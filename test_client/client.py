import socketio

rooms = ['poggers']

if __name__ == '__main__':
    sio = socketio.Client()
    sio.connect(f'http://localhost:5000', namespaces=rooms)
    sio.sleep(1)
    """
    while True: 
        for room in rooms:
            sio.emit('main_loop', namespace=f'/{room}')
        sio.sleep(0.5)"""

