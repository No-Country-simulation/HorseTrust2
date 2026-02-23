# Documentos del Caballo

Endpoints para gestionar los documentos asociados a un caballo (certificados de propiedad, pasaporte equino, exámenes veterinarios, etc.).

> **Autenticación requerida** en POST y DELETE. Solo el dueño del caballo puede subir o eliminar documentos.

## Subir Documento (POST)

POST : /api/v1/horses/:horseId/documents

> **Content-Type: `multipart/form-data`** — Se envía el archivo real + metadatos como campos del formulario.
> El servidor guarda el archivo en el filesystem local y genera automáticamente la `url` y el `public_id`.

### Campos del FormData (todos los documentos)

| Campo      | Tipo   | Requerido | Descripción                                                          |
| ---------- | ------ | --------- | -------------------------------------------------------------------- |
| `file`     | File   | ✅         | Archivo a subir (PDF o imagen). Máx 10MB                            |
| `type`     | string | ✅         | `image`, `document`                                                  |
| `category` | string | ✅         | `ownership`, `veterinary`, `competition`, `identification`           |
| `role`     | string | ✅         | `cover`, `title`, `passport`, `xray`, `vaccine_card`, `certificate`  |
| `issuedAt` | string | ❌         | Fecha ISO 8601. **Obligatorio si category = veterinary**             |

### Campos adicionales para documentos veterinarios (category = "veterinary")

| Campo        | Tipo   | Requerido       | Descripción                            |
| ------------ | ------ | --------------- | -------------------------------------- |
| `vetName`    | string | ✅ (veterinary)  | Nombre del veterinario                 |
| `examType`   | string | ✅ (veterinary)  | `basic`, `advanced`                    |
| `examResult` | string | ✅ (veterinary)  | `apt`, `with_observations`             |

### Archivos permitidos

| Tipo (`type`) | MIME types aceptados                  | Extensiones       |
| ------------- | ------------------------------------- | ----------------- |
| `image`       | image/jpeg, image/png, image/webp     | .jpg, .png, .webp |
| `document`    | application/pdf                       | .pdf              |

### Ejemplo con cURL — Documento de propiedad

```bash
curl -X POST http://localhost:3000/api/v1/horses/{horseId}/documents \
  -H "Cookie: token=JWT_TOKEN" \
  -F "file=@titulo-propiedad.pdf" \
  -F "type=document" \
  -F "category=ownership" \
  -F "role=title" \
  -F "issuedAt=2024-06-01"
```

### Ejemplo con cURL — Examen veterinario

```bash
curl -X POST http://localhost:3000/api/v1/horses/{horseId}/documents \
  -H "Cookie: token=JWT_TOKEN" \
  -F "file=@examen-clinico.pdf" \
  -F "type=document" \
  -F "category=veterinary" \
  -F "role=certificate" \
  -F "issuedAt=2024-06-01" \
  -F "vetName=Dr. García López" \
  -F "examType=basic" \
  -F "examResult=apt"
```

### Ejemplo con JavaScript (fetch)

```js
const formData = new FormData()
formData.append("file", fileInput.files[0])
formData.append("type", "document")
formData.append("category", "veterinary")
formData.append("role", "certificate")
formData.append("issuedAt", "2024-06-01")
formData.append("vetName", "Dr. García López")
formData.append("examType", "basic")
formData.append("examResult", "apt")

const res = await fetch(`/api/v1/horses/${horseId}/documents`, {
  method: "POST",
  body: formData, // NO poner Content-Type, el browser lo agrega con boundary
})
```

### Response 201

```json
{
  "ok": true,
  "statusCode": 201,
  "message": "Documento subido correctamente. Pendiente por verificación",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "user_id": "50f2c2fb-ca16-4bc2-a9f4-117db03ba126",
    "horse_id": "83c823de-4185-4797-9a62-ff758e3878a4",
    "type": "document",
    "category": "veterinary",
    "purpose": "certificate",
    "url": "/api/v1/uploads/horses/83c823de-.../a1b2c3d4-uuid.pdf",
    "public_id": "horses/83c823de-.../a1b2c3d4-uuid.pdf",
    "issued_at": "2024-06-01T00:00:00.000Z",
    "vet_name": "Dr. García López",
    "exam_type": "basic",
    "exam_result": "apt",
    "verified": false,
    "created_at": "2026-02-21T00:00:00.000Z",
    "updated_at": "2026-02-21T00:00:00.000Z"
  }
}
```

### Bad Request — Campos veterinarios faltantes

```json
{
  "ok": false,
  "statusCode": 400,
  "message": "El nombre del veterinario (vetName) es obligatorio para documentos veterinarios",
  "code": "MISSING_VET_NAME"
}
```

### Bad Request — Tipo de archivo no permitido

```json
{
  "ok": false,
  "statusCode": 400,
  "message": "Tipo de archivo no permitido. Para type \"document\" se aceptan: application/pdf",
  "code": "INVALID_FILE_TYPE"
}
```

### Bad Request — Archivo muy grande

```json
{
  "ok": false,
  "statusCode": 400,
  "message": "El archivo excede el tamaño máximo permitido (10MB)",
  "code": "FILE_TOO_LARGE"
}
```

### Acceder al archivo subido

Los archivos se sirven desde:

```
GET /api/v1/uploads/horses/{horseId}/{filename}
```

El campo `url` de la respuesta contiene esta ruta directamente.

---

## Listar Documentos (GET)

GET : /api/v1/horses/:horseId/documents

> No requiere autenticación. Se puede filtrar por categoría.

### Query Params

| Param      | Tipo | Descripción                                              |
| ---------- | ---- | -------------------------------------------------------- |
| `category` | enum | Filtrar por: `ownership`, `veterinary`, `competition`, `identification` |

### Ejemplos

```
GET /api/v1/horses/83c823de-.../documents
GET /api/v1/horses/83c823de-.../documents?category=veterinary
GET /api/v1/horses/83c823de-.../documents?category=ownership
```

### Response 200

```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Documentos del caballo obtenidos correctamente",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "type": "document",
      "category": "veterinary",
      "purpose": "certificate",
      "url": "/api/v1/uploads/horses/83c823de-.../f47ac10b-uuid.pdf",
      "public_id": "horses/83c823de-.../f47ac10b-uuid.pdf",
      "issued_at": "2024-06-01T00:00:00.000Z",
      "vet_name": "Dr. García López",
      "exam_type": "basic",
      "exam_result": "apt",
      "verified": false,
      "created_at": "2026-02-21T00:00:00.000Z"
    },
    {
      "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      "type": "document",
      "category": "ownership",
      "purpose": "title",
      "url": "/api/v1/uploads/horses/83c823de-.../a1b2c3d4-uuid.pdf",
      "public_id": "horses/83c823de-.../a1b2c3d4-uuid.pdf",
      "issued_at": "2024-06-01T00:00:00.000Z",
      "vet_name": null,
      "exam_type": null,
      "exam_result": null,
      "verified": false,
      "created_at": "2026-02-20T00:00:00.000Z"
    }
  ]
}
```

---

## Eliminar Documento (DELETE)

DELETE : /api/v1/horses/:horseId/documents?documentId=xxx

> Requiere autenticación. Solo el dueño del caballo puede eliminar documentos.

### Query Params

| Param        | Tipo   | Requerido | Descripción           |
| ------------ | ------ | --------- | --------------------- |
| `documentId` | string | ✅         | UUID del documento    |

### Ejemplo

```
DELETE /api/v1/horses/83c823de-.../documents?documentId=f47ac10b-...
```

### Response 200

```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Documento eliminado correctamente",
  "data": null
}
```

### Document Not Found

```json
{
  "ok": false,
  "statusCode": 404,
  "message": "Documento no encontrado",
  "code": "DOCUMENT_NOT_FOUND"
}
```

---

## Resumen de Endpoints

| Método   | Ruta                                          | Auth | Descripción                     |
| -------- | --------------------------------------------- | ---- | ------------------------------- |
| `GET`    | `/api/v1/horses`                              | ❌    | Listar caballos (filtro status) |
| `POST`   | `/api/v1/horses`                              | ✅    | Crear caballo                   |
| `GET`    | `/api/v1/horses/:id`                          | ❌    | Detalle de caballo              |
| `PATCH`  | `/api/v1/horses/:id`                          | ✅    | Actualizar caballo (owner)      |
| `DELETE` | `/api/v1/horses/:id`                          | ✅    | Eliminar caballo (owner)        |
| `GET`    | `/api/v1/horses/:id/documents`                | ❌    | Listar documentos del caballo   |
| `POST`   | `/api/v1/horses/:id/documents`                | ✅    | Subir documento                 |
| `DELETE` | `/api/v1/horses/:id/documents?documentId=xxx` | ✅    | Eliminar documento              |

### Enums de referencia

| Enum             | Valores                                                    |
| ---------------- | ---------------------------------------------------------- |
| `type`           | `image`, `document`                            |
| `category`       | `ownership`, `veterinary`, `competition`, `identification` |
| `role` (purpose) | `cover`, `title`, `passport`, `xray`, `vaccine_card`, `certificate` |
| `examType`       | `basic`, `advanced`                                        |
| `examResult`     | `apt`, `with_observations`                                 |
| `sex`            | `male`, `female`                                           |
| `discipline`     | `racing`, `jumping`, `dressage`, `recreational`            |
| `sale_status`    | `for_sale`, `reserved`, `sold`                             |
