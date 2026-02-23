import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const { employeeId, password } = request.body as { employeeId: string; password: string }

    const user = await app.db.user.findUnique({ where: { employeeId } })
    if (!user || !user.active) return reply.code(401).send({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return reply.code(401).send({ error: 'Invalid credentials' })

    const token = app.jwt.sign({ userId: user.id, role: user.role })
    return { token, user: { id: user.id, name: user.name, role: user.role } }
  })

  app.post('/logout', async () => ({ message: 'Logged out' }))
}
