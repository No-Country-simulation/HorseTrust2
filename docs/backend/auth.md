# Document Backedn


###  Register

POST /api/v1/auth/register

```json
Rquest Body 
{
  "email": "user@example.com",
  "password": "Password123"
}

```

#### Response 201 

```json
{
  "success": true,
  "message": "Usuario creado correctamente",
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  }
}

```

### Login

POST /api/v1/auth/login

Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Response 200

```json
{
  "success": true,
  "message": "Login correcto",
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  }
}

```


❌ Errores posibles
Código	HTTP	Descripción
USER_NOT_FOUND	404	Usuario no existe
INVALID_PASSWORD	401	Contraseña incorrecta
INTERNAL_ERROR	500	Error inesperado


#### Proteccion de Rutas

Ejemplo en lib\auth\get-user-from-token.ts