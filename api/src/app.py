from flask import Flask
from flask_restful import Resource, Api, reqparse
from flaskext.mysql import MySQL
from flask_cors import CORS
import requests

#Initialize app and pymysql instance
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
mysql = MySQL()

#Configure database
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'queue'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

#initialize more stuff and create cursor
mysql.init_app(app)
api = Api(app)
connection = mysql.connect()
cursor = connection.cursor()

# Routes 
# TODO: put in different file

class GetVideos(Resource):
    def get(self):
        with mysql.connect().cursor() as cursor:
            cursor.execute("SELECT * FROM videos")
            videos = []
            data = cursor.fetchall()
            for i in data:
                videos.append({"URL": i[1], "requester": i[2], "timestamp": i[3].strftime("%m/%d/%Y, %H:%M:%S")})
            return videos
        
add_video_args = reqparse.RequestParser()
add_video_args.add_argument("URL", type=str, help="Video URL", required=True)
add_video_args.add_argument("requester", type=str, help="Username of account that reqeusted video")

class AddVideo(Resource):
    def post(self):
        with mysql.connect() as connection:
            args = add_video_args.parse_args()
            cursor = connection.cursor()
            try:
                VIDEO_ID = args['URL'][len(args['URL']) - 11:]
                r = requests.get(f"https://www.youtube.com/watch?v={VIDEO_ID}")
                if "Video unavailable" in r.text:
                    return {"success": False, "message": "Not valid youtube video ID."}
                cursor.execute(f"INSERT INTO videos (URL, requester) VALUES (\"{args['URL']}\", \"{args['requester']}\");")
                connection.commit()
                return {"success": True}
            except Exception as e:
                connection.rollback()
                print(e)
                return {"success": False, "message": "Database error."}

class GetCurrentVideo(Resource):
    def get(self):
        with mysql.connect().cursor() as cursor:
            cursor.execute("SELECT * FROM videos WHERE ID = (SELECT MIN(ID) FROM videos);")
            data = cursor.fetchone()
            print(data)
            return {"URL": data[1] if data is not None else "", "timestamp": data[4] if data is not None else -1}


#Add routes to API
api.add_resource(GetVideos, "/get_videos")
api.add_resource(AddVideo, "/add_video")
api.add_resource(GetCurrentVideo, "/get_current_video")

if __name__ == '__main__':
    app.run(debug=True)