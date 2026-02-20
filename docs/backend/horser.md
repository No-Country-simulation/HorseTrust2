# Document BackEnd

## Register Horser

POST /api/v1/horses

```json
Request Body 

{
  "name":"Horser",
  "age":"10",
  "sex":"male",
  "discipline":"racing",
  "breed":""
}
```

## Response 201

```json
{
  "ok": true,
  "statusCode": 201,
  "message": "Caballo creado correctamente",
  "data": {
    "id": "091c323f-4212-4330-923c-e99b85ea65eb",
    "owner": {
      "id": "50f2c2fb-ca16-4bc2-a9f4-117db03ba126"
    },
    "name": "Horser",
    "age": "10",
    "sex": "male",
    "breed": "",
    "discipline": "racing",
    "price": null,
    "sale_status": "for_sale",
    "verification_status": "pending",
    "created_at": "2026-02-19T00:12:31.754Z",
    "updated_at": "2026-02-19T00:12:31.754Z"
  }
}
```

## Bad Request

```json
{
  "ok": false,
  "statusCode": 400,
  "message": "Disciplina inválida inválido. Valores permitidos: racing, jumping, dressage, recreational",
  "code": "INVALID_DISCIPLINE"
}
```

## Listado de Caballos por Status

example :
GET /api/v1/horses?status=for_sale
GET /api/v1/horses?status=reserved
GET /api/v1/horses?status=sold

Querys : for_sale , reserved , sold .

## Response 200

```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Listado de caballos obtenido correctamente",
  "data": [
    {
      "id": "83c823de-4185-4797-9a62-ff758e3878a4",
      "name": "Horser",
      "age": 10,
      "sex": "male",
      "breed": "",
      "discipline": "racing",
      "sale_status": "for_sale",
      "verification_status": "pending"
    },
    {
      "id": "4c8ba552-1356-4d18-bc0b-54eca8190a70",
      "name": "Horser",
      "age": 10,
      "sex": "male",
      "breed": "",
      "discipline": "racing",
      "sale_status": "for_sale",
      "verification_status": "pending"
    },
    {
      "id": "091c323f-4212-4330-923c-e99b85ea65eb",
      "name": "Horser",
      "age": 10,
      "sex": "male",
      "breed": "",
      "discipline": "racing",
      "sale_status": "for_sale",
      "verification_status": "pending"
    }
  ]
}
```

## GET Horses by Id

GET : /api/v1/horses/83c823de-4185-4797-9a62-ff758e3878a4

## Response200

```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Detalle del caballo obtenido correctamente",
  "data": {
    "id": "83c823de-4185-4797-9a62-ff758e3878a4",
    "owner": {
      "id": "50f2c2fb-ca16-4bc2-a9f4-117db03ba126",
      "email": "orlandocv0107@gmail.com",
      "avatar_url": null,
      "first_name": null,
      "last_name": null,
      "phone": null,
      "average_rating": null
    },
    "name": "Horser",
    "age": 10,
    "sex": "male",
    "breed": "",
    "discipline": "racing",
    "price": null,
    "sale_status": "for_sale",
    "verification_status": "pending",
    "documents": [],
    "sales": []
  }
}
```

## Update Horse (PATCH)

PATCH : /api/v1/horses/:id

> Requiere autenticación. Solo el dueño del caballo puede editarlo.

### Campos actualizables

| Campo          | Tipo     | Valores permitidos                              |
| -------------- | -------- | ----------------------------------------------- |
| `name`         | string   | cualquier texto                                 |
| `age`          | number   | cualquier número                                |
| `sex`          | enum     | `male`, `female`                                |
| `breed`        | string   | cualquier texto                                 |
| `discipline`   | enum     | `racing`, `jumping`, `dressage`, `recreational` |
| `price`        | number   | cualquier número o `null`                       |
| `sale_status`  | enum     | `for_sale`, `reserved`, `sold`                  |

### Campos NO actualizables

| Campo                 | Razón                                      |
| --------------------- | ------------------------------------------ |
| `id`                  | Generado automáticamente (UUID)            |
| `owner`               | Se asigna al crear el caballo              |
| `verification_status` | Solo modificable por administradores       |
| `created_at`          | Generado automáticamente                   |
| `updated_at`          | Se actualiza automáticamente               |
| `documents`           | Se gestionan desde su propio endpoint      |
| `sales`               | Se gestionan desde su propio endpoint      |

### Request Body (ejemplo)

```json
{
  "name": "Thunder",
  "age": 12,
  "price": 5000,
  "sale_status": "reserved"
}
```

> Solo se envían los campos que se desean actualizar. No es necesario enviar todos.

### Response 200

```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Caballo actualizado correctamente",
  "data": {
    "id": "83c823de-4185-4797-9a62-ff758e3878a4",
    "owner": {
      "id": "50f2c2fb-ca16-4bc2-a9f4-117db03ba126"
    },
    "name": "Thunder",
    "age": 12,
    "sex": "male",
    "breed": "",
    "discipline": "racing",
    "price": 5000,
    "sale_status": "reserved",
    "verification_status": "pending",
    "created_at": "2026-02-19T00:12:31.754Z",
    "updated_at": "2026-02-19T01:30:00.000Z"
  }
}
```

### Bad Request (sin campos)

```json
{
  "ok": false,
  "statusCode": 400,
  "message": "No se proporcionaron campos para actualizar",
  "code": "NO_FIELDS_TO_UPDATE"
}
```

### Forbidden (no es el dueño)

```json
{
  "ok": false,
  "statusCode": 403,
  "message": "No autorizado para editar este caballo",
  "code": "UNAUTHORIZED"
}
```
