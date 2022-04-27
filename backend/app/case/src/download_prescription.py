from flask import request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus
from flask import send_file

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class DownloadPrescription(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'case_id': And(Use(int), lambda n: n > 0),
            'prescription_id': And(Use(int), lambda n : n >0)
        })

    @jwt_required()
    def get(self):
        if not self.schema.is_valid(request.args.to_dict()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.args.to_dict())

        case_id = data['case_id']
        prescription_id = data['prescription_id']
        user_id = get_jwt_identity()

        user_type = get_jwt()['user_type']

        content = open(f'app/case/tools/s3.pdf', 'rb').read()
        return Response(content, mimetype='application/pdf')
