from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.s3 import S3
from app.common.config import Config


class AddReport(Resource):
    def __init__(self):
        self.rds = RDS()
        self.s3 = S3()
        self.schema = Schema({
            'case_id': And(Use(int), lambda n: n > 0),
            'prescription_id': And(Use(int), lambda n: n > 0),
            'report_id': And(Use(int), lambda n: n >= 0)
        })

    @jwt_required()
    def post(self):
        data = {
            'case_id': request.form.get('case_id'),
            'prescription_id': request.form.get('prescription_id'),
            'report_id': request.form.get('report_id')
        }
        if not self.schema.is_valid(data):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(data)
        user_id = get_jwt_identity()
        user_type = get_jwt()['type']

        prescription_info = self.rds.get_prescription(case_id=data['case_id'],
                                                      prescription_id=data['prescription_id'])

        if prescription_info is None:
            return {'message': 'Prescription not found'}, HTTPStatus.NOT_FOUND

        if user_type == 'patient':
            if prescription_info['patient_id'] != user_id:
                return {'message': 'Unauthorized'}, HTTPStatus.UNAUTHORIZED

        file = request.files['report']
        if not file:
            return {'message': 'No file'}, HTTPStatus.BAD_REQUEST
        file_uuid = self.s3.push(file=file)
        report_link = Config.BUCKET_URL + file_uuid
        report_id = data['report_id']
        prescription = prescription_info['prescription']
        try:
            prescription['labtests'][report_id]['reportLink'] = report_link
            self.rds.update_prescription(case_id=data['case_id'],
                                         prescription_id=data['prescription_id'],
                                         prescription=prescription)
            self.rds.update_case_updated_at(case_id=data['case_id'])
        except KeyError:
            return {'message': 'Report not found'}, HTTPStatus.NOT_FOUND
        return {'message': 'Report added'}, HTTPStatus.OK
