from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.case.tools.pdf_generator_for_mail import PdfGeneratorForMail
from app.common.mail import Email


class AddCorrection(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'case_id': And(Use(int), lambda n: n > 0),
            'prescription_id': And(Use(int), lambda n: n > 0),
            'correction': And(dict)
        })

    @jwt_required()
    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())
        user_id = get_jwt_identity()
        added, prescription = self.rds.add_correction(case_id=data['case_id'],
                                                      prescription_id=data['prescription_id'],
                                                      correction=data['correction'],
                                                      created_by_id=user_id)
        if not added:
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST
        case_info = self.rds.get_case_by_staff(case_id=data['case_id'])
        patient_email = self.rds.get_patient_email_by_case(case_id=data['case_id'])
        AddCorrection.send_prescription_mail(case_info=case_info,
                                             prescription=prescription,
                                             patient_email=patient_email)
        self.rds.update_case_updated_at(case_id=data['case_id'])
        return HTTPStatus.OK

    @staticmethod
    def send_prescription_mail(*, case_info, prescription, patient_email):
        pdf_generator = PdfGeneratorForMail(case_info, prescription)
        pdf_file = pdf_generator.generate_pdf()
        filename = 'prescription_' + str(prescription['prescription_id']) + '.pdf'
        email = Email()
        email.login()
        subject = 'Prescription ' + str(prescription['prescription_id']) + ' for case ' + str(case_info['case_id'])
        message_text = 'Dear ' + case_info['patient_name'] + ',\n\n' + \
                       'There is some correction in your prescription.\n' + \
                       'Your new prescription is attached.\n\n'
        body = email.create_msg_with_attachment(message_text=message_text, to=[patient_email], subject=subject,
                                                pdf_file=pdf_file, filename=filename)
        email.send_msg(message=body)
