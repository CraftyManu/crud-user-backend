# CRUD User Backend

API REST para la gestión de usuarios con autenticación mediante JWT, autorización por roles, validaciones de entrada y protección contra accesos abusivos. El proyecto permite crear, consultar, actualizar y eliminar usuarios, así como iniciar sesión para obtener un token de acceso.

## Características principales

- CRUD de usuarios
- Autenticación y autorización con JWT
- Hashing seguro de contraseñas con `bcryptjs`
- Validaciones de entrada con `Joi`
- Control de acceso por roles (`ROOT`, `ADMIN`, `USER`, `GUEST`)
- Rate limiting y protección contra ataques de fuerza bruta
- Registro de auditoría y seguridad para operaciones sensibles
- Envío de email de bienvenida al crear usuarios con Resend
- Cálculo de edad a partir de la fecha de nacimiento
- Conexión a MongoDB con Mongoose

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
- express-rate-limit y rate-limiter-flexible

## Instalación

1. Clonar el repositorio:

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
   RESEND_API_KEY=your_resend_api_key
   FRONTEND_URLS=http://localhost:5173
   RATE_LIMIT_WINDOW_MINUTES=15
   RATE_LIMIT_MAX_REQUESTS=100
   LOGIN_WINDOW_MINUTES=15
   LOGIN_MAX_ATTEMPTS=5
   LOGIN_BLOCK_MINUTES=30
   ```

## Ejecución del proyecto

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

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
├── config/         # Configuración de entorno, base de datos y CORS
├── controllers/    # Handlers de las rutas de la API
├── dto/            # Validaciones con Joi
├── functions/      # Funciones auxiliares
├── helpers/        # Utilidades para respuestas estandarizadas
├── middlewares/    # Autenticación, roles, rate limit y brute force
├── models/         # Modelos de Mongoose
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
└── app.js          # Inicialización del servidor
```

### Estructura del proyecto detallada

```text
src/
├── app.js                          # Inicializa Express, middlewares, conexión a MongoDB y rutas
├── config/
│   ├── cors.js                    # Configuración de CORS para los orígenes permitidos
│   ├── db.js                      # Conexión a MongoDB mediante Mongoose
│   └── env.js                     # Carga y acceso a variables de entorno
├── controllers/
│   ├── auth.controller.js         # Maneja el login y las respuestas HTTP
│   └── user.controller.js         # Maneja CRUD de usuarios y validaciones de entrada
├── dto/
│   └── user.dto.js                # Esquemas Joi para crear y actualizar usuarios
├── functions/
│   └── edad/
│       └── edad.users.js          # Cálculo de edad a partir de la fecha de nacimiento
├── helpers/
│   └── response.helper.js         # Respuestas uniformes para éxito/error
├── middlewares/
│   ├── auth.middleware.js         # Verifica JWT y adjunta datos del usuario autenticado
│   ├── bruteForce.middleware.js   # Protege el login ante múltiples intentos fallidos
│   ├── rateLimit.middleware.js    # Limita la cantidad de peticiones por IP
│   └── role.middleware.js         # Verifica permisos por roles
├── models/
│   ├── audit.model.js             # Registro de auditoría para operaciones sensibles
│   ├── securityLog.model.js       # Logs de seguridad para eventos como rate limit y brute force
│   └── user.model.js              # Esquema principal del usuario
├── routes/
│   ├── auth.routes.js             # Ruta de autenticación (/auth/login)
│   └── user.routes.js             # Rutas de usuarios (/users)
├── services/
│   ├── auth.service.js            # Lógica de autenticación y generación de tokens
│   ├── email.service.js           # Envío de emails de bienvenida usando Resend
│   └── user.service.js            # Lógica de negocio para CRUD y permisos
└── scripts/                       # Scripts auxiliares del proyecto
```

## Endpoints de la API

### 1. Autenticación (Login)

| Método | Endpoint      | Descripción                     | Requiere token |
| ------ | ------------- | ------------------------------- | -------------- |
| POST   | `/auth/login` | Inicia sesión y devuelve un JWT | No             |

#### Encabezados

```http
Content-Type: application/json
```

#### Cuerpo

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

Para consumir los endpoints protegidos, debe enviarse el siguiente encabezado:

```http
Authorization: Bearer <your_jwt_token>
```

---

### 2. Listar usuarios

| Método | Endpoint | Descripción                                                | Requiere token |
| ------ | -------- | ---------------------------------------------------------- | -------------- |
| GET    | `/users` | Devuelve la lista de usuarios según el rol del solicitante | Sí             |

#### Parámetros de consulta opcionales

- `id`: filtra por ID de usuario

Ejemplo:

```bash
http://localhost:7000/users?id=6a52573bbf379ab68dad7dd3
```

<!-- - `email`: filtra por email

#### Ejemplos con curl

```bash
curl http://localhost:7000/users
```

```bash
curl "http://localhost:7000/users?email=usuario@example.com"
```

```bash
curl "http://localhost:7000/users?id=6a52573bbf379ab68dad7dd3"
```
 -->

---

### 3. Crear usuario

| Método | Endpoint | Descripción           | Requiere token | Usuarios autorizados |
| ------ | -------- | --------------------- | -------------- | -------------------- |
| POST   | `/users` | Crea un nuevo usuario | Sí             | ROOT / ADMIN         |

#### Cuerpo

```json
{
  "nombre": "Manuela",
  "apellido": "Sartor",
  "email": "manu@ejemplo.com",
  "password": "123456",
  "fechaNacimiento": "1991-07-14",
  "genero": "Femenino",
  "telefono": "1122334455",
  "direccion": "Calle 12",
  "localidad": "Avellaneda",
  "provincia": "Santa Fe",
  "pais": "Argentina",
  "codigoPostal": "5000",
  "role": "USER"
}
```

#### Campos obligatorios

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

---

### 4. Actualizar usuario

| Método | Endpoint     | Descripción                                | Requiere token | Usuarios autorizados |
| ------ | ------------ | ------------------------------------------ | -------------- | -------------------- |
| PUT    | `/users/:id` | Actualiza los datos del usuario solicitado | Sí             | ROOT / ADMIN / USER  |

#### Cuerpo

Puede enviarse uno o varios de los siguientes campos:

```json
{
  "nombre": "Manuela Actualizado",
  "apellido": "Sartor",
  "fechaNacimiento": "1992-07-24",
  "telefono": "1199887766",
  "direccion": "Nueva dirección 456",
  "password": "nuevaPassword123"
}
```

#### Consideraciones

- El campo `email` no puede modificarse.
- Debe enviarse al menos un campo para actualizar.
- El `id` debe ser un ObjectId válido de MongoDB.

### 5. Eliminar usuario

| Método | Endpoint     | Descripción                 | Requiere token | Usuarios autorizados |
| ------ | ------------ | --------------------------- | -------------- | -------------------- |
| DELETE | `/users/:id` | Elimina el usuario indicado | Sí             | ROOT / ADMIN         |

---

## Modelo de usuario

El modelo de usuario incluye los siguientes campos:

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
- `avatarURL`

## Roles disponibles

- `ROOT`
- `ADMIN`
- `USER`
- `GUEST`

## Códigos de respuesta comunes

- `200`: operación exitosa
- `201`: usuario creado correctamente
- `400`: error de validación o datos inválidos
- `401`: token faltante o inválido
- `403`: acceso denegado por rol
- `404`: recurso no encontrado
- `409`: usuario ya existe
- `429`: demasiadas solicitudes o intentos fallidos

## Recomendación para probar en Postman o Thunder Client

1. Ejecutar `POST /auth/login` con un usuario existente.
2. Copiar el token recibido.
3. En los endpoints protegidos, agregar el encabezado `Authorization: Bearer <token>`.
4. Para probar `PUT` y `DELETE`, utilizar un usuario con rol `ROOT` o `ADMIN`.

## Notas

- El backend espera que la cadena de conexión de MongoDB se proporcione a través de `MONGO_URI`.
- `JWT_SECRET` y `JWT_EXPIRES_IN` son obligatorios para que la autenticación funcione correctamente.
- `FRONTEND_URLS` se utiliza en la configuración de CORS.
- El campo `email` es único por usuario.
- La contraseña se almacena de forma segura como valor hash.
