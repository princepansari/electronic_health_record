from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from http import HTTPStatus

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class GetAllCases(Resource):
    def __init__(self):
        self.rds = RDS()

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = self.rds.get_user_by_user_id(user_id=user_id)
        user_type = self.rds.get_user_type(user_id=user_id)
        data = {}
        if user_type == 'doctor' or user_type == 'nurse':
            cases = self.rds.get_all_cases_by_staff(created_by_id=user_id)
            for case in cases:
                data[case['case_id']] = {
                    'patient_name': user['patient_name'],
                    'created_by': user['name'],
                    'problem': case['problem'],
                    'created_at': case['created_at'],
                    'updated_at': case['updated_at']
                }
        elif user_type == 'patient':
            cases = self.rds.get_all_cases_by_patient(patient_id=user_id)
            for case in cases:
                data[case['case_id']] = {
                    'patient_name': user['name'],
                    'created_by': case['created_by'],
                    'problem': case['problem'],
                    'created_at': case['created_at'],
                    'updated_at': case['updated_at']
                }
        return data, HTTPStatus.OK




