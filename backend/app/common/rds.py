from datetime import datetime, timezone
import boto3
import psycopg2
from psycopg2.extras import RealDictCursor

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
        query = "UPDATE users SET last_login=%s WHERE id=%s"
        cursor.execute(query, [datetime.now(timezone.utc), user_id])
        self.connection.commit()
        cursor.close()

    def get_user_otp(self, *, user_id): 
        cursor = self.connection.cursor()
        query = "SELECT email_otp AND guardian_email_otp FROM signup_verification WHERE user_id=%s"
        cursor.execute(query, [user_id])
        valid_otp, valid_guardian_otp = cursor.fetchone()
        cursor.close()
        return valid_otp, valid_guardian_otp

    def update_verification_status(self, *, email):
        cursor = self.connection.cursor()
        query = "UPDATE users SET account_verfied='TRUE' WHERE email=%s"
        cursor.execute(query, [email])
        self.connection.commit()
        cursor.close()
    
    # TODO: add user
    def create_user(self, *, user_type, email, guardian_email, name, password, dob, phone, allergy):
        cursor = self.connection.cursor()
        query = "INSERT INTO users(user_id, user_type_id, email, guardian_email, name, password, phone_number, dob, allergy, user_type_verification, created_at, updated_at, account_verfied, last_login)"
        VALUES (check, user_type, email, guardian_email, name, password, phone, dob, allergy )

    # TODO: add schedule
    def create_schedule(self, *, user_id, schedule, slot_duration):
        pass

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
        user_type = cursor.fetchone()
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

    def get_case_by_patient(self, *, case_id, user_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * from cases WHERE case_id=%s"
        cursor.execute(query, [case_id])
        case = cursor.fetchone()
        cursor.close()
        if not case:
            return True, None
        if case['patient_id'] != user_id:
            return False, None
        case['patient_name'] = self.get_user_by_user_id(user_id=case['patient_id'])['name']
        case['created_by'] = self.get_user_by_user_id(user_id=case['created_by_id'])['name']
        return case

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
