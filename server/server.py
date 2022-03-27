from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit, Namespace
from flaskext.mysql import MySQL
import time
import html
import requests
from queue import Queue
import time
from multiprocessing import Process, Value, Array
import youtube_dl

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

def get_duration(ID):
    with youtube_dl.YoutubeDL({}) as dl:
        dictMeta = dl.extract_info(f"https://www.youtube.com/watch?v={ID}", download=False)
    return dictMeta['duration']

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

@app.route('/create_room', methods=['POST'])
def create_room():
    with mysql.connect() as connection:
        cursor = connection.cursor()
        name = request.json["room"]
        sql_query = "INSERT INTO rooms (name) VALUES (%s)"
        try:
            cursor.execute(sql_query, (name,))
        except Exception as e:
            return {"success": False}
        connection.commit()
        return {"success": True}

class Room(Namespace):
    def __init__(self, route):
        super().__init__(route)
        self.queue = Queue()
        self.connected = 0
        self.current_video_ID = "-1"
        self.started_video_at = 0
        self.current_video_duration = -1
        print("initialized", route)
    def on_connect(self, auth):
        self.connected+=1
        print('connected')
        qlist = list(self.queue.queue)
        res_list = []
        for video in qlist:
            res_list.append({"ID": video["ID"]})
        emit("current_videos", {"videos": res_list})
        emit("connected_users", {"connected_users": self.connected}, broadcast=True)
        emit('switch_video', {"videoID": self.current_video_ID, "startPoint": int(time.time()) - self.started_video_at})
    def on_disconnect(self):
        print('client_disconnected')
        self.connected-=1
        emit("connected_users", {"connected_users": self.connected}, broadcast=True)
    def on_link_input(self, data):
        link = html.escape(data["link"])
        #check if link is valid youtube video
        VIDEO_ID = link[len(link) - 11:]
        r = requests.get(f"https://www.youtube.com/watch?v={VIDEO_ID}")
        if "Video unavailable" in r.text:
            emit("input_status", {"success": False})
            return
        self.queue.put({"ID": VIDEO_ID, "duration": get_duration(VIDEO_ID)})
        emit("add_video", {"video": {"ID": VIDEO_ID}}, broadcast=True)
        emit("input_status", {"success": True})
    def on_main_loop(self):
        if self.current_video_ID == "-1":
            print("there are no videos in the queue")
            if len(list(self.queue.queue)) != 0:
                    print("video added, switching")
                    new_video_obj = self.queue.get()
                    self.current_video_ID = new_video_obj["ID"]
                    self.current_video_duration = new_video_obj["duration"]
                    self.started_video_at = int(time.time())
                    print(self.current_video_ID, self.current_video_duration, self.started_video_at, len(list(self.queue.queue)))
                    emit("switch_video", {"videoID": self.current_video_ID, "startPoint": 0}, broadcast=True)
        else:
            print("a video is going")
            if int(time.time()) - self.started_video_at > self.current_video_duration:
                print("switching to new video")
                if len(list(self.queue.queue)) != 0:
                    new_video_obj = self.queue.get()
                    self.current_video_ID = new_video_obj["ID"]
                    self.current_video_duration = new_video_obj["duration"]
                    self.started_video_at = int(time.time())
                    emit('switch_video', {"videoID": self.current_video_ID, "startPoint": 0}, broadcast=True)
                    emit("dequeue", broadcast=True)
                else:
                    print("video is over but there are no new ones :(")
                    self.current_video_duration = -1
                    self.current_video_ID = "-1"
                    self.started_video_at = 0
                    emit('switch_video', {"videoID": self.current_video_ID, "startPoint": 0}, broadcast=True)
                    emit("dequeue", broadcast=True)

            #check if current video is over
            #if so pop queue and switch current_video, started_at, and current_video_duration


if __name__ == '__main__':
    rooms = get_rooms()
    room_processes = []
    #re render room list when new room is made
    for room in rooms:
        room_obj = Room(f'/{room["name"]}')
        #room_obj_value = Value(Room, room_obj)
        socketio.on_namespace(room_obj)
        #room_processes.append(Process(target=lambda r: r.value.main_loop(), args=(room_obj_value)))
    #for room_process in room_processes:
    #    room_process.start()
    socketio.run(app, use_reloader=False)
    #for room_process in room_processes:
    #    room_process.join()
