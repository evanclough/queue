from flask import Flask
from flask_restful import Resource, Api, reqparse
from flaskext.mysql import MySQL
from flask_cors import CORS
from get_duration import get_duration
import time
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

update_queue = False

def should_switch():
        with mysql.connect().cursor() as cursor:
            cursor.execute("SELECT * FROM videos WHERE ID = (SELECT MIN(ID) FROM videos);")
            data = cursor.fetchone()
            return data is not None and int(time.time()) < data[5] + data[6]

def get_videos():
    with mysql.connect().cursor() as cursor:
            cursor.execute("SELECT * FROM videos")
            videos = []
            data = cursor.fetchall()
            for i in data:
                scuffed = requests.get(f"https://www.youtube.com/watch?v={i[1]}").text
                title = scuffed[scuffed.find("<title>") + 7:scuffed.find("</title>") - 10]
                videos.append({
                    "URL": i[1], 
                    "requester": i[2], 
                    "timestamp": i[3].strftime("%m/%d/%Y, %H:%M:%S"), 
                    "title": title,
                    "thumbnail": f"https://i.ytimg.com/vi/{i[1]}/hqdefault.jpg"
                })
            return videos

class GetVideos(Resource):
    def get(self):
        return get_videos()
        
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
                cursor.execute(
                    f"""INSERT INTO videos (URL, requester, duration)  
                    VALUES (\"{VIDEO_ID}\", \"{args['requester']}\", \"{get_duration(VIDEO_ID) * 1000}\");"""
                )
                connection.commit()
                update_queue = True
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
            return {"URL": data[1] if data is not None else "", "startedAt": data[5] if data is not None else -1}

def switch_video():
    with mysql.connect() as connection:
            cursor = connection.cursor()
            cursor.execute("DELETE FROM videos WHERE ID = (SELECT MIN(ID) FROM videos);")
            connection.commit()
    with mysql.connect() as connection:
            cursor = connection.cursor()
            cursor.execute(f"UPDATE videos SET started_at = {int(time.time())} WHERE ID = (SELECT MIN(ID) FROM videos);")
            connection.commit()
    with mysql.connect().cursor() as cursor:
            cursor.execute("SELECT * FROM videos WHERE ID = (SELECT MIN(ID) FROM videos);")
            data = cursor.fetchone()
            return {"URL": data[1] if data is not None else "", "startedAt": data[5] if data is not None else -1}

def start_video():
    with mysql.connect() as connection:
            cursor = connection.cursor()
            cursor.execute(f"UPDATE videos SET started_at = {int(time.time())} WHERE ID = (SELECT MIN(ID) FROM videos);")
            connection.commit()
    with mysql.connect().cursor() as cursor:
            cursor.execute("SELECT * FROM videos WHERE ID = (SELECT MIN(ID) FROM videos);")
            data = cursor.fetchone()
            return {"URL": data[1] if data is not None else "", "startedAt": data[5] if data is not None else -1}

class RefreshRequest(Resource):
    def get(self):
        response = {}
        response["startVideo"] = False
        response["switchVideo"]: should_switch()
        if response["switchVideo"]: 
            response["switchResponse"] = switch_video()
        response["updateQueue"] = update_queue
        if update_queue:
            response["updateQueueResponse"] = get_videos()
            if len(response["updateQueueResponse"]) == 1:
                response["startVideo"] = True
                response["startResponse"] = start_video()
        update_queue = False
        return response

#Add routes to API
api.add_resource(GetVideos, "/get_videos")
api.add_resource(AddVideo, "/add_video")
api.add_resource(GetCurrentVideo, "/get_current_video")
api.add_resource(RefreshRequest, "/refresh_request")

if __name__ == '__main__':
    app.run(debug=True)