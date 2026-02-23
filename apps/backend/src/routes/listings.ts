import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/authorize'

export async function listingsRoutes(app: FastifyInstance) {
  const menuOptionSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string', nullable: true },
      imageUrl: { type: 'string', nullable: true },
      category: { type: 'string', nullable: true },
    },
  }

  app.get('/listings/active', {
    preHandler: [authenticate],
    schema: {
      tags: ['Listings'],
      summary: 'Get the current active listing with menu options',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            date: { type: 'string', format: 'date' },
            startTime: { type: 'string' },
            endTime: { type: 'string' },
            status: { type: 'string' },
            menuOptions: { type: 'array', items: menuOptionSchema },
          },
        },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, async (request, reply) => {
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
    {
      preHandler: [authenticate, requireRole('HR')],
      schema: {
        tags: ['Listings'],
        summary: 'Create a new active listing (deactivates any existing one)',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['title', 'date', 'startTime', 'endTime'],
          properties: {
            title: { type: 'string', example: "Monday's Lunch" },
            date: { type: 'string', format: 'date', example: '2026-02-24' },
            startTime: { type: 'string', example: '09:00', description: 'HH:MM (24h)' },
            endTime: { type: 'string', example: '11:00', description: 'HH:MM (24h)' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              date: { type: 'string' },
              startTime: { type: 'string' },
              endTime: { type: 'string' },
              status: { type: 'string' },
            },
          },
          400: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
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
