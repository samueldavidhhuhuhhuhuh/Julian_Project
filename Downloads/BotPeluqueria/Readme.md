💈 Bot de WhatsApp - Julian Rodriguez Peluqueria

Este es un asistente virtual automatizado para WhatsApp basado en la librería Baileys. Está diseñado para gestionar agendamientos, membresías VIP y cancelaciones de citas de manera automática, sin depender de un navegador web (lo que lo hace muy rápido y estable).

🚀 Características

Conexión Directa: Usa WebSockets (Baileys) en lugar de simular un navegador, evitando errores por actualizaciones visuales de WhatsApp.

Flujo Conversacional: Menú interactivo con opciones numéricas (1, 2, 3).

Persistencia: Guarda la sesión localmente para no escanear el QR cada vez.

Respuestas Automáticas: Envía enlaces y mensajes de confirmación predefinidos.

Reconexión Inteligente: Detecta caídas de red y se reconecta automáticamente.

📋 Requisitos Previos

Para ejecutar este bot, necesitas tener instalado en tu computadora:

Node.js (Versión 18 o superior): Descargar aquí.

Git: Descargar aquí.

Un número de WhatsApp activo en un celular físico.

🛠️ Instalación (Paso a Paso)

Clona este repositorio (o descarga el ZIP):

git clone [https://github.com/TU_USUARIO/bot-peluqueria.git](https://github.com/TU_USUARIO/bot-peluqueria.git)
cd bot-peluqueria


Instala las dependencias:
Abre una terminal en la carpeta del proyecto y ejecuta:

npm install


Configuración:
Abre el archivo bot.js con un editor de texto y busca las líneas donde están los enlaces de ejemplo para poner los de tu negocio:

// Ejemplo:
text: `👉 https://tupaginaweb.com/agendar`


▶️ Ejecución

Opción A: Desde Terminal

Simplemente ejecuta:

npm start


Opción B: Doble Clic (Windows)

Si estás en Windows, puedes dar doble clic al archivo Iniciar.bat incluido en el proyecto.

📱 Vinculación

Al iniciar el bot por primera vez, verás un Código QR en la terminal.

Abre WhatsApp en tu celular.

Ve a Dispositivos vinculados > Vincular dispositivo.

Escanea el QR.

¡Listo! Verás un mensaje de "CONECTADO".

⚠️ Solución de Problemas Comunes

Error 405 / Conexión rechazada:
Borra la carpeta auth_info_baileys generada y vuelve a escanear el QR.

El QR no aparece:
Asegúrate de que la ventana de la terminal sea lo suficientemente grande.

📄 Licencia

Samuel David Rojas Monroy