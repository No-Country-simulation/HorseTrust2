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
