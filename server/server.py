from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit, Namespace
from flaskext.mysql import MySQL
import time
import html
import requests
from queue import Queue

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'queue'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

socketio = SocketIO(app, cors_allowed_origins="*")

#query db with:
#with mysql.connect() as connection
#if insert, connection.commit
#if pulling, cursor.fetchone or cursor.fetchall

def get_rooms():
    with mysql.connect() as connection:
        cursor = connection.cursor()
        sql_query = "SELECT * FROM rooms;"
        cursor.execute(sql_query)
        res = []
        raw_data = cursor.fetchall()
        for room in raw_data:
            res.append({"ID": room[0], "name": room[1]})
        return res

@app.route('/get_rooms')
def get_rooms_route():
    return get_rooms()

@app.route("/check_if_valid_room", methods=['POST'])
def check_if_valid_room():
    with mysql.connect() as connection:
        cursor = connection.cursor()
        name = request.json["room"]
        sql_query = "SELECT * FROM rooms;"
        cursor.execute(sql_query)
        raw_data = cursor.fetchall()
        res = False
        for datum in raw_data:
            res |= (datum[1] == name)
        return {"roomExists": res}

class Room(Namespace):
    def __init__(self, route):
        super().__init__(route)
        self.queue = Queue()
        self.connected = 0
        print("initialized", route)
    def on_connect(self):
        print('connected')
        emit("current_videos", list(self.queue.queue))
        emit("connected_users", {"connectedUsers": self.connected})
        self.connected+=1
    def on_disconnect(self):
        print('client_disconnected')
        self.connected-=1
    def on_link_input(self, data):
        link = html.escape(data["link"])
        #check if link is valid youtube video
        VIDEO_ID = link[len(link) - 11:]
        r = requests.get(f"https://www.youtube.com/watch?v={VIDEO_ID}")
        if "Video unavailable" in r.text:
            print(123)
            emit("input_status", {"success": False})
            return
        self.queue.put(VIDEO_ID)
        emit("add_video", link, broadcast=True)
        emit("input_status", {"success": True})
    def on_get_current_video(self):
        emit('get_current_video', {"ID": "-1"} if self.queue.empty() else self.queue.get())

if __name__ == '__main__':
    rooms = get_rooms()
    for room in rooms:
        socketio.on_namespace(Room(f'/{room["name"]}'))
    socketio.run(app)
