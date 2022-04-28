from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus
import json

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.s3 import S3
from app.common.config import Config
from app.case.tools.pdf_generator_for_mail import PdfGeneratorForMail
from app.common.mail import Email


class CreatePrescription(Resource):
    def __init__(self):
        self.rds = RDS()
        self.s3 = S3()
        self.schema = Schema({
            'case_id': And(Use(int), lambda n: n > 0),
            'prescription': And(Use(json.loads))
        })

    @jwt_required()
    def post(self):
        data = {
            'case_id': request.form.get('case_id'),
            'prescription': request.form.get('prescription')
        }
        if not self.schema.is_valid(data):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(data)
        user_id = get_jwt_identity()
        user_type = get_jwt()['user_type']
        if user_type == 'doctor' or user_type == 'nurse':
            if not self.rds.is_case_exists(case_id=data['case_id']):
                return {'message': 'Case does not exists'}, HTTPStatus.NOT_FOUND
            file = request.files.get('recording')
            if file:
                file_uuid = self.s3.push(file=file)
                data['prescription']['recording'] = Config.BUCKET_URL + file_uuid
            prescription = self.rds.create_prescription(created_by_id=user_id,
                                                        case_id=data['case_id'],
                                                        prescription=data['prescription'])

            case_info = self.rds.get_case_by_staff(case_id=data['case_id'])
            patient_email = self.rds.get_patient_email_by_case(case_id=data['case_id'])
            CreatePrescription.send_prescription_mail(case_info=case_info, prescription=prescription, patient_email=patient_email)
            self.rds.update_case_updated_at(case_id=data['case_id'])
            prescription_info = {
                'prescription_id': prescription['prescription_id'],
                'case_id': prescription['case_id'],
                'prescription': prescription['prescription'],
                'created_at': prescription['created_at'].isoformat(),
                'updated_at': prescription['updated_at'].isoformat(),
            }
            return prescription_info, HTTPStatus.OK
        else:
            return {'message': 'Unauthorized'}, HTTPStatus.UNAUTHORIZED

    @staticmethod
    def send_prescription_mail(*, case_info, prescription, patient_email):
        pdf_generator = PdfGeneratorForMail(case_info, prescription)
        pdf_file = pdf_generator.generate_pdf()
        filename = 'prescription_' + str(prescription['prescription_id']) + '.pdf'
        email = Email()
        email.login()
        body = email.create_msg_with_attachment(message_text="Prescription", to=[patient_email], subject="Prescription",
                                                pdf_file=pdf_file, filename=filename)
        email.send_msg(message=body)
