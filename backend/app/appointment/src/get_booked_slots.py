from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from http import HTTPStatus
import bleach
from datetime import datetime, timedelta
from schema import Schema, And, Use
from flask import request
import math
import os
import sys


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS
from app.common.utilities import Utils


class GetBookedSlots(Resource):
    def __init__(self):
        self.rds = RDS()
        self.schema = Schema({
            'doctor_id': And(str, Use(bleach.clean)),
            'from_date': And(str, Use(Utils.convert_to_datetime))
        })

    @jwt_required()
    def get(self):
        if not self.schema.is_valid(request.args.to_dict()):
            return {'message': 'Invalid data'}, HTTPStatus.BAD_REQUEST

        data = self.schema.validate(request.args.to_dict())
        user_type = get_jwt()['user_type']
        user_id = get_jwt_identity()

        doctor_id = data['doctor_id']
        from_date = data['from_date']
        last_date = from_date + timedelta(days=8)

        schedule, slot_duration = self.rds.get_schedule(doctor_id=doctor_id)
        slots = self.rds.get_booked_slots(doctor_id=doctor_id, from_date=from_date, last_date=last_date)

        response = []
        for slot in slots:
            slot_num = GetBookedSlots.get_slot_num(schedule=schedule,
                                                   slot_duration=slot_duration,
                                                   appointment_datetime=slot['appointment_time'])
            if user_type == 'doctor' or user_type == 'nurse' or slot['patient_id'] == user_id:
                response.append({
                    'slot': slot_num,
                    'date': slot['appointment_time'].isoformat(),
                    'booked_by_id': slot['patient_id'],
                    'booked_by_name': slot['name'],
                    'appointment_id' : slot['id']})
                    
            else:
                response.append({
                    'slot': slot_num,
                    'date': slot['appointment_time'].isoformat()})

        return response, HTTPStatus.OK

    @staticmethod
    def get_slot_num(*, schedule, slot_duration, appointment_datetime):
        appointment_time = appointment_datetime.time()
        start_time = datetime.strptime(schedule['start_time'], '%I:%M %p').time()

        duration = timedelta(hours=appointment_time.hour - start_time.hour,
                             minutes=appointment_time.minute-start_time.minute).total_seconds()/60
        slot_num = math.floor(duration / slot_duration)
        return slot_num
