# Queue
Queue is a application which enables users to queue videos
to watch together as a group. Basically unscuffed PlugDJ (RIP).
Ideal for bored online chatrooms (e.g. twitch offline chat).

# Development
For now, to develop, you'll need to:
* set up a mysql database for rooms, 
* Make a .env file in the format of the default.env in both directories, 
* Run ```pip install -r requirements.txt``` in the server directory, 
* Run  ```npm install``` in both the client and scuffed server client directories,
* Run ```py server.py``` in the server directory to start the server,
* Run```node client.js``` in the scuffed server client directory to start that up so the main loop is run,
* Then finally run ```npm start``` in the client directory to start the frontend.

# Goals
I hope to create an account system for the site, so that
users can create and run their own rooms, make some kind of dockerfile
or whatever that is to make it so that you don't have to use three different 
terminals to start it up, and also make it prettier.

