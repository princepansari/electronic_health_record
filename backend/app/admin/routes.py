import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.admin.src.verification_get_users import VerificationGetUsers
from app.admin.src.verify_user import VerifyUser


def admin_routes(api):
    api.add_resource(VerificationGetUsers, '/api/admin/verification/get_users')
    api.add_resource(VerifyUser, '/api/admin/verification/verify_user')
