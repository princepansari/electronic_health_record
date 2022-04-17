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

class Get_booked_slots(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'doctor_id': And(uuid, Use(bleach.clean), Utils.validate_id),
            'patient_id': And(uuid, Use(bleach.clean), Utils.validate_id),
            'followup_prescription_id' : And(int, lambda x: x >= 0)
        })

    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST
        
        data = self.schema.validate(request.get_json())
        doctor_id = data['doctor_id']
        patient_id = data['patient_id']
        creation_time = data['creation_time']
        appointment_datetime = data['appointment_datetime']
        followup_prescription_id = data['followup_prescription_id']

        appointment_id=self.rds.create_appointment(doctor_id=doctor_id ,patient_id=patient_id ,creation_time=creation_time ,appointment_datetime=appointment_datetime, followup_prescription_id=followup_prescription_id)
        return appointment_id, HTTPStatus.OK