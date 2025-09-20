# Manejo de Excepciones

- **Servidor**: usa `try/except` en cada cliente para evitar caída total.
- **Cliente**: reconexión en caso de fallo de red.
- **Timeouts**: detectar clientes inactivos con `socket.settimeout`.
- **Hash mismatch**: servidor responde con `error: hash_mismatch`.
