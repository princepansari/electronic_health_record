from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
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
        user_type = get_jwt()['user_type']
        data = []
        if user_type == 'doctor' or user_type == 'nurse':
            cases = self.rds.get_all_cases_by_staff(created_by_id=user_id)
            for case in cases:
                data.append({
                    'case_id': case['case_id'],
                    'patient_name': case['patient_name'],
                    'created_by': user['name'],
                    'problem': case['problem'],
                    'created_at': case['created_at'].isoformat(),
                    'updated_at': case['updated_at'].isoformat()
                })
        elif user_type == 'patient':
            cases = self.rds.get_all_cases_by_patient(patient_id=user_id)
            for case in cases:
                data.append({
                    'case_id': case['case_id'],
                    'patient_name': user['name'],
                    'created_by': case['created_by'],
                    'problem': case['problem'],
                    'created_at': case['created_at'].isoformat(),
                    'updated_at': case['updated_at'].isoformat()
                })
        return data, HTTPStatus.OK




