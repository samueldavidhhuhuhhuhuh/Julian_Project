import struct, json, hashlib, socket

def md5_hex(data_bytes):
    return hashlib.md5(data_bytes).hexdigest()

def send_message(sock: socket.socket, obj: dict):
    data = json.dumps(obj, separators=(',', ':')).encode('utf-8')
    length = struct.pack('>I', len(data))
    sock.sendall(length + data)

def recvall(sock: socket.socket, n: int):
    data = b''
    while len(data) < n:
        packet = sock.recv(n - len(data))
        if not packet:
            return None
        data += packet
    return data

def recv_message(sock: socket.socket):
    raw_len = recvall(sock, 4)
    if not raw_len:
        return None
    msg_len = struct.unpack('>I', raw_len)[0]
    data = recvall(sock, msg_len)
    if not data:
        return None
    return json.loads(data.decode('utf-8'))
