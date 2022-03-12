import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.auth.src.login import LoginApi


def auth_routes(api):
    api.add_resource(LoginApi, '/api/auth/login')
