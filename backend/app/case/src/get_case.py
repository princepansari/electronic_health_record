from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class GetCase(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema(And(Use(int), lambda n: n > 0))

    @jwt_required()
    def get(self, case_id):
        if not self.schema.is_valid(case_id):
            return {'message': 'Invalid case id'}, HTTPStatus.BAD_REQUEST

        case_id = self.schema.validate(case_id)
        user_id = get_jwt_identity()

        user_type = get_jwt()['user_type']
        case = None
        if user_type == 'doctor' or user_type == 'nurse':
            case = self.rds.get_case_by_staff(case_id=case_id)
        elif user_type == 'patient':
            access, case = self.rds.get_case_by_patient(case_id=case_id, patient_id=user_id)
            if not access:
                return {'message': 'You do not have access to this case'}, HTTPStatus.FORBIDDEN
        if not case:
            return {'message': 'Case not found'}, HTTPStatus.NOT_FOUND

        prescriptions = self.rds.get_prescriptions_by_case(case_id=case_id)
        prescriptions_data = []
        for prescription in prescriptions:
            prescription['prescription']['id'] = prescription['prescription_id']
            prescription['prescription']['created_by'] = prescription['created_by']
            prescription['prescription']['updated_at'] = prescription['updated_at'].isoformat()
            prescription['prescription']['created_at'] = prescription['created_at'].isoformat()
            prescriptions_data.append(prescription['prescription'])
        data = {'id': case_id,
                'patient_name': case['patient_name'],
                'patient_allergy': case['patient_allergy'],
                'patient_age': case['patient_age'],
                'created_by': case['created_by'],
                'problem': case['problem'],
                'created_at': case['created_at'].isoformat(),
                'updated_at': case['updated_at'].isoformat(),
                'prescriptions': prescriptions_data}
        return data, HTTPStatus.OK
