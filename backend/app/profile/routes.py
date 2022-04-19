import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.profile.src.get_profile import GetProfile
from app.profile.src.update_profile import UpdateProfile


def profile_routes(api):
    api.add_resource(GetProfile, '/api/profile/get_profile')
    api.add_resource(UpdateProfile, '/api/profile/update_profile')
