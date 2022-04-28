from datetime import datetime, timezone
import boto3
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.common.config import Config
from app.common.utilities import Utils


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
                "allergy) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (email) DO UPDATE SET " \
                "user_type_id=%s, guardian_email=%s, name=%s, password=%s, phone_number=%s, dob=%s RETURNING user_id"
        cursor.execute(query, [user_type_id, email, guardian_email, name, password, phone, dob, allergy,
                               user_type_id, guardian_email, name, password, phone, dob])
        self.connection.commit()
        user_id = cursor.fetchone()['user_id']
        cursor.close()
        return user_id

    def update_user(self, *, user_id, name, dob, phone, allergy=None):
        cursor = self.connection.cursor()
        query = "UPDATE users SET name=%s, dob=%s, phone_number=%s, allergy=%s WHERE user_id=%s"
        cursor.execute(query, [name, dob, phone, allergy, user_id])
        self.connection.commit()
        cursor.close()
        return True

    def create_schedule(self, *, user_id, schedule, slot_duration):
        cursor = self.connection.cursor()
        query = "INSERT INTO staff_schedule(staff_id, slot_duration, schedule) VALUES (%s, %s, %s)"
        cursor.execute(query, [user_id, slot_duration, json.dumps(schedule)])
        self.connection.commit()
        cursor.close()

    def get_staff_schedule_by_user_id(self, *, user_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * FROM staff_schedule WHERE staff_id=%s"
        cursor.execute(query, [user_id])
        schedule = cursor.fetchone()
        cursor.close()
        return schedule

    def update_schedule(self, *, user_id, schedule, slot_duration):
        cursor = self.connection.cursor()
        query = "UPDATE staff_schedule SET schedule=%s, slot_duration=%s WHERE staff_id=%s"
        cursor.execute(query, [json.dumps(schedule), slot_duration, user_id])
        self.connection.commit()
        cursor.close()
        return True

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

    def get_patient_email_by_case(self, *, case_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT email FROM users INNER JOIN cases ON cases.patient_id=users.user_id WHERE cases.case_id=%s"
        cursor.execute(query, [case_id])
        email = cursor.fetchone()['email']
        cursor.close()
        return email

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
        query = "SELECT DISTINCT cases.case_id, users.name as patient_name, cases.problem, cases.created_at, " \
                "cases.updated_at FROM cases INNER JOIN users ON cases.patient_id=users.user_id INNER JOIN " \
                "prescriptions ON prescriptions.case_id=cases.case_id WHERE prescriptions.created_by_id=%s UNION " \
                "SELECT cases.case_id, users.name as patient_name, cases.problem, cases.created_at, cases.updated_at " \
                "FROM cases INNER JOIN users ON cases.patient_id=users.user_id where cases.created_by_id=%s"
        cursor.execute(query, [created_by_id, created_by_id])
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
        patient = self.get_user_by_user_id(user_id=case['patient_id'])
        case['patient_name'] = patient['name']
        case['patient_allergy'] = patient['allergy']
        case['patient_age'] = Utils.calculate_age(patient['dob'])
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
        patient = self.get_user_by_user_id(user_id=case['patient_id'])
        case['patient_name'] = patient['name']
        case['patient_allergy'] = patient['allergy']
        case['patient_age'] = Utils.calculate_age(patient['dob'])
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

    def get_prescriptions_by_case_and_prescription_id(self, *, case_id, prescription_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT prescriptions.prescription_id , prescriptions.prescription, prescriptions.created_at, " \
                "prescriptions.updated_at, users.name as created_by from prescriptions INNER JOIN users ON " \
                "prescriptions.created_by_id=users.user_id WHERE case_id=%s AND prescription_id=%s"
        cursor.execute(query, [case_id, prescription_id])
        prescription = cursor.fetchone()
        cursor.close()
        return prescription

    def create_case(self, *, patient_id, created_by_id, problem):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "INSERT INTO cases (patient_id, created_by_id, problem) VALUES (%s, %s, %s) RETURNING case_id"
        cursor.execute(query, [patient_id, created_by_id, problem])
        self.connection.commit()
        case_id = cursor.fetchone()['case_id']
        cursor.close()
        return case_id

    def update_case_updated_at(self, *, case_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "UPDATE cases SET updated_at=now() WHERE case_id=%s"
        cursor.execute(query, [case_id])
        self.connection.commit()
        cursor.close()

    def is_case_exists(self, *, case_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * FROM cases WHERE case_id=%s"
        cursor.execute(query, [case_id])
        case = cursor.fetchone()
        cursor.close()
        if not case:
            return False
        return True

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
        cursor.execute(query, [prescription_id, case_id, created_by_id, json.dumps(prescription)])
        self.connection.commit()
        prescription = cursor.fetchone()
        cursor.close()
        return prescription

    def add_correction(self, *, case_id, prescription_id, correction, created_by_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT prescription from prescriptions WHERE prescription_id=%s and created_by_id=%s and case_id=%s"
        cursor.execute(query, [prescription_id, created_by_id, case_id])
        if cursor.rowcount == 0:
            return False, None
        prescription = cursor.fetchone()['prescription']
        if 'corrections' not in prescription:
            prescription['corrections'] = []
        prescription['corrections'].append(correction)
        query = "UPDATE prescriptions SET prescription=%s, updated_at=now() WHERE prescription_id=%s and " \
                "created_by_id=%s and case_id=%s RETURNING *"
        cursor.execute(query, [json.dumps(prescription), prescription_id, created_by_id, case_id])
        self.connection.commit()
        prescription = cursor.fetchone()
        cursor.close()
        return True, prescription

    def get_prescription(self, case_id, prescription_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * FROM prescriptions WHERE prescription_id=%s and case_id=%s"
        cursor.execute(query, [prescription_id, case_id])
        prescription = cursor.fetchone()
        cursor.close()
        if not prescription:
            return None
        return prescription

    def update_prescription(self, *, case_id, prescription_id, prescription):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "UPDATE prescriptions SET prescription=%s, updated_at=now() WHERE prescription_id=%s and case_id=%s"
        cursor.execute(query, [json.dumps(prescription), prescription_id, case_id])
        self.connection.commit()
        cursor.close()

    def get_not_verified_users(self):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT user_id, name, email, user_type.type FROM users INNER JOIN user_type ON " \
                "users.user_type_id=user_type.id WHERE (user_type.type=%s OR user_type.type=%s) AND " \
                "user_type_verification=%s"
        cursor.execute(query, ['doctor', 'nurse', False])
        users = cursor.fetchall()
        cursor.close()
        return users;

    def update_user_type_verification(self, user_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "UPDATE users SET user_type_verification=%s WHERE user_id=%s"
        cursor.execute(query, [True, user_id])
        self.connection.commit()
        if cursor.rowcount == 0:
            cursor.close()
            return False
        cursor.close()
        return True

    def delete_user(self, user_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "DELETE FROM users WHERE user_id=%s"
        cursor.execute(query, [user_id])
        self.connection.commit()
        if cursor.rowcount == 0:
            cursor.close()
            return False
        cursor.close()
        return True

    def get_doctors_schedule(self):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT users.name as name, users.user_id as id, staff_schedule.schedule, "\
                "staff_schedule.slot_duration FROM users INNER JOIN user_type ON user_type.id=users.user_type_id "\
                "INNER JOIN staff_schedule ON users.user_id=staff_schedule.staff_id where user_type.type=%s"
        cursor.execute(query, ['doctor'])
        scheduled = cursor.fetchall()
        cursor.close()
        return scheduled

    def get_booked_slots(self, *, doctor_id, from_date, last_date):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT id, appointment_time, patient_id, users.name FROM appointment_table INNER JOIN users ON " \
                "appointment_table.patient_id=users.user_id WHERE "\
                "appointment_time > %s AND appointment_time < %s And doctor_id = %s "
        cursor.execute(query, [from_date, last_date, doctor_id])
        booked = cursor.fetchall()
        cursor.close()
        return booked

    def get_schedule(self, *,doctor_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT slot_duration, schedule FROM staff_schedule WHERE staff_id=%s "
        cursor.execute(query, [doctor_id])
        schedule = cursor.fetchone()
        cursor.close()
        return schedule['schedule'], schedule['slot_duration']

    def create_appointment(self, *, doctor_id, patient_id, appointment_datetime, followup_prescription_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "INSERT INTO appointment_table(doctor_id ,patient_id ,created_at ,appointment_time, followup_case_id)"\
                " VALUES (%s, %s, %s, %s, %s) RETURNING id"
        cursor.execute(query, [doctor_id, patient_id, datetime.now(timezone.utc), appointment_datetime,
                               followup_prescription_id])
        self.connection.commit()
        appointment_id = cursor.fetchone()['id']
        cursor.close()
        return appointment_id

    def get_doctors_schedule_by_id(self, *, doctor_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT schedule FROM staff_schedule WHERE staff_id=%s "
        cursor.execute(query, [doctor_id])
        schedule = cursor.fetchone()
        cursor.close()
        if not schedule:
            return None
        return schedule['schedule']

    def get_slot_availability(self, *, appointment_time):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT appointment_time FROM appointment_table WHERE appointment_time=%s "
        cursor.execute(query, [appointment_time])
        slot = cursor.fetchone()
        cursor.close()
        if not slot:
            return True
        return False

    def delete_appointment(self, *, user_id, appointment_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "DELETE FROM appointment_table WHERE id = %s and patient_id=%s"
        cursor.execute(query, [appointment_id, user_id])
        self.connection.commit()
        if cursor.rowcount == 0:
            cursor.close()
            return False
        cursor.close()
        return True

    def get_upcoming_appointment_for_patient(self, *, user_id, current_datetime):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT doctor_id, patient_id, appointment_time, users.name as patient_name, users.email as " \
                "patient_email, followup_case_id FROM appointment_table INNER JOIN users ON " \
                "appointment_table.patient_id=users.user_id WHERE "\
                "appointment_time > %s  And patient_id = %s "
        cursor.execute(query, [current_datetime, user_id])
        upcoming_appointment = cursor.fetchall()
        cursor.close()
        return upcoming_appointment

    def get_upcoming_appointment_for_doctor(self, *, user_id, current_datetime):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT doctor_id, patient_id, appointment_time, users.name as patient_name, users.email as " \
                "patient_email, followup_case_id FROM appointment_table INNER JOIN users ON " \
                "appointment_table.patient_id=users.user_id WHERE "\
                "appointment_time > %s  And doctor_id = %s "
        cursor.execute(query, [current_datetime, user_id])
        upcoming_appointment = cursor.fetchall()
        cursor.close()
        return upcoming_appointment

    def get_doctor_name(self,*,doctor_id):
        cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        query = "SELECT name FROM users WHERE user_id=%s "
        cursor.execute(query, [doctor_id])
        name = cursor.fetchone()
        cursor.close()
        return name
        
