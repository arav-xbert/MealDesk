import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

export const jwtPlugin = fp(async (app) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET env var is required')
  await app.register(fastifyJwt, { secret })
})
