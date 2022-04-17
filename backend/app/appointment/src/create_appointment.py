from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from http import HTTPStatus
from schema import Schema, And, Use
import bleach
import time
import os
import sys

from datetime import date
import calendar
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.config import Config
from app.common.utilities import Utils

class CreateAppointment(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'doctor_id': And(str, Use(bleach.clean)),
            'followup_prescription_id' : And(int, lambda x: x >= 0)
        })

    @jwt_required()
    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST
        
        data = self.schema.validate(request.get_json())
        doctor_id = data['doctor_id']
        patient_id = get_jwt_identity()
        creation_time = time.time()
        appointment_datetime = data['appointment_datetime']
        followup_prescription_id = data['followup_prescription_id']
        doctor_availability=self.rds.get_doctors_schedule_by_id(doctor_id)
        appointment_date=date.appointment_datetime
        day_name=calendar.day_name[appointment_date.weekday()]
        slot_availaibility=self.rds.get_slot_availaibility(doctor_id)
        if (day_name in doctor_availability.days):
            if (appointment_datetime in slot_availaibility):
                return {'message': 'slot is booked'}, HTTPStatus.BAD_REQUEST
            else :
                appointment_id=self.rds.create_appointment(doctor_id=doctor_id ,patient_id=patient_id ,creation_time=creation_time ,appointment_datetime=appointment_datetime, followup_prescription_id=followup_prescription_id)
                return appointment_id, HTTPStatus.OK
        else :
          return {'message': 'Doctor is not available'}, HTTPStatus.BAD_REQUEST   
        