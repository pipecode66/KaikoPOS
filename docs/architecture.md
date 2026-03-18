# Architecture

## 1. System Overview

The workspace is split into two apps to keep the MVP modular without introducing heavy monorepo complexity:

- `apps/api`: operational backend responsible for authentication, authorization, transactions, persistence, reporting, and kitchen real-time events.
- `apps/web`: responsive operator UI optimized for desktop and tablet, with a touch-friendly POS workstation and admin navigation.

The core workflow covered by the foundation is:

`login -> open cash register -> create order -> send kitchen ticket -> receive payment -> deduct inventory -> query reports -> close cash register`

## 2. Architectural Principles

- MVP first: no multi-tenant or event-bus complexity yet.
- Transactional core: sales, payments, stock deduction, and register totals are handled in the backend.
- Query-driven reporting: reports are derived from orders, payments, and cash movements.
- Fast UX over decorative UI: large controls, low visual noise, shallow navigation.
- Scalable seams: role model, recipe model, WebSocket gateway, and branch-ready entities can grow later.

## 3. Backend Structure

```text
apps/api
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
└─ src/
   ├─ app.module.ts
   ├─ common/
   ├─ config/
   ├─ prisma/
   └─ modules/
      ├─ audit/
      ├─ auth/
      ├─ users/
      ├─ catalog/
      ├─ inventory/
      ├─ tables/
      ├─ orders/
      ├─ kitchen/
      ├─ cash-registers/
      └─ reports/
```

### Backend module intent

- `auth`: JWT login, strategy, public login route.
- `users`: user CRUD, role assignment, activation/deactivation.
- `catalog`: categories, products, availability, recipe references.
- `inventory`: ingredients, stock adjustments, low-stock alerts, movement history.
- `tables`: visual state support and table-to-table order moves.
- `orders`: create/update/submit/split/merge/settle orders.
- `kitchen`: KDS queries, status updates, Socket.IO gateway.
- `cash-registers`: open register, manual movements, reconciliation, close shift.
- `reports`: daily summary, payment methods, best sellers, cash movement reports.
- `audit`: centralized audit log writing.

## 4. Frontend Structure

```text
apps/web
├─ app/
│  ├─ (auth)/login
│  └─ (dashboard)/
│     ├─ dashboard
│     ├─ pos
│     ├─ tables
│     ├─ kitchen
│     ├─ cash-register
│     ├─ products
│     ├─ inventory
│     ├─ reports
│     └─ users
└─ src/
   ├─ components/
   │  ├─ layout/
   │  ├─ ui/
   │  ├─ dashboard/
   │  ├─ pos/
   │  ├─ tables/
   │  └─ kitchen/
   ├─ lib/
   │  ├─ format.ts
   │  ├─ mock-data.ts
   │  ├─ types.ts
   │  └─ store/use-pos-store.ts
   └─ providers/
```

### UI system decisions

- Left sidebar + top header for admin areas.
- Tokens in CSS variables so branding can be swapped later.
- Card-based surfaces with soft shadows and 16px-ish radii.
- Zustand for high-speed cart state.
- React Query provider included for API integration without refactoring the tree later.

## 5. Data Model

The Prisma schema is normalized and centered on transactional entities:

- Security: `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `audit_logs`
- Sales & cash: `cash_registers`, `cash_movements`, `orders`, `order_items`, `payments`
- Catalog & stock: `categories`, `products`, `product_recipes`, `ingredients`, `ingredient_stock_movements`
- Floor & kitchen: `tables`, `kitchen_tickets`

### Key modeling notes

- Products do not store stock directly; ingredients do.
- Recipes (`product_recipes`) enable stock deduction on sale completion.
- Mixed payments are modeled as multiple `payments` rows rather than a special summary record.
- Reports stay query-based from orders, payments, and cash movement tables.
- `orders.parent_order_id` supports split lineage without extra tables.

## 6. Core API Endpoints

### Authentication

- `POST /api/auth/login`

### Users

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `PATCH /api/users/:id/active`

### Catalog

- `GET /api/catalog/categories`
- `POST /api/catalog/categories`
- `GET /api/catalog/products`
- `POST /api/catalog/products`
- `PATCH /api/catalog/products/:id`
- `PATCH /api/catalog/products/:id/availability`

### Inventory

- `GET /api/inventory/ingredients`
- `POST /api/inventory/ingredients`
- `POST /api/inventory/ingredients/:id/adjustments`
- `GET /api/inventory/low-stock`
- `GET /api/inventory/movements`

### Tables

- `GET /api/tables`
- `PATCH /api/tables/:id/status`
- `POST /api/tables/move-order`

### Orders

- `GET /api/orders/active`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PATCH /api/orders/:id/items`
- `POST /api/orders/:id/submit`
- `POST /api/orders/:id/settle`
- `POST /api/orders/:id/split`
- `POST /api/orders/merge`

### Kitchen

- `GET /api/kitchen/tickets`
- `PATCH /api/kitchen/orders/:orderId/status`

### Cash Registers

- `GET /api/cash-registers/active`
- `POST /api/cash-registers/open`
- `POST /api/cash-registers/:id/movements`
- `POST /api/cash-registers/:id/close`
- `GET /api/cash-registers/:id/summary`

### Reports

- `GET /api/reports/daily-summary`
- `GET /api/reports/payment-methods`
- `GET /api/reports/best-sellers`
- `GET /api/reports/cash-movements`

## 7. Assumptions Made

- One restaurant branch for the MVP.
- One open register per station label.
- Reports are generated from live transactional data.
- Taxes and discounts are order-level values, not per-line tax rules yet.
- Mixed payment means multiple payment rows.
- The frontend is a polished shell with aligned mock data until API wiring is completed screen by screen.

## 8. Future Modules

### Loyalty program

- Add `customers`, `loyalty_accounts`, `points_ledger`, and promotion rules.
- Hook into payment completion to accrue points.
- Expose redemption at checkout without changing the order core.

### WhatsApp integration

- Add outbound message service and webhook module.
- Reuse order lifecycle events for ticket-ready and delivery updates.
- Store channel message logs tied to order/customer records.

### Electronic invoicing

- Add `invoices`, `invoice_lines`, tax configuration, and provider adapters.
- Generate invoices from paid orders after validation.
- Keep invoice generation asynchronous so POS flow stays fast.

### Multi-branch

- Add `branches` and branch foreign keys to transactional entities.
- Scope auth, registers, inventory, and reporting by branch.
- Keep shared catalog optional with branch-level overrides.

### Marketplace / QR ordering

- Add `channels`, `customer_sessions`, and public menu publishing.
- Reuse the same `orders` and `payments` core with a different entry point.
- Kitchen and reporting modules remain mostly unchanged.
