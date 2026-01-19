import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';

const userStates = new Map();

// TIEMPOS DE CONFIGURACIÓN
const SESSION_TIMEOUT = 30 * 60 * 1000;      // 30 minutos para reiniciar el menú si no responden
const HUMAN_MODE_TIMEOUT = 2 * 60 * 60 * 1000; // 2 HORAS de silencio si el bot falla (para que hable el humano)

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
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
            console.clear();
            console.log('\n=============================================');
            console.log('⚠️  ESCANEA ESTE NUEVO CÓDIGO QR  ⚠️');
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
            console.clear();
            console.log('=============================================');
            console.log('✅ BOT CONECTADO - MODO SILENCIO INTELIGENTE');
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

            // ---------------------------------------------------------
            // 1. CHEQUEO DE "MODO HUMANO" (SILENCIO)
            // ---------------------------------------------------------
            if (userState.step === 'HUMAN_MODE') {
                // Si aún no han pasado las 2 horas de silencio...
                if (now - userState.lastMsg < HUMAN_MODE_TIMEOUT) {
                    // EL BOT NO HACE NADA. Deja que el humano hable.
                    return; 
                } else {
                    // Si ya pasaron 2 horas, reactivamos el bot
                    userState = { step: 'START', lastMsg: now };
                }
            }

            // ---------------------------------------------------------
            // 2. REINICIO DE SESIÓN NORMAL (TIMEOUT DE 30 MIN)
            // ---------------------------------------------------------
            if (now - userState.lastMsg > SESSION_TIMEOUT && userState.step !== 'HUMAN_MODE') {
                userState = { step: 'START', lastMsg: now };
            }

            // ---------------------------------------------------------
            // 3. FLUJO DEL BOT
            // ---------------------------------------------------------

            // FASE 1: MENÚ DE BIENVENIDA (ACTIVACIÓN UNIVERSAL)
            if (userState.step === 'START') {
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
                    setTimeout(async () => {
                        await sock.sendMessage(remoteJid, { text: `En caso de no poder asistir por favor avisarnos con anticipación.` });
                    }, 2000);
                    // ÉXITO: Reiniciamos a START para la próxima vez (dentro de mucho tiempo)
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
                    setTimeout(async () => {
                        await sock.sendMessage(remoteJid, { text: `Gracias por confiar en nuestros servicios.` });
                    }, 2000);
                    userStates.set(remoteJid, { step: 'START', lastMsg: now }); 
                }
                
                // --- AQUÍ OCURRE EL "HUMAN HANDOFF" (PASO A HUMANO) ---
                // Si el usuario escribe algo que NO es una opción válida...
                else {
                    await sock.sendMessage(remoteJid, { 
                        text: `⚠️ Opción no reconocida.\n` +
                              `Te pondremos en contacto con un asesor humano para que te ayude directamente. Por favor espera, te responderemos pronto.`
                    });
                    
                    // ACTIVAMOS EL MODO SILENCIO POR 2 HORAS
                    console.log(`[MODO HUMANO] Activado para ${remoteJid} por 2 horas.`);
                    userStates.set(remoteJid, { step: 'HUMAN_MODE', lastMsg: now });
                }
            }
        } catch (e) {
            console.error("Error mensaje:", e);
        }
    });
}

connectToWhatsApp();