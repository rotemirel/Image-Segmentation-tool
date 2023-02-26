import io
import cv2
import numpy as np
from bson import ObjectId
from matplotlib import pyplot as pltd
from flask import Flask, send_file
from flask import jsonify
from flask import request
from flask_cors import CORS
import json
from imageProcessing import *
from io import BytesIO
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)

image_processing = imageProcessing()


def transform_image(image_bytes):
    # Decode the base64-encoded image bytes
    image_data = base64.b64decode(image_bytes)
    # Open the image using PIL
    image = Image.open(io.BytesIO(image_bytes))
    # Convert the image to a NumPy array
    image_array = np.array(image)
    # Convert the NumPy array to a OpenCV image
    cv2_image = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
    image_processing.set_data(cv2_image)
    return


@app.route('/data', methods=['POST'])
def send_data():
    # Saving the sent image
    image_bytes = request.get_data()
    transform_image(image_bytes)
    return jsonify(True)


@app.route('/indices', methods=['POST'])  # NEW
def receive_line_pixels():
    # receiving the detected pixels
    line_pixels = request.get_json()  # 'request' object to get the line pixels from the request body.
    image_processing.set_pixels(line_pixels)
    # Create a new image with the corrected border
    new_image = image_processing.process_data()
    # Saving the new image
    image_processing.set_data(new_image)

    # encode imgae to bytes
    image_str = cv2.imencode('.jpg', new_image)[1].tobytes()
    image_str = base64.b64encode(image_str).decode('utf-8')
    response = {'image': image_str}
    return jsonify(response)


@app.route('/undo', methods=['GET'])
def undo():
    if len(image_processing.get_image()) > 1:
        image_str = cv2.imencode('.jpg', image_processing.get_image()[-2])[1].tobytes()
    else:
        image_str = cv2.imencode('.jpg', image_processing.get_image()[-1])[1].tobytes()
    image_str = base64.b64encode(image_str).decode('utf-8')
    response = {'image': image_str}

    if len(image_processing.get_image()) > 1:
        image_processing.remove_last_img()
    return jsonify(response)


if __name__ == '__main__':
    app.run()


