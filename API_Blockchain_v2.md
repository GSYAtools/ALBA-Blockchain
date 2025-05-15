# 🧭 PLAN DE ACCIÓN PARA LA NUEVA PLATAFORMA BLOCKCHAIN-API (v2)

---

## 🧱 **FASE 0 – Objetivo y principios clave**

### 🎯 Objetivo

Desarrollar una plataforma centralizada (API en Node.js + PostgreSQL + Fabric) que:

* Registre usuarios y sistemas asociados
* Genere código cliente reutilizable para sistemas externos
* Centralice el acceso a Hyperledger Fabric
* Implemente control de acceso con roles diferenciados
* Mantenga logs detallados y separados (API y Blockchain)
* Permita gestión de chaincode desde el backend
* Sea **segura**, **auditada**, **escalable** y **mantenible**

### 🔐 Principios de seguridad a respetar:

| Propiedad          | Aplicación en el sistema                                               |
| ------------------ | ---------------------------------------------------------------------- |
| **Auditoría**      | Logs firmados, eventos de chaincode, y logs API independientes por rol |
| **Integridad**     | Datos cifrados, validados y con hash almacenado en Fabric              |
| **No repudio**     | Toda acción está firmada por identidad Fabric (o sistema tokenizado)   |
| **Disponibilidad** | Control de acceso API, rate-limiting, health-checks, Prometheus        |

---

## 🧱 FASE 1 – Diseño del Backend `Node.js`

### 📦 Módulos principales:

1. **Usuarios (con roles: admin, auditor, usuario)**
2. **Sistemas (tokenizados, asociados a usuario)**
3. **Autenticación JWT (usuarios) + Tokens seguros (sistemas)**
4. **Rate limiting y validación de carga**
5. **Logs de auditoría API**
6. **Logs de transacciones blockchain**
7. **Instalación de chaincodes por Admin (en nombre de la API)**

---

## 🧱 FASE 2 – Base de Datos

### 🔧 Motor: **PostgreSQL**

Elegido por:

* Mejor soporte de seguridad (roles, certificados, cifrado)
* JSONB nativo para extensiones
* Integración robusta con `sequelize` o `prisma`

### 📑 Tablas clave:

* `users`: { id, username, password\_hash, role, created\_at }
* `systems`: { id, name, token, user\_id, created\_at }
* `api_logs`: { id, type, source, user\_id, system\_id, action, status, timestamp }
* `blockchain_logs`: { id, txid, chaincode, payload\_hash, system\_id, timestamp }
* `chaincodes`: { id, name, path, installed\_by, version, status }

---

## 🧱 FASE 3 – API REST (Puerto 42400)

### 🔐 Seguridad:

* JWT con expiración y renovación para usuarios
* Tokens firmados para sistemas
* Middleware de rate-limit / throttling para sistemas
* Validación de payload + schema (usando Zod o Joi)
* Separación de logs por tipo de actor

### 📌 Rutas clave:

| Endpoint             | Método | Acceso        | Función                            |
| -------------------- | ------ | ------------- | ---------------------------------- |
| `/auth/login`        | POST   | Público       | Login de usuario                   |
| `/users/me`          | GET    | Autenticado   | Perfil del usuario                 |
| `/systems/register`  | POST   | Usuario/Admin | Registra nuevo sistema             |
| `/systems/token/:id` | GET    | Usuario/Admin | Genera token cliente               |
| `/proxy/client-code` | GET    | Usuario/Admin | Código cliente (FastAPI, JS, etc.) |
| `/event/store`       | POST   | Sistema       | Enviar evento cifrado              |
| `/state/store`       | POST   | Sistema       | Enviar estado global               |
| `/audit/api`         | GET    | Auditor/Admin | Ver logs API                       |
| `/audit/chaincode`   | GET    | Auditor/Admin | Ver transacciones blockchain       |
| `/chaincode/install` | POST   | Admin         | Instalar nuevo chaincode           |
| `/grafana/iframe`    | GET    | Admin         | Ver métricas integradas            |

---

## 🧱 FASE 4 – Chaincode base: `secureSystem.go`

### 🧩 Funciones:

* `StoreEvent(systemID, encryptedData)`
* `StoreState(systemID, snapshot)`
* `GetEvents(systemID)`
* `GetLastState(systemID)`

### 🔒 Seguridad:

* Validar `clientIdentity.GetID()` contra el `systemID` recibido
* Registrar `TxID`, `timestamp` y `invoker`
* Nunca descifrar información
* Solo Admin puede invocar ciertas funciones (mediante MSP/role check)

---

## 🧱 FASE 5 – Generación de código cliente (strategy pattern)

### 📦 Arquitectura:

* Una interfaz `ClientProxyGenerator` con métodos para generar clientes
* Implementaciones: `PythonFastAPIClient`, `NodeAxiosClient`, etc.
* API entrega ZIP listo para ser usado en sistemas externos

---

## 🧱 FASE 6 – Interfaz Web Admin (posterior)

### 🔍 Funcionalidades clave:

* Dashboard general con métricas Prometheus/Grafana embebido
* Ver usuarios y sistemas conectados
* Ver actividad en tiempo real
* Crear y administrar chaincodes
* Auditar logs API y Blockchain
* Generar tokens y exportar código cliente

---

# 🛡️ RECOMENDACIONES DE SEGURIDAD

### 🔐 Backend/API:

* Rate limiting agresivo para endpoints de sistemas
* Validación estricta de schema de entrada
* Uso de JWT + refresh tokens para usuarios
* Encriptación en reposo para secrets/token (PostgreSQL + AES o pgcrypto)
* Modo "audit lock" para sistemas: auditor no puede modificar nada

### 🔒 Blockchain (Fabric):

* Cada acción importante debe invocar una función de chaincode auditable
* Todos los datos deben ser cifrados antes de entrar a Fabric
* Se debe usar `clientIdentity` para trazar autoría en chaincode

### 🔍 Auditoría:

* Todos los logs de auditoría se firman o hashean
* Los logs de la blockchain pueden almacenarse en otra base adicional para consulta paralela
* Posibilidad de incluir webhook para eventos relevantes (crear sistema, chaincode, etc.)

---

## 🧠 Extras sugeridos (mediano plazo)

* Agregar compatibilidad para OAuth2.0 (para integrar con plataformas externas)
* Integración con HashiCorp Vault o AWS KMS para manejo de claves
* Control de versiones de chaincode y rollback desde el backend
* Exponer métricas Prometheus desde la propia API

