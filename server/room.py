from queue import Queue
import time
from utilities import get_duration
from flask_socketio import Namespace
from dotenv import load_dotenv
from os import getenv
import html
import requests

#class to create room
class Room(Namespace):
    #constructor initializes a bunch of stuff
    def __init__(self, route, emit_method, debug=False):
        super().__init__(route)
        self.queue = Queue()
        self.connected = 0
        self.current_video_ID = "-1"
        self.started_video_at = 0
        self.current_video_duration = -1
        self.current_votes_to_skip = 0
        self.debug = debug
        self.emit = emit_method
        if self.debug:
            print("initialized", route)
        
    #connect method returns current video list and current video to connected user
    #also broadcasts the connected users going up
    def on_connect(self, auth):
        self.connected+=1
        if self.debug:
            print('connected')
        qlist = list(self.queue.queue)
        self.emit("current_videos", {"videos": qlist})
        self.emit("connected_users", {"connected_users": self.connected}, broadcast=True)
        self.emit('switch_video', {"videoID": self.current_video_ID, "startPoint": int(time.time()) - self.started_video_at})

    #disconnect method just broadcasts connected users going down
    def on_disconnect(self):
        if self.debug:
            print('client_disconnected')
        self.connected-=1
        self.emit("connected_users", {"connected_users": self.connected}, broadcast=True)

    #vote to skip method broadcasts new vote to skip
    #TODO: make sure only one vote is counted for each user.
    def on_vote_to_skip(self):
        self.current_votes_to_skip+=1
        self.emit("add_vote_to_skip", broadcast=True)

    #link input route takes in video link, makes sure it's a valid link
    #then broadcasts it being added to the queue for everyone and returns input status
    def on_link_input(self, data):
        link = html.escape(data["link"])
        #chops off video id of link
        VIDEO_ID = link[len(link) - 11:]
        r = requests.get(f"https://www.youtube.com/watch?v={VIDEO_ID}")
        #hack to check if video is real
        if "Video unavailable" in r.text:
            self.emit("input_status", {"success": False})
            return
        video_data = requests.get(f"https://noembed.com/embed?url=https://www.youtube.com/watch?v={VIDEO_ID}").json()
        self.queue.put({"ID": VIDEO_ID, "duration": get_duration(VIDEO_ID), "title": video_data["title"], "author_name": video_data["author_name"], "author_url": video_data["author_url"]})
        self.emit("add_video", {"video": {"ID": VIDEO_ID, "title": video_data["title"], "author_name": video_data["author_name"], "author_url": video_data["author_url"]}}, broadcast=True)
        self.emit("input_status", {"success": True})

    #main loop function is called twice a seocnd by external constantly 
    #running, it checks whether or not there's a video playing, then 
    #checks whether or not it's done, and switchs to the next video
    #if so.
    def on_main_loop(self, auth):
        #verifies that the client is real
        if auth["SECRET_KEY_FOR_SCUFFED_SERVERCLIENT"] == getenv("SECRET_KEY_FOR_SCUFFED_SERVERCLIENT"):
            #if there's no current video
            if self.current_video_ID == "-1":
                if self.debug:
                    print("there are no videos in the queue")
                #if the queue isn't empty, switch the current video
                if len(list(self.queue.queue)) != 0:
                    if self.debug:
                        print("video added, switching")
                    new_video_obj = self.queue.get()
                    self.current_video_ID = new_video_obj["ID"]
                    self.current_video_duration = new_video_obj["duration"]
                    self.started_video_at = int(time.time())
                    self.current_votes_to_skip = 0
                    if self.debug:
                        print(self.current_video_ID, self.current_video_duration, self.started_video_at, len(list(self.queue.queue)))
                    self.emit("switch_video", {"videoID": self.current_video_ID, "startPoint": 0, "title": new_video_obj["title"], "channelName": new_video_obj["author_name"], "channelUrl": new_video_obj["author_url"]}, broadcast=True)
                    self.emit("dequeue", broadcast=True)
            else:
                #if there is a video playing
                if self.debug:
                    print("a video is going")
                #if the videos over, swtich it
                if int(time.time()) - self.started_video_at > self.current_video_duration + 1 or self.current_votes_to_skip / (self.connected - 1 if self.connected != 0 else 1) > 0.5:
                    if self.current_votes_to_skip / (self.connected - 1 if self.connected != 0 else 1) > 0.5:
                        self.emit("skipping", broadcast=True)
                    if self.debug:
                        print("switching to new video")
                    #if there's a video in the queue, switch to that one
                    if len(list(self.queue.queue)) != 0:
                        new_video_obj = self.queue.get()
                        self.current_video_ID = new_video_obj["ID"]
                        self.current_video_duration = new_video_obj["duration"]
                        self.started_video_at = int(time.time())
                        self.current_votes_to_skip = 0
                        self.emit("switch_video", {"videoID": self.current_video_ID, "startPoint": 0, "title": new_video_obj["title"], "channelName": new_video_obj["author_name"], "channelUrl": new_video_obj["author_url"]}, broadcast=True)
                        self.emit("dequeue", broadcast=True)
                    else:
                        #if there isn't switch to the no video flag.
                        if self.debug:
                            print("video is over but there are no new ones :(")
                        self.current_video_duration = -1
                        self.current_video_ID = "-1"
                        self.started_video_at = 0
                        self.current_votes_to_skip = 0
                        self.emit("switch_video", {"videoID": self.current_video_ID, "startPoint": 0, "title": "-1", "channelName": "-1", "channelUrl": "-1"}, broadcast=True)
                        self.emit("dequeue", broadcast=True)
