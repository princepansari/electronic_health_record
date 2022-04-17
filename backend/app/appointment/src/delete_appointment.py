from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from http import HTTPStatus
from schema import Schema, And, Use
import bleach
import time
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.config import Config
from app.common.utilities import Utils

class DeleteAppointment(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'appointment_id': And(str, Use(bleach.clean))
        })

    @jwt_required()
    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST
        
        data = self.schema.validate(request.get_json())
        appointment_id = data['appointment_id']
        return self.rds.delete_appointment(appointment_id), HTTPStatus.OK