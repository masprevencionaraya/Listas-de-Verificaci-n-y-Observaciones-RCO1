/**
 * Receptor de informes PDF — Bitácora de Exposición a Calor (Salfa Montajes)
 *
 * Qué hace: recibe un POST con un PDF en base64 desde la app web y lo guarda
 * como archivo en una carpeta de Google Drive. No requiere que cada persona
 * que usa la bitácora tenga acceso a Drive: el script corre con la cuenta de
 * quien lo despliega, y esa cuenta es la que necesita acceso a la carpeta.
 *
 * CÓMO DESPLEGAR (una sola vez):
 * 1. Ve a https://script.google.com/ → "Proyecto nuevo".
 * 2. Borra el contenido de Code.gs y pega este archivo completo.
 * 3. Verifica que FOLDER_ID abajo corresponda a tu carpeta de Drive
 *    (ya viene con el ID del link que compartiste).
 * 4. Cambia SHARED_SECRET por un valor propio si quieres (debe coincidir
 *    exactamente con DRIVE_SHARED_SECRET en calor/index.html).
 * 5. Menú "Implementar" → "Nueva implementación":
 *    - Tipo: "Aplicación web"
 *    - Descripción: la que quieras (ej: "Receptor bitácora calor v1")
 *    - Ejecutar como: "Yo (tu-correo@gmail.com)"
 *    - Quién tiene acceso: "Cualquier usuario"
 * 6. Al implementar, Google pedirá autorizar permisos: son permisos sobre
 *    TU PROPIO Drive (crear archivos), no de terceros. Acepta.
 * 7. Copia la URL que termina en "/exec" — esa es la que va en
 *    DRIVE_UPLOAD_URL dentro de calor/index.html.
 *
 * Si más adelante cambias el código de este script, debes crear una
 * "Nueva implementación" de nuevo (o editar la implementación existente)
 * para que los cambios queden activos en la URL ya publicada.
 */

const FOLDER_ID = '1kBdLsalEch9fqmYJ360pjkP3G6uVAyXB';
const SHARED_SECRET = '0ecca3d7af4b241d1453e171c313b8485cc7423b';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }
    if (!data.pdfBase64) {
      return jsonResponse({ ok: false, error: 'missing_pdf' });
    }

    const folder = DriveApp.getFolderById(FOLDER_ID);
    const bytes = Utilities.base64Decode(data.pdfBase64);
    const filename = data.filename || ('Bitacora-Calor_' + Date.now() + '.pdf');
    const blob = Utilities.newBlob(bytes, 'application/pdf', filename);
    const file = folder.createFile(blob);

    return jsonResponse({ ok: true, fileId: file.getId(), url: file.getUrl() });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
