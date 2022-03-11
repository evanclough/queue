from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from flaskext.mysql import MySQL

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
    print('received link: ' + link)
    #update database
    #then broadcast a queue update to all in room
    emit("input_status", "poggers")


if __name__ == '__main__':
    socketio.run(app)