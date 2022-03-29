from flask import request
from flask_bcrypt import generate_password_hash
from flask_restful import Resource
from schema import Schema, And, Use, Optional
from http import HTTPStatus
import bleach
import datetime
import json
import math
import random

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.config import Config
from app.common.utilities import Utils
from app.common.mail import Email


class SignupApi(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'user_type': And(str, Use(str.lower), Use(bleach.clean), lambda x: x in Config.USER_TYPES),
            'email': And(str, Use(bleach.clean), Utils.validate_email),
            Optional('guardian_email'): And(str, Use(bleach.clean), Utils.validate_email),
            'name': And(str, Use(bleach.clean)),
            'password': And(str, Use(bleach.clean), Utils.validate_password),
            'dob': And(str, Use(bleach.clean), lambda x: datetime.datetime.strptime(x, '%Y-%m-%d')),
            'phone': And(str, Use(bleach.clean)),
            Optional('allergy'): And(str, Use(bleach.clean)),
            Optional('schedule'): And(json, Use(bleach.clean)),
            Optional('slot_duration'): And(int, Use(bleach.clean))
        })

    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())

        domain_email = data['email'].split('@')[1]
        if domain_email not in Config.IIT_DOMAIN:
            if 'guardian_email' not in data:
                return {'message': 'Invalid email'}, HTTPStatus.BAD_REQUEST
            domain_guardian_email = data['guardian_email'].split('@')[1]
            if domain_guardian_email not in Config.IIT_DOMAIN:
                return {'message': 'Invalid email'}, HTTPStatus.BAD_REQUEST

        if data['user_type'] == 'doctor' or data['user_type'] == 'nurse':
            if 'schedule' not in data or 'slot_duration' not in data:
                return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        user_id = self.rds.create_user(user_type=data['user_type'],
                                       email=data['email'],
                                       guardian_email=data.get('guardian_email'),
                                       name=data['name'],
                                       password=SignupApi.hash_password(password=data['password']),
                                       dob=data['dob'],
                                       phone=data['phone'],
                                       allergy=data['allergy'])

        if user_id is None:
            return {'message': 'User already exists'}, HTTPStatus.BAD_REQUEST
        if data['user_type'] == 'doctor' or data['user_type'] == 'nurse':
            self.rds.create_schedule(user_id=user_id, schedule=data['schedule'], slot_duration=data['slot_duration'])

        self.initiate_user_verification(user_id=user_id, email=data['email'], guardian_email=data.get('guardian_email'))
        return {'message': 'User created successfully'}, HTTPStatus.OK

    @staticmethod
    def hash_password(*, password):
        return generate_password_hash(password).decode('utf8')

    def initiate_user_verification(self, *, user_id, email, guardian_email):
        if guardian_email is None:
            otp = self.get_otp()
            self.rds.save_otp(user_id=user_id, email_otp=otp, guardian_email_otp=None)
            SignupApi.send_email(to=email,
                                 subject='Verify your account',
                                 message=f'Your OTP is {otp}')
        else:
            email_otp = self.get_otp()
            guardian_email_otp = self.get_otp()
            self.rds.save_otp(user_id=user_id, email_otp=email_otp, guardian_email_otp=guardian_email_otp)
            SignupApi.send_email(to=email,
                                 subject='Verify your account',
                                 message=f'Your OTP is {email_otp}')
            SignupApi.send_email(to=guardian_email,
                                 subject='Verify your account',
                                 message=f'Your OTP is {guardian_email_otp}')

    @staticmethod
    def send_email(*, to, subject, message):
        email = Email()
        email.login()
        body = email.create_msg(message_text=message, to=to, subject=subject)
        email.send_msg(message=body)

    @staticmethod
    def get_otp():
        digits = Config.OTP_DIGIT_SPACE
        otp = ""
        for i in range(6):
            otp += digits[math.floor(random.random() * 10)]
        return otp
