from flask import Flask
from flask_restful import Resource, Api
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'queue'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)
api = Api(app)
connection = mysql.connect()
cursor = connection.cursor()

class GetVideos(Resource):
    def get(self):
        cursor.execute("SELECT * FROM videos")
        videos = []
        data = cursor.fetchall()
        for i in data:
            videos.append({"URL": i[1], "requester": i[2], "timestamp": i[3].strftime("%m/%d/%Y, %H:%M:%S")})
        return videos
        
class AddVideo(Resource):
    def post(self):
        cursor.execute("")
api.add_resource(GetVideos, "/get_videos")

if __name__ == '__main__':
    app.run(debug=True)