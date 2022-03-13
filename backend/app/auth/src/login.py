from flask import request
from flask_jwt_extended import create_access_token
from flask_bcrypt import check_password_hash
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus
import bleach
import datetime

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.config import Config
from app.common.utilities import Utils


class LoginApi(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'email': And(str, Use(bleach.clean), Utils.validate_email),
            'password': And(str, Use(bleach.clean), Utils.validate_password)
        })

    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())
        email = data['email']
        password = data['password']

        user = self.rds.get_user_by_email(email=email)

        if not user:
            return {'message': 'User not found'}, HTTPStatus.NOT_FOUND

        if not check_password_hash(user['password'], password):
            return {'message': 'Invalid password'}, HTTPStatus.UNAUTHORIZED

        if not user['account_verified']:
            return {'message': 'Account not verified'}, HTTPStatus.NOT_FOUND

        if not user['user_type_verification']:
            return {'message': 'User type not verified'}, HTTPStatus.NOT_FOUND

        self.rds.update_user_last_login(user_id=user['user_id'])

        expires = datetime.timedelta(days=Config.EXPIRE_AFTER_DAYS)
        access_token = create_access_token(identity=str(user['email']), expires_delta=expires)
        return {'access_token': access_token}, HTTPStatus.OK
