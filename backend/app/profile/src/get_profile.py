from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from http import HTTPStatus

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class GetProfile(Resource):

    def __init__(self):
        self.rds = RDS()

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user_type = get_jwt()['user_type']

        user = self.rds.get_user_by_user_id(user_id=user_id)
        if user is None:
            return {'message': 'User not found'}, HTTPStatus.NOT_FOUND

        if user_type == 'doctor' or user_type == 'nurse':
            staff_schedule = self.rds.get_staff_schedule_by_user_id(user_id=user_id)
            return {'email': user['email'],
                    'guardian_email': user['guardian_email'],
                    'name': user['name'],
                    'dob': user['dob'].strftime('%d/%m/%Y'),
                    'phone': user['phone_number'],
                    'schedule': staff_schedule['schedule'],
                    'slot_duration': staff_schedule['slot_duration'],
                    'user_type': user_type}, HTTPStatus.OK

        return {'email': user['email'],
                'guardian_email': user['guardian_email'],
                'name': user['name'],
                'dob': user['dob'].strftime('%d/%m/%Y'),
                'phone': user['phone_number'],
                'allergy': user['allergy'],
                'user_type': user_type}, HTTPStatus.OK
