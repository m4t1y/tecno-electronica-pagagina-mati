(() => {
    'use strict';

    const STORAGE_KEY = 'tecno-electronica.bell-panel.v1';
    const ESP32_IP_KEY = 'tecno-electronica.esp32-ip';
    const MAX_DURATION = 60;
    const MAX_DRILL_DURATION = 600;
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const defaultAlarms = [
        { id: 'default-1', time: '07:00', label: 'Entrada Principal', enabled: true, recurrence: 'L-V', durationSeconds: 5 },
        { id: 'default-2', time: '12:30', label: 'Salida Turno Mañana', enabled: true, recurrence: 'L-V', durationSeconds: 5 },
        { id: 'default-3', time: '17:00', label: 'Salida Turno Tarde', enabled: true, recurrence: 'L-V', durationSeconds: 5 }
    ];

    function defaultState() {
        return {
            version: 1,
            durationSeconds: 5,
            activeDates: [],
            alarms: defaultAlarms.map(alarm => ({ ...alarm }))
        };
    }

    function isValidDate(value) {
        return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
    }

    function normalizeAlarm(alarm, index) {
        const fallback = defaultAlarms[index] || { id: newId(), time: '08:00', label: 'Nuevo horario', enabled: true, recurrence: 'L-V', durationSeconds: 5 };
        const rawDur = Number.parseInt(alarm?.durationSeconds, 10);
        const durationSeconds = Number.isInteger(rawDur) && rawDur >= 1 && rawDur <= MAX_DURATION ? rawDur : 5;
        return {
            id: typeof alarm?.id === 'string' ? alarm.id : fallback.id,
            time: /^([01]\d|2[0-3]):[0-5]\d$/.test(alarm?.time) ? alarm.time : fallback.time,
            label: typeof alarm?.label === 'string' ? alarm.label.slice(0, 80) : fallback.label,
            enabled: Boolean(alarm?.enabled),
            recurrence: typeof alarm?.recurrence === 'string' ? alarm.recurrence : 'L-V',
            durationSeconds
        };
    }

    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!saved || saved.version !== 1) return defaultState();
            return {
                version: 1,
                durationSeconds: Number.isInteger(saved.durationSeconds) ? Math.min(MAX_DURATION, Math.max(1, saved.durationSeconds)) : 5,
                activeDates: Array.isArray(saved.activeDates) ? [...new Set(saved.activeDates.filter(isValidDate))].sort() : [],
                alarms: Array.isArray(saved.alarms) ? saved.alarms.map(normalizeAlarm) : defaultState().alarms
            };
        } catch (error) {
            console.warn('No se pudo recuperar la configuración local del timbre.', error);
            return defaultState();
        }
    }

    let state = loadState();
    let calCurrentDate = new Date();
    calCurrentDate = new Date(calCurrentDate.getFullYear(), calCurrentDate.getMonth(), 1);

    // Estado del simulacro
    let drillInterval = null;
    let drillRemaining = 0;

    // Conexión ESP32
    function getEspIp() {
        return localStorage.getItem(ESP32_IP_KEY) || '192.168.4.1';
    }

    function setEspIp(ip) {
        localStorage.setItem(ESP32_IP_KEY, ip.trim());
    }

    function getEspUrl(path) {
        if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !window.location.protocol.startsWith('file')) {
            return path;
        }
        const ip = getEspIp();
        return `http://${ip}${path}`;
    }

    async function checkEspConnection() {
        const text = document.getElementById('esp-status-text');
        const dot = document.getElementById('esp-status-dot');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(getEspUrl('/data'), { method: 'GET', signal: controller.signal, mode: 'cors' });
            clearTimeout(timeoutId);
            if (res.ok) {
                if (dot) dot.className = 'w-2 h-2 rounded-full bg-secondary pulse-green';
                if (text) text.textContent = `ESP32 Conectado (${getEspIp()})`;
                return true;
            }
        } catch (e) {
            // ESP32 offline o modo navegador local
        }
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-yellow-400';
        if (text) text.textContent = `Modo Local / Simulación (${getEspIp()})`;
        return false;
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return true;
        } catch (error) {
            console.error('No se pudo guardar la configuración local.', error);
            showToast('No se pudo guardar en este navegador.', 'error');
            return false;
        }
    }

    function newId() {
        return globalThis.crypto?.randomUUID?.() || `alarm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function toDateKey(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast-notification');
        if (!toast) {
            console.log(`[Toast] ${message}`);
            return;
        }
        const text = document.getElementById('toast-text');
        const icon = document.getElementById('toast-icon');
        if (text) text.textContent = message;
        if (icon) {
            if (type === 'success') icon.textContent = 'check_circle';
            else if (type === 'error') icon.textContent = 'warning';
            else icon.textContent = 'info';
        }
        toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        toast.classList.add('opacity-100', 'translate-y-0');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
            toast.classList.remove('opacity-100', 'translate-y-0');
        }, 3500);
    }

    function renderDuration() {
        const value = document.getElementById('duration-val');
        if (value) value.textContent = String(state.durationSeconds);
    }

    function renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        const title = document.getElementById('cal-month-title');
        if (!grid || !title) return;

        const year = calCurrentDate.getFullYear();
        const month = calCurrentDate.getMonth();
        title.textContent = `${monthNames[month]} ${year}`;
        while (grid.children.length > 7) grid.removeChild(grid.lastChild);

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const previousMonthDays = new Date(year, month, 0).getDate();

        for (let offset = firstDayIndex - 1; offset >= 0; offset -= 1) {
            const padding = document.createElement('span');
            padding.className = 'aspect-square flex items-center justify-center rounded text-xs sm:text-sm text-on-surface-variant/40';
            padding.textContent = previousMonthDays - offset;
            grid.appendChild(padding);
        }

        for (let day = 1; day <= totalDays; day += 1) {
            const key = toDateKey(year, month, day);
            const selected = state.activeDates.includes(key);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'calendar-day aspect-square flex items-center justify-center rounded text-xs sm:text-sm border transition-all font-label-mono';
            button.textContent = String(day);
            button.setAttribute('aria-pressed', String(selected));
            button.setAttribute('aria-label', `${day} de ${monthNames[month]} de ${year}${selected ? ', activo' : ''}`);
            if (selected) {
                button.classList.add('bg-primary-container/20', 'border-primary-container', 'text-primary-container', 'font-bold');
                button.style.boxShadow = '0 0 10px rgba(24,212,255,0.25)';
            } else {
                button.classList.add('bg-surface-container', 'border-transparent', 'text-on-surface', 'hover:border-primary');
            }
            button.addEventListener('click', () => {
                state.activeDates = selected ? state.activeDates.filter(date => date !== key) : [...state.activeDates, key].sort();
                saveState();
                renderCalendar();
            });
            grid.appendChild(button);
        }

        const usedCells = firstDayIndex + totalDays;
        const remainingCells = (7 - (usedCells % 7)) % 7;
        for (let day = 1; day <= remainingCells; day += 1) {
            const padding = document.createElement('span');
            padding.className = 'aspect-square flex items-center justify-center rounded text-xs sm:text-sm text-on-surface-variant/40';
            padding.textContent = String(day);
            grid.appendChild(padding);
        }
    }

    function cardTemplate(alarm) {
        const card = document.createElement('article');
        card.className = `alarm-card bg-[#0B2538] rounded-xl border border-outline-variant/50 p-3 sm:p-4 flex flex-col gap-3 transition-all duration-200 relative overflow-hidden${alarm.enabled ? '' : ' opacity-50 grayscale-[50%]'}`;
        card.dataset.alarmId = alarm.id;
        card.innerHTML = `
            <div class="alarm-stripe absolute left-0 top-0 bottom-0 w-1.5 ${alarm.enabled ? 'bg-secondary' : 'bg-outline-variant'}"></div>
            
            <!-- Fila superior: Hora + Duración individual + Switch y Borrar -->
            <div class="flex flex-wrap items-center justify-between gap-2.5 pl-1.5">
                <div class="flex items-center gap-2 flex-wrap">
                    <input class="alarm-time bg-surface-container border border-outline-variant/40 text-xl sm:text-2xl font-timer-display text-primary rounded-lg px-2.5 py-1 focus:border-primary-container focus:ring-1 focus:ring-primary-container" type="time" aria-label="Hora del horario" required>
                    
                    <!-- Control de Duración Individual por Alarma -->
                    <div class="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg border border-outline-variant/40" title="Duración del timbre para este horario">
                        <span class="material-symbols-outlined text-xs sm:text-sm text-primary-container">timer</span>
                        <button type="button" class="btn-dec-alarm-dur w-6 h-6 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface flex items-center justify-center text-xs font-bold font-label-mono transition-colors" aria-label="Disminuir segundos">−</button>
                        <span class="alarm-dur-val text-xs sm:text-sm font-timer-display text-primary-container font-bold min-w-[28px] text-center" aria-live="polite">${alarm.durationSeconds}s</span>
                        <button type="button" class="btn-inc-alarm-dur w-6 h-6 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface flex items-center justify-center text-xs font-bold font-label-mono transition-colors" aria-label="Aumentar segundos">+</button>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <label class="relative inline-flex items-center cursor-pointer" title="Activar/Desactivar alarma">
                        <input class="sr-only peer alarm-toggle" type="checkbox" aria-label="Activar horario">
                        <div class="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary switch-active"></div>
                    </label>
                    <button class="btn-delete-alarm text-outline-variant hover:text-error transition-colors p-1.5 bg-surface-container rounded-lg border border-transparent hover:border-error/30 flex items-center justify-center" title="Eliminar horario" type="button">
                        <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </div>

            <!-- Fila inferior: Etiqueta y Badges -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-1.5">
                <input class="alarm-label bg-transparent border-b border-outline-variant/30 text-body-md text-on-surface focus:border-primary focus:ring-0 px-1 py-1 w-full" placeholder="Etiqueta del horario (ej. Entrada, Recreo)" type="text" maxlength="80" aria-label="Etiqueta del horario">
                <div class="flex gap-1.5 shrink-0">
                    <span class="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant/30 font-label-mono">${alarm.recurrence}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/30 font-label-mono">Relé 1</span>
                </div>
            </div>`;

        card.querySelector('.alarm-time').value = alarm.time;
        card.querySelector('.alarm-label').value = alarm.label;
        card.querySelector('.alarm-toggle').checked = alarm.enabled;
        bindAlarmCard(card);
        return card;
    }

    function updateAlarm(id, patch) {
        state.alarms = state.alarms.map(alarm => alarm.id === id ? { ...alarm, ...patch } : alarm);
        saveState();
    }

    function bindAlarmCard(card) {
        const id = card.dataset.alarmId;
        const time = card.querySelector('.alarm-time');
        const label = card.querySelector('.alarm-label');
        const toggle = card.querySelector('.alarm-toggle');
        const durVal = card.querySelector('.alarm-dur-val');
        const btnDecDur = card.querySelector('.btn-dec-alarm-dur');
        const btnIncDur = card.querySelector('.btn-inc-alarm-dur');

        time.addEventListener('change', () => {
            if (time.validity.valid && time.value) updateAlarm(id, { time: time.value });
        });
        label.addEventListener('change', () => {
            updateAlarm(id, { label: label.value.trim() || 'Horario sin etiqueta' });
        });
        toggle.addEventListener('change', () => {
            updateAlarm(id, { enabled: toggle.checked });
            card.classList.toggle('opacity-50', !toggle.checked);
            card.classList.toggle('grayscale-[50%]', !toggle.checked);
            card.querySelector('.alarm-stripe').className = `alarm-stripe absolute left-0 top-0 bottom-0 w-1.5 ${toggle.checked ? 'bg-secondary' : 'bg-outline-variant'}`;
        });

        btnDecDur?.addEventListener('click', () => {
            const currentAlarm = state.alarms.find(a => a.id === id);
            if (!currentAlarm) return;
            const newDur = Math.max(1, (currentAlarm.durationSeconds || 5) - 1);
            updateAlarm(id, { durationSeconds: newDur });
            if (durVal) durVal.textContent = `${newDur}s`;
        });

        btnIncDur?.addEventListener('click', () => {
            const currentAlarm = state.alarms.find(a => a.id === id);
            if (!currentAlarm) return;
            const newDur = Math.min(MAX_DURATION, (currentAlarm.durationSeconds || 5) + 1);
            updateAlarm(id, { durationSeconds: newDur });
            if (durVal) durVal.textContent = `${newDur}s`;
        });

        card.querySelector('.btn-delete-alarm').addEventListener('click', () => {
            state.alarms = state.alarms.filter(alarm => alarm.id !== id);
            saveState();
            renderAlarms();
            showToast('Horario eliminado.', 'info');
        });
    }

    function renderAlarms() {
        const container = document.getElementById('alarms-container');
        const badge = document.getElementById('alarm-total-badge');
        if (!container || !badge) return;
        container.replaceChildren(...state.alarms.map(cardTemplate));
        badge.textContent = `Total: ${state.alarms.length}`;
    }

    function startDrillSiren(seconds) {
        const sec = Math.max(1, Math.min(MAX_DRILL_DURATION, parseInt(seconds, 10) || 30));
        drillRemaining = sec;

        const btnStart = document.getElementById('btn-start-drill');
        const btnStop = document.getElementById('btn-stop-drill');
        const countdownBox = document.getElementById('drill-countdown-box');

        if (btnStart) {
            btnStart.disabled = true;
            btnStart.classList.add('opacity-50', 'cursor-not-allowed');
        }
        if (btnStop) {
            btnStop.classList.remove('hidden');
            btnStop.classList.add('flex');
        }
        if (countdownBox) countdownBox.classList.remove('hidden');

        fetch(getEspUrl(`/simulacro?sec=${sec}`), { mode: 'cors' })
            .then(res => res.text())
            .then(text => console.log('ESP32 Simulacro:', text))
            .catch(() => console.log('Simulacro ejecutado en modo local (sin ESP32).'));

        showToast(`🚨 Sirena de simulacro activada por ${sec}s`, 'error');

        clearInterval(drillInterval);
        const total = sec;
        updateDrillUi(drillRemaining, total);

        drillInterval = setInterval(() => {
            drillRemaining -= 1;
            if (drillRemaining <= 0) {
                stopDrillSiren(false);
            } else {
                updateDrillUi(drillRemaining, total);
            }
        }, 1000);
    }

    function updateDrillUi(remaining, total) {
        const countdownSec = document.getElementById('drill-countdown-sec');
        const progressBar = document.getElementById('drill-progress-bar');
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        if (countdownSec) {
            countdownSec.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        if (progressBar) {
            const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
            progressBar.style.width = `${pct}%`;
        }
    }

    function stopDrillSiren(abortedByUser = true) {
        clearInterval(drillInterval);
        drillInterval = null;
        drillRemaining = 0;

        const btnStart = document.getElementById('btn-start-drill');
        const btnStop = document.getElementById('btn-stop-drill');
        const countdownBox = document.getElementById('drill-countdown-box');
        const progressBar = document.getElementById('drill-progress-bar');

        if (btnStart) {
            btnStart.disabled = false;
            btnStart.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        if (btnStop) {
            btnStop.classList.add('hidden');
            btnStop.classList.remove('flex');
        }
        if (countdownBox) countdownBox.classList.add('hidden');
        if (progressBar) progressBar.style.width = '100%';

        if (abortedByUser) {
            fetch(getEspUrl('/stopsirena'), { mode: 'cors' })
                .then(r => r.text())
                .then(t => console.log('ESP32 Detenido:', t))
                .catch(() => {});
            showToast('🛑 Sirena de simulacro detenida de inmediato.', 'info');
        } else {
            showToast('✓ Simulacro finalizado.', 'success');
        }
    }

    function testBell(seconds) {
        const btn = document.getElementById('btn-test-bell');
        if (!btn) return;
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-lg">autorenew</span> Sonando timbre...';
        btn.classList.add('ring-2', 'ring-primary-container');

        fetch(getEspUrl(`/testrelay?sec=${seconds}`), { mode: 'cors' })
            .then(r => r.text())
            .then(t => console.log('ESP32 Test:', t))
            .catch(() => console.log('Prueba de timbre en simulación local'));

        showToast(`⚡ Probando timbre (${seconds}s)...`, 'info');

        setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
            btn.classList.remove('ring-2', 'ring-primary-container');
        }, seconds * 1000);
    }

    async function syncSystem(button) {
        if (!saveState()) return;

        const original = button ? button.innerHTML : '';
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="material-symbols-outlined animate-spin text-lg">sync</span> Guardando...';
        }

        const payloadSchedules = state.alarms.map(alarm => {
            const [hStr, mStr] = alarm.time.split(':');
            const onH = parseInt(hStr, 10) || 0;
            const onM = parseInt(mStr, 10) || 0;
            const onS = 0;
            const dur = alarm.durationSeconds || state.durationSeconds || 5;

            const totalOnSeconds = onH * 3600 + onM * 60 + onS;
            const totalOffSeconds = totalOnSeconds + dur;
            const offH = Math.floor(totalOffSeconds / 3600) % 24;
            const offM = Math.floor((totalOffSeconds % 3600) / 60);
            const offS = totalOffSeconds % 60;

            return {
                en: alarm.enabled ? 1 : 0,
                onH, onM, onS,
                offH, offM, offS
            };
        });

        let syncedWithEsp = false;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);
            const res = await fetch(getEspUrl('/save'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schedules: payloadSchedules }),
                signal: controller.signal,
                mode: 'cors'
            });
            clearTimeout(timeoutId);
            if (res.ok) syncedWithEsp = true;
        } catch (e) {
            syncedWithEsp = false;
        }

        if (button) {
            button.disabled = false;
            button.innerHTML = '<span class="material-symbols-outlined text-lg">check_circle</span> ¡Guardado con Éxito!';
            button.classList.add('bg-secondary', 'text-on-secondary');
            setTimeout(() => {
                button.innerHTML = original;
                button.classList.remove('bg-secondary', 'text-on-secondary');
            }, 2200);
        }

        if (syncedWithEsp) {
            showToast('✓ Configuración guardada en navegador y sincronizada en ESP32.', 'success');
        } else {
            showToast('✓ Guardado en este navegador. (ESP32 no detectado o fuera de red).', 'info');
        }
        checkEspConnection();
    }

    function setupEvents() {
        document.getElementById('btn-dec-duration')?.addEventListener('click', () => {
            state.durationSeconds = Math.max(1, state.durationSeconds - 1);
            saveState();
            renderDuration();
        });
        document.getElementById('btn-inc-duration')?.addEventListener('click', () => {
            state.durationSeconds = Math.min(MAX_DURATION, state.durationSeconds + 1);
            saveState();
            renderDuration();
        });

        document.getElementById('btn-test-bell')?.addEventListener('click', () => {
            testBell(state.durationSeconds);
        });

        document.getElementById('cal-prev')?.addEventListener('click', () => {
            calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
            renderCalendar();
        });
        document.getElementById('cal-next')?.addEventListener('click', () => {
            calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
            renderCalendar();
        });
        document.getElementById('btn-workdays')?.addEventListener('click', () => {
            const year = calCurrentDate.getFullYear();
            const month = calCurrentDate.getMonth();
            const thisMonth = new Set();
            for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day += 1) {
                const weekday = new Date(year, month, day).getDay();
                if (weekday >= 1 && weekday <= 5) thisMonth.add(toDateKey(year, month, day));
            }
            state.activeDates = [...state.activeDates.filter(date => !date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}-`)), ...thisMonth].sort();
            saveState();
            renderCalendar();
        });
        document.getElementById('btn-clear-cal')?.addEventListener('click', () => {
            const prefix = `${calCurrentDate.getFullYear()}-${String(calCurrentDate.getMonth() + 1).padStart(2, '0')}-`;
            state.activeDates = state.activeDates.filter(date => !date.startsWith(prefix));
            saveState();
            renderCalendar();
        });

        document.getElementById('btn-add-alarm')?.addEventListener('click', () => {
            const alarm = {
                id: newId(),
                time: '08:00',
                label: 'Nuevo horario',
                enabled: true,
                recurrence: 'L-V',
                durationSeconds: state.durationSeconds || 5
            };
            state.alarms.push(alarm);
            saveState();
            renderAlarms();
            document.querySelector(`[data-alarm-id="${alarm.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        [document.getElementById('btn-sync-system'), document.getElementById('btn-sync-mobile')].forEach(button => {
            button?.addEventListener('click', () => syncSystem(button));
        });

        const drillInput = document.getElementById('drill-duration-input');
        document.querySelectorAll('.btn-drill-preset').forEach(presetBtn => {
            presetBtn.addEventListener('click', () => {
                const sec = presetBtn.dataset.seconds;
                if (drillInput && sec) drillInput.value = sec;
            });
        });
        document.getElementById('btn-start-drill')?.addEventListener('click', () => {
            const val = drillInput ? parseInt(drillInput.value, 10) : 30;
            startDrillSiren(val || 30);
        });
        document.getElementById('btn-stop-drill')?.addEventListener('click', () => {
            stopDrillSiren(true);
        });

        const ipInput = document.getElementById('esp-ip-input');
        const ipSaveBtn = document.getElementById('btn-save-esp-ip');
        const ipToggleBtn = document.getElementById('btn-toggle-esp-config');
        const ipModal = document.getElementById('esp-config-box');

        if (ipInput) ipInput.value = getEspIp();
        ipToggleBtn?.addEventListener('click', () => {
            if (ipModal) ipModal.classList.toggle('hidden');
        });
        ipSaveBtn?.addEventListener('click', () => {
            if (ipInput && ipInput.value) {
                setEspIp(ipInput.value.trim());
                showToast(`IP de ESP32 actualizada a ${ipInput.value.trim()}`, 'success');
                if (ipModal) ipModal.classList.add('hidden');
                checkEspConnection();
            }
        });
    }

    function updateClock() {
        const clock = document.getElementById('header-clock');
        if (clock) clock.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
    }

    setupEvents();
    renderDuration();
    renderCalendar();
    renderAlarms();
    updateClock();
    window.setInterval(updateClock, 1000);
    checkEspConnection();
})();
