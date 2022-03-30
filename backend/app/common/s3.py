import os
import boto3
from botocore.exceptions import ClientError
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.common.config import Config
from app.common.utilities import Utils


class S3:

    def __init__(self):
        self.client = boto3.client('s3')
        self.resource = boto3.resource('s3')
        self.bucket = Config.S3_BUCKET

    def push(self, *, file):
        file_uuid = Utils.get_uuid()
        try:
            if file.filename != '':
                file.save(file.filename)
            self.client.upload_file(file.filename, self.bucket, file_uuid)
            os.remove(file.filename)
            return file_uuid
        except ClientError as e:
            print(e)
        return None



