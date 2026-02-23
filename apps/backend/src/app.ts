import Fastify from 'fastify'
import cors from '@fastify/cors'
import { dbPlugin } from './plugins/db'
import { jwtPlugin } from './plugins/jwt'
import { multipartPlugin } from './plugins/multipart'
import { authRoutes } from './routes/auth'
import { listingsRoutes } from './routes/listings'
import { selectionsRoutes } from './routes/selections'
import { mealsRoutes } from './routes/meals'
import { dashboardRoutes } from './routes/dashboard'
import { adminRoutes } from './routes/admin'

export async function buildApp() {
  const app = Fastify({ logger: true })

  await app.register(cors, { origin: true })
  await app.register(dbPlugin)
  await app.register(jwtPlugin)
  await app.register(multipartPlugin)

  app.get('/api/health', async () => ({ status: 'ok' }))

  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(listingsRoutes, { prefix: '/api' })
  await app.register(selectionsRoutes, { prefix: '/api' })
  await app.register(mealsRoutes, { prefix: '/api' })
  await app.register(dashboardRoutes, { prefix: '/api/dashboard' })
  await app.register(adminRoutes, { prefix: '/api/admin' })

  return app
}
