from flask import request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus
from flask import send_from_directory

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.case.tools.pdf_generator import PdfGenerator


class DownloadCase(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'case_id': And(Use(int), lambda n: n > 0)
        })

    @jwt_required()
    def get(self):
        if not self.schema.is_valid(request.args.to_dict()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.args.to_dict())
        case_id = data['case_id']
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

        pdf_generator = PdfGenerator(case, prescriptions, 'case')
        return pdf_generator.generate_pdf()
