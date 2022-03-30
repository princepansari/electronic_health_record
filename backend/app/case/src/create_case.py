from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus
import bleach

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.utilities import Utils


class CreateCase(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'patient_email': And(str, Use(bleach.clean), Utils.validate_email),
            'problem': And(str, Use(bleach.clean))
        })

    @jwt_required()
    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())
        user_id = get_jwt_identity()
        user_type = get_jwt()['user_type']
        if user_type == 'doctor' or user_type == 'nurse':
            patient_id = self.rds.get_user_by_email(email=data['patient_email'])['user_id']
            case_id = self.rds.create_case(patient_id=patient_id,
                                           created_by_id=user_id,
                                           problem=data['problem'])
            return {'case_id': case_id}, HTTPStatus.OK
        else:
            return {'message': 'Unauthorized'}, HTTPStatus.UNAUTHORIZED
