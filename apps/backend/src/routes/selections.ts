import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { Prisma } from '@prisma/client'

export async function selectionsRoutes(app: FastifyInstance) {
  app.post('/selections', { preHandler: [authenticate] }, async (request, reply) => {
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

  app.get('/selections/my-latest', { preHandler: [authenticate] }, async (request) => {
    return app.db.selection.findFirst({
      where: { userId: request.user.userId },
      orderBy: { createdAt: 'desc' },
      include: { menuOption: true, listing: true },
    })
  })
}
