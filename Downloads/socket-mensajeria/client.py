# client.py
import socket, threading, time, json, sys
from utils import send_message, recv_message, md5_hex
from datetime import datetime

def recv_loop(sock):
    try:
        while True:
            msg = recv_message(sock)
            if msg is None:
                print("Conexión cerrada por servidor.")
                break
            print(f"\n<< {msg.get('from','SERVER')} -> {msg.get('to')}: {msg.get('payload')}")
    except Exception as e:
        print("Error en recv_loop:", e)

if __name__ == "__main__":
    server_ip = input("IP del servidor (o presiona Enter para localhost): ").strip() or '127.0.0.1'
    server_port = int(input("Puerto (Enter para 5000): ") or 5000)
    username = input("Tu usuario: ").strip()

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((server_ip, server_port))

    # register
    reg = {"type":"register","from":username,"to":"server","payload":"","timestamp":datetime.utcnow().isoformat(),"hash":md5_hex(b"")}
    send_message(s, reg)
    # esperar ack
    resp = recv_message(s)
    if not resp or resp.get('type') == 'error':
        print("Registro falló:", resp); s.close(); sys.exit(1)

    threading.Thread(target=recv_loop, args=(s,), daemon=True).start()

    print("Comandos: /list  /quit  /msg <usuario> <mensaje>  o escribe mensaje para broadcast")
    try:
        while True:
            line = input("> ").strip()
            if not line:
                continue
            if line.startswith("/quit"):
                send_message(s, {"type":"disconnect","from":username,"to":"server","payload":"","timestamp":datetime.utcnow().isoformat(),"hash":md5_hex(b"")})
                break
            if line.startswith("/list"):
                send_message(s, {"type":"list","from":username,"to":"server","payload":"","timestamp":datetime.utcnow().isoformat(),"hash":md5_hex(b"")})
                continue
            if line.startswith("/msg "):
                parts = line.split(" ",2)
                if len(parts)<3:
                    print("Uso: /msg usuario mensaje")
                    continue
                to_user = parts[1]
                payload = parts[2].encode('utf-8')
                msg = {"type":"msg","from":username,"to":to_user,"payload":parts[2],"timestamp":datetime.utcnow().isoformat(),"hash":md5_hex(payload)}
                send_message(s, msg)
                continue
            # broadcast
            payload = line.encode('utf-8')
            msg = {"type":"msg","from":username,"to":"all","payload":line,"timestamp":datetime.utcnow().isoformat(),"hash":md5_hex(payload)}
            send_message(s, msg)
    except KeyboardInterrupt:
        pass
    finally:
        s.close()
        print("Cliente cerrado.")
