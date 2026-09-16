/**
 * ==============================================================================
 * TECNO BOT - Asistente Virtual Inteligente y Sistema de Entrevistas
 * Tecno Electrónica - Todos los derechos reservados (2026)
 * ==============================================================================
 */

(function () {
    'use strict';

    // ── Configuración General de Tecno Electrónica ──
    const CONFIG = {
        name: 'Tecno Bot',
        version: '2.0.0',
        phone: '5493541267777',
        email: 'tecno.electronica@gmail.com',
        location: 'IPETyM Nº 84 "Jorge Vocos Lescano", Ruta Provincial 28, Tanti, Córdoba, Argentina',
        coverage: 'Tanti, Valle de Punilla y toda la Provincia de Córdoba',
        workHours: 'Lunes a Viernes de 08:00 a 19:00 hs',
        quoteTime: 'Menos de 48 horas hábiles',
        storageKey: 'tecno_bot_chat_history',
        soundKey: 'tecno_bot_sound_enabled'
    };

    // ── Base de Conocimiento de Servicios ──
    const SERVICES_KB = {
        timbre: {
            id: 'timbre',
            title: 'Timbre Automático Escolar',
            icon: 'notifications_active',
            link: 'servicios/timbre-automatico.html',
            summary: 'Sistema autónomo de automatización de horarios y alarmas para instituciones educativas.',
            features: [
                'Precisión al segundo en cada timbre de entrada, recreo y salida.',
                'Panel de control web propio accesible por WiFi desde celular o PC.',
                'Memoria no volátil: no se desconfigura si se corta la luz.',
                'Calendario inteligente: selección de días hábiles, feriados y turnos especiales.',
                'Compatible con los timbres eléctricos convencionales existentes.'
            ],
            estimatedTime: 'Instalación y puesta en marcha en 24 a 48 hs.',
            priceInfo: 'Presupuesto a medida según cantidad de timbres y turnos. Cotización sin cargo.'
        },
        cctv: {
            id: 'cctv',
            title: 'CCTV y Cámaras de Seguridad',
            icon: 'videocam',
            link: 'servicios/cctv.html',
            summary: 'Instalación y configuración de videovigilancia HD / IP con monitoreo remoto en tiempo real.',
            features: [
                'Cámaras de alta resolución con visión nocturna infrarroja y ColorVu.',
                'Monitoreo en vivo desde tu celular (iOS / Android) o PC en cualquier lugar.',
                'Grabación continua o inteligente por detección de movimiento.',
                'Sistemas para escuelas, comercios, galpones y residencias.'
            ],
            estimatedTime: 'Instalación completa en 24 a 72 hs según cantidad de cámaras.',
            priceInfo: 'Kits desde 2 hasta 32+ cámaras. Presupuesto personalizado.'
        },
        web: {
            id: 'web',
            title: 'Creación de Páginas Web',
            icon: 'language',
            link: 'servicios/paginas-web.html',
            summary: 'Diseño y desarrollo de sitios web modernos, rápidos y optimizados para captar clientes.',
            features: [
                '100% Responsive: visualización perfecta en celulares, tablets y computadoras.',
                'Optimización para motores de búsqueda (SEO) y máxima velocidad de carga.',
                'Integración directa con WhatsApp, redes sociales y formularios inteligentes.',
                'Landing pages, sitios institucionales, catálogos y tiendas online.'
            ],
            estimatedTime: 'Entrega en 5 a 15 días hábiles según complejidad.',
            priceInfo: 'Planes accesibles para emprendedores, comercios e instituciones.'
        },
        electrica: {
            id: 'electrica',
            title: 'Instalaciones Eléctricas',
            icon: 'bolt',
            link: 'servicios/instalaciones-electricas.html',
            summary: 'Soluciones eléctricas normalizadas bajo normativa AEA para industrias, comercios y hogares.',
            features: [
                'Armado, adecuación y certificación de tableros eléctricos.',
                'Instalación de disyuntores diferenciales, térmicas y puesta a tierra (jabalina).',
                'Detección de fugas, balanceo de fases y corrección de factor de potencia.',
                'Mantenimiento preventivo y correctivo para evitar riesgos de sobrecarga o incendio.'
            ],
            estimatedTime: 'Relevamiento inicial en 24 hs.',
            priceInfo: 'Presupuesto transparente según relevamiento técnico.'
        },
        solar: {
            id: 'solar',
            title: 'Instalación de Paneles Solares',
            icon: 'solar_power',
            link: 'servicios/paneles-solares.html',
            summary: 'Sistemas solares fotovoltaicos para reducir hasta un 90% el consumo eléctrico y tener respaldo.',
            features: [
                'Sistemas On-Grid (inyección y ahorro) y Off-Grid (con baterías para cortes de luz).',
                'Inversores y paneles monocristalinos de alta eficiencia garantizados.',
                'Estudio previo de radiación y consumo para amortización rápida.',
                'Ahorro económico y energía limpia y sustentable.'
            ],
            estimatedTime: 'Proyecto e instalación en 5 a 10 días.',
            priceInfo: 'Dimensionamiento a medida del consumo de tu factura de luz.'
        },
        plc: {
            id: 'plc',
            title: 'Programación PLC y Automatización Industrial',
            icon: 'precision_manufacturing',
            link: 'servicios/plc.html',
            summary: 'Automatización y control de procesos industriales con controladores lógicos programables.',
            features: [
                'Programación en Siemens (Logo!, S7-1200), Schneider y controladores estándar.',
                'Control de motores, bombas, cintas transportadoras, temperatura y nivel.',
                'Diseño de interfaces HMI para operación intuitiva.',
                'Optimización de tiempos de producción y eliminación de errores operativos.'
            ],
            estimatedTime: 'Según alcance del proceso industrial a automatizar.',
            priceInfo: 'Cotización tras relevamiento técnico detallado.'
        },
        marketing: {
            id: 'marketing',
            title: 'Marketing Digital',
            icon: 'campaign',
            link: 'servicios/marketing-digital.html',
            summary: 'Estrategias de presencia online, gestión de redes y campañas para conseguir más clientes.',
            features: [
                'Publicidad digital efectiva en Meta Ads (Instagram/Facebook) y Google Ads.',
                'Creación de contenido visual profesional e identidad de marca.',
                'Estrategias de conversión y captación de clientes potenciales calificados.',
                'Reportes mensuales de rendimiento y métricas claras.'
            ],
            estimatedTime: 'Puesta en marcha de campañas en 48 a 72 hs.',
            priceInfo: 'Planes mensuales adaptados a tu presupuesto publicitario.'
        },
        lumen: {
            id: 'lumen',
            title: 'Cálculo de Luminarias / Método Lumen',
            icon: 'lightbulb',
            link: 'servicios/metodo-lumen.html',
            summary: 'Estudio técnico de iluminación para asegurar el nivel de lux reglamentario y máxima eficiencia.',
            features: [
                'Cálculo fotométrico exacto según dimensiones, reflectancias y destino del espacio.',
                'Cumplimiento estricto de normas de seguridad e higiene laboral.',
                'Distribución uniforme de la luz evitando zonas oscuras o encandilamiento.',
                'Ahorro energético optimizando cantidad y potencia de artefactos LED.'
            ],
            estimatedTime: 'Estudio y reporte técnico en 48 a 72 hs.',
            priceInfo: 'Informe completo por ambiente o por metro cuadrado.'
        },
        arduino: {
            id: 'arduino',
            title: 'Prototipado Electrónico con Arduino & IoT',
            icon: 'developer_board',
            link: 'servicios/arduino.html',
            summary: 'Desarrollo de proyectos electrónicos a medida, integración de sensores e Internet de las Cosas.',
            features: [
                'Microcontroladores Arduino, ESP32, ESP8266 con conectividad WiFi/Bluetooth.',
                'Integración de sensores de presencia, temperatura, humedad, RFID, ultrasonido.',
                'Diseño de circuitos, prototipos en protoboard/PCB y maquetas funcionales.',
                'Validación técnica rápida antes de producción a escala.'
            ],
            estimatedTime: 'Prototipo funcional en 7 a 20 días.',
            priceInfo: 'Presupuesto según complejidad de hardware y programación.'
        }
    };

    // ── Árbol de Entrevista y Diagnóstico Interactivo ──
    const INTERVIEW_TREE = {
        step1: {
            question: '¡Excelente! Vamos a hacer un diagnóstico rápido para encontrar la mejor solución técnica. 🛠️\n\n¿Para qué tipo de lugar o actividad es tu consulta?',
            chips: [
                { label: '🏫 Escuela / Colegio / Instituto', action: 'int_client_escuela' },
                { label: '🏬 Comercio / Local / Negocio', action: 'int_client_comercio' },
                { label: '🏠 Hogar / Vivienda Particular', action: 'int_client_hogar' },
                { label: '🏭 Industria / Taller / Fábrica', action: 'int_client_industria' },
                { label: '💼 Empresa / Profesional / Emprendedor', action: 'int_client_empresa' }
            ]
        },
        step2: {
            escuela: {
                question: 'Perfecto para una institución educativa. 🏫 ¿Cuál es tu principal necesidad o desafío actual?',
                chips: [
                    { label: '🔔 Automatizar horarios de timbres (sin errores)', action: 'int_need_timbre_escuela' },
                    { label: '📹 Cámaras de seguridad en accesos y patios', action: 'int_need_cctv_escuela' },
                    { label: '⚡ Seguridad y tableros eléctricos de la escuela', action: 'int_need_electrica_escuela' },
                    { label: '💡 Estudio de iluminación para aulas y talleres', action: 'int_need_lumen_escuela' },
                    { label: '🌐 Crear página web o portal institucional', action: 'int_need_web_escuela' }
                ]
            },
            comercio: {
                question: 'Entendido, para comercio o negocio. 🏬 ¿Qué necesidad querés resolver?',
                chips: [
                    { label: '📹 Monitoreo por cámaras y seguridad', action: 'int_need_cctv_comercio' },
                    { label: '🌐 Página web y catálogo digital', action: 'int_need_web_comercio' },
                    { label: '📱 Publicidad y Marketing para vender más', action: 'int_need_mkt_comercio' },
                    { label: '☀️ Ahorrar en la factura de luz con energía solar', action: 'int_need_solar_comercio' },
                    { label: '⚡ Instalación / Adecuación eléctrica comercial', action: 'int_need_electrica_comercio' }
                ]
            },
            hogar: {
                question: 'Genial, para tu hogar o residencia. 🏠 ¿Qué proyecto tenés en mente?',
                chips: [
                    { label: '☀️ Bajar el costo de la luz con Paneles Solares', action: 'int_need_solar_hogar' },
                    { label: '📹 Cámaras de seguridad para ver desde el celular', action: 'int_need_cctv_hogar' },
                    { label: '⚡ Arreglar térmicas / tablero o instalación segura', action: 'int_need_electrica_hogar' },
                    { label: '🔬 Proyecto de automatización / Arduino a medida', action: 'int_need_arduino_hogar' }
                ]
            },
            industria: {
                question: 'Excelente para industria o taller. 🏭 ¿En qué área técnica necesitás apoyo?',
                chips: [
                    { label: '⚙️ Automatización de máquinas y programación PLC', action: 'int_need_plc_industria' },
                    { label: '⚡ Tableros de fuerza motriz y balance trifásico', action: 'int_need_electrica_industria' },
                    { label: '☀️ Sistema solar industrial para reducir costos', action: 'int_need_solar_industria' },
                    { label: '💡 Estudio lumínico reglamentario (Método Lumen)', action: 'int_need_lumen_industria' },
                    { label: '🔬 Prototipos electrónicos / IoT a medida', action: 'int_need_arduino_industria' }
                ]
            },
            empresa: {
                question: 'Muy bien. 💼 Para tu empresa o emprendimiento, ¿cuál es el objetivo primordial?',
                chips: [
                    { label: '🌐 Desarrollo de Página Web profesional', action: 'int_need_web_empresa' },
                    { label: '📈 Campañas de Marketing Digital y Redes', action: 'int_need_mkt_empresa' },
                    { label: '📹 Sistema de cámaras para oficinas / sucursales', action: 'int_need_cctv_empresa' },
                    { label: '⚙️ Automatización de procesos o hardware IoT', action: 'int_need_arduino_empresa' }
                ]
            }
        },
        step3: {
            timbre: {
                question: 'Acerca del sistema de timbres: 🔔 ¿Cuántos turnos manejan aproximadamente y tienen red WiFi en la institución?',
                chips: [
                    { label: '1 o 2 Turnos (Mañana / Tarde) con WiFi', action: 'int_detail_timbre_1' },
                    { label: '3 Turnos (Mañana, Tarde y Noche)', action: 'int_detail_timbre_2' },
                    { label: 'Varios timbres en edificios separados', action: 'int_detail_timbre_3' }
                ]
            },
            cctv: {
                question: 'Sobre el sistema de cámaras: 📹 ¿Aproximadamente cuántos puntos o zonas te gustaría vigilar?',
                chips: [
                    { label: 'Kit Básico (2 a 4 cámaras)', action: 'int_detail_cctv_small' },
                    { label: 'Kit Mediano (5 a 8 cámaras)', action: 'int_detail_cctv_med' },
                    { label: 'Sistema Integral (más de 8 cámaras + exterior)', action: 'int_detail_cctv_large' }
                ]
            },
            web: {
                question: 'Respecto al sitio web: 🌐 ¿Contás con material previo (logo, fotos, textos) o arrancás desde cero?',
                chips: [
                    { label: 'Arranco desde cero (necesito todo)', action: 'int_detail_web_new' },
                    { label: 'Tengo logo e información lista', action: 'int_detail_web_ready' },
                    { label: 'Quiero renovar una web ya existente', action: 'int_detail_web_redesign' }
                ]
            },
            electrica: {
                question: 'En cuanto a la parte eléctrica: ⚡ ¿Qué tipo de trabajo se requiere primordialmente?',
                chips: [
                    { label: 'Tablero nuevo / Arreglo de disyuntores y térmicas', action: 'int_detail_elec_board' },
                    { label: 'Puesta a tierra (Jabalina) y normalización', action: 'int_detail_elec_ground' },
                    { label: 'Instalación completa de obra o reforma', action: 'int_detail_elec_full' }
                ]
            },
            solar: {
                question: 'Para la energía solar: ☀️ ¿Cuál es tu prioridad principal?',
                chips: [
                    { label: 'Ahorrar al máximo en la factura mensual de luz', action: 'int_detail_solar_save' },
                    { label: 'Tener luz de respaldo ante cortes (Baterías)', action: 'int_detail_solar_backup' },
                    { label: 'Sistema híbrido completo (Ahorro + Respaldo)', action: 'int_detail_solar_hybrid' }
                ]
            },
            plc: {
                question: 'En programación y PLC: ⚙️ ¿Qué tipo de equipamiento o proceso involucra?',
                chips: [
                    { label: 'Control de bombas / motores / variadores', action: 'int_detail_plc_motors' },
                    { label: 'Línea de envasado / cinta transportadora', action: 'int_detail_plc_line' },
                    { label: 'Modernización de tablero con Siemens Logo / S7', action: 'int_detail_plc_siemens' }
                ]
            },
            mkt: {
                question: 'Para Marketing Digital: 📈 ¿En qué plataforma te interesa enfocar la inversión?',
                chips: [
                    { label: 'Instagram y Facebook Ads (Meta)', action: 'int_detail_mkt_meta' },
                    { label: 'Google Ads (Búsquedas directas de clientes)', action: 'int_detail_mkt_google' },
                    { label: 'Estrategia integral (Redes + Google + Contenido)', action: 'int_detail_mkt_all' }
                ]
            },
            lumen: {
                question: 'Para el Cálculo de Luminarias: 💡 ¿Qué superficie aproximada tiene el espacio?',
                chips: [
                    { label: 'Hasta 100 m² (Aulas, local pequeño, oficina)', action: 'int_detail_lumen_small' },
                    { label: '100 a 500 m² (Salón, comercio mediano, taller)', action: 'int_detail_lumen_med' },
                    { label: 'Más de 500 m² (Galpón industrial, colegio completo)', action: 'int_detail_lumen_large' }
                ]
            },
            arduino: {
                question: 'Para el desarrollo con Arduino/IoT: 🔬 ¿Qué requerimiento técnico clave tiene?',
                chips: [
                    { label: 'Lectura de sensores y telemetría por WiFi/Bluetooth', action: 'int_detail_ard_iot' },
                    { label: 'Control automático de relés / actuadores', action: 'int_detail_ard_actuators' },
                    { label: 'Prototipo de validación o maqueta funcional', action: 'int_detail_ard_prototype' }
                ]
            }
        },
        step4: {
            question: '¡Casi listo! ⏱️ ¿Con qué urgencia o plazo estimás la implementación de este proyecto?',
            chips: [
                { label: '⚡ Urgente (Dentro de esta semana)', action: 'int_urgency_urgent' },
                { label: '📅 Durante este mes', action: 'int_urgency_month' },
                { label: '💡 Planificando / Pidiendo presupuesto preliminar', action: 'int_urgency_planning' }
            ]
        }
    };

    // ── Sonidos Sintetizados (Web Audio API) ──
    class SoundFX {
        constructor() {
            this.ctx = null;
            this.enabled = localStorage.getItem(CONFIG.soundKey) !== 'false';
        }

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
        }

        playMessage() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(580, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
                
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.15);
            } catch (e) {
                // Silently ignore audio context restrictions
            }
        }

        playPop() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.08);

                gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.1);
            } catch (e) {}
        }

        toggle() {
            this.enabled = !this.enabled;
            localStorage.setItem(CONFIG.soundKey, this.enabled ? 'true' : 'false');
            return this.enabled;
        }
    }

    // ── Clase Principal de Tecno Bot ──
    class TecnoBot {
        constructor() {
            this.sound = new SoundFX();
            this.isOpen = false;
            this.messages = [];
            this.isTyping = false;
            this.interviewState = {
                active: false,
                clientType: null,
                clientTypeLabel: '',
                needKey: null,
                needLabel: '',
                serviceId: null,
                detailLabel: '',
                urgencyLabel: ''
            };

            this.dom = {};
            this.init();
        }

        init() {
            this.buildDOM();
            this.bindEvents();
            this.loadHistory();
            this.checkUrlParams();
        }

        // Construcción dinámica del HTML si no existe
        buildDOM() {
            let launcher = document.querySelector('.tecno-bot-launcher');
            let windowEl = document.querySelector('.tecno-bot-window');

            if (!launcher) {
                launcher = document.createElement('div');
                launcher.className = 'tecno-bot-launcher';
                launcher.id = 'tecno-bot-launcher';
                launcher.setAttribute('role', 'button');
                launcher.setAttribute('aria-label', 'Abrir asistente Tecno Bot');
                launcher.innerHTML = `
                    <div class="tecno-bot-teaser" id="tecno-bot-teaser">
                        <button class="tecno-bot-teaser-close" id="tecno-bot-teaser-close" title="Cerrar aviso">&times;</button>
                        <div class="tecno-bot-teaser-title">
                            <span class="material-symbols-outlined" style="font-size:16px;">smart_toy</span>
                            Tecno Bot Activo
                        </div>
                        <div class="tecno-bot-teaser-text">
                            ¿Dudas con algún servicio? Hacé un diagnóstico o consulta online aquí.
                        </div>
                    </div>
                    <button class="tecno-bot-btn" id="tecno-bot-btn">
                        <span class="tecno-bot-pulse"></span>
                        <span class="material-symbols-outlined tecno-bot-avatar-icon">smart_toy</span>
                        <span class="tecno-bot-status-dot"></span>
                    </button>
                `;
                document.body.appendChild(launcher);
            }

            if (!windowEl) {
                windowEl = document.createElement('div');
                windowEl.className = 'tecno-bot-window';
                windowEl.id = 'tecno-bot-window';
                windowEl.innerHTML = `
                    <div class="tecno-bot-header">
                        <div class="tecno-bot-header-info">
                            <div class="tecno-bot-header-avatar">
                                <span class="material-symbols-outlined">smart_toy</span>
                                <span class="pulse-mini"></span>
                            </div>
                            <div class="tecno-bot-header-titles">
                                <h3>Tecno Bot <span class="tecno-bot-header-badge">IA EXPERTA</span></h3>
                                <p><span class="material-symbols-outlined" style="font-size:12px;">bolt</span> En línea | Tecno Electrónica</p>
                            </div>
                        </div>
                        <div class="tecno-bot-header-actions">
                            <button class="tecno-bot-icon-btn" id="tecno-bot-sound-btn" title="Activar/Desactivar sonido">
                                <span class="material-symbols-outlined">${this.sound.enabled ? 'volume_up' : 'volume_off'}</span>
                            </button>
                            <button class="tecno-bot-icon-btn" id="tecno-bot-reset-btn" title="Reiniciar conversación">
                                <span class="material-symbols-outlined">restart_alt</span>
                            </button>
                            <button class="tecno-bot-icon-btn" id="tecno-bot-close-btn" title="Minimizar chat">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    <div class="tecno-bot-messages" id="tecno-bot-messages"></div>

                    <div class="tecno-bot-chips-wrapper" id="tecno-bot-chips-wrapper">
                        <div class="tecno-bot-chips-title">Opciones Rápidas:</div>
                        <div class="tecno-bot-chips" id="tecno-bot-chips"></div>
                    </div>

                    <form class="tecno-bot-input-form" id="tecno-bot-form">
                        <input type="text" class="tecno-bot-input" id="tecno-bot-input" placeholder="Escribí tu consulta o problema..." autocomplete="off">
                        <button type="submit" class="tecno-bot-send-btn" id="tecno-bot-send-btn" title="Enviar">
                            <span class="material-symbols-outlined" style="font-size:18px;">send</span>
                        </button>
                    </form>
                `;
                document.body.appendChild(windowEl);
            }

            this.dom = {
                launcher: launcher,
                btn: launcher.querySelector('#tecno-bot-btn') || launcher,
                teaser: launcher.querySelector('#tecno-bot-teaser'),
                teaserClose: launcher.querySelector('#tecno-bot-teaser-close'),
                window: windowEl,
                headerClose: windowEl.querySelector('#tecno-bot-close-btn'),
                resetBtn: windowEl.querySelector('#tecno-bot-reset-btn'),
                soundBtn: windowEl.querySelector('#tecno-bot-sound-btn'),
                messages: windowEl.querySelector('#tecno-bot-messages'),
                chipsWrapper: windowEl.querySelector('#tecno-bot-chips-wrapper'),
                chips: windowEl.querySelector('#tecno-bot-chips'),
                form: windowEl.querySelector('#tecno-bot-form'),
                input: windowEl.querySelector('#tecno-bot-input')
            };
        }

        // Asignación de Event Listeners
        bindEvents() {
            // Abrir / Cerrar Launcher
            if (this.dom.btn) {
                this.dom.btn.addEventListener('click', () => this.toggleWindow());
            }
            if (this.dom.teaser) {
                this.dom.teaser.addEventListener('click', (e) => {
                    if (e.target !== this.dom.teaserClose) {
                        this.openWindow();
                    }
                });
            }
            if (this.dom.teaserClose) {
                this.dom.teaserClose.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.dom.teaser.style.display = 'none';
                });
            }

            if (this.dom.headerClose) {
                this.dom.headerClose.addEventListener('click', () => this.closeWindow());
            }
            
            // Botón de Reinicio
            if (this.dom.resetBtn) {
                this.dom.resetBtn.addEventListener('click', () => {
                    this.resetConversation();
                });
            }

            // Botón de Sonido
            if (this.dom.soundBtn) {
                this.dom.soundBtn.addEventListener('click', () => {
                    const isEnabled = this.sound.toggle();
                    const iconEl = this.dom.soundBtn.querySelector('.material-symbols-outlined');
                    if (iconEl) {
                        iconEl.textContent = isEnabled ? 'volume_up' : 'volume_off';
                    }
                    this.dom.soundBtn.title = isEnabled ? 'Sonido activado' : 'Sonido desactivado';
                });
            }

            // Envío de Formulario
            if (this.dom.form) {
                this.dom.form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (!this.dom.input) return;
                    const text = this.dom.input.value.trim();
                    if (!text) return;
                    this.dom.input.value = '';
                    this.handleUserText(text);
                });
            }

            // Event Delegation para chips y botones interactivos
            if (this.dom.chips) {
                this.dom.chips.addEventListener('click', (e) => {
                    const chip = e.target.closest('.tecno-bot-chip');
                    if (!chip) return;
                    const action = chip.dataset.action;
                    const label = chip.textContent.trim();
                    this.sound.playPop();
                    this.handleChipClick(action, label);
                });
            }

            if (this.dom.messages) {
                this.dom.messages.addEventListener('click', (e) => {
                    const btn = e.target.closest('[data-bot-action]');
                    if (!btn) return;
                    const action = btn.dataset.botAction;
                    const param = btn.dataset.botParam;
                    this.sound.playPop();
                    this.handleMessageAction(action, param);
                });
            }

            // Tecla ESC para cerrar
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeWindow();
                }
            });

            // Enlaces externos con atributo [data-open-tecno-bot]
            document.querySelectorAll('[data-open-tecno-bot]').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    const action = el.dataset.openTecnoBot || 'welcome';
                    this.openWindow();
                    if (action === 'interview') {
                        this.startInterview();
                    } else if (SERVICES_KB[action]) {
                        this.showServiceInfo(action);
                    }
                });
            });
        }

        // Detección de parámetros URL (ej. ?bot=interview)
        checkUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('bot') === 'interview') {
                setTimeout(() => {
                    this.openWindow();
                    this.startInterview();
                }, 600);
            }
        }

        // Cargar o Inicializar Mensajes
        loadHistory() {
            try {
                const saved = sessionStorage.getItem(CONFIG.storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        this.messages = parsed;
                        this.renderAllMessages();
                        return;
                    }
                }
            } catch (e) {}

            this.sendWelcome();
        }

        saveHistory() {
            try {
                // Guardamos solo los últimos 30 mensajes para no saturar memoria
                const slice = this.messages.slice(-30);
                sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(slice));
            } catch (e) {}
        }

        openWindow() {
            this.isOpen = true;
            this.dom.window.classList.add('active');
            if (this.dom.teaser) {
                this.dom.teaser.style.display = 'none';
            }
            this.scrollToBottom();
            setTimeout(() => this.dom.input.focus(), 250);
        }

        closeWindow() {
            this.isOpen = false;
            this.dom.window.classList.remove('active');
        }

        toggleWindow() {
            if (this.isOpen) {
                this.closeWindow();
            } else {
                this.openWindow();
            }
        }

        resetConversation() {
            this.messages = [];
            this.interviewState = {
                active: false,
                clientType: null,
                clientTypeLabel: '',
                needKey: null,
                needLabel: '',
                serviceId: null,
                detailLabel: '',
                urgencyLabel: ''
            };
            sessionStorage.removeItem(CONFIG.storageKey);
            this.dom.messages.innerHTML = '';
            this.sendWelcome();
        }

        sendWelcome() {
            const welcomeText = `¡Hola! 👋 Soy **Tecno Bot**, el asistente virtual de **Tecno Electrónica**.\n\nEstoy aquí para responder consultas sobre nuestros servicios o realizar una **entrevista interactiva** para diagnosticar tu problema y brindarte la solución ideal.\n\n¿En qué te puedo ayudar hoy?`;
            
            this.addBotMessage(welcomeText);
            this.showMainQuickChips();
        }

        showMainQuickChips() {
            const chips = [
                { label: '🎯 Iniciar Diagnóstico / Entrevista', action: 'start_interview', featured: true },
                { label: '🔔 Timbre Escolar', action: 'info_timbre' },
                { label: '📹 Cámaras CCTV', action: 'info_cctv' },
                { label: '☀️ Paneles Solares', action: 'info_solar' },
                { label: '⚡ Instalaciones Eléctricas', action: 'info_electrica' },
                { label: '💻 Páginas Web', action: 'info_web' },
                { label: '⚙️ PLC & Arduino', action: 'info_plc' },
                { label: '💡 Cálculo Lumen', action: 'info_lumen' },
                { label: '📍 Ubicación y Cobertura', action: 'info_location' },
                { label: '💬 Hablar con Asesor Humano', action: 'contact_whatsapp' }
            ];
            this.renderChips(chips);
        }

        // Renderizado de Mensajes en la UI
        renderAllMessages() {
            this.dom.messages.innerHTML = '';
            this.messages.forEach(msg => this.renderMessageDOM(msg));
            this.showMainQuickChips();
            this.scrollToBottom();
        }

        renderMessageDOM(msg) {
            const row = document.createElement('div');
            row.className = `tecno-bot-msg-row ${msg.sender}`;

            const timeStr = msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (msg.sender === 'bot') {
                row.innerHTML = `
                    <div class="tecno-bot-msg-avatar">
                        <span class="material-symbols-outlined" style="font-size:16px;color:#18D4FF;">smart_toy</span>
                    </div>
                    <div class="tecno-bot-msg-bubble">
                        <div class="tecno-bot-msg-content">${this.formatMarkdown(msg.text)}</div>
                        ${msg.cardHtml ? `<div class="tecno-bot-card-container">${msg.cardHtml}</div>` : ''}
                        <div class="tecno-bot-msg-time">${timeStr}</div>
                    </div>
                `;
            } else {
                row.innerHTML = `
                    <div class="tecno-bot-msg-bubble">
                        <div class="tecno-bot-msg-content">${this.escapeHTML(msg.text)}</div>
                        <div class="tecno-bot-msg-time">${timeStr}</div>
                    </div>
                `;
            }

            this.dom.messages.appendChild(row);
        }

        addUserMessage(text) {
            const msg = {
                sender: 'user',
                text: text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            this.messages.push(msg);
            this.renderMessageDOM(msg);
            this.saveHistory();
            this.scrollToBottom();
        }

        addBotMessage(text, cardHtml = null, delay = 450) {
            this.showTyping();
            setTimeout(() => {
                this.hideTyping();
                const msg = {
                    sender: 'bot',
                    text: text,
                    cardHtml: cardHtml,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                this.messages.push(msg);
                this.renderMessageDOM(msg);
                this.sound.playMessage();
                this.saveHistory();
                this.scrollToBottom();
            }, delay);
        }

        showTyping() {
            if (this.isTyping) return;
            this.isTyping = true;
            const typingEl = document.createElement('div');
            typingEl.className = 'tecno-bot-msg-row bot tecno-bot-typing-row';
            typingEl.id = 'tecno-bot-typing-indicator';
            typingEl.innerHTML = `
                <div class="tecno-bot-msg-avatar">
                    <span class="material-symbols-outlined" style="font-size:16px;color:#18D4FF;">smart_toy</span>
                </div>
                <div class="tecno-bot-typing">
                    <div class="tecno-bot-typing-dot"></div>
                    <div class="tecno-bot-typing-dot"></div>
                    <div class="tecno-bot-typing-dot"></div>
                </div>
            `;
            this.dom.messages.appendChild(typingEl);
            this.scrollToBottom();
        }

        hideTyping() {
            this.isTyping = false;
            const indicator = document.getElementById('tecno-bot-typing-indicator');
            if (indicator) indicator.remove();
        }

        renderChips(chipsList) {
            this.dom.chips.innerHTML = '';
            if (!chipsList || chipsList.length === 0) {
                this.dom.chipsWrapper.style.display = 'none';
                return;
            }
            this.dom.chipsWrapper.style.display = 'block';
            chipsList.forEach(item => {
                const chipBtn = document.createElement('button');
                chipBtn.type = 'button';
                chipBtn.className = `tecno-bot-chip ${item.featured ? 'featured' : ''}`;
                chipBtn.dataset.action = item.action;
                chipBtn.innerHTML = item.label;
                this.dom.chips.appendChild(chipBtn);
            });
        }

        scrollToBottom() {
            setTimeout(() => {
                this.dom.messages.scrollTop = this.dom.messages.scrollHeight;
            }, 50);
        }

        // ── Manejo de Clics en Chips de Opciones ──
        handleChipClick(action, label) {
            this.addUserMessage(label);

            if (action === 'start_interview') {
                this.startInterview();
            } else if (action.startsWith('int_client_')) {
                const clientType = action.replace('int_client_', '');
                this.handleInterviewStep1(clientType, label);
            } else if (action.startsWith('int_need_')) {
                const need = action.replace('int_need_', '');
                this.handleInterviewStep2(need, label);
            } else if (action.startsWith('int_detail_')) {
                this.handleInterviewStep3(action, label);
            } else if (action.startsWith('int_urgency_')) {
                this.handleInterviewStep4(action, label);
            } else if (action.startsWith('info_')) {
                const serviceKey = action.replace('info_', '');
                this.showServiceInfo(serviceKey);
            } else if (action === 'contact_whatsapp') {
                this.openWhatsAppWithContext('Hola Tecno Electrónica, me gustaría hacer una consulta con un asesor.');
            } else {
                this.processNLP(label);
            }
        }

        // ── Flujo de la Entrevista y Diagnóstico ──
        startInterview() {
            this.interviewState = {
                active: true,
                clientType: null,
                clientTypeLabel: '',
                needKey: null,
                needLabel: '',
                serviceId: null,
                detailLabel: '',
                urgencyLabel: ''
            };

            this.addBotMessage(INTERVIEW_TREE.step1.question);
            this.renderChips(INTERVIEW_TREE.step1.chips);
        }

        handleInterviewStep1(clientType, label) {
            this.interviewState.clientType = clientType;
            this.interviewState.clientTypeLabel = label;

            const step2Config = INTERVIEW_TREE.step2[clientType];
            if (step2Config) {
                this.addBotMessage(step2Config.question);
                this.renderChips(step2Config.chips);
            } else {
                this.addBotMessage('¿En qué servicio puntual tenés mayor interés?', [
                    { label: 'Timbre Escolar', action: 'info_timbre' },
                    { label: 'CCTV / Cámaras', action: 'info_cctv' }
                ]);
            }
        }

        handleInterviewStep2(needKey, label) {
            this.interviewState.needKey = needKey;
            this.interviewState.needLabel = label;

            // Determinar servicio asociado
            let serviceId = 'timbre';
            if (needKey.includes('timbre')) serviceId = 'timbre';
            else if (needKey.includes('cctv')) serviceId = 'cctv';
            else if (needKey.includes('web')) serviceId = 'web';
            else if (needKey.includes('electrica')) serviceId = 'electrica';
            else if (needKey.includes('solar')) serviceId = 'solar';
            else if (needKey.includes('plc')) serviceId = 'plc';
            else if (needKey.includes('mkt')) serviceId = 'marketing';
            else if (needKey.includes('lumen')) serviceId = 'lumen';
            else if (needKey.includes('arduino')) serviceId = 'arduino';

            this.interviewState.serviceId = serviceId;

            const step3Key = serviceId === 'marketing' ? 'mkt' : serviceId;
            const step3Config = INTERVIEW_TREE.step3[step3Key];

            if (step3Config) {
                this.addBotMessage(step3Config.question);
                this.renderChips(step3Config.chips);
            } else {
                this.promptUrgencyStep();
            }
        }

        handleInterviewStep3(action, label) {
            this.interviewState.detailLabel = label;
            this.promptUrgencyStep();
        }

        promptUrgencyStep() {
            this.addBotMessage(INTERVIEW_TREE.step4.question);
            this.renderChips(INTERVIEW_TREE.step4.chips);
        }

        handleInterviewStep4(action, label) {
            this.interviewState.urgencyLabel = label;
            this.interviewState.active = false;

            // Generar informe y dictamen de diagnóstico
            this.generateDiagnosticReport();
        }

        generateDiagnosticReport() {
            const s = this.interviewState;
            const service = SERVICES_KB[s.serviceId] || SERVICES_KB.timbre;

            const reportCardHtml = `
                <div class="tecno-bot-card">
                    <div class="tecno-bot-card-header">
                        <span class="badge-tag">DIAGNÓSTICO FINAL</span>
                        <h4 class="tecno-bot-card-title">${service.title}</h4>
                    </div>
                    <div class="tecno-bot-card-body">
                        <div class="tecno-bot-card-item">
                            <span class="material-symbols-outlined icon">domain</span>
                            <div><strong>Tipo de Cliente:</strong> ${this.escapeHTML(s.clientTypeLabel || 'Institucional / Particular')}</div>
                        </div>
                        <div class="tecno-bot-card-item">
                            <span class="material-symbols-outlined icon">check_circle</span>
                            <div><strong>Necesidad Principal:</strong> ${this.escapeHTML(s.needLabel || service.title)}</div>
                        </div>
                        <div class="tecno-bot-card-item">
                            <span class="material-symbols-outlined icon">tune</span>
                            <div><strong>Especificación:</strong> ${this.escapeHTML(s.detailLabel || 'Dimensionamiento estándar')}</div>
                        </div>
                        <div class="tecno-bot-card-item">
                            <span class="material-symbols-outlined icon">schedule</span>
                            <div><strong>Plazo Estimado:</strong> ${service.estimatedTime}</div>
                        </div>
                        <div class="tecno-bot-card-item">
                            <span class="material-symbols-outlined icon">verified</span>
                            <div><strong>Garantía:</strong> Instalación profesional, capacitación y soporte post-instalación en toda la provincia de Córdoba.</div>
                        </div>
                    </div>
                    <div class="tecno-bot-card-actions">
                        <button class="tecno-bot-card-btn whatsapp" data-bot-action="send_diag_whatsapp">
                            <span class="material-symbols-outlined">send</span>
                            Enviar Diagnóstico por WhatsApp
                        </button>
                        <button class="tecno-bot-card-btn primary" data-bot-action="autofill_form">
                            <span class="material-symbols-outlined">edit_note</span>
                            Completar Formulario de Contacto
                        </button>
                        <a href="${this.resolvePath(service.link)}" class="tecno-bot-card-btn outline">
                            <span class="material-symbols-outlined">open_in_new</span>
                            Ver Ficha Técnica Completa
                        </a>
                    </div>
                </div>
            `;

            const conclusionText = `🎯 **¡Diagnóstico Completado con Éxito!**\n\nBasado en tus respuestas, la solución más eficiente para tu caso es nuestro servicio de **${service.title}**.\n\nA continuación te preparé tu resumen técnico para que puedas solicitar el presupuesto formal de inmediato:`;

            this.addBotMessage(conclusionText, reportCardHtml, 600);

            // Mostrar chips de seguimiento
            const followupChips = [
                { label: '📱 Enviar a WhatsApp', action: 'contact_whatsapp' },
                { label: '🔄 Iniciar Nuevo Diagnóstico', action: 'start_interview' },
                { label: '🔍 Consultar otro servicio', action: 'show_all_services' }
            ];
            this.renderChips(followupChips);
        }

        // Resolutor inteligente de rutas relativas
        resolvePath(relPath) {
            if (!relPath) return '#';
            if (/^(https?:|\/\/|#|mailto:|tel:)/i.test(relPath)) {
                return relPath;
            }
            const path = window.location.pathname.replace(/\\/g, '/');
            const isInSubdir = path.includes('/servicios/') || path.includes('/panel/');
            if (isInSubdir) {
                if (relPath.startsWith('servicios/')) {
                    return relPath.replace('servicios/', '');
                }
                return '../' + relPath;
            }
            return relPath;
        }

        // Acciones de los botones dentro de mensajes/tarjetas
        handleMessageAction(action, param) {
            if (action === 'send_diag_whatsapp') {
                this.sendDiagnosisToWhatsApp();
            } else if (action === 'autofill_form') {
                this.autofillContactForm();
            } else if (action === 'view_service') {
                if (SERVICES_KB[param]) {
                    window.location.href = this.resolvePath(SERVICES_KB[param].link);
                }
            } else if (action === 'open_panel') {
                window.location.href = this.resolvePath('panel/panel.html');
            }
        }

        sendDiagnosisToWhatsApp() {
            const s = this.interviewState;
            const serviceName = SERVICES_KB[s.serviceId] ? SERVICES_KB[s.serviceId].title : 'Soluciones Tecnológicas';
            
            const message = `*Hola Tecno Electrónica!* 🤖\nRealicé el diagnóstico en su web con *Tecno Bot*:\n\n` +
                `📋 *Perfil:* ${s.clientTypeLabel || 'Cliente Web'}\n` +
                `🎯 *Necesidad:* ${s.needLabel || 'Consulta técnica'}\n` +
                `🔍 *Detalle:* ${s.detailLabel || 'No especificado'}\n` +
                `⏱️ *Urgencia:* ${s.urgencyLabel || 'Estándar'}\n` +
                `💡 *Solución Recomendada:* ${serviceName}\n\n` +
                `¿Podrían brindarme una cotización formal y asesoramiento? Muchas gracias!`;

            this.openWhatsAppWithContext(message);
        }

        openWhatsAppWithContext(rawMessage) {
            const url = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(rawMessage)}`;
            window.open(url, '_blank');
        }

        autofillContactForm() {
            this.closeWindow();
            const s = this.interviewState;
            const serviceId = s.serviceId || 'otro';

            // Buscar elementos del formulario de contacto
            const selectService = document.getElementById('contact-service');
            const messageArea = document.getElementById('contact-message');
            const contactSection = document.getElementById('contacto');

            if (selectService) {
                // Mapear servicio
                const map = {
                    timbre: 'timbre',
                    cctv: 'cctv',
                    web: 'web',
                    electrica: 'electrica',
                    solar: 'solar',
                    plc: 'plc',
                    marketing: 'marketing',
                    lumen: 'lumen',
                    arduino: 'arduino'
                };
                if (map[serviceId]) {
                    selectService.value = map[serviceId];
                }
            }

            if (messageArea) {
                messageArea.value = `[Diagnóstico Tecno Bot]\nPerfil: ${s.clientTypeLabel || 'No especificado'}\nNecesidad: ${s.needLabel || 'General'}\nDetalle: ${s.detailLabel || '-'}\nUrgencia: ${s.urgencyLabel || '-'}\n\nHola, me gustaría recibir más detalles y cotización para este proyecto.`;
            }

            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                if (messageArea) messageArea.focus();
            }
        }

        // ── Respuestas Detalladas de Servicios ──
        showServiceInfo(key) {
            const kb = SERVICES_KB[key];
            if (!kb) {
                if (key === 'location') {
                    this.showLocationInfo();
                } else {
                    this.showAllServicesList();
                }
                return;
            }

            const featuresList = kb.features.map(f => `• ${f}`).join('\n');
            const text = `ℹ️ **${kb.title}**\n\n${kb.summary}\n\n**Características Principales:**\n${featuresList}\n\n⏱️ **Tiempo estimado:** ${kb.estimatedTime}\n💰 **Cotización:** ${kb.priceInfo}`;

            const cardHtml = `
                <div class="tecno-bot-card">
                    <div class="tecno-bot-card-actions">
                        <button class="tecno-bot-card-btn primary" data-bot-action="view_service" data-bot-param="${kb.id}">
                            <span class="material-symbols-outlined">article</span>
                            Ver Página del Servicio
                        </button>
                        <button class="tecno-bot-card-btn whatsapp" data-bot-action="send_diag_whatsapp">
                            <span class="material-symbols-outlined">chat</span>
                            Consultar por WhatsApp
                        </button>
                    </div>
                </div>
            `;

            this.addBotMessage(text, cardHtml);

            // Actualizar chips
            this.renderChips([
                { label: '🎯 Iniciar Diagnóstico de este Servicio', action: 'start_interview', featured: true },
                { label: '📋 Ver otros servicios', action: 'show_all_services' },
                { label: '💬 Contactar Asesor', action: 'contact_whatsapp' }
            ]);
        }

        showLocationInfo() {
            const text = `📍 **Nuestra Sede & Zona de Cobertura**\n\nEstamos ubicados en:\n**${CONFIG.location}**\n\n📌 **Zona de trabajo:** Realizamos instalaciones, montajes técnicos y asesoramiento en **Tanti, Villa Carlos Paz, Punilla y toda la Provincia de Córdoba**.\n\n⏰ **Horario de atención:** ${CONFIG.workHours}.\n📧 **Email:** ${CONFIG.email}\n📱 **WhatsApp:** +54 9 3541 26 7777`;
            this.addBotMessage(text);
            this.showMainQuickChips();
        }

        showAllServicesList() {
            const text = `🔧 **Servicios de Tecno Electrónica:**\n\n1. 🔔 **Timbre Automático Escolar** (con panel web WiFi y memoria ante cortes de luz)\n2. 📹 **CCTV & Cámaras de Seguridad** (monitoreo en celular HD/IP)\n3. 💻 **Creación de Páginas Web** (responsive, rápidas y SEO)\n4. ⚡ **Instalaciones Eléctricas** (tableros, normativas AEA, jabalina)\n5. ☀️ **Paneles Solares** (ahorro de hasta 90% en la factura eléctrica)\n6. ⚙️ **Programación PLC** (Siemens Logo!, S7-1200, control industrial)\n7. 📈 **Marketing Digital** (publicidad en Meta/Google, gestión de redes)\n8. 💡 **Cálculo de Luminarias** (Método Lumen y optimización LED)\n9. 🔬 **Prototipado con Arduino e IoT** (sensores y automatización a medida)\n\n¿Sobre cuál te gustaría saber más o preferís hacer una entrevista de diagnóstico?`;
            this.addBotMessage(text);
            this.showMainQuickChips();
        }

        // ── Procesamiento de Lenguaje Natural (NLP & Consultas Libres) ──
        handleUserText(text) {
            this.addUserMessage(text);
            this.processNLP(text);
        }

        processNLP(query) {
            const clean = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            // 1. Saludos
            if (/^(hola|buenas|buen dia|buenas tardes|buenas noches|que tal|hey|hello|hi)/i.test(clean)) {
                this.addBotMessage(`¡Hola! 😊 ¿Cómo estás? Soy **Tecno Bot**. ¿Querés que hagamos un diagnóstico rápido de tu proyecto o tenés alguna consulta específica sobre nuestros servicios?`);
                this.showMainQuickChips();
                return;
            }

            // 2. Iniciar entrevista / Diagnóstico
            if (/(diagnostico|entrevista|evalua|asesor|recomiend|que me recomiendas|ayudame a elegir|problema|necesidad)/i.test(clean)) {
                this.startInterview();
                return;
            }

            // 3. Timbre escolar / Corte de luz
            if (/(timbre|campana|horario escolar|recreo|escuela|colegio|alarma escolar|corte de luz|panel web)/i.test(clean)) {
                if (/(corte|luz|energia|apaga|guarda|memoria)/i.test(clean)) {
                    this.addBotMessage(`⚡ **¿Qué pasa si se corta la luz con el Timbre Automático?**\n\nEl sistema cuenta con **memoria no volátil**. Toda la programación, horarios y calendarios se mantienen intactos y al volver la electricidad el reloj sincroniza automáticamente sin necesidad de reconfigurar nada.`);
                } else if (/(panel|wifi|configur|celular)/i.test(clean)) {
                    this.addBotMessage(`📱 **Panel de Control del Timbre:**\n\nEl timbre incluye un panel web accesible conectándote a la red WiFi del colegio desde cualquier navegador (celular o PC). Podés modificar horarios, activar timbres manuales o definir feriados en un clic.\n\n👉 [Abrir Panel de Control Demo](panel/panel.html)`);
                } else {
                    this.showServiceInfo('timbre');
                }
                return;
            }

            // 4. Cámaras / CCTV
            if (/(camara|cctv|seguridad|vigilancia|dvr|nvr|graba|monitoreo|ver desde el celular|infrarrojo)/i.test(clean)) {
                this.showServiceInfo('cctv');
                return;
            }

            // 5. Páginas web
            if (/(pagina|web|sitio|tienda|ecommerce|landing|diseno web|dominio|hosting)/i.test(clean)) {
                this.showServiceInfo('web');
                return;
            }

            // 6. Instalaciones eléctricas / Tableros / Jabalina
            if (/(electrica|electricidad|tablero|termica|disyuntor|jabalina|fuga|trifasica|monofasica|aea|cableado|cortocircuito)/i.test(clean)) {
                this.showServiceInfo('electrica');
                return;
            }

            // 7. Paneles solares / Energía solar
            if (/(solar|paneles|fotovoltaic|inversor|bateria|ahorro luz|on grid|off grid|factura)/i.test(clean)) {
                this.showServiceInfo('solar');
                return;
            }

            // 8. PLC / Automatización
            if (/(plc|siemens|logo|s7|ladder|hmi|automatiz|variador|frecuencia|industrial|maquina)/i.test(clean)) {
                this.showServiceInfo('plc');
                return;
            }

            // 9. Marketing digital / Redes
            if (/(marketing|publicidad|redes|instagram|facebook|anuncios|meta|google ads|campana|ventas)/i.test(clean)) {
                this.showServiceInfo('marketing');
                return;
            }

            // 10. Método Lumen / Iluminación
            if (/(lumen|iluminacion|lux|luminaria|calculo lum|focos|lampara|dialux)/i.test(clean)) {
                this.showServiceInfo('lumen');
                return;
            }

            // 11. Arduino / Prototipos / IoT
            if (/(arduino|esp32|esp8266|sensor|iot|prototipo|microcontrolador|robotica|circuito)/i.test(clean)) {
                this.showServiceInfo('arduino');
                return;
            }

            // 12. Precios / Cuánto cuesta / Cotizaciones
            if (/(precio|costo|cuanto sale|cuanto cuesta|valor|tarifa|presupuesto|cotiz)/i.test(clean)) {
                this.addBotMessage(`💰 **Cotizaciones y Presupuestos:**\n\nTodos nuestros presupuestos se adaptan milimétricamente al tamaño y requerimientos de cada cliente sin costos ocultos.\n\nPodés realizar la **entrevista de diagnóstico** aquí mismo o escribirnos directamente a WhatsApp para cotizar en menos de 48 hs.`);
                this.renderChips([
                    { label: '🎯 Iniciar Diagnóstico para Presupuesto', action: 'start_interview', featured: true },
                    { label: '💬 Pedir Cotización por WhatsApp', action: 'contact_whatsapp' }
                ]);
                return;
            }

            // 13. Ubicación / Dónde están / Cobertura
            if (/(donde|ubicacion|direccion|tanti|cordoba|carlos paz|punilla|mapa|donde queda|cobertura)/i.test(clean)) {
                this.showLocationInfo();
                return;
            }

            // 14. Contacto con humanos / WhatsApp
            if (/(humano|persona|asesor|whatsapp|telefono|llamar|contacto|correo|email)/i.test(clean)) {
                this.addBotMessage(`📲 Podés contactarte directamente con nuestro equipo técnico por WhatsApp al **+54 9 3541 26 7777** o por email a **${CONFIG.email}**.`);
                this.renderChips([
                    { label: '💬 Abrir WhatsApp ahora', action: 'contact_whatsapp', featured: true },
                    { label: '📋 Ver Formulario Web', action: 'autofill_form' }
                ]);
                return;
            }

            // 15. Agradecimientos
            if (/(gracias|muchas gracias|genial|excelente|joya|buenisimo|de diez)/i.test(clean)) {
                this.addBotMessage(`¡Un placer ayudarte! 🙌 Si necesitás algo más, estoy a tu disposición.`);
                this.showMainQuickChips();
                return;
            }

            // 16. Fallback inteligente
            this.addBotMessage(`Entendido. Para darte la respuesta más exacta sobre tu consulta (*"${this.escapeHTML(query)}"*) o tu proyecto, te sugiero iniciar el **Diagnóstico Guiado** o elegir uno de nuestros servicios a continuación:`);
            this.showMainQuickChips();
        }

        // Helpers de formato y seguridad
        escapeHTML(str) {
            if (!str) return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        formatMarkdown(text) {
            if (!text) return '';
            let html = this.escapeHTML(text);
            
            // Negrita: **texto**
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Cursiva: *texto*
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            // Links [texto](url)
            html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#18D4FF;text-decoration:underline;">$1</a>');
            
            // Saltos de línea
            html = html.replace(/\n/g, '<br>');

            return html;
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.TecnoBotInstance = new TecnoBot();
        });
    } else {
        window.TecnoBotInstance = new TecnoBot();
    }

})();
