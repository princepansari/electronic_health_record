import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class Config:
    # Config
    USER_TYPES = os.environ.get('USER_TYPES') or ['patient', 'doctor', 'nurse']
    IIT_DOMAIN = os.environ.get('IIT_DOMAIN') or 'iitbhilai.ac.in'

    # Common config
    TMP_DIR = os.environ.get("TMP_DIR") or "/tmp"
    ENV = os.environ.get("ENV") or "test"

    # RDS config
    REGION = os.environ.get("REGION")
    RDS_ENDPOINT = os.environ.get("RDS_ENDPOINT")
    PORT = os.environ.get("PORT")
    DBUSER = os.environ.get("DBUSER")
    DATABASE = os.environ.get("DATABASE")
    PASSWORD = os.environ.get("PASSWORD")

    # S3 config
    S3_BUCKET = os.environ.get("S3_BUCKET")
    BUCKET_URL = os.environ.get("BUCKET_URL")

    # email config
    FROM_EMAIL = "shortify.tech@gmail.com"
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
    REFRESH_TOKEN = os.environ.get("REFRESH_TOKEN")

    # JWT config
    EXPIRE_AFTER_DAYS = os.environ.get('EXPIRE_AFTER_DAYS') or 1

    # OTP config
    OTP_DIGIT_SPACE = os.environ.get('OTP_DIGIT_SPACE') or '0123456789'
