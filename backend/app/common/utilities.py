import re


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
