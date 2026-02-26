import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const csvPath = path.join(__dirname, 'users.csv')

  if (!fs.existsSync(csvPath)) {
    // Default seed data when no CSV provided
    const users = [
      { employeeId: 'EMP001', name: 'Alice Employee', role: 'EMPLOYEE' as const, password: 'password123' },
      { employeeId: 'HR001', name: 'Bob HR', role: 'HR' as const, password: 'password123' },
      { employeeId: 'EMP002', name: 'Charlie Employee', role: 'EMPLOYEE' as const, password: 'password123' },
      { employeeId : 'EMP003', name: 'David Employee', role: 'EMPLOYEE' as const, password: 'password123' },
      { employeeId : 'EMP004', name: 'Eve Employee', role: 'EMPLOYEE' as const, password: 'password123' },
      { employeeId : 'EMP005', name: 'Frank Employee', role: 'EMPLOYEE' as const, password: 'password123' },
      { employeeId : 'EMP006', name: 'Grace Employee', role: 'EMPLOYEE' as const, password: 'password123' },


    ]
    for (const u of users) {
      const passwordHash = await bcrypt.hash(u.password, 10)
      await prisma.user.upsert({
        where: { employeeId: u.employeeId },
        update: {},
        create: { employeeId: u.employeeId, name: u.name, role: u.role, passwordHash },
      })
    }
    console.log('Seeded default users')
  } else {

  const lines = fs.readFileSync(csvPath, 'utf-8').trim().split('\n').slice(1) // skip header
  for (const line of lines) {
    const [employeeId, name, role, password] = line.split(',').map((s) => s.trim())
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.upsert({
      where: { employeeId },
      update: {},
      create: {
        employeeId,
        name,
        role: role === 'HR' ? 'HR' : 'EMPLOYEE',
        passwordHash,
      },
    })
  }
    console.log(`Seeded ${lines.length} users from CSV`)
  }
}

async function seedDemoData() {
  const meals = [
    { name: 'Grilled Chicken Bowl', description: 'Lean grilled chicken with rice and veggies', category: 'HIGH PROTEIN' },
    { name: 'Veggie Wrap', description: 'Fresh seasonal vegetables in a whole wheat wrap', category: 'VEG' },
    { name: 'Beef Burger', description: 'Classic beef patty with lettuce and tomato', category: 'CLASSIC' },
    { name: 'Salmon Salad', description: 'Grilled salmon over mixed greens with lemon dressing', category: 'HIGH PROTEIN' },
  ]

  for (const meal of meals) {
    const exists = await prisma.menuOption.findFirst({ where: { name: meal.name } })
    if (!exists) await prisma.menuOption.create({ data: meal })
  }
  console.log('Seeded demo menu options')

  const activeListing = await prisma.listing.findFirst({ where: { status: 'ACTIVE' } })
  if (!activeListing) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await prisma.listing.create({
      data: {
        title: "Today's Lunch",
        date: today,
        startTime: new Date('1970-01-01T09:00:00Z'),
        endTime: new Date('1970-01-01T11:00:00Z'),
        status: 'ACTIVE',
      },
    })
    console.log('Seeded demo active listing')
  }
}

main()
  .then(() => seedDemoData())
  .catch(console.error)
  .finally(() => prisma.$disconnect())
