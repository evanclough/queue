from flask import Flask
from flask_restful import Resource, Api, reqparse
from flaskext.mysql import MySQL
from flask_cors import CORS

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
                cursor.execute(f"INSERT INTO videos (URL, requester) VALUES (\"{args['URL']}\", \"{args['requester']}\");")
                connection.commit()
            except Exception as e:
                connection.rollback()
                print(e)
            
#Add routes to API
api.add_resource(GetVideos, "/get_videos")
api.add_resource(AddVideo, "/add_video")

if __name__ == '__main__':
    app.run(debug=True)