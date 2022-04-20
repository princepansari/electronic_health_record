from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from flask_restful import Resource
from http import HTTPStatus
from schema import Schema, And, Use
import bleach
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class VerifyUser(Resource):

    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'user_id': And(str, Use(bleach.clean)),
            'verified': And(bool)
        })

    @jwt_required()
    def post(self):
        user_type = get_jwt()['user_type']

        if user_type != 'admin':
            return {'message': 'You are not authorized to perform this action'}, HTTPStatus.UNAUTHORIZED

        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())

        user_id = data['user_id']
        verified = data['verified']

        if verified:
            status = self.rds.update_user_type_verification(user_id=user_id)
            if not status:
                return {'message': 'User not found'}, HTTPStatus.NOT_FOUND
            return {'message': 'User verified'}, HTTPStatus.OK
        else:
            status = self.rds.delete_user(user_id=user_id)
            if not status:
                return {'message': 'User not found'}, HTTPStatus.NOT_FOUND
            return {'message': 'User Deleted'}, HTTPStatus.OK


