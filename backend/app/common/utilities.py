import re
import uuid
import datetime


class Utils:

    @staticmethod
    def validate_email(email):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.fullmatch(regex, email)

    @staticmethod
    def validate_password(password):
        if len(password) >= 8:
            lower = upper = digit = special = 0
            for char in password:
                if char.islower():
                    lower += 1
                elif char.isupper():
                    upper += 1
                elif char.isdigit():
                    digit += 1
                elif char in '!@#$%^&*()~':
                    special += 1
            if lower and upper and digit and special and lower + upper + digit + special == len(password):
                return True
        return False

    @staticmethod
    def validate_otp(otp):
        if len(otp) != 6:
            return False
        for i in range(6):
            if not otp[i].isdigit():
                return False
        return True

    @staticmethod
    def get_uuid():
        return str(uuid.uuid4())

    @staticmethod
    def calculate_age(dob):
        today = datetime.date.today()
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))