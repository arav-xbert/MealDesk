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
    return
  }

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

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
