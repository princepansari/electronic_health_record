from flask_jwt_extended import jwt_required, get_jwt
from flask_restful import Resource
from http import HTTPStatus

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class VerificationGetUsers(Resource):

    def __init__(self):
        self.rds = RDS()

    @jwt_required()
    def get(self):
        user_type = get_jwt()['user_type']

        if user_type != 'admin':
            return {'message': 'You are not authorized to perform this action'}, HTTPStatus.UNAUTHORIZED

        users = self.rds.get_not_verified_users()
        data = {'user_details': []}
        for user in users:
            data['user_details'].append({'user_id': user['user_id'],
                                         'name': user['name'],
                                         'email': user['email'],
                                         'user_type': user['type']})
        return data, HTTPStatus.OK
