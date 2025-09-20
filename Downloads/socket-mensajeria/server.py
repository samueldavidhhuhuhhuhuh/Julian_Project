# server.py
import socket, threading, time, json
from utils import send_message, recv_message, md5_hex

HOST = '0.0.0.0'
PORT = 5000

clients = {}  

lock = threading.Lock()

def broadcast(obj, exclude_username=None):
    with lock:
        for user, (conn, _) in clients.items():
            if user == exclude_username:
                continue
            try:
                send_message(conn, obj)
            except Exception as e:
                print(f"Error enviando a {user}: {e}")

def handle_client(conn, addr):
    try:
        msg = recv_message(conn)
        if not msg or msg.get('type') != 'register':
            send_message(conn, {"type":"error","payload":"Se necesita register"}); conn.close(); return
        username = msg.get('from')
        with lock:
            if username in clients:
                send_message(conn, {"type":"error","payload":"Usuario ya conectado"}); conn.close(); return
            clients[username] = (conn, addr)
        send_message(conn, {"type":"ack","payload":"registered"})
        print(f"{username} registrado desde {addr}")

        while True:
            msg = recv_message(conn)
            if msg is None:
                print(f"{username} desconectado")
                break
            payload = msg.get('payload','').encode('utf-8')
            expected = md5_hex(payload)
            if msg.get('hash') != expected:
                send_message(conn, {"type":"error","payload":"hash_mismatch"})
                continue

            if msg['type'] == 'msg':
                to = msg.get('to')
                if to == 'all':
                    forward = {"type":"msg","from":msg['from'],"to":"all","payload":msg['payload'],"timestamp":msg.get('timestamp')}
                    broadcast(forward, exclude_username=None)
                else:
                    with lock:
                        dest = clients.get(to)
                    if dest:
                        dest_conn, _ = dest
                        forward = {"type":"msg","from":msg['from'],"to":to,"payload":msg['payload'],"timestamp":msg.get('timestamp')}
                        send_message(dest_conn, forward)
                    else:
                        send_message(conn, {"type":"error","payload":"usuario_no_encontrado"})
            elif msg['type'] == 'list':
                with lock:
                    userlist = list(clients.keys())
                send_message(conn, {"type":"ack","payload": json.dumps(userlist)})
            elif msg['type'] == 'disconnect':
                break
            else:
                send_message(conn, {"type":"error","payload":"tipo_desconocido"})
    except Exception as e:
        print("Excepción en handle_client:", e)
    finally:
         
        with lock:
            for u,(c,a) in list(clients.items()):
                if c is conn:
                    del clients[u]
                    print(f"Eliminado {u}")
        try:
            conn.close()
        except:
            pass

def accept_loop():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))
    s.listen(5)
    print(f"Servidor en {HOST}:{PORT}")
    while True:
        conn, addr = s.accept()
        threading.Thread(target=handle_client, args=(conn, addr), daemon=True).start()

if __name__ == "__main__":
    accept_loop()
