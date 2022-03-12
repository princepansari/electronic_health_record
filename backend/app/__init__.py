from flask import Flask
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)

api = Api(app)
cors = CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
