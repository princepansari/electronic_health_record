import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.case.src.get_all_cases import GetAllCases
from app.case.src.get_case import GetCase


def case_routes(api):
    api.add_resource(GetAllCases, '/api/case/get_all_cases/')
    api.add_resource(GetCase, '/api/case/get_case/<int:case_id>')

