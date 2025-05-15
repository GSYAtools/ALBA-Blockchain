# ✅ FASE 1 – Diseño del Backend SecureStorage API (Node.js)

---

## 🎯 Objetivo general

Diseñar un backend robusto en Node.js que:

* Actúe como **único punto de acceso a Hyperledger Fabric**
* **Gestione usuarios y sistemas**, con control de acceso basado en roles
* Permita a usuarios registrar sistemas que se conectan con tokens
* Genere **SDKs clientes** para facilitar integración
* Implemente auditoría interna, rate-limiting y validaciones
* Sea **modular, extensible y seguro**

---

## 🧱 1. Estructura de carpetas propuesta

```bash
secure-storage-api/
├── app.js                   # Entrypoint principal
├── config/                  # Configuración general (DB, JWT, Fabric)
│   ├── db.js
│   ├── fabric.js
│   └── rateLimit.js
├── controllers/             # Lógica de negocio por módulo
│   ├── authController.js
│   ├── userController.js
│   ├── systemController.js
│   ├── eventController.js
│   └── adminController.js
├── middleware/              # Middlewares comunes
│   ├── auth.js
│   ├── roleCheck.js
│   ├── rateLimiter.js
│   └── validateInput.js
├── models/                  # Modelos Sequelize (o Prisma)
│   ├── User.js
│   ├── System.js
│   ├── ApiLog.js
│   ├── BlockchainLog.js
│   └── Chaincode.js
├── routes/                  # Rutas express
│   ├── auth.js
│   ├── users.js
│   ├── systems.js
│   ├── events.js
│   ├── admin.js
│   └── audit.js
├── services/                # Servicios auxiliares
│   ├── fabricService.js
│   ├── identityService.js
│   ├── chaincodeInstaller.js
│   ├── clientCodeGenerator.js
│   └── logger.js
├── utils/                   # Helpers comunes
│   ├── token.js
│   ├── encryption.js
│   └── validators.js
├── wallet/                  # Carpeta local de identidades (Fabric)
├── logs/                    # Logs firmados por separado
└── .env                     # Variables de entorno
```

---

## 🔐 2. Seguridad de la arquitectura

| Componente             | Mecanismo propuesto                         |
| ---------------------- | ------------------------------------------- |
| Autenticación usuarios | JWT con expiración y refresh                |
| Autenticación sistemas | Token firmado (UUID + firma HMAC o similar) |
| Validación de datos    | Middleware `validateInput` (con Zod/Joi)    |
| Roles                  | Middleware `roleCheck('admin')`, etc.       |
| Rate limiting          | Express-rate-limit por token o IP           |
| Auditoría              | Logs separados por tipo (API vs Blockchain) |
| Cifrado de tokens      | Guardar token hash (no raw) en BD           |
| Hardening HTTP         | Helmet, CORS controlado, limitar headers    |

---

## 📑 3. Base de datos: PostgreSQL

Usaremos **PostgreSQL + Sequelize o Prisma**.

### Tablas y relaciones:

```sql
users (id, username, password_hash, role, created_at)
systems (id, name, token_hash, user_id, created_at)
api_logs (id, type, source, user_id, system_id, action, status, timestamp)
blockchain_logs (id, txid, chaincode, payload_hash, system_id, timestamp)
chaincodes (id, name, version, installed_by, status, created_at)
```

* `user_id` en `systems` permite múltiples sistemas por usuario
* `token_hash` evita almacenar tokens en texto plano
* `api_logs` y `blockchain_logs` permiten trazabilidad cruzada

---

## 🌐 4. Endpoints principales (resumen)

### 🔑 Autenticación

* `POST /auth/login` → Devuelve JWT
* `POST /auth/refresh` → Renovación de token

### 👤 Usuarios

* `GET /users/me` → Info actual
* `POST /users/register` → Alta de usuario (opcional si no se hace desde admin)

### 🧩 Sistemas

* `POST /systems/register` → Registra un sistema asociado a un usuario
* `GET /systems/token/:id` → Genera token para un sistema
* `GET /proxy/client-code?lang=python` → Genera SDK cliente

### 🔗 Blockchain

* `POST /event/store` → Recibe evento cifrado
* `POST /state/store` → Recibe estado cifrado
* `GET /logs/chaincode/:systemID` → Auditoría blockchain

### ⚙️ Admin

* `POST /chaincode/install` → Instala chaincode
* `GET /audit/api` → Logs API
* `GET /grafana/iframe` → Inserta dashboard Prometheus

---

## 🧠 5. Componentes clave

### 📦 `fabricService.js`

* Encapsula la conexión a Fabric
* Carga wallet, gateway y network
* Expone funciones como `submitTransaction`, `evaluateTransaction`

### 🛠 `chaincodeInstaller.js`

* Permite instalar e instanciar chaincode desde la API (solo admin)
* Usa el SDK con política `OR('Org1MSP.member')`

### 🧰 `clientCodeGenerator.js`

* Implementa patrón Strategy para distintos lenguajes
* Devuelve ZIP descargable por el usuario

### 🧾 `logger.js`

* Guarda logs API con tipo (`login`, `chaincode_call`, etc.)
* Cada log tiene `user_id`, `system_id`, `ip`, `status`, etc.

---

## ⚠️ 6. Consideraciones importantes

* **No exponer Fabric directamente**
* **Cifrado extremo a extremo**: la API no descifra datos antes de enviarlos a Fabric
* **Identidades Fabric administradas por el backend** (usuarios y sistemas nunca manejan certificados)
* **Logs API ≠ Logs blockchain**: separación clara y estructurada
* **Protección contra abuso**: limite por sistema (tokens) y por IP (usuarios)

---

## ✅ 7. Criterios de finalización de esta fase

* Estructura de carpetas aprobada
* Roles y autenticación definidos
* Base de datos modelada (ERD o esquema SQL)
* Endpoints y funcionalidades aprobadas
* Lógica general de seguridad cerrada
* Diagrama de interacción Backend ↔ Blockchain ↔ Sistemas ↔ Usuarios documentado
