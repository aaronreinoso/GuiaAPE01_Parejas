# Esqueleto Angular 21 — "Mis Tareas"

Proyecto base para ejemplificar la arquitectura cliente-servidor, la separación
frontend/backend y el consumo de una API REST, usando **Angular 21**
(standalone components, signals, nueva sintaxis de control de flujo y
zoneless change detection).

No es una aplicación completa: es un **punto de partida funcional** —lista,
crea, edita y elimina tareas contra una API REST real (`json-server`)— sobre
el que los estudiantes pueden seguir construyendo en las siguientes sesiones.

---

## 1. Requisitos

- Node.js 20 o superior
- npm 10 o superior

---

## 2. Crear el proyecto base con Angular CLI

```bash
npx @angular/cli@21 new mis-tareas --style=css --routing --ssr=false
cd mis-tareas
```

El CLI puede preguntar interactivamente por características experimentales
(por ejemplo, *zoneless change detection* o *AI tooling*). Puedes responder
que no a todas: este esqueleto usa la detección de cambios por defecto
(zone.js), que es la opción más estable entre distintos patches de Angular 21.

> **Nota sobre zoneless:** en versiones anteriores de este esqueleto se
> configuraba `provideZonelessChangeDetection()` en `app.config.ts`. Se quitó
> porque en algunos patches de Angular 21 esa función todavía no es un export
> público estable (aparece como `ɵprovideZonelessChangeDetection`), lo que
> rompe la compilación según la versión exacta instalada. No es necesaria
> para lo que estamos ejemplificando; si quieres explorarla más adelante,
> revisa primero `node_modules/@angular/core/index.d.ts` en tu proyecto.

---

## 3. Copiar los archivos de este esqueleto

1. Copia el contenido de la carpeta `src/app` de este esqueleto dentro de
   `src/app` de tu proyecto recién creado, **reemplazando** los archivos que
   ya existan (el componente raíz, `app.config.ts`, `app.routes.ts`) y
   añadiendo las carpetas nuevas: `core`, `models`, `services`, `components`.

   > Según la versión exacta del CLI, el componente raíz puede llamarse
   > `app.ts` o `app.component.ts`. Si tu proyecto generó
   > `app.component.ts`, simplemente sustituye su contenido por el de
   > `app.ts` de este esqueleto (y haz lo mismo con el `.html` y el `.css`).

2. Copia `db.json` a la **raíz** del proyecto (al mismo nivel que
   `package.json`, **no** dentro de `src`).

---

## 4. Instalar json-server (nuestra API REST de prueba)

```bash
npm install -D json-server
```

Agrega este script en `package.json`:

```json
"scripts": {
  "api": "json-server --watch db.json --port 3000"
}
```

`json-server` convierte el archivo `db.json` en una API REST completa,
sin escribir una sola línea de backend: expone automáticamente
`GET/POST/PUT/DELETE` sobre `/tareas` y `/cursos`. Esto permite que la primera
demostración se concentre en el frontend Angular y en el consumo de la API,
dejando la construcción de un backend real para una sesión posterior.

---

## 5. Ejecutar el proyecto (dos terminales)

**Terminal 1 — la API:**
```bash
npm run api
```
Queda escuchando en `http://localhost:3000`.

**Terminal 2 — la aplicación Angular:**
```bash
npm start
```
Ábrela en `http://localhost:4200`.

---

## 6. Qué contiene este esqueleto

| Archivo / carpeta                        | Qué demuestra |
|-------------------------------------------|---------------|
| `models/tarea.model.ts`, `models/curso.model.ts` | Forma de los datos (JSON) que viajan entre frontend y backend |
| `core/constants.ts`                        | Un único punto donde vive la URL base de la API (frontend y backend desacoplados) |
| `services/tarea.service.ts`                | Capa de comunicación con la API vía `HttpClient` (GET, POST, PUT, DELETE) y estado reactivo con `signal` |
| `services/curso.service.ts`                | Un segundo endpoint consumido para poblar un `<select>` (relación entre recursos) |
| `components/tarea-list`                    | Consumo de GET, renderizado con `@for`/`@if`, filtrado en el cliente |
| `components/tarea-form`                    | Formularios reactivos, POST para crear y PUT para editar, navegación con `Router` |
| `app.routes.ts`                            | Comportamiento SPA: cambiar de vista sin recargar la página |
| `app.config.ts`                            | `provideHttpClient()` y `provideRouter()` |
| `db.json`                                  | Simula la base de datos que "vería" el backend, servida como API REST por `json-server` |

---

## 7. Relación con los conceptos ya vistos en clase

- **Arquitectura cliente-servidor:** Angular (cliente) y `json-server`
  (servidor) corren como dos procesos independientes en puertos distintos
  (4200 y 3000).
- **Frontend / Backend:** todo lo que hay en `src/app` es frontend; `db.json`
  + `json-server` actúan como backend de prueba, sin que el frontend sepa
  (ni le importe) cómo está implementado por dentro.
- **API REST y métodos HTTP:** cada método de `TareaService`
  (`cargarTareas`, `crear`, `actualizar`, `eliminar`) corresponde a un verbo
  HTTP distinto (GET, POST, PUT, DELETE) sobre el mismo recurso `/tareas`.
- **JSON:** es el formato en el que viajan los datos en cada solicitud y
  respuesta; puedes verlo directamente abriendo la pestaña *Network* del
  navegador mientras usas la app.
- **SPA:** la navegación entre la lista y el formulario ocurre sin recargar
  el navegador; el `Router` de Angular solo cambia el componente mostrado.

---

## 8. Ejercicios sugeridos para las siguientes sesiones

1. Agregar una vista de **detalle** de tarea (`/tareas/:id`) que solo
   consuma GET, sin editar.
2. Mostrar el **nombre** del curso (no solo su id) en la lista de tareas,
   combinando los datos de `TareaService` y `CursoService`.
3. Agregar validaciones adicionales al formulario (longitud mínima del
   título, fecha no anterior a hoy).
4. Sustituir `json-server` por un backend real en Node/Express o Spring
   Boot **sin tocar el frontend**: es una buena forma de comprobar en
   la práctica que el frontend no depende de cómo está construido el
   servidor, solo del contrato de la API.
5. Agregar manejo de errores HTTP (por ejemplo, mostrar un mensaje si
   `json-server` no está corriendo).
6. Añadir un buscador por título usando otro `signal` y `computed`,
   como ya se hizo con el filtro por estado.
