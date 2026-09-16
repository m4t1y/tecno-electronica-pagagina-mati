# Panel del timbre — contrato de configuración

La fase 1 guarda la configuración en el navegador bajo la clave
`tecno-electronica.bell-panel.v1`. `panel-state.js` es el único archivo que
lee o escribe esa configuración; el HTML sólo presenta los datos.

```json
{
  "version": 1,
  "durationSeconds": 5,
  "activeDates": ["2026-09-03"],
  "alarms": [
    {
      "id": "uuid-o-identificador-local",
      "time": "07:00",
      "label": "Entrada Principal",
      "enabled": true,
      "recurrence": "L-V"
    }
  ]
}
```

`activeDates` usa fechas ISO completas, nunca sólo el número del día. Así las
selecciones sobreviven el cambio de mes y no se mezclan, por ejemplo, el 3 de
septiembre con el 3 de octubre.

## Preparación para fase 2

La migración a Supabase debe conservar este formato y sustituir solamente
`loadState()` y `saveState()` por llamadas asíncronas. La configuración deberá
llevar además `organization_id`, `device_id`, `created_at` y `updated_at`.

Roles recomendados para una institución:

- `admin`: administra institución, usuarios, dispositivos y configuración.
- `operator`: opera la configuración de timbres asignados.
- `viewer`: consulta el estado y los horarios sin editarlos.

El plan comercial no debe ser un rol de usuario: debe pertenecer a la
institución y habilitar límites o funcionalidades. Esta separación evita que
la interfaz muestre permisos ficticios antes de que exista autenticación real.
