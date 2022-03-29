from flask import request
from flask_restful import Resource
from app.common.utilities import Utils
from app.common.rds import RDS
from schema import Schema, And, Use
from http import HTTPStatus
import bleach


class UserVerification(Resource):

    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'otp': And(str, Utils.validate_otp),
            'guardian_otp': And(str, Utils.validate_otp),
            'email': And(str, Use(bleach.clean), Utils.validate_email)
        })

    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST
        data = self.schema.validate(request.get_json())
        email = data['email']
        verified = self.check_otp(given_otp=data['otp'], guardian_otp=data['guardian_otp'], email=email)
        if not verified:
            return {'error': 'Wrong OTP'}, HTTPStatus.BAD_REQUEST
        self.rds.update_verification_status(email=email)

    def check_otp(self, *, given_otp, guardian_otp, email):
        user = self.rds.get_user_by_email(email=email)
        valid_otp, valid_guardian_otp = self.rds.get_user_otp(user_id=user['user_id'])
        return valid_otp == given_otp and valid_guardian_otp == guardian_otp
