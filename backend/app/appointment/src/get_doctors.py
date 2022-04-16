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

class Get_doctors(Resource):
    def __init__(self):
        self.rds = RDS()
    
    @jwt_required()
    def get(self):
        return self.rds.get_doctors_schedule(), HTTPStatus.OK