import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/authorize'

export async function adminRoutes(app: FastifyInstance) {
  app.post('/users', { preHandler: [authenticate, requireRole('HR')] }, async (request, reply) => {
    const { employeeId, name, role, password } = request.body as {
      employeeId: string
      name: string
      role?: 'EMPLOYEE' | 'HR'
      password: string
    }

    if (!employeeId || !name || !password) {
      return reply.code(400).send({ error: 'employeeId, name, and password required' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await app.db.user.create({
      data: { employeeId, name, role: role ?? 'EMPLOYEE', passwordHash },
      select: { id: true, employeeId: true, name: true, role: true, active: true, createdAt: true },
    })
    return reply.code(201).send(user)
  })
}
