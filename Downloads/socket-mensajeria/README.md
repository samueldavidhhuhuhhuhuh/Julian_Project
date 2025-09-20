# Proyecto de Chat con Sockets en Python

Este proyecto implementa un sistema de mensajería simple usando **sockets TCP** en Python. Consta de un **servidor** que gestiona las conexiones de múltiples clientes y de un **cliente** que permite enviar y recibir mensajes en tiempo real.

---

## 📂 Estructura del Proyecto

```
socket-mensajeria/
├── server.py
├── client.py
└── README.md
```

* **server.py** → Código del servidor, encargado de recibir y distribuir los mensajes.
* **client.py** → Código del cliente, encargado de conectarse al servidor y enviar/recibir mensajes.
* **README.md** → Instrucciones de uso y explicación del proyecto.

---

## 🚀 Requisitos Previos

* Tener instalado **Python 3.10+** (el proyecto fue probado en Python 3.13.3).
* Funciona en Windows, Linux y macOS.

> 💡 Nota: En Windows puede que el comando `python3` no funcione. En ese caso usar simplemente `python`.

---

## ▶️ Ejecución del Proyecto

### 1. Clonar o descargar el proyecto

Si tienes el `.zip`, simplemente descomprímelo en la carpeta de tu preferencia.

### 2. Iniciar el servidor

En una terminal, dirígete a la carpeta del proyecto y ejecuta:

```bash
python server.py
```

El servidor quedará a la espera de clientes.

### 3. Iniciar los clientes

En otras terminales (o incluso en otras máquinas dentro de la misma red), ejecuta:

```bash
python client.py
```

Se pedirá un nombre de usuario y luego podrás empezar a enviar mensajes.

### 4. Enviar mensajes

* Todo lo que escribas en el cliente será enviado al servidor.
* El servidor retransmitirá los mensajes a todos los clientes conectados.

---

## 🛠️ Funcionamiento Interno

1. **Servidor**:

   * Acepta múltiples conexiones de clientes.
   * Escucha continuamente los mensajes de cada cliente.
   * Reenvía cada mensaje a todos los demás clientes conectados.

2. **Cliente**:

   * Se conecta al servidor.
   * Envía mensajes escritos por el usuario.
   * Recibe en tiempo real los mensajes de los demás.

---

## ✅ Problema Resuelto

El objetivo era crear un chat funcional usando sockets en Python. Durante el desarrollo surgió un detalle en Windows: el comando `python3` no estaba reconocido, aunque Python sí estaba instalado. La solución fue ejecutar el código usando simplemente `python`.

De esta forma, el sistema de chat funciona correctamente en Windows y otros sistemas operativos.

---

## 📌 Notas Finales

* Este proyecto implementa **mensajería grupal** (todos los clientes reciben todos los mensajes).

---

¡Ahora ya puedes ejecutar tu propio chat por sockets en Python! 🎉
