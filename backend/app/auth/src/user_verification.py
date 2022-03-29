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
            'otp': And(int, lambda otp: len(otp)==6),
            'guardian_otp': And(str, lambda guardian_otp: len(guardian_otp)==6),
            'email': And(str, Use(bleach.clean), Utils.validate_email)
        }, ignore_extra_keys=True)

    def post(self):
        data = self.schema.validate(request.get_json())
        email = data['email']
        verified = self.check_otp(given_otp=data['otp'], guardian_otp=data['guardian_otp'], email=email)
        if not verified:
            return {'error': 'Wrong OTP'}, HTTPStatus.BAD_REQUEST
        self.rds.update_verification_status(email=email)

    def check_otp(self, *, given_otp, guardian_otp, email):
        user = self.rds.get_user_by_email(email=email)
        valid_otp, valid_guardian_otp = self.rds.get_user_otp(user_id=user['user_id'])
        return (valid_otp == given_otp and valid_guardian_otp == guardian_otp)
