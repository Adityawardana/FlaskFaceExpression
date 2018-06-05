from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

from app import views

if __name__ == '__main__':
    app.run(threaded=True)

# @app.route('/')
#
# def index():
#     return "Hello WOrld!"
#
# if __name__ == "__main__":
#     app.run(debug = True)