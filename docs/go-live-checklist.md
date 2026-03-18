# Go-Live Checklist

## Ya resuelto

- Frontend desplegado en Vercel.
- Backend NestJS desplegado en Render.
- Base PostgreSQL conectable por `DATABASE_URL`.
- Login web conectado al backend real por `POST /api/auth/login`.
- Sesion del frontend guardada por cookies seguras desde Next.js.

## Aun falta para operar sin mocks

### 1. Reemplazar mock data por consumo real del API

- Conectar `dashboard`, `pos`, `tables`, `kitchen`, `cash-register`, `products`, `inventory`, `reports` y `users` al backend.
- Crear una capa unica de fetchers y mutations con React Query.
- Unificar estados de `loading`, `error`, `empty` y `retry`.

### 2. Cerrar el flujo completo de venta en frontend

- Abrir caja usando `cash-registers`.
- Crear orden real usando `orders`.
- Enviar ticket a cocina.
- Registrar pago.
- Refrescar estado de mesa.
- Reflejar cierre de orden en dashboard y reportes.

### 3. Activar tiempo real

- Conectar Socket.IO desde el frontend a `NEXT_PUBLIC_SOCKET_URL`.
- Escuchar namespace `/kitchen`.
- Actualizar KDS, mesas y alertas sin refresco manual.

### 4. Inventario y recetas en produccion

- Consumir ingredientes, productos y recetas desde Prisma.
- Descontar inventario al completar una venta.
- Mostrar alertas de stock bajo con datos reales.
- Registrar movimientos de inventario desde UI.

### 5. Seguridad operativa

- Proteger pantallas y acciones segun rol real.
- Manejar expiracion de token y cierre de sesion.
- Agregar rotacion de password inicial del administrador.
- Registrar auditoria visualizable desde frontend.

### 6. Persistencia y despliegue estable

- Ejecutar `prisma migrate deploy` en produccion.
- Correr seed inicial solo si la sucursal esta vacia.
- Definir backups y restauracion para Neon/Postgres.
- Configurar dominios finales y CORS explicito entre Vercel y Render.

### 7. Operacion de restaurante real

- Integrar impresion de comanda y recibo.
- Agregar selector real de mesa, comensales y operador.
- Registrar aperturas, cierres y arqueos por turno.
- Crear validaciones para pagos mixtos y anulaciones.

### 8. Calidad minima antes de abrir

- Pruebas E2E de login, apertura de caja, venta, cocina y cierre.
- Logs y monitoreo del backend.
- Health check publico y alarmas de caida.
- Revision de UX en tablet y escritorio con operadores reales.

## Orden sugerido de implementacion

1. Auth real y sesion web.
2. Catalogo + mesas + ordenes reales.
3. KDS por sockets.
4. Caja y pagos.
5. Inventario automatico.
6. Reportes reales.
7. Impresion y hardware.
