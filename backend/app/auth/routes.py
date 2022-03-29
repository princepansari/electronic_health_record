import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.auth.src.login import LoginApi
from app.auth.src.signup import SignupApi
from app.auth.src.user_verification import UserVerification


def auth_routes(api):
    api.add_resource(SignupApi, '/api/auth/signup')
    api.add_resource(LoginApi, '/api/auth/login')
    api.add_resource(UserVerification, '/api/auth/verify')
