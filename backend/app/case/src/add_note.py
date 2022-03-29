from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from schema import Schema, And, Use
from http import HTTPStatus
import json

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class AddNote(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'prescription_id': And(Use(int), lambda n: n > 0),
            'note': And(Use(str), lambda n: len(n) > 0)
        })

    @jwt_required()
    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())
        user_id = get_jwt_identity()
        added, prescription = self.rds.add_note(prescription_id=data['prescription_id'],
                                                note=data['note'],
                                                created_by_id=user_id)
        if not added:
            return {'message': 'Invalid request'}, HTTPStatus.BAD_REQUEST
        return {'prescription': prescription}, HTTPStatus.OK
