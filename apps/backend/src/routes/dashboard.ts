import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/authorize'

export async function dashboardRoutes(app: FastifyInstance) {
  const auth = [authenticate, requireRole('HR')]

  app.get('/stats', {
    preHandler: auth,
    schema: {
      tags: ['Dashboard'],
      summary: 'Get submission statistics for the active listing',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            totalUsers: { type: 'integer' },
            submitted: { type: 'integer' },
            pending: { type: 'integer' },
          },
        },
      },
    },
  }, async () => {
    const activeListing = await app.db.listing.findFirst({ where: { status: 'ACTIVE' } })
    const totalUsers = await app.db.user.count({ where: { active: true } })
    const submitted = activeListing
      ? await app.db.selection.count({ where: { listingId: activeListing.id } })
      : 0
    return { totalUsers, submitted, pending: totalUsers - submitted }
  })

  app.get('/recent-submissions', {
    preHandler: auth,
    schema: {
      tags: ['Dashboard'],
      summary: 'Get last 20 submissions for the active listing',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              createdAt: { type: 'string' },
              user: { type: 'object', properties: { name: { type: 'string' }, employeeId: { type: 'string' } } },
              menuOption: { type: 'object', properties: { name: { type: 'string' } } },
            },
          },
        },
      },
    },
  }, async () => {
    const activeListing = await app.db.listing.findFirst({ where: { status: 'ACTIVE' } })
    if (!activeListing) return []

    return app.db.selection.findMany({
      where: { listingId: activeListing.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: { select: { name: true, employeeId: true } }, menuOption: { select: { name: true } } },
    })
  })

  app.get('/meal-counts', {
    preHandler: auth,
    schema: {
      tags: ['Dashboard'],
      summary: 'Get selection counts grouped by menu option for the active listing',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              menuOptionId: { type: 'string' },
              name: { type: 'string' },
              imageUrl: { type: 'string', nullable: true },
              count: { type: 'integer' },
            },
          },
        },
      },
    },
  }, async () => {
    const activeListing = await app.db.listing.findFirst({ where: { status: 'ACTIVE' } })
    if (!activeListing) return []

    const counts = await app.db.selection.groupBy({
      by: ['menuOptionId'],
      where: { listingId: activeListing.id },
      _count: { menuOptionId: true },
      orderBy: { _count: { menuOptionId: 'desc' } },
    })

    const options = await app.db.menuOption.findMany({
      where: { id: { in: counts.map((c) => c.menuOptionId) } },
      select: { id: true, name: true, imageUrl: true },
    })

    const optionMap = Object.fromEntries(options.map((o) => [o.id, o]))
    return counts.map((c) => ({ menuOptionId: c.menuOptionId, name: optionMap[c.menuOptionId]?.name, imageUrl: optionMap[c.menuOptionId]?.imageUrl ?? null, count: c._count.menuOptionId }))
  })
}
