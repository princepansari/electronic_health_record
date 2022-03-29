import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.case.src.get_all_cases import GetAllCases
from app.case.src.get_case import GetCase
from app.case.src.create_case import CreateCase
from app.case.src.create_prescription import CreatePrescription
from app.case.src.add_note import AddNote
from app.case.src.add_report import AddReport


def case_routes(api):
    api.add_resource(GetAllCases, '/api/case/get_all_cases/')
    api.add_resource(GetCase, '/api/case/get_case/<int:case_id>')
    api.add_resource(CreateCase, '/api/case/create_case/')
    api.add_resource(CreatePrescription, '/api/case/create_prescription/')
    api.add_resource(AddNote, '/api/case/add_note/')
    api.add_resource(AddReport, '/api/case/add_report/')

