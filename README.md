# CRUD User Backend

Backend para gestionar usuarios con autenticación JWT, roles y conexión a MongoDB. El proyecto permite crear, listar, actualizar y eliminar usuarios, además de realizar login para obtener un token de acceso.

## Features

- User CRUD operations
- JWT authentication
- Password hashing with `bcryptjs`
- Validation with `Joi`
- Role-based access control (`ROOT`, `ADMIN`, `USER`, `GUEST`)
- MongoDB connection with Mongoose

## Requisitos

- Node.js 18 o superior
- MongoDB (local o Atlas)
- npm

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Dotenv para variables de entorno
- Joi para validaciones
- bcryptjs
- CORS

## Instalación

1. Clonar el repositorio

   ```bash
   git clone https://github.com/CraftyManu/crud-user-backend.git
   cd crud-user-backend
   ```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   PORT=7000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   FRONTEND_URLS=http://localhost:5173
   ```

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

```bash
npm start
```

La API quedará disponible en:

```text
http://localhost:7000
```

## Estructura del proyecto

```text
src/
├── config/         # Environment, database, and CORS configuration
├── controllers/    # Request handlers (controladores de la API)
├── dto/            # validaciones con Joi
├── functions/      # Helper functions
├── helpers/        # Response utilities
├── middlewares/    # Autenticación y autorización según roles
├── models/         # Mongoose schemas
├── routes/         # definición de rutas
├── services/       # lógica de negocio
└── app.js          # inicialización del servidor
```

## API Endpoints

### 1) Login (Authentication)

| Method | Endpoint      | Description                          | Requiere Token |
| ------ | ------------- | ------------------------------------ | -------------- |
| POST   | `/auth/login` | Login a user and receive a JWT token | No             |

#### Headers

```http
Content-Type: application/json
```

#### Body

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password"
}
```

#### Respuesta esperada

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "<jwt_token>",
    "role": "ADMIN"
  }
}
```

El login devuelve un token JWT. Para los endpoints protegidos, debes enviar este header:

#### Auth Header Example

```http
Authorization: Bearer <your_jwt_token>
```

---

### 2) Listar usuarios

- Método: GET
- Ruta: /users
- Requiere token: No (actualmente)

| Method | Endpoint | Description                             | Requiere Token |
| ------ | -------- | --------------------------------------- | -------------- |
| GET    | `/users` | Devuelve la lista de todos los usuarios | Si             |

#### Headers

```http
Content-Type: application/json
```

#### Query params (opcionales)

- id: filtra por ID de usuario
- email: filtra por email

#### Ejemplo con curl

```bash
curl http://localhost:7000/users
```

Filtrar por email:

```bash
curl "http://localhost:7000/users?email=usuario@example.com"
```

Filtrar por id:

```bash
curl "http://localhost:7000/users?id=6a52573bbf379ab68dad7dd3"
```

---

### 3) Crear usuario

| Method | Endpoint | Description           | Requiere Token   |
| ------ | -------- | --------------------- | ---------------- |
| POST   | `/users` | Crea un nuevo usuario | No (actualmente) |

#### Headers

```http
Content-Type: application/json
```

#### Body

```json
{
  "nombre": "Manuela",
  "apellido": "Sartor",
  "email": "manu@ejemplo.com",
  "password": "123456",
  "fechaNacimiento": "1991-07-14",
  "genero": "Femenino",
  "telefono": "1122334455",
  "direccion": "Av. Siempre Viva 123",
  "localidad": "Santa Fe",
  "provincia": "Santa Fe",
  "pais": "Argentina",
  "codigoPostal": "5000",
  "role": "USER"
}
```

#### Campos obligatorios

- nombre
- apellido
- email
- password
- fechaNacimiento
- genero
- telefono
- direccion
- localidad
- provincia
- pais
- codigoPostal

#### Ejemplo con curl

```bash
curl -X POST http://localhost:7000/users \
  -H "Content-Type: application/json" \
  -d '{
"nombre": "Manuela",
  "apellido": "Sartor",
  "email": "manu@ejemplo.com",
  "password": "123456",
  "fechaNacimiento": "1991-07-14",
  "genero": "Femenino",
  "telefono": "1122334455",
  "direccion": "Av. Siempre Viva 123",
  "localidad": "Santa Fe",
  "provincia": "Santa Fe",
  "pais": "Argentina",
  "codigoPostal": "5000",
  "role": "USER"
  }'
```

---

### 4) Actualizar usuario

- Roles permitidos: ROOT, ADMIN

| Method | Endpoint     | Description                               | Requiere Token |
| ------ | ------------ | ----------------------------------------- | -------------- |
| PUT    | `/users/:id` | Devuelve los datos del usuario solicitado | Si             |

#### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

#### Body

Puedes enviar uno o varios de estos campos:

```json
{
  "nombre": "Manuela Actualizado",
  "apellido": "Sartor",
  "fechaNaciemiento": "1992-07-24",
  "telefono": "1199887766",
  "direccion": "Nueva dirección 456",
  "password": "nuevaPassword123"
}
```

#### Consideraciones

- El campo email no se puede modificar.
- Debe enviarse al menos un campo para actualizar.
- El id debe ser un ObjectId válido de MongoDB.

#### Ejemplo con curl

```bash
curl -X PUT http://localhost:7000/users/6a52573bbf379ab68dad7dd3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Manuela Actualizado",
      "direccion": "Nueva dirección 456"
  }'
```

---

### 5) Eliminar usuario

- Roles permitidos: ROOT, ADMIN

| Method | Endpoint     | Description        | Requiere Token |
| ------ | ------------ | ------------------ | -------------- |
| DELETE | `/users/:id` | Elimina el usuario | Si             |

#### Headers

```http
Authorization: Bearer <token>
```

#### Body

No requiere body.

#### Ejemplo con curl

```bash
curl -X DELETE http://localhost:7000/users/6a52573bbf379ab68dad7dd3 \
  -H "Authorization: Bearer <token>"
```

---

## User Fields

The user model includes the following fields:

- `nombre`
- `apellido`
- `email`
- `password`
- `fechaNacimiento`
- `genero`
- `telefono`
- `direccion`
- `localidad`
- `provincia`
- `pais`
- `codigoPostal`
- `role`
- `userName`
- `ultimoLogin`

### Users

Además, para los endpoints de actualización y eliminación, el usuario debe tener rol `ROOT` o `ADMIN`.

All user routes require a valid Bearer token and the role must be `ROOT` or `ADMIN`.

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| GET    | `/users`        | Get all users          |
| GET    | `/users/:id`    | Get a user by ID       |
| GET    | `/users/:email` | Get a user by ID       |
| POST   | `/users`        | Create a new user      |
| PUT    | `/users/:id`    | Update a user by ID    |
| PUT    | `/users/:email` | Update a user by email |
| DELETE | `/users/:id`    | Delete a user by ID    |

## Roles disponibles

- ROOT
- ADMIN
- USER
- GUEST

## Códigos de respuesta comunes

- 200: operación exitosa
- 201: usuario creado correctamente
- 400: error de validación o datos inválidos
- 401: token faltante o inválido
- 403: acceso denegado por rol
- 404: recurso no encontrado
- 409: usuario ya existe

## Recomendación para probar en Postman o Thunder Client

1. Ejecutar POST /auth/login con un usuario existente.
2. Copiar el token recibido.
3. En los endpoints protegidos, agregar el header Authorization con el valor Bearer <token>.
4. Para probar PUT y DELETE, usar un usuario con rol ROOT o ADMIN.

#### Notas

- The backend expects the MongoDB connection string to be provided through `MONGO_URI`.
- `JWT_SECRET` and `JWT_EXPIRES_IN` are required for authentication to work.
- `FRONTEND_URLS` is used by the CORS configuration.
- The `email` field is unique for each user.
- `password` is stored securely as a hashed value.
