import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Login with Employee ID and password',
      body: {
        type: 'object',
        required: ['employeeId', 'password'],
        properties: {
          employeeId: { type: 'string', example: 'EMP001' },
          password: { type: 'string', example: 'password123' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string', enum: ['EMPLOYEE', 'HR'] },
              },
            },
          },
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, async (request, reply) => {
    const { employeeId, password } = request.body as { employeeId: string; password: string }

    const user = await app.db.user.findUnique({ where: { employeeId } })
    if (!user || !user.active) return reply.code(401).send({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return reply.code(401).send({ error: 'Invalid credentials' })

    const token = app.jwt.sign({ userId: user.id, role: user.role })
    return { token, user: { id: user.id, name: user.name, role: user.role } }
  })

  app.post('/logout', {
    schema: {
      tags: ['Auth'],
      summary: 'Logout (client should discard the JWT)',
      response: { 200: { type: 'object', properties: { message: { type: 'string' } } } },
    },
  }, async () => ({ message: 'Logged out' }))
}
