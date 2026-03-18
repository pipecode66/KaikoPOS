import {
  AuditAction,
  CashMovementType,
  KitchenTicketStatus,
  OrderStatus,
  OrderType,
  PrismaClient,
  RoleCode,
  StockMovementType,
  TableStatus,
  UnitOfMeasure
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.kitchenTicket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cashMovement.deleteMany();
  await prisma.cashRegister.deleteMany();
  await prisma.ingredientStockMovement.deleteMany();
  await prisma.productRecipe.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.user.deleteMany();

  const permissions: Array<[string, string]> = [
    ["dashboard:view", "View dashboard"],
    ["orders:manage", "Manage orders"],
    ["tables:manage", "Manage dining tables"],
    ["kitchen:view", "Access kitchen display"],
    ["cash_registers:manage", "Manage cash register"],
    ["products:manage", "Manage products"],
    ["inventory:manage", "Manage inventory"],
    ["reports:view", "View reports"],
    ["users:manage", "Manage users"]
  ];

  const createdPermissions = await Promise.all(
    permissions.map(([code, name]) =>
      prisma.permission.create({
        data: {
          code,
          name
        }
      })
    )
  );

  const permissionMap = new Map(createdPermissions.map((permission) => [permission.code, permission.id]));
  const getPermissionId = (code: string) => {
    const permissionId = permissionMap.get(code);
    if (!permissionId) {
      throw new Error(`Missing permission ${code}`);
    }
    return permissionId;
  };

  const roleDefinitions: Array<{
    code: RoleCode;
    name: string;
    description: string;
    permissions: string[];
  }> = [
    {
      code: RoleCode.ADMIN,
      name: "Administrador",
      description: "Control total del sistema",
      permissions: permissions.map(([code]) => code)
    },
    {
      code: RoleCode.CASHIER,
      name: "Cajero",
      description: "Caja, ventas y cierres",
      permissions: ["dashboard:view", "orders:manage", "cash_registers:manage", "reports:view"]
    },
    {
      code: RoleCode.WAITER,
      name: "Mesero",
      description: "Mesas y pedidos",
      permissions: ["dashboard:view", "orders:manage", "tables:manage"]
    },
    {
      code: RoleCode.KITCHEN,
      name: "Cocina",
      description: "Pantalla de cocina",
      permissions: ["kitchen:view"]
    }
  ];

  const roles = await Promise.all(
    roleDefinitions.map((definition) =>
      prisma.role.create({
        data: {
          code: definition.code,
          name: definition.name,
          description: definition.description,
          permissions: {
            create: definition.permissions.map((permissionCode) => ({
              permission: {
                connect: {
                  id: getPermissionId(permissionCode)
                }
              }
            }))
          }
        }
      })
    )
  );

  const roleMap = new Map(roles.map((role) => [role.code, role.id]));
  const getRoleId = (code: RoleCode) => {
    const roleId = roleMap.get(code);
    if (!roleId) {
      throw new Error(`Missing role ${code}`);
    }
    return roleId;
  };
  const passwordHash = await bcrypt.hash("Demo1234!", 10);

  const [adminUser, cashierUser, waiterUser, kitchenUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@sandeli.local",
        passwordHash,
        firstName: "Sara",
        lastName: "Mendoza",
        displayName: "Sara Admin",
        roles: {
          create: {
            roleId: getRoleId(RoleCode.ADMIN)
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: "caja@sandeli.local",
        passwordHash,
        firstName: "Carlos",
        lastName: "Rojas",
        displayName: "Carlos Caja",
        roles: {
          create: {
            roleId: getRoleId(RoleCode.CASHIER)
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: "mesa@sandeli.local",
        passwordHash,
        firstName: "Laura",
        lastName: "Paz",
        displayName: "Laura Mesas",
        roles: {
          create: {
            roleId: getRoleId(RoleCode.WAITER)
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: "kds@sandeli.local",
        passwordHash,
        firstName: "Mateo",
        lastName: "Chef",
        displayName: "Mateo Cocina",
        roles: {
          create: {
            roleId: getRoleId(RoleCode.KITCHEN)
          }
        }
      }
    })
  ]);

  const beverages = await prisma.category.create({
    data: {
      name: "Bebidas",
      sortOrder: 1
    }
  });

  const bakery = await prisma.category.create({
    data: {
      name: "Panaderia",
      sortOrder: 2
    }
  });

  const kitchen = await prisma.category.create({
    data: {
      name: "Cocina",
      sortOrder: 3
    }
  });

  const [espresso, cappuccino, croissant, turkeySandwich, icedTea] = await Promise.all([
    prisma.product.create({
      data: {
        sku: "BEB-001",
        name: "Espresso Doble",
        price: 7000,
        estimatedCost: 2100,
        categoryId: beverages.id
      }
    }),
    prisma.product.create({
      data: {
        sku: "BEB-002",
        name: "Capuccino Vainilla",
        price: 12500,
        estimatedCost: 3900,
        categoryId: beverages.id
      }
    }),
    prisma.product.create({
      data: {
        sku: "PAN-001",
        name: "Croissant Mantequilla",
        price: 8500,
        estimatedCost: 2800,
        categoryId: bakery.id
      }
    }),
    prisma.product.create({
      data: {
        sku: "COC-001",
        name: "Sandwich Pavo Brie",
        price: 21500,
        estimatedCost: 9300,
        categoryId: kitchen.id
      }
    }),
    prisma.product.create({
      data: {
        sku: "BEB-003",
        name: "Te Helado Limon",
        price: 9000,
        estimatedCost: 2600,
        categoryId: beverages.id
      }
    })
  ]);

  const [coffeeBeans, milk, vanillaSyrup, croissantDough, turkeySlices, brieCheese, countryBread, lemonMix] =
    await Promise.all([
      prisma.ingredient.create({
        data: {
          sku: "ING-001",
          name: "Cafe en grano",
          unit: UnitOfMeasure.GRAM,
          currentStock: 4500,
          minimumStock: 1200,
          costPerUnit: 12
        }
      }),
      prisma.ingredient.create({
        data: {
          sku: "ING-002",
          name: "Leche entera",
          unit: UnitOfMeasure.MILLILITER,
          currentStock: 18000,
          minimumStock: 5000,
          costPerUnit: 0.008
        }
      }),
      prisma.ingredient.create({
        data: {
          sku: "ING-003",
          name: "Sirope vainilla",
          unit: UnitOfMeasure.MILLILITER,
          currentStock: 2500,
          minimumStock: 400,
          costPerUnit: 0.02
        }
      }),
      prisma.ingredient.create({
        data: {
          sku: "ING-004",
          name: "Masa croissant",
          unit: UnitOfMeasure.PORTION,
          currentStock: 48,
          minimumStock: 12,
          costPerUnit: 2200
        }
      }),
      prisma.ingredient.create({
        data: {
          sku: "ING-005",
          name: "Pavo ahumado",
          unit: UnitOfMeasure.GRAM,
          currentStock: 6000,
          minimumStock: 1000,
          costPerUnit: 0.02
        }
      }),
      prisma.ingredient.create({
        data: {
          sku: "ING-006",
          name: "Queso brie",
          unit: UnitOfMeasure.GRAM,
          currentStock: 3200,
          minimumStock: 700,
          costPerUnit: 0.03
        }
      }),
      prisma.ingredient.create({
        data: {
          sku: "ING-007",
          name: "Pan campesino",
          unit: UnitOfMeasure.PORTION,
          currentStock: 36,
          minimumStock: 10,
          costPerUnit: 1800
        }
      }),
      prisma.ingredient.create({
        data: {
          sku: "ING-008",
          name: "Base te limon",
          unit: UnitOfMeasure.MILLILITER,
          currentStock: 9000,
          minimumStock: 1500,
          costPerUnit: 0.01
        }
      })
    ]);

  const recipeEntries = [
    { productId: espresso.id, ingredientId: coffeeBeans.id, quantity: 18 },
    { productId: cappuccino.id, ingredientId: coffeeBeans.id, quantity: 16 },
    { productId: cappuccino.id, ingredientId: milk.id, quantity: 180 },
    { productId: cappuccino.id, ingredientId: vanillaSyrup.id, quantity: 20 },
    { productId: croissant.id, ingredientId: croissantDough.id, quantity: 1 },
    { productId: turkeySandwich.id, ingredientId: turkeySlices.id, quantity: 120 },
    { productId: turkeySandwich.id, ingredientId: brieCheese.id, quantity: 60 },
    { productId: turkeySandwich.id, ingredientId: countryBread.id, quantity: 2 },
    { productId: icedTea.id, ingredientId: lemonMix.id, quantity: 350 }
  ];

  await prisma.productRecipe.createMany({
    data: recipeEntries
  });

  await prisma.ingredientStockMovement.createMany({
    data: [
      {
        ingredientId: coffeeBeans.id,
        type: StockMovementType.PURCHASE,
        quantity: 4500,
        balanceAfter: 4500,
        referenceType: "SEED",
        note: "Carga inicial"
      },
      {
        ingredientId: milk.id,
        type: StockMovementType.PURCHASE,
        quantity: 18000,
        balanceAfter: 18000,
        referenceType: "SEED",
        note: "Carga inicial"
      },
      {
        ingredientId: turkeySlices.id,
        type: StockMovementType.PURCHASE,
        quantity: 6000,
        balanceAfter: 6000,
        referenceType: "SEED",
        note: "Carga inicial"
      }
    ]
  });

  const tables = await prisma.$transaction([
    prisma.diningTable.create({ data: { name: "Mesa 1", area: "Salon", seats: 4, status: TableStatus.OCCUPIED } }),
    prisma.diningTable.create({ data: { name: "Mesa 2", area: "Salon", seats: 2, status: TableStatus.AVAILABLE } }),
    prisma.diningTable.create({ data: { name: "Mesa 3", area: "Terraza", seats: 2, status: TableStatus.PENDING_PAYMENT } }),
    prisma.diningTable.create({ data: { name: "Barra 1", area: "Barra", seats: 1, status: TableStatus.AVAILABLE } })
  ]);

  const register = await prisma.cashRegister.create({
    data: {
      label: "Caja Principal",
      openingAmount: 250000,
      expectedAmount: 250000,
      openedById: cashierUser.id,
      cashMovements: {
        create: {
          createdById: cashierUser.id,
          type: CashMovementType.OPENING,
          amount: 250000,
          reason: "Apertura de turno"
        }
      }
    }
  });

  const order1 = await prisma.order.create({
    data: {
      orderNumber: "POS-1001",
      type: OrderType.TABLE,
      status: OrderStatus.IN_PREPARATION,
      tableId: tables[0].id,
      registerId: register.id,
      placedById: waiterUser.id,
      subtotal: 34000,
      totalAmount: 34000,
      submittedAt: new Date(),
      items: {
        create: [
          {
            productId: cappuccino.id,
            quantity: 1,
            unitPrice: 12500,
            lineTotal: 12500,
            notes: "Leche deslactosada"
          },
          {
            productId: turkeySandwich.id,
            quantity: 1,
            unitPrice: 21500,
            lineTotal: 21500,
            notes: "Sin mostaza"
          }
        ]
      },
      kitchenTicket: {
        create: {
          status: KitchenTicketStatus.PREPARING
        }
      }
    }
  });

  await prisma.order.create({
    data: {
      orderNumber: "POS-1002",
      type: OrderType.TABLE,
      status: OrderStatus.READY,
      tableId: tables[2].id,
      registerId: register.id,
      placedById: waiterUser.id,
      subtotal: 15500,
      totalAmount: 15500,
      submittedAt: new Date(),
      items: {
        create: [
          {
            productId: espresso.id,
            quantity: 1,
            unitPrice: 7000,
            lineTotal: 7000
          },
          {
            productId: croissant.id,
            quantity: 1,
            unitPrice: 8500,
            lineTotal: 8500
          }
        ]
      },
      kitchenTicket: {
        create: {
          status: KitchenTicketStatus.READY
        }
      }
    }
  });

  await prisma.auditLog.createMany({
    data: [
      {
        action: AuditAction.OPEN_REGISTER,
        entityType: "cash_register",
        entityId: register.id,
        performedById: cashierUser.id
      },
      {
        action: AuditAction.CREATE_ORDER,
        entityType: "order",
        entityId: order1.id,
        performedById: waiterUser.id
      }
    ]
  });

  console.log("Seed completed");
  console.table([
    { user: adminUser.email, password: "Demo1234!" },
    { user: cashierUser.email, password: "Demo1234!" },
    { user: waiterUser.email, password: "Demo1234!" },
    { user: kitchenUser.email, password: "Demo1234!" }
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
