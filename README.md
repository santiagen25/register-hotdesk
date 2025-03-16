# Gestion de Espacios - Arquitectura Hexagonal con DDD

Este proyecto implementa la gestión de espacios de trabajo mediante arquitectura hexagonal y siguiendo los principios de Domain-Driven Design (DDD). 

## Arquitectura del Proyecto

La solución la he organizado en tres capas principales:

- **Domain (Core del Negocio)**  
  Es donde he hecho las entidades, sus reglas de negocio y la lógica.

- **Application (Casos de Uso)**  
  Implemento los casos de uso a través de Command Handlers, gestionando la interacción con los repositorios y aplicando validaciones.

- **Infrastructure (Adaptadores de Entrada y Salida)**  
  Aqui he puesto los controladores HTTP que exponen los casos de uso, y los repositorios en memoria.

---

## Casos de Uso Implementados

### 1️. **Registrar un HotDesk** (`RegisterHotDeskUseCase`)
   - Recibe un número (`number`) y lo almacena si es valido y único.

### 2️. **Registrar una Sala de Reunión** (`RegisterMeetingRoomUseCase`)
   - Permite registrar salas con un `name` y `capacity`, evitando duplicados.

### 3️. **Registrar una Oficina** (`RegisterOfficeUseCase`)
   - Registra oficinas con `number`, `leasePeriod` y `status` inicial.

### 4️. **Reservar una Sala de Reunión** (`ReserveMeetingRoomUseCase`)
   - Gestiona la disponibilidad de salas y evita solapamientos de reservas.

### 5️. **Reservar un HotDesk** (`ReserveHotDeskUseCase`)
   - Verifica si el usuario ya tiene una reserva y consulta Memberships para comprobar si está cubierta por su membresía.

---

## **Decisiones de Diseño**
- **Arquitectura Hexagonal:** Separación clara entre dominio, aplicación e infraestructura.
- **Aplicacion de DDD Táctico:** Uso de entidades, repositorios y servicios de dominio.
- **Flexibilidad y Escalabilidad:** Posibilidad de intercambiar bases de datos sin modificar la lógica central.
- **Simulación de Microservicios:** `MembershipsService` representa una consulta a un bounded context externo.

---

## **Archivo memberships.service**
   Este archivo simula un servicio externo que devuelve información sobre la membresia de un usuario. Este servicio se usa en el caso de uso ReserveHotDeskUseCase, donde se necesita saber si la reserva de un HotDesk está cubierta por una membresía ya pagada.

---

## **Ejecucion**
### 1. Instalar Dependencias
npm install

### 2. Levantar servidor
npm run start

### 3. Ejecutar tests
npm run test

### 4. Probar endpoints (Linux)
- **HotDesk**
   curl -X POST http://localhost:3000/hotdesk \
     -H "Content-Type: application/json" \
     -d '{"number": 10}'

- **Meeting-Room**
   curl -X POST http://localhost:3000/meeting-room \
     -H "Content-Type: application/json" \
     -d '{"name": "Sala A", "capacity": 10}'

- **Office**
   curl -X POST http://localhost:3000/office \
     -H "Content-Type: application/json" \
     -d '{"number": 101, "leasePeriod": 24, "status": "Active"}'

- **Reservation** (Es necesario ejecutar Meeting-Room para que pueda haber una reserva)
   curl -X POST http://localhost:3000/reservation \
     -H "Content-Type: application/json" \
     -d '{"meetingRoomId": "Sala A", "userId": "123e4567-e89b-12d3-a456-426614174000", "date": "2025-02-20", "hour": 10, "duration": 2}'

- **HotDesk-Reservation**
   curl -X POST http://localhost:3000/hotdesk-reservation \
     -H "Content-Type: application/json" \
     -d '{"userId": "123e4567-e89b-12d3-a456-426614174000", "date": "2025-02-20"}'

- **Create-Membership**
   curl -X POST http://localhost:3000/membership -H "Content-Type: application/json" -d '{"userId": "user-123"}'

- **Register-Package**
   curl -X POST http://localhost:3000/membership/package -H "Content-Type: application/json" -d '{"membershipId": "membership-123", "credits": 10, "year": 2025, "month": 5}'

- **8**

