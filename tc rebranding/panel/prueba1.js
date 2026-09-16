const scheduleCount = 5;
const dayNames = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' }
];

const defaultSchedules = Array.from({ length: scheduleCount }, (_, index) => ({
    id: index + 1,
    message: `Mensaje ${index + 1}`,
    day: dayNames[index % dayNames.length].value,
    time: `0${7 + index}:00`.slice(-5),
    active: index === 0
}));

let arduinoSchedules = [];

function buildScheduleRows() {
    const scheduleRows = document.getElementById('scheduleRows');
    scheduleRows.innerHTML = '';

    for (let i = 1; i <= scheduleCount; i += 1) {
        const row = document.createElement('div');
        row.className = 'schedule-row';
        row.innerHTML = `
            <input type="text" id="message_${i}" maxlength="32" placeholder="Mensaje ${i}" />
            <select id="day_${i}">${dayNames.map(day => `<option value="${day.value}">${day.label}</option>`).join('')}</select>
            <input type="time" id="time_${i}" step="60" />
            <input type="checkbox" id="active_${i}" />
        `;
        scheduleRows.appendChild(row);
    }
}

function loadSchedules() {
    const stored = localStorage.getItem('scheduleConfig');
    let schedules = defaultSchedules;

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length === scheduleCount) {
                schedules = parsed.map((item, index) => ({
                    id: index + 1,
                    message: typeof item.message === 'string' ? item.message : defaultSchedules[index].message,
                    day: Number.isInteger(item.day) ? item.day : defaultSchedules[index].day,
                    time: typeof item.time === 'string' ? item.time : defaultSchedules[index].time,
                    active: Boolean(item.active)
                }));
            }
        } catch (error) {
            console.warn('No se pudo cargar la configuración guardada:', error);
        }
    }

    schedules.forEach(item => {
        const messageInput = document.getElementById(`message_${item.id}`);
        const dayInput = document.getElementById(`day_${item.id}`);
        const timeInput = document.getElementById(`time_${item.id}`);
        const activeInput = document.getElementById(`active_${item.id}`);

        if (messageInput) messageInput.value = item.message;
        if (dayInput) dayInput.value = item.day;
        if (timeInput) timeInput.value = item.time;
        if (activeInput) activeInput.checked = item.active;
    });

    arduinoSchedules = schedules.map(item => ({
        id: item.id,
        dayIndex: Number(item.day),
        hour: Number(item.time.split(':')[0]),
        minute: Number(item.time.split(':')[1]),
        message: item.message,
        active: item.active
    }));

    displayScheduleVariables();
}

function saveSchedules() {
    const schedules = [];

    for (let i = 1; i <= scheduleCount; i += 1) {
        const messageInput = document.getElementById(`message_${i}`);
        const dayInput = document.getElementById(`day_${i}`);
        const timeInput = document.getElementById(`time_${i}`);
        const activeInput = document.getElementById(`active_${i}`);

        const timeValue = timeInput?.value || defaultSchedules[i - 1].time;
        const [hourText, minuteText] = timeValue.split(':');
        const hour = Number(hourText);
        const minute = Number(minuteText);

        if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            alert(`El horario de la alarma ${i} no es válido. Usa un formato de hora correcto.`);
            return;
        }

        schedules.push({
            id: i,
            message: messageInput?.value.trim() || defaultSchedules[i - 1].message,
            day: Number(dayInput?.value) || defaultSchedules[i - 1].day,
            time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
            active: Boolean(activeInput?.checked)
        });
    }

    localStorage.setItem('scheduleConfig', JSON.stringify(schedules));
    arduinoSchedules = schedules.map(item => ({
        id: item.id,
        dayIndex: item.day,
        hour: Number(item.time.split(':')[0]),
        minute: Number(item.time.split(':')[1]),
        message: item.message,
        active: item.active
    }));

    displayScheduleVariables();
    alert('Horarios guardados correctamente.');
}

function resetSchedules() {
    localStorage.removeItem('scheduleConfig');
    loadSchedules();
}

function displayScheduleVariables() {
    const output = document.getElementById('outputVariables');
    const scheduleLines = arduinoSchedules.map(item => {
        return `alarma${item.id}: día=${item.dayIndex}, hora=${item.hour}, minuto=${item.minute}, activa=${item.active ? 1 : 0}, texto="${item.message}"`;
    });

    output.textContent = `// Variables preparadas para Arduino\n` +
        `const int scheduleCount = ${scheduleCount};\n` +
        scheduleLines.map((line, index) => `const String alarma${index + 1} = "${line}";`).join('\n');
}

function init() {
    buildScheduleRows();
    document.getElementById('saveBtn').addEventListener('click', saveSchedules);
    document.getElementById('resetBtn').addEventListener('click', resetSchedules);
    loadSchedules();
}

window.addEventListener('DOMContentLoaded', init);

// Variables disponibles en este script para usar luego en cualquier integración con Arduino:
// arduinoSchedules es un array con { id, dayIndex, hour, minute, message, active }
// También puede serializarse a JSON o convertirse en datos numéricos para un if en Arduino.

