import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.appointment.src.get_doctors import Get_doctors
from app.appointment.src.get_booked_slots import Get_booked_slots
from app.appointment.src.create_appointment import Create_appointment


def appointment_routes(api):
    api.add_resource(Get_doctors, '/api/appointment/get_doctors')
    api.add_resource(Get_booked_slots, '/api/appointment/get_booked_slots')
    api.add_resource(Create_appointment, '/api/appointment/create_appointment')
