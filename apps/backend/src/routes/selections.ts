import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { Prisma } from '@prisma/client'

export async function selectionsRoutes(app: FastifyInstance) {
  app.post('/selections', {
    preHandler: [authenticate],
    schema: {
      tags: ['Selections'],
      summary: 'Submit meal selection for the active listing',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['listingId', 'menuOptionId'],
        properties: {
          listingId: { type: 'string' },
          menuOptionId: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            listingId: { type: 'string' },
            userId: { type: 'string' },
            menuOptionId: { type: 'string' },
            createdAt: { type: 'string' },
            menuOption: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
          },
        },
        409: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, async (request, reply) => {
    const { listingId, menuOptionId } = request.body as { listingId: string; menuOptionId: string }
    if (!listingId || !menuOptionId) {
      return reply.code(400).send({ error: 'listingId and menuOptionId required' })
    }

    try {
      const selection = await app.db.selection.create({
        data: { listingId, menuOptionId, userId: request.user.userId },
        include: { menuOption: true, listing: true },
      })
      return reply.code(201).send(selection)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return reply.code(409).send({ error: 'Already submitted for this listing' })
      }
      throw err
    }
  })

  app.get('/selections/my-latest', {
    preHandler: [authenticate],
    schema: {
      tags: ['Selections'],
      summary: "Get the current user's latest meal selection",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          nullable: true,
          type: 'object',
          properties: {
            id: { type: 'string' },
            createdAt: { type: 'string' },
            menuOption: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, category: { type: 'string', nullable: true } } },
            listing: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' } } },
          },
        },
      },
    },
  }, async (request) => {
    return app.db.selection.findFirst({
      where: { userId: request.user.userId },
      orderBy: { createdAt: 'desc' },
      include: { menuOption: true, listing: true },
    })
  })
}
