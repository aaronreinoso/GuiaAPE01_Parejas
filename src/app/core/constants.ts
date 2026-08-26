// Único punto donde el frontend "sabe" dónde vive el backend.
// Si mañana json-server se reemplaza por un backend real (Node, Java, .NET...),
// solo hay que cambiar esta línea: el resto del frontend no se entera.
export const API_URL = 'http://localhost:3000';
