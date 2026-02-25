// Auto-generated snapshot — 2026-02-25T10:49:17.691Z
// Run this file as your seed: copy to prisma/seed.ts then run pnpm db:seed
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Users (7)
  await prisma.user.upsert({
    where: { employeeId: "EMP001" },
    update: {},
    create: {
      employeeId: "EMP001",
      name: "Alice Employee",
      role: "EMPLOYEE",
      passwordHash: "$2b$10$xILM/yv3KZX7ZPluWP1VxO0aJC2TyRQXS9svsr34yuFyloz8sltui",
      active: true,
    },
  })
  await prisma.user.upsert({
    where: { employeeId: "HR001" },
    update: {},
    create: {
      employeeId: "HR001",
      name: "Bob HR",
      role: "HR",
      passwordHash: "$2b$10$4de5b/Knz8Gfjlch/QKChOnJBFLAANtXaK3CvpHDwwZ3Ekn6Y/U82",
      active: true,
    },
  })
  await prisma.user.upsert({
    where: { employeeId: "EMP002" },
    update: {},
    create: {
      employeeId: "EMP002",
      name: "Charlie Employee",
      role: "EMPLOYEE",
      passwordHash: "$2b$10$F0zywP0GydDnw/DXzS.Xx.jsIRpgcRSq/j1BNlBrVMZjykAofpWha",
      active: true,
    },
  })
  await prisma.user.upsert({
    where: { employeeId: "EMP003" },
    update: {},
    create: {
      employeeId: "EMP003",
      name: "David Employee",
      role: "EMPLOYEE",
      passwordHash: "$2b$10$5sWDZ2hHbxjBg6Yf1FdDB.YJGjZM6v.eW9cdXIwLd3593Pm5cENoq",
      active: true,
    },
  })
  await prisma.user.upsert({
    where: { employeeId: "EMP004" },
    update: {},
    create: {
      employeeId: "EMP004",
      name: "Eve Employee",
      role: "EMPLOYEE",
      passwordHash: "$2b$10$3Z.NGIoIQJy3B0LiWj7ZbeJDC0ZXdPNqVskGB4jLUSpOM8.l/hr0K",
      active: true,
    },
  })
  await prisma.user.upsert({
    where: { employeeId: "EMP005" },
    update: {},
    create: {
      employeeId: "EMP005",
      name: "Frank Employee",
      role: "EMPLOYEE",
      passwordHash: "$2b$10$aGGdSpwjUQatxAf1XptAJO8eCampP12uycw.2Ot70g0tfMXIRFQA2",
      active: true,
    },
  })
  await prisma.user.upsert({
    where: { employeeId: "EMP006" },
    update: {},
    create: {
      employeeId: "EMP006",
      name: "Grace Employee",
      role: "EMPLOYEE",
      passwordHash: "$2b$10$5HmxTxFu1Y1hBUzbxEgPKO6mDTQnfSBL4fzWJ/GBUPCGivfqc13vy",
      active: true,
    },
  })

  // Menu options (6)
  await prisma.menuOption.upsert({
    where: { id: "cmm1v75og0002xyyo1g4k0vv7" },
    update: {},
    create: {
      id: "cmm1v75og0002xyyo1g4k0vv7",
      name: "Grilled Chicken Bowl",
      description: "Lean grilled chicken with rice and veggies",
      imageUrl: "/uploads/71981e8d-2f40-4e99-a087-f090492e1f99.jpg",
      category: "HIGH PROTEIN",
      active: true,
    },
  })
  await prisma.menuOption.upsert({
    where: { id: "cmm1v75vb0003xyyoxij34534" },
    update: {},
    create: {
      id: "cmm1v75vb0003xyyoxij34534",
      name: "Veggie Wrap",
      description: "Fresh seasonal vegetables in a whole wheat wrap",
      imageUrl: "/uploads/c11909af-57a6-47b3-bf2e-cf577e5a8c7b.jpg",
      category: "VEG",
      active: true,
    },
  })
  await prisma.menuOption.upsert({
    where: { id: "cmm1v75yt0004xyyog2ztbc5o" },
    update: {},
    create: {
      id: "cmm1v75yt0004xyyog2ztbc5o",
      name: "Beef Burger",
      description: "Classic beef patty with lettuce and tomato",
      imageUrl: "/uploads/26a5d534-3859-4410-9499-17955c734668.png",
      category: "CLASSIC",
      active: true,
    },
  })
  await prisma.menuOption.upsert({
    where: { id: "cmm1v762d0005xyyokkq0h808" },
    update: {},
    create: {
      id: "cmm1v762d0005xyyokkq0h808",
      name: "Salmon Salad",
      description: "Grilled salmon over mixed greens with lemon dressing",
      imageUrl: "/uploads/24dee159-4e8a-4cf4-a852-baefc23a8c0b.png",
      category: "HIGH PROTEIN",
      active: true,
    },
  })
  await prisma.menuOption.upsert({
    where: { id: "cmm1wbt6z0000sez556evmx2f" },
    update: {},
    create: {
      id: "cmm1wbt6z0000sez556evmx2f",
      name: "Test",
      description: "test",
      imageUrl: "/uploads/f9b3db85-8e6e-41a0-9caa-519029831830.png",
      category: "TEST",
      active: true,
    },
  })
  await prisma.menuOption.upsert({
    where: { id: "cmm1wqmiz0000secj4tfxv1z5" },
    update: {},
    create: {
      id: "cmm1wqmiz0000secj4tfxv1z5",
      name: "Wow",
      description: "wow",
      imageUrl: "/uploads/877d4f08-ea8d-4261-8d15-907f0ddd40ac.png",
      category: "WOW",
      active: true,
    },
  })

  // Listings (1)
  await prisma.listing.upsert({
    where: { id: "cmm1v76a00006xyyo9v6b378q" },
    update: {},
    create: {
      id: "cmm1v76a00006xyyo9v6b378q",
      title: "Today's Lunch",
      date: new Date("2026-02-24T00:00:00.000Z"),
      startTime: new Date("1970-01-01T09:00:00.000Z"),
      endTime: new Date("1970-01-01T11:00:00.000Z"),
      status: "ACTIVE",
    },
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
