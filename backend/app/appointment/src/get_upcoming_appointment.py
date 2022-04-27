from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_restful import Resource
from http import HTTPStatus
from datetime import datetime
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.common.rds import RDS


class GetUpcomingAppointment(Resource):
    def __init__(self):
        self.rds = RDS()

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user_type = get_jwt()['user_type']
        response = []
        current_datetime = datetime.now()
        if user_type == 'doctor':
            upcoming_appointment = self.rds.get_upcoming_appointment_for_doctor(user_id=user_id,
                                                                                current_datetime=current_datetime)
            for appointment in upcoming_appointment:
                doctor_id = appointment["doctor_id"]
                doctor_name = self.rds.get_doctor_name(doctor_id=doctor_id)
                if appointment["followup_case_id"] is None:
                    followup_type = "New"
                else:
                    followup_type = "Followup"
                response.append({
                    'doctor_id': appointment["doctor_id"],
                    'doctor_name': doctor_name["name"],
                    'patient_id': appointment['patient_id'],
                    'patient_name': appointment['patient_name'],
                    'patient_email': appointment['patient_email'],
                    'case_id': appointment['followup_case_id'],
                    'type': followup_type,
                    'datetime': appointment['appointment_time'].isoformat()})
        elif user_type == 'patient':
            upcoming_appointment = self.rds.get_upcoming_appointment_for_patient(user_id=user_id,
                                                                                 current_datetime=current_datetime)
            for appointment in upcoming_appointment:
                doctor_id = appointment["doctor_id"]
                doctor_name = self.rds.get_doctor_name(doctor_id=doctor_id)
                if appointment["followup_case_id"] is None:
                    followup_type = "New"
                else:
                    followup_type = "Followup"
                response.append({
                    'doctor_id': appointment["doctor_id"],
                    'doctor_name': doctor_name["name"],
                    'patient_id': appointment['patient_id'],
                    'patient_name': appointment['patient_name'],
                    'patient_email': appointment['patient_email'],
                    'case_id': appointment['followup_case_id'],
                    'type': followup_type,
                    'datetime': appointment['appointment_time'].isoformat()})

        return response, HTTPStatus.OK
