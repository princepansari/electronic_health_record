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
    REGION = os.environ.get("REGION") or "ap-south-1"
    RDS_ENDPOINT = os.environ.get("RDS_ENDPOINT") or "mydatabase.cpzjlut3r44b.ap-south-1.rds.amazonaws.com"
    PORT = os.environ.get("PORT") or "5432"
    DBUSER = os.environ.get("DBUSER") or "unicorn"
    DATABASE = os.environ.get("DATABASE") or "unicorn_db"
    PASSWORD = os.environ.get("PASSWORD") or "welcome123"

    # email config
    FROM_EMAIL = "shortify.tech@gmail.com"
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID") or \
                       "393388259530-e13a3lv6fje5mc87itt3d9fkj83j3gaa.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET") or "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"
    REFRESH_TOKEN = os.environ.get("REFRESH_TOKEN") or \
                    "1//0gBXrnPpfPkutCgYIARAAGBASNwF-L9IrsC_r-F-JF-oYan-qXNzdZU3vi22U0-ELNYEXPQtlDIGrB4VG-8htudwFUnUAz7-7O08"

    # JWT config
    EXPIRE_AFTER_DAYS = os.environ.get('EXPIRE_AFTER_DAYS') or 1

    # OTP config
    OTP_DIGIT_SPACE = os.environ.get('OTP_DIGIT_SPACE') or '0123456789'
