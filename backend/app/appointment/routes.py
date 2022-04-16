import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.appointment.src.get_doctors import Get_doctors


def appointment_routes(api):
    api.add_resource(Get_doctors, '/api/appointment/get_doctors')
