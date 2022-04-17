from flask_jwt_extended import jwt_required
from flask_restful import Resource
from http import HTTPStatus
import bleach
import datetime

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.config import Config
from app.common.utilities import Utils

class GetBookedSlots(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'doctor_id': And(uuid, Use(bleach.clean), Utils.validate_id)
        })

    def get(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())
        doctor_id = data['doctor_id']
        from_date = data['from_date']

        @jwt_required()
        slot = self.rds.get_booked_slots(doctor_id=doctor_id, from_date=from_date)

        if not slot:
            return {'message': 'You are not a doctor'}, HTTPStatus.NOT_FOUND
        return slot, HTTPStatus.OK