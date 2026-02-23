import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/authorize'

export async function listingsRoutes(app: FastifyInstance) {
  app.get('/listings/active', { preHandler: [authenticate] }, async (request, reply) => {
    const listing = await app.db.listing.findFirst({
      where: { status: 'ACTIVE' },
      include: { selections: false },
    })
    if (!listing) return reply.code(404).send({ error: 'No active listing' })

    const menuOptions = await app.db.menuOption.findMany({ where: { active: true } })
    return { ...listing, menuOptions }
  })

  app.post(
    '/listings',
    { preHandler: [authenticate, requireRole('HR')] },
    async (request, reply) => {
      const { title, date, startTime, endTime } = request.body as {
        title: string
        date: string
        startTime: string
        endTime: string
      }

      if (!title || !date || !startTime || !endTime) {
        return reply.code(400).send({ error: 'All fields required' })
      }
      if (startTime >= endTime) {
        return reply.code(400).send({ error: 'startTime must be before endTime' })
      }

      const listing = await app.db.$transaction(async (tx) => {
        await tx.listing.updateMany({ where: { status: 'ACTIVE' }, data: { status: 'INACTIVE' } })
        return tx.listing.create({
          data: {
            title,
            date: new Date(date),
            startTime: new Date(`1970-01-01T${startTime}:00Z`),
            endTime: new Date(`1970-01-01T${endTime}:00Z`),
          },
        })
      })

      return reply.code(201).send(listing)
    }
  )
}
