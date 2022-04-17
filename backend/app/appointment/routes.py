import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.appointment.src.get_doctors import GetDoctors
from app.appointment.src.get_booked_slots import GetBookedSlots
from app.appointment.src.create_appointment import CreateAppointment
from app.appointment.src.delete_appointment import DeleteAppointment


def appointment_routes(api):
    api.add_resource(GetDoctors, '/api/appointment/get_doctors')
    api.add_resource(GetBookedSlots, '/api/appointment/get_booked_slots')
    api.add_resource(CreateAppointment, '/api/appointment/create_appointment')
    api.add_resource(DeleteAppointment, '/api/appointment/delete_appointment')
