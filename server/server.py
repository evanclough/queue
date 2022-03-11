from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

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
    print('received link: ' + link)
    #update database
    #then broadcast a queue update to all in room
    emit("input_status", "poggers")


if __name__ == '__main__':
    socketio.run(app)