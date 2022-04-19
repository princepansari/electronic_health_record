from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use, Optional
from http import HTTPStatus
import bleach
import datetime

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.utilities import Utils


class UpdateProfile(Resource):

    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'name': And(str, Use(bleach.clean)),
            'dob': And(str, Use(bleach.clean), lambda x: datetime.datetime.strptime(x, '%d/%m/%Y')),
            'phone': And(str, Use(bleach.clean)),
            Optional('allergy'): And(str, Use(bleach.clean)),
            Optional('schedule'): And(dict),
            Optional('slot_duration'): And(int, lambda x: x > 0)
        })

    @jwt_required()
    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())
        user_id = get_jwt_identity()
        user_type = get_jwt()['user_type']

        if user_type == 'doctor' or user_type == 'nurse':
            if 'schedule' not in data or 'slot_duration' not in data:
                return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST
            status = self.rds.update_user(user_id=user_id,
                                          name=data['name'],
                                          dob=datetime.datetime.strptime(data['dob'], '%d/%m/%Y').strftime("%Y-%m-%d"),
                                          phone=data['phone'])
            if not status:
                return {'message': 'Internal server error'}, HTTPStatus.INTERNAL_SERVER_ERROR
            status = self.rds.update_schedule(user_id=user_id,
                                              schedule=data['schedule'],
                                              slot_duration=data['slot_duration'])
            if not status:
                return {'message': 'Internal server error'}, HTTPStatus.INTERNAL_SERVER_ERROR
            return {'message': 'Successfully updated'}, HTTPStatus.OK
        elif user_type == 'patient':
            status = self.rds.update_user(user_id=user_id,
                                          name=data['name'],
                                          dob=datetime.datetime.strptime(data['dob'], '%d/%m/%Y').strftime("%Y-%m-%d"),
                                          phone=data['phone'],
                                          allergy=data.get('allergy'))
            if not status:
                return {'message': 'Internal server error'}, HTTPStatus.INTERNAL_SERVER_ERROR
            return {'message': 'Successfully updated'}, HTTPStatus.OK
        else:
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST


