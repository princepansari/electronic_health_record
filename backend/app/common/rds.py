from datetime import datetime, timezone
import boto3
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.common.config import Config


class RDS:

    def __init__(self):
        self.env = Config.ENV
        self.host = Config.RDS_ENDPOINT
        self.user = Config.DBUSER
        self.database = Config.DATABASE
        self.password = Config.PASSWORD
        self.region = Config.REGION
        self.port = int(Config.PORT)

        conn_str = self.get_connection_string()
        self.connection = psycopg2.connect(conn_str)

    def get_connection_string(self):
        env = self.env
        host = self.host
        port = self.port
        user = self.user
        region = self.region
        database = self.database
        password = self.password

        if env != "test":
            client = boto3.client("rds", region_name=region)
            password = client.generate_db_auth_token(DBHostname=host, Port=port, DBUsername=user)

        conn_str = f"host={host} dbname={database} user={user} password={password} port={port}"
        return conn_str

    def get_user_by_email(self, *, email):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * FROM users WHERE email=%s"
        cursor.execute(query, [email])
        user = cursor.fetchone()
        cursor.close()
        return user

    def get_user_by_user_id(self, *, user_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * FROM users WHERE user_id=%s"
        cursor.execute(query, [user_id])
        user = cursor.fetchone()
        cursor.close()
        return user

    def update_user_last_login(self, *, user_id):
        cursor = self.connection.cursor()
        query = "UPDATE users SET last_login=%s WHERE user_id=%s"
        cursor.execute(query, [datetime.now(timezone.utc), user_id])
        self.connection.commit()
        cursor.close()

    def get_user_otp(self, *, user_id): 
        cursor = self.connection.cursor()
        query = "SELECT email_otp, guardian_email_otp FROM signup_verification WHERE user_id=%s"
        cursor.execute(query, [user_id])
        valid_otp, valid_guardian_otp = cursor.fetchone()
        cursor.close()
        return valid_otp, valid_guardian_otp

    def update_verification_status(self, *, email):
        cursor = self.connection.cursor()
        query = "UPDATE users SET account_verified='TRUE' WHERE email=%s"
        cursor.execute(query, [email])
        self.connection.commit()
        cursor.close()

    def create_user(self, *, user_type, email, guardian_email, name, password, dob, phone, allergy):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT id FROM user_type WHERE type=%s"
        cursor.execute(query, [user_type])
        user_type_id = cursor.fetchone()['id']
        query = "INSERT INTO users(user_type_id, email, guardian_email, name, password, phone_number, dob, " \
                "allergy) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (email) DO NOTHING RETURNING user_id"
        cursor.execute(query, [user_type_id, email, guardian_email, name, password, phone, dob, allergy])
        self.connection.commit()
        if cursor.rowcount == 0:
            return None
        user_id = cursor.fetchone()['user_id']
        cursor.close()
        return user_id

    def create_schedule(self, *, user_id, schedule, slot_duration):
        cursor = self.connection.cursor()
        query = "INSERT INTO staff_schedule(staff_id, slot_duration, schedule) VALUES (%s, %s, %s)"
        cursor.execute(query, [user_id, slot_duration, json.dumps(schedule)])
        self.connection.commit()
        cursor.close()

    def save_otp(self, *, user_id, email_otp, guardian_email_otp):
        cursor = self.connection.cursor()
        query = "INSERT INTO signup_verification (user_id, email_otp, guardian_email_otp) VALUES (%s, %s, %s) " \
                "ON CONFLICT (user_id) DO UPDATE SET email_otp=%s, guardian_email_otp=%s"
        cursor.execute(query, [user_id, email_otp, guardian_email_otp, email_otp, guardian_email_otp])
        self.connection.commit()
        cursor.close()

    def get_user_type(self, *, user_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT type FROM user_type INNER JOIN users ON user_type.id=users.user_type_id WHERE users.user_id=%s"
        cursor.execute(query, [user_id])
        user_type = cursor.fetchone()['type']
        cursor.close()
        return user_type

    def get_all_cases_by_patient(self, *, patient_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT cases.case_id, users.name as created_by, cases.problem, cases.created_at, cases.updated_at " \
                "FROM cases INNER JOIN users ON cases.created_by_id=users.user_id WHERE cases.patient_id=%s"
        cursor.execute(query, [patient_id])
        cases = cursor.fetchall()
        cursor.close()
        return cases

    def get_all_cases_by_staff(self, *, created_by_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT cases.case_id, users.name as patient_id, cases.problem, cases.created_at, cases.updated_at " \
                "FROM cases INNER JOIN users ON cases.patient_id=users.user_id INNER JOIN prescriptions " \
                "ON prescriptions.created_by_id=cases.created_by_id WHERE prescriptions.created_by_id=%s"
        cursor.execute(query, [created_by_id])
        cases = cursor.fetchall()
        cursor.close()
        return cases

    def get_case_by_staff(self, *, case_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * from cases WHERE case_id=%s"
        cursor.execute(query, [case_id])
        case = cursor.fetchone()
        cursor.close()
        if not case:
            return None
        case['patient_name'] = self.get_user_by_user_id(user_id=case['patient_id'])['name']
        case['created_by'] = self.get_user_by_user_id(user_id=case['created_by_id'])['name']
        return case

    def get_case_by_patient(self, *, case_id, patient_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * from cases WHERE case_id=%s"
        cursor.execute(query, [case_id])
        case = cursor.fetchone()
        cursor.close()
        if not case:
            return True, None
        if case['patient_id'] != patient_id:
            return False, None
        case['patient_name'] = self.get_user_by_user_id(user_id=case['patient_id'])['name']
        case['created_by'] = self.get_user_by_user_id(user_id=case['created_by_id'])['name']
        return True, case

    def get_prescriptions_by_case(self, *, case_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT prescriptions.prescription_id , prescriptions.prescription, prescriptions.created_at, " \
                "prescriptions.updated_at, users.name as created_by from prescriptions INNER JOIN users ON " \
                "prescriptions.created_by_id=users.user_id WHERE case_id=%s"
        cursor.execute(query, [case_id])
        prescriptions = cursor.fetchall()
        cursor.close()
        return prescriptions

    def create_case(self, *, patient_id, created_by_id, problem):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "INSERT INTO cases (patient_id, created_by_id, problem) VALUES (%s, %s, %s) RETURNING case_id"
        cursor.execute(query, [patient_id, created_by_id, problem])
        self.connection.commit()
        case_id = cursor.fetchone()['case_id']
        cursor.close()
        return case_id

    def create_prescription(self, *, case_id, created_by_id, prescription):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT MAX(prescription_id) as prescription_id from prescriptions where case_id=%s"
        cursor.execute(query, [case_id])
        prescription_id = cursor.fetchone()['prescription_id']
        if not prescription_id:
            prescription_id = 1
        else:
            prescription_id += 1
        query = "INSERT INTO prescriptions (prescription_id, case_id, created_by_id, prescription) " \
                "VALUES (%s, %s, %s, %s) RETURNING *"
        cursor.execute(query, [prescription_id, case_id, created_by_id, prescription])
        self.connection.commit()
        prescription_info = cursor.fetchone()
        cursor.close()
        return prescription_info

    def add_note(self, *, prescription_id, note, created_by_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT prescription from prescriptions WHERE prescription_id=%s and created_by_id=%s"
        cursor.execute(query, [prescription_id, created_by_id])
        prescription = cursor.fetchone()['prescription']
        if not prescription:
            return False, None
        if 'note' not in prescription:
            prescription['note'] = []
        prescription['note'].append(note)
        query = "UPDATE prescriptions SET prescription=%s WHERE prescription_id=%s and created_by_id=%s"
        cursor.execute(query, [prescription, prescription_id, created_by_id])
        self.connection.commit()
        cursor.close()
        return True, prescription

    def add_report_by_staff(self, *, prescription_id,  report):
        pass

    def add_report_by_patient(self, *, prescription_id,  report, patient_id):
        pass
