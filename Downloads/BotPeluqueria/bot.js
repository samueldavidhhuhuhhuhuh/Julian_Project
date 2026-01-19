import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';

const userStates = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    // Obtenemos la versión oficial más reciente soportada por la librería
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Usando versión de WhatsApp v${version.join('.')}, ¿Es la última?: ${isLatest}`);

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Julian Rodriguez', 'Chrome', '10.0'], 
        generateHighQualityLinkPreview: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('\n=============================================');
            console.log('⚠️  ESCANEA ESTE QR AHORA  ⚠️');
            console.log('=============================================\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const error = lastDisconnect?.error;
            const statusCode = error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut && statusCode !== 405;
            
            if (shouldReconnect) {
                console.log('🔄 Reconectando en 3s...');
                setTimeout(connectToWhatsApp, 3000);
            } else {
                console.log('⛔ Error crítico. Si es 405, borra auth_info_baileys e intenta de nuevo.');
            }
        } else if (connection === 'open') {
            console.log('=============================================');
            console.log('✅ BOT CONECTADO Y LISTO');
            console.log('=============================================');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // --- LÓGICA DEL CHAT ---
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const remoteJid = msg.key.remoteJid;
            const texto = (msg.message.conversation || 
                           msg.message.extendedTextMessage?.text || 
                           msg.message.imageMessage?.caption || 
                           "").toLowerCase().trim();

            if (!texto) return;

            const now = Date.now();
            let userState = userStates.get(remoteJid) || { step: 'START', lastMsg: 0 };
            if (now - userState.lastMsg > SESSION_TIMEOUT) userState = { step: 'START', lastMsg: now };

            // FASE 1: MENÚ DE BIENVENIDA
            if (userState.step === 'START' || ['hola', 'buenas', 'info', 'menu'].some(t => texto.includes(t))) {
                await sock.sendMessage(remoteJid, { 
                    text: `Bienvenido a Julian Rodriguez Peluqueria 💈\n\n` +
                          `A partir de ahora contamos con un sistema de agendamiento exclusivo a través de WhatsApp. Nuestro asistente virtual gestionará tu cita de manera rápida, cómoda y personalizada.\n\n` +
                          `👇 *Selecciona una opción:*\n\n` +
                          `1️⃣ Reserva una cita\n` +
                          `2️⃣ Membresía VIP\n` +
                          `3️⃣ Cancelar cita`
                });
                userStates.set(remoteJid, { step: 'WAITING_OPTION', lastMsg: now });
            }
            // FASE 2: OPCIONES
            else if (userState.step === 'WAITING_OPTION') {
                
                // OPCIÓN 1: RESERVA
                if (texto === '1' || texto.includes('reserva')) {
                    await sock.sendMessage(remoteJid, { 
                        text: `Para agendar tu cita te invitamos a hacerlo directamente en nuestra página web, aquí podrás elegir el día y la hora que mejor se adapten a ti de manera rápida y segura:\n\n` +
                              `👉 https://julianrodriguezpeluqueria.com/` 
                    });
                    
                    // Mensaje de cierre a los 2 segundos
                    setTimeout(async () => {
                        await sock.sendMessage(remoteJid, { text: `En caso de no poder asistir por favor avisarnos con anticipación.` });
                    }, 2000);
                    
                    userStates.set(remoteJid, { step: 'START', lastMsg: now });
                }
                
                // OPCIÓN 2: VIP
                else if (texto === '2' || texto.includes('vip')) {
                    await sock.sendMessage(remoteJid, { 
                        text: `Club VIP Rodriguez Peluqueria 🌟\n\n` +
                              `Beneficios exclusivos, descuentos especiales y acceso prioritario a nuestros servicios.\n\n` +
                              `👇 *Quiero ser VIP:*\n` +
                              `👉 https://julianrodriguezpeluqueria.com/` 
                    });

                    // Mensaje de cierre a los 2 segundos
                    setTimeout(async () => {
                        await sock.sendMessage(remoteJid, { text: `Gracias por confiar en nuestros servicios.` });
                    }, 2000);

                    userStates.set(remoteJid, { step: 'START', lastMsg: now });
                }
                
                // OPCIÓN 3: CANCELAR
                else if (texto === '3' || texto.includes('cancelar')) {
                    await sock.sendMessage(remoteJid, { 
                        text: `Has solicitado cancelar tu cita en Julian Rodriguez Peluqueria.\n\n` +
                              `Tu reserva ha sido cancelada con éxito. Si deseas reagendar puedes hacerlo directamente desde nuestra web.`
                    });

                    // Mensaje de cierre a los 2 segundos
                    setTimeout(async () => {
                        await sock.sendMessage(remoteJid, { text: `Gracias por confiar en nuestros servicios.` });
                    }, 2000);

                    userStates.set(remoteJid, { step: 'START', lastMsg: now });
                }
                
                // OPCIÓN NO VÁLIDA
                else {
                    await sock.sendMessage(remoteJid, { text: `Por favor escribe *1, 2 o 3* para seleccionar una opción.` });
                }
            }
        } catch (e) {
            console.error("Error mensaje:", e);
        }
    });
}

connectToWhatsApp();