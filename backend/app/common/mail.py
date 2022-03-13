from __future__ import print_function
import base64
import googleapiclient.discovery
from httplib2 import Http
from oauth2client.client import GoogleCredentials
from email.mime.text import MIMEText
from app.common.config import Config


class Email:

    def __init__(self):
        self.service = None
        self.FROM_EMAIL = Config.FROM_EMAIL
        self.GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID
        self.GOOGLE_CLIENT_SECRET = Config.GOOGLE_CLIENT_SECRET
        self.GOOGLE_TOKEN_URI = "https://accounts.google.com/o/oauth2/token"
        self.REFRESH_TOKEN = Config.REFRESH_TOKEN

    def login(self):
        creds = GoogleCredentials(None,
                                  self.GOOGLE_CLIENT_ID,
                                  self.GOOGLE_CLIENT_SECRET,
                                  self.REFRESH_TOKEN,
                                  None,
                                  self.GOOGLE_TOKEN_URI,
                                  None)

        self.service = googleapiclient.discovery.build(
            'gmail', 'v1', http=creds.authorize(Http()))

    def create_msg(self, *, message_text, to, subject):

        message = MIMEText(message_text)
        message['to'] = ','.join(to)
        message['from'] = self.FROM_EMAIL
        message['subject'] = subject
        raw = base64.urlsafe_b64encode(message.as_bytes())
        raw = raw.decode()

        return {'raw': raw}

    def send_msg(self, *, message):
        try:
            mail = (self.service.users().messages().send(userId='me', body=message)
                    .execute())
            return mail
        except Exception as error:
            print('An error occurred: %s' % error)
            raise error
