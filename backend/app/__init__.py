from flask import Flask
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.auth.routes import auth_routes
from app.case.routes import case_routes
from app.profile.routes import profile_routes
from app.admin.routes import admin_routes

app = Flask(__name__)

app.config.from_object('config')

api = Api(app)
cors = CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

auth_routes(api)
case_routes(api)
profile_routes(api)
admin_routes(api)
