import base64
import os
import uuid

import boto3

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("S3_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("S3_SECRET_ACCESS_KEY"),
    region_name=os.getenv("S3_REGION"),
)


def upload_image_to_s3(image_dataurl: str, filename: str = str(uuid.uuid4())):
    image_dataurl = image_dataurl.split(",")[1]
    image_data = base64.b64decode(image_dataurl)
    s3.put_object(
        Bucket=os.getenv("S3_NAME"),
        Key=filename,
        Body=image_data,
        ContentType="image/png",
    )
    return f"https://{os.getenv('S3_NAME')}.s3.{os.getenv('S3_REGION')}.amazonaws.com/{filename}"
