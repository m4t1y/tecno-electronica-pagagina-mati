/*
  =============================================================================
  PROYECTO: Conmutación Alternada de Dos Transistores BC547C con Arduino
  DESCRIPCIÓN: Este programa conmuta (alterna) el estado de dos transistores NPN 
               BC547C cada 1 segundo (1000 ms) para encender y apagar dos LEDs 
               de forma intercalada (L1 Encendido / L2 Apagado -> L1 Apagado / L2 Encendido).
  
  HARDWARE:
  - Arduino Uno / Nano / Mega / Leonardo
  - 2 Transistores NPN BC547C (Encapsulado TO-92)
  - 2 Resistencias de Base: 1 kΩ (marrón-negro-rojo-dorado) o 2.2 kΩ
  - 2 Resistencias para LED: 220 Ω (rojo-rojo-marrón-dorado) o 330 Ω
  - 2 LEDs (Ejemplo: Rojo y Verde)
  - Protoboard y Cables Jumper
  
  CONEXIONES:
  - Pin Digital 2 (Arduino) -> Resistencia 1kΩ -> Base (Pin 2) del Transistor Q1
  - Pin Digital 3 (Arduino) -> Resistencia 1kΩ -> Base (Pin 2) del Transistor Q2
  - Emisores (Pin 3 de Q1 y Q2) -> GND de Arduino (Masa común)
  - Ánodo (+) de LED1 -> Resistencia 220Ω -> +5V de Arduino
  - Cátodo (-) de LED1 -> Colector (Pin 1) de Q1
  - Ánodo (+) de LED2 -> Resistencia 220Ω -> +5V de Arduino
  - Cátodo (-) de LED2 -> Colector (Pin 1) de Q2
  =============================================================================
*/

// Definición de pines para controlar las bases de los transistores
const int PIN_TRANSISTOR_1 = 2; // Pin digital conectado a la Base de Q1 (BC547C)
const int PIN_TRANSISTOR_2 = 3; // Pin digital conectado a la Base de Q2 (BC547C)

// Tiempo de conmutación en milisegundos (1 segundo = 1000 ms)
const unsigned long INTERVALO_CONMUTACION = 20;

// Variables de estado
unsigned long tiempoAnterior = 0; // Almacena la última vez que se conmutó
bool estadoTransistor1 = true;    // Inicia Q1 activo (HIGH) y Q2 inactivo (LOW)

void setup() {
  // Configurar los pines de control como Salidas Digitales
  pinMode(PIN_TRANSISTOR_1, OUTPUT);
  pinMode(PIN_TRANSISTOR_2, OUTPUT);

  // Inicializar comunicación serial para monitoreo en la computadora (opcional)
  Serial.begin(9600);
  Serial.println(F("=================================================="));
  Serial.println(F("Sistema de Conmutación Transistores BC547C Iniciado"));
  Serial.println(F("Intervalo de conmutacion: 1000 ms (1 segundo)"));
  Serial.println(F("=================================================="));

  // Aplicar estado inicial: Q1 ON, Q2 OFF
  actualizarEstadoTransistores();
}

void loop() {
  // Obtener el tiempo transcurrido desde el encendido del Arduino
  unsigned long tiempoActual = millis();

  // Verificar si ha transcurrido 1 segundo (1000 ms) desde la última conmutación
  if (tiempoActual - tiempoAnterior >= INTERVALO_CONMUTACION) {
    // Actualizar la marca de tiempo
    tiempoAnterior = tiempoActual;

    // Invertir el estado (Toggle): Si era true pasa a false, y viceversa
    estadoTransistor1 = !estadoTransistor1;

    // Aplicar los nuevos estados a las salidas digitales
    actualizarEstadoTransistores();
  }

  // NOTA: Al usar millis(), el loop queda libre para ejecutar otras tareas 
  // sin bloquear el procesador como ocurriría con delay().
}

/**
 * Función auxiliar para enviar las señales digitales a las bases de los transistores
 * y mostrar el estado en el Monitor Serie.
 */
void actualizarEstadoTransistores() {
  if (estadoTransistor1) {
    // Q1 conduce (Saturación) -> LED1 ENCIENDE
    // Q2 cortado (Corte)       -> LED2 APAGA
    digitalWrite(PIN_TRANSISTOR_1, HIGH);
    digitalWrite(PIN_TRANSISTOR_2, LOW);
    
    Serial.println(F("[ESTADO] Transistor Q1: ACTIVADO (HIGH) | Transistor Q2: DESACTIVADO (LOW) -> LED 1 ENCENDIDO"));
  } else {
    // Q1 cortado (Corte)       -> LED1 APAGA
    // Q2 conduce (Saturación) -> LED2 ENCIENDE
    digitalWrite(PIN_TRANSISTOR_1, LOW);
    digitalWrite(PIN_TRANSISTOR_2, HIGH);
    
    Serial.println(F("[ESTADO] Transistor Q1: DESACTIVADO (LOW) | Transistor Q2: ACTIVADO (HIGH) -> LED 2 ENCENDIDO"));
  }
}

/* 
  =============================================================================
  CÓDIGO ALTERNATIVO CON delay() (VERSIÓN BÁSICA):
  Si prefieres la versión tradicional simplificada con delay(), puedes usar esta:

  void setup() {
    pinMode(2, OUTPUT);
    pinMode(3, OUTPUT);
  }

  void loop() {
    digitalWrite(2, HIGH); // Transistor Q1 conduce (LED1 encendido)
    digitalWrite(3, LOW);  // Transistor Q2 cortado  (LED2 apagado)
    delay(1000);           // Espera 1 segundo

    digitalWrite(2, LOW);  // Transistor Q1 cortado  (LED1 apagado)
    digitalWrite(3, HIGH); // Transistor Q2 conduce (LED2 encendido)
    delay(1000);           // Espera 1 segundo
  }
  =============================================================================
*/
