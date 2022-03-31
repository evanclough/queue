from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from flaskext.mysql import MySQL
from dotenv import load_dotenv
from os import getenv
from room import Room

#initialize flask app
app = Flask(__name__)
#allow CORS
CORS(app)
#initialize pymysql
mysql = MySQL()
#load environment variables
load_dotenv()

#configure db
app.config['MYSQL_DATABASE_USER'] = getenv("DB_USER")
app.config['MYSQL_DATABASE_PASSWORD'] = getenv("DB_PASSWORD")
app.config['MYSQL_DATABASE_DB'] = 'queue'
app.config['MYSQL_DATABASE_HOST'] = getenv("DB_HOST")

#connect mysql to flask app with magic
mysql.init_app(app)

#create socketio instance
socketio = SocketIO(app, cors_allowed_origins="*")

#query db with:
#with mysql.connect() as connection
#if insert, connection.commit
#if pulling, cursor.fetchone or cursor.fetchall

@app.route('/login', methods=['POST'])
def login():
    #take in username/password
    #check if valid
    #if so, generate token
    #add token to db list of active tokens
    pass

#grabs list of rooms from db
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

#route to grab list of rooms
@app.route('/get_rooms')
def get_rooms_route():
    return get_rooms()

#checks if inputted room is valid, and returns answer
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

#creates room if available, returns false if not
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

if __name__ == '__main__':
    rooms = get_rooms()
    for room in rooms:
        room_obj = Room(f'/{room["name"]}', emit, debug=True)
        socketio.on_namespace(room_obj)
    socketio.run(app, use_reloader=False)
