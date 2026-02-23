import { FastifyRequest, FastifyReply } from 'fastify'

export function requireRole(role: 'HR' | 'EMPLOYEE') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user?.role !== role) {
      reply.code(403).send({ error: 'Forbidden' })
    }
  }
}
