# ✅ FASE 3 – Diseño funcional de la API REST

---

## 🎯 Objetivo general

Diseñar una **API REST modular, segura y controlada** que:

* Sea el **único punto de entrada** hacia la blockchain Hyperledger Fabric
* Gestione **usuarios, sistemas y tokens**
* Exponga endpoints para sistemas automatizados con tokens seguros
* Controle el acceso con autenticación por JWT y roles
* Permita registrar eventos o estados cifrados en Fabric
* Lleve un **log estructurado** y auditable de todas las acciones

---

## 🧭 Rutas principales agrupadas por función

---

### 🔑 1. Autenticación de usuarios

| Método | Ruta            | Acceso  | Descripción                           |
| ------ | --------------- | ------- | ------------------------------------- |
| `POST` | `/auth/login`   | Público | Iniciar sesión con usuario/contraseña |
| `POST` | `/auth/refresh` | JWT     | Renovar token                         |
| `POST` | `/auth/logout`  | JWT     | Invalidar token actual (opcional)     |

📌 **Respuesta JWT**: incluye rol (`admin`, `auditor`, `user`) y expiración.

---

### 👤 2. Gestión de usuarios

| Método   | Ruta              | Acceso | Descripción               |
| -------- | ----------------- | ------ | ------------------------- |
| `GET`    | `/users/me`       | JWT    | Ver perfil autenticado    |
| `POST`   | `/users/register` | Admin  | Crear usuario nuevo       |
| `GET`    | `/users`          | Admin  | Listar todos los usuarios |
| `DELETE` | `/users/:id`      | Admin  | Eliminar usuario          |

---

### 🤖 3. Gestión de sistemas

| Método   | Ruta                 | Acceso     | Descripción                       |
| -------- | -------------------- | ---------- | --------------------------------- |
| `POST`   | `/systems/register`  | User/Admin | Crear sistema y generar token     |
| `GET`    | `/systems`           | User/Admin | Listar sistemas propios           |
| `GET`    | `/systems/:id/token` | User/Admin | Regenerar token (revoca anterior) |
| `DELETE` | `/systems/:id`       | User/Admin | Eliminar sistema                  |

📌 Tokens de sistemas **firmados y expiran**, para evitar abuso.

---

### 🔐 4. Interacción con Blockchain (vía proxy)

| Método | Ruta               | Acceso | Descripción                           |
| ------ | ------------------ | ------ | ------------------------------------- |
| `POST` | `/event/store`     | Token  | Registrar evento cifrado en Fabric    |
| `POST` | `/state/store`     | Token  | Registrar estado global cifrado       |
| `GET`  | `/event/:systemID` | JWT    | Ver eventos del sistema (si es dueño) |
| `GET`  | `/state/:systemID` | JWT    | Ver estados del sistema               |

📌 Requiere encabezado `Authorization: Bearer <token>` o JWT para control de acceso.

---

### 📄 5. Auditoría

| Método | Ruta                | Acceso        | Descripción                         |
| ------ | ------------------- | ------------- | ----------------------------------- |
| `GET`  | `/audit/api`        | Auditor/Admin | Logs de la API (base de datos)      |
| `GET`  | `/audit/chaincode`  | Auditor/Admin | Logs blockchain (`blockchain_logs`) |
| `GET`  | `/audit/system/:id` | User/Admin    | Ver log específico de sistema       |

---

### ⚙️ 6. Administración de chaincodes

| Método | Ruta                  | Acceso | Descripción               |
| ------ | --------------------- | ------ | ------------------------- |
| `POST` | `/chaincode/install`  | Admin  | Instalar chaincode        |
| `GET`  | `/chaincodes`         | Admin  | Ver chaincodes instalados |
| `GET`  | `/chaincode/:id/logs` | Admin  | Logs por chaincode        |

📌 Se conecta al SDK para instalar `secureStorage`, `auditTracker`, etc.

---

### 🧰 7. Generación de cliente SDK

| Método | Ruta                             | Acceso     | Descripción                                      |
| ------ | -------------------------------- | ---------- | ------------------------------------------------ |
| `GET`  | `/proxy/client-code?lang=python` | User/Admin | Descarga ZIP con SDK para integración            |
| `GET`  | `/proxy/languages`               | Público    | Lista de lenguajes soportados (Strategy Pattern) |

---

### 📊 8. Monitorización (opcional en frontend)

| Método | Ruta             | Acceso     | Descripción                           |
| ------ | ---------------- | ---------- | ------------------------------------- |
| `GET`  | `/metrics`       | Prometheus | Métricas de la API                    |
| `GET`  | `/grafana/embed` | Admin      | IFrame de Grafana embebido (opcional) |

---

## 🔐 Seguridad por diseño

### Autenticación

* JWT para humanos
* Tokens firmados para sistemas
* TLS obligatorio en producción

### Autorización

* Middleware `roleCheck('admin')`, `roleCheck('auditor')`
* Sistema puede enviar solo a `/event/store` y `/state/store`

### Validación

* Validación de JSON con Zod/Joi en cada entrada
* Rechazo de payloads incorrectos con logs estructurados

### Protección

* Rate limiting por IP y por token
* Timestamps + nonce (si se implementa anti-replay)
* Hash del payload almacenado para trazabilidad

---

## 🔄 Flujos de uso

### ✅ Caso 1: Un usuario registra un sistema

1. `POST /auth/login` → obtiene JWT
2. `POST /systems/register` → crea nuevo sistema
3. Recibe token y código SDK (vía `/proxy/client-code`)
4. Integra el SDK en su Smart Home o servicio externo

---

### ✅ Caso 2: Un sistema envía evento

1. Llama `POST /event/store` con token
2. API valida token, genera hash, guarda en Fabric
3. Registra en `blockchain_logs` y `api_logs`
4. Respuesta incluye `TxID`, timestamp

---

### ✅ Caso 3: Auditor accede al historial

1. Se loguea como auditor
2. Llama `GET /audit/api` y `GET /audit/chaincode`
3. Visualiza acciones, errores, transacciones y tiempos

---

## 🧭 Final de Fase 3 — Checklist

✅ Rutas REST definidas por función
✅ Métodos, roles y validaciones pensadas
✅ Flujos de uso para usuarios, sistemas y auditoría
✅ Integración con DB y Blockchain planeada
✅ Seguridad por capa y tipo de actor establecida
✅ Generación de SDK cliente prevista como extensión
