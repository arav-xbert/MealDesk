import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/authorize'

export async function dashboardRoutes(app: FastifyInstance) {
  const auth = [authenticate, requireRole('HR')]

  app.get('/stats', { preHandler: auth }, async () => {
    const activeListing = await app.db.listing.findFirst({ where: { status: 'ACTIVE' } })
    const [totalUsers, submitted] = await app.db.$transaction([
      app.db.user.count({ where: { active: true } }),
      activeListing
        ? app.db.selection.count({ where: { listingId: activeListing.id } })
        : Promise.resolve(0),
    ])
    return { totalUsers, submitted, pending: totalUsers - submitted }
  })

  app.get('/recent-submissions', { preHandler: auth }, async () => {
    const activeListing = await app.db.listing.findFirst({ where: { status: 'ACTIVE' } })
    if (!activeListing) return []

    return app.db.selection.findMany({
      where: { listingId: activeListing.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: { select: { name: true, employeeId: true } }, menuOption: { select: { name: true } } },
    })
  })

  app.get('/meal-counts', { preHandler: auth }, async () => {
    const activeListing = await app.db.listing.findFirst({ where: { status: 'ACTIVE' } })
    if (!activeListing) return []

    const counts = await app.db.selection.groupBy({
      by: ['menuOptionId'],
      where: { listingId: activeListing.id },
      _count: { menuOptionId: true },
    })

    const options = await app.db.menuOption.findMany({
      where: { id: { in: counts.map((c) => c.menuOptionId) } },
      select: { id: true, name: true },
    })

    const nameMap = Object.fromEntries(options.map((o) => [o.id, o.name]))
    return counts.map((c) => ({ menuOptionId: c.menuOptionId, name: nameMap[c.menuOptionId], count: c._count.menuOptionId }))
  })
}
