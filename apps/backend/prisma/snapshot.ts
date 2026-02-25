/**
 * Run with: pnpm db:snapshot
 * Reads the current database state and writes prisma/seed.snapshot.ts
 * which you can use as a seed by copying it over seed.ts.
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const [users, menuOptions, listings] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.menuOption.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.listing.findMany({ orderBy: { createdAt: 'asc' } }),
  ])

  const lines: string[] = [
    `// Auto-generated snapshot — ${new Date().toISOString()}`,
    `// Run this file as your seed: copy to prisma/seed.ts then run pnpm db:seed`,
    `import { PrismaClient } from '@prisma/client'`,
    ``,
    `const prisma = new PrismaClient()`,
    ``,
    `async function main() {`,
  ]

  // Users (store hash directly — no re-hashing needed)
  lines.push(`  // Users (${users.length})`)
  for (const u of users) {
    lines.push(`  await prisma.user.upsert({`)
    lines.push(`    where: { employeeId: ${JSON.stringify(u.employeeId)} },`)
    lines.push(`    update: {},`)
    lines.push(`    create: {`)
    lines.push(`      employeeId: ${JSON.stringify(u.employeeId)},`)
    lines.push(`      name: ${JSON.stringify(u.name)},`)
    lines.push(`      role: ${JSON.stringify(u.role)},`)
    lines.push(`      passwordHash: ${JSON.stringify(u.passwordHash)},`)
    lines.push(`      active: ${u.active},`)
    lines.push(`    },`)
    lines.push(`  })`)
  }
  lines.push(``)

  // MenuOptions
  lines.push(`  // Menu options (${menuOptions.length})`)
  for (const m of menuOptions) {
    lines.push(`  await prisma.menuOption.upsert({`)
    lines.push(`    where: { id: ${JSON.stringify(m.id)} },`)
    lines.push(`    update: {},`)
    lines.push(`    create: {`)
    lines.push(`      id: ${JSON.stringify(m.id)},`)
    lines.push(`      name: ${JSON.stringify(m.name)},`)
    lines.push(`      description: ${JSON.stringify(m.description)},`)
    lines.push(`      imageUrl: ${JSON.stringify(m.imageUrl)},`)
    lines.push(`      category: ${JSON.stringify(m.category)},`)
    lines.push(`      active: ${m.active},`)
    lines.push(`    },`)
    lines.push(`  })`)
  }
  lines.push(``)

  // Listings
  lines.push(`  // Listings (${listings.length})`)
  for (const l of listings) {
    lines.push(`  await prisma.listing.upsert({`)
    lines.push(`    where: { id: ${JSON.stringify(l.id)} },`)
    lines.push(`    update: {},`)
    lines.push(`    create: {`)
    lines.push(`      id: ${JSON.stringify(l.id)},`)
    lines.push(`      title: ${JSON.stringify(l.title)},`)
    lines.push(`      date: new Date(${JSON.stringify(l.date.toISOString())}),`)
    lines.push(`      startTime: new Date(${JSON.stringify(l.startTime.toISOString())}),`)
    lines.push(`      endTime: new Date(${JSON.stringify(l.endTime.toISOString())}),`)
    lines.push(`      status: ${JSON.stringify(l.status)},`)
    lines.push(`    },`)
    lines.push(`  })`)
  }

  lines.push(`}`)
  lines.push(``)
  lines.push(`main().catch(console.error).finally(() => prisma.$disconnect())`)
  lines.push(``)

  const outPath = path.join(__dirname, 'seed.snapshot.ts')
  fs.writeFileSync(outPath, lines.join('\n'))
  console.log(`Snapshot written to prisma/seed.snapshot.ts`)
  console.log(`  ${users.length} users, ${menuOptions.length} menu options, ${listings.length} listings`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
