from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from flaskext.mysql import MySQL
import time
import html
import requests

app = Flask(__name__)
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

@socketio.on('connect')
def connect(auth):
    print('connected')
    #emit queue
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')
    
@socketio.on('link_input')
def link_input(link):
    link = html.escape(link)
    #check if link is valid youtube video
    VIDEO_ID = link[len(link) - 11:]
    r = requests.get(f"https://www.youtube.com/watch?v={VIDEO_ID}")
    if "Video unavailable" in r.text:
        print(123)
        emit("input_status", {"success": False})
        return
    #update database

    #send out video to everyone in room
    emit("add_video", link, broadcast=True)
    emit("input_status", {"success": True})

@socketio.on('get_current_video')
def get_current_video():
    #grab current video from DB
    socketio.emit("switch_video", {"videoID": "1nzuUprovC4"})

def main_loop():
        pass
        #if current video is over, 
        #then emit switch_video with next video in db
        #set time started to now, 
        #and edit DB accordingly.
        #if there isn't a next video, 
        #then emit switch_video with null or
        #whatever flag I choose.

def main_loop(socketio):
    while True:
        socketio.emit("abc", "123")
        time.sleep(1)

if __name__ == '__main__':
    SocketIO.start_background_task(main_loop(socketio))
    socketio.run(app)
