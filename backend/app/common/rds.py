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

    def update_user_last_login(self, *, user_id):
        cursor = self.connection.cursor()
        query = "UPDATE users SET last_login=%s WHERE id=%s"
        cursor.execute(query, [datetime.now(timezone.utc), user_id])
        self.connection.commit()
        cursor.close()

    #TODO: add user
    def create_user(self, *, user_type, email, guardian_email, name, password, dob, phone, allergy):
        pass

    #TODO: add schedule
    def create_schedule(self, *, user_id, schedule, slot_duration):
        pass

    def save_otp(self, *, user_id, email_otp, guardian_email_otp):
        cursor = self.connection.cursor()
        query = "INSERT INTO signup_verification (user_id, email_otp, guardian_email_otp) VALUES (%s, %s, %s) " \
                "ON CONFLICT (user_id) DO UPDATE SET email_otp=%s, guardian_email_otp=%s"
        cursor.execute(query, [user_id, email_otp, guardian_email_otp, email_otp, guardian_email_otp])
        self.connection.commit()
        cursor.close()
