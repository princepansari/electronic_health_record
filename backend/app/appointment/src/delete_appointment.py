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

    @jwt_required()
    def delete(self, appointment_id):
        user_id = get_jwt_identity()
        status = self.rds.delete_appointment(user_id=user_id, appointment_id=appointment_id)
        if status:
            return HTTPStatus.OK
        return {'message': 'Error!!'}, HTTPStatus.BAD_REQUEST
