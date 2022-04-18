from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from http import HTTPStatus
from schema import Schema, And, Use, Optional
import bleach
import time
import os
import sys
from datetime import datetime
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
            'appointment_datetime': And(str, Use(Utils.convert_to_datetime)),
            Optional('followup_prescription_id'): And(int, lambda x: x >= 0)
        })

    @jwt_required()
    def post(self):
        if not self.schema.is_valid(request.get_json()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.get_json())
        doctor_id = data['doctor_id']
        patient_id = get_jwt_identity()
        appointment_datetime = data['appointment_datetime']
        followup_prescription_id = data.get('followup_prescription_id')

        appointment_date = appointment_datetime.date()
        day_name = calendar.day_name[appointment_date.weekday()].lower()
        appointment_time = appointment_datetime.time()

        doctor_availability = self.rds.get_doctors_schedule_by_id(doctor_id=doctor_id)
        slot_availability = self.rds.get_slot_availability(appointment_time=appointment_datetime)
        if doctor_availability['days'][day_name]:
            start_time = datetime.strptime(doctor_availability['start_time'], '%I:%M %p').time()
            end_time = datetime.strptime(doctor_availability['end_time'], '%I:%M %p').time()
            if start_time <= appointment_time < end_time:
                if slot_availability:
                    appointment_id = self.rds.create_appointment(doctor_id=doctor_id, patient_id=patient_id,
                                                                 appointment_datetime=appointment_datetime,
                                                                 followup_prescription_id=followup_prescription_id)
                    return appointment_id, HTTPStatus.OK
                else:
                    return {'message': 'slot is booked'}, HTTPStatus.BAD_REQUEST
            else:
                return {'message': 'Doctor is not available'}, HTTPStatus.BAD_REQUEST
        else:
            return {'message': 'Doctor is not available'}, HTTPStatus.BAD_REQUEST
