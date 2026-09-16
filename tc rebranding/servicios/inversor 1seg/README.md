# Conmutación de Transistores BC547C con Arduino

Este proyecto proporciona el código completo de Arduino, el esquema eléctrico detallado, la vista de armado física estilo **Tinkercad**, la justificación matemática de componentes y la guía de montaje paso a paso para conmutar dos transistores NPN **BC547C** alternadamente cada 1 segundo ($1000\text{ ms}$) y encender dos LEDs de forma intercalada.

---

## 1. Lista de Materiales y Componentes

| Componente | Cantidad | Especificaciones / Valor | Notas / Código de Colores |
| :--- | :---: | :--- | :--- |
| **Placa Arduino** | 1 | Uno, Nano, Mega o Leonardo | Microcontrolador principal (5V) |
| **Transistor BC547C** | 2 | NPN (Encapsulado TO-92) | Transistor conmutable de alta ganancia ($h_{FE} > 400$) |
| **Resistencia de Base ($R_B$)** | 2 | $1\text{ k}\Omega$ ($\frac{1}{4}\text{W}$) | Marrón - Negro - Rojo - Dorado |
| **Resistencia para LED ($R_{LED}$)** | 2 | $220\text{ }\Omega$ ($\frac{1}{4}\text{W}$) | Rojo - Rojo - Marrón - Dorado |
| **LED 1** | 1 | $5\text{ mm}$ Rojo | Cátodo al colector de Q1 |
| **LED 2** | 1 | $5\text{ mm}$ Verde | Cátodo al colector de Q2 |
| **Protoboard y Cables** | 1 set | Cables Jumper Macho-Macho | Para interconexiones |

---

## 2. Descripción del Transistor BC547C y Pinout

El **BC547C** es un transistor bipolar NPN de propósito general con encapsulado TO-92. En este proyecto se utiliza como un **interruptor electrónico (conmutador)** operando en dos regiones principales:

- **Corte ($V_{BE} < 0.7\text{V}$):** La corriente de base es cero ($I_B = 0$). El transistor no conduce ($I_C = 0$) y actúa como un interruptor abierto. El LED permanece **APAGADO**.
- **Saturación ($V_{BE} \approx 0.7\text{V}$):** La señal de 5V del Arduino inyecta corriente a la base. El transistor se satura ($V_{CE(\text{sat})} \approx 0.2\text{V}$) actuando como un interruptor cerrado. El LED permanece **ENCENDIDO**.

### Pinout del BC547C (Encapsulado TO-92)
Mirando el transistor de frente (con la **cara plana** hacia ti y los pines hacia abajo):

```
       _____
      /     \
     |  BC  |   <- Cara plana con texto impreso
     | 547C |
     |______|
      |  |  |
      1  2  3
      |  |  |
      C  B  E
```

1. **Pin 1 (Izquierda):** **Colector (C)** -> Conectado al Cátodo (-) del LED.
2. **Pin 2 (Centro):** **Base (B)** -> Conectado a la Resistencia de $1\text{ k}\Omega$ desde el Arduino.
3. **Pin 3 (Derecha):** **Emisor (E)** -> Conectado directamente a **GND**.

---

## 3. Cálculos Electrónicos y Justificación

### A. Cálculo de la Resistencia de Limitación del LED ($R_{LED}$)
Para alimentar un LED de $5\text{mm}$ conectado a $V_{CC} = 5\text{V}$ a través del transistor saturado:

$$\text{Fórmula: } R_{LED} = \frac{V_{CC} - V_F - V_{CE(\text{sat})}}{I_C}$$

Donde:
- $V_{CC} = 5.0\text{ V}$ (Tensión de alimentación del Arduino)
- $V_F \approx 2.0\text{ V}$ (Tensión de umbral típica para un LED Rojo/Verde)
- $V_{CE(\text{sat})} \approx 0.2\text{ V}$ (Caída de tensión Colector-Emisor en saturación)
- $I_C \approx 12\text{ mA} = 0.012\text{ A}$ (Corriente deseada para brillo adecuado)

$$R_{LED} = \frac{5.0\text{V} - 2.0\text{V} - 0.2\text{V}}{0.012\text{A}} = \frac{2.8\text{V}}{0.012\text{A}} \approx 233.3\text{ }\Omega$$

> **Valor Estándar Seleccionado:** **$220\text{ }\Omega$** (o $330\text{ }\Omega$), lo cual genera una corriente segura de $I_C \approx 12.7\text{ mA}$.

---

### B. Cálculo de la Resistencia de Base ($R_B$) para Saturación Garantizada
Para asegurar que el transistor BC547C funcione en **saturación profunda**:

$$R_B = \frac{V_{\text{Arduino}} - V_{BE(\text{sat})}}{I_{B(\text{saturación})}} = \frac{5.0\text{V} - 0.7\text{V}}{0.0043\text{A}} \approx 1000\text{ }\Omega \quad (1\text{ k}\Omega)$$

> **Valor Seleccionado:** **$1\text{ k}\Omega$** (garantiza una corriente de base $I_B \approx 4.3\text{ mA}$, asegurando saturación rápida y total sin sobrecargar la salida digital del Arduino cuyo límite es $20\text{ mA}$).

---

## 4. Guía de Conexión en Protoboard Estilo Tinkercad

Visualiza la disposición de pines y cables estilo Tinkercad en el archivo gráfico: `tinkercad_view.svg`

### Tabla Exacta de Conexiones por Agujero en Protoboard

| Componente / Cable | Origen | Destino en Protoboard | Notas |
| :--- | :--- | :--- | :--- |
| **Cable Rojo (5V)** | Pin `5V` Arduino | Riel Positivo `(+)` superior | Alimentación de LEDs |
| **Cable Negro (GND)** | Pin `GND` Arduino | Riel Negativo `(-)` inferior | Masa común |
| **Cable Azul (D2)** | Pin `D2` Arduino | Extremo Resistencia $RB1$ | Señal control Q1 |
| **Cable Púrpura (D3)** | Pin `D3` Arduino | Extremo Resistencia $RB2$ | Señal control Q2 |
| **Transistor Q1 (BC547C)** | Encapsulado TO-92 | Columna 8 (C), 9 (B), 10 (E) | Cara plana mirando al usuario |
| **Transistor Q2 (BC547C)** | Encapsulado TO-92 | Columna 22 (C), 23 (B), 24 (E)| Cara plana mirando al usuario |
| **Resistencia RB1 ($1\text{k}\Omega$)** | Columna 9 (Base Q1) | Fila libre conectada al Cable Azul | Base Q1 |
| **Resistencia RB2 ($1\text{k}\Omega$)** | Columna 23 (Base Q2) | Fila libre conectada al Cable Púrpura | Base Q2 |
| **Resistencia R1 ($220\Omega$)** | Riel Positivo `(+)` | Columna 7 (Ánodo LED 1) | Limitadora LED 1 |
| **Resistencia R2 ($220\Omega$)** | Riel Positivo `(+)` | Columna 21 (Ánodo LED 2) | Limitadora LED 2 |
| **LED 1 (Rojo)** | Columna 7 (Ánodo +) | Columna 8 (Cátodo - Colector Q1) | Pata larga en 7, corta en 8 |
| **LED 2 (Verde)** | Columna 21 (Ánodo +) | Columna 22 (Cátodo - Colector Q2) | Pata larga en 21, corta en 22 |
| **Puente GND Q1** | Columna 10 (Emisor Q1) | Riel Negativo `(-)` inferior | Conexión Emisor a Masa |
| **Puente GND Q2** | Columna 24 (Emisor Q2) | Riel Negativo `(-)` inferior | Conexión Emisor a Masa |

---

## 5. Explicación del Código Arduino

El código principal utiliza el temporizador interno `millis()` para lograr la conmutación **sin bloquear el procesador** (código multitarea no bloqueante).

- **Intervalo:** Se configura a $1000\text{ ms}$ (1 segundo).
- **Proceso de Conmutación:**
  - Iteración 1: Pin D2 = HIGH, Pin D3 = LOW. Transistor Q1 conduce $\rightarrow$ **LED 1 ENCENDIDO** / LED 2 APAGADO.
  - Al cumplirse 1 segundo: Pin D2 = LOW, Pin D3 = HIGH. Transistor Q2 conduce $\rightarrow$ LED 1 APAGADO / **LED 2 ENCENDIDO**.

---

## 6. Simulación en Wokwi y Visualización Web

1. **Simulador Web Interactivo Incluido:** Abre `index.html` en tu navegador para ver la simulación en tiempo real, osciloscopio y alternar entre el esquema simbólico y la vista Tinkercad.
2. **Simulador Online Wokwi:** Importa el código `arduino_bc547_toggle.ino` y el archivo `diagram.json` en [wokwi.com](https://wokwi.com).
