import { FastifyRequest, FastifyReply } from 'fastify'

export interface JwtUser {
  userId: string
  role: 'EMPLOYEE' | 'HR'
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtUser
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify<JwtUser>()
    request.user = payload
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}
