import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import staticPlugin from '@fastify/static'
import path from 'path'
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
  const app = Fastify({
    logger: true,
    ajv: { customOptions: { keywords: ['example'] } },
  })

  await app.register(cors, { origin: true })

  const uploadDir = process.env.UPLOAD_DIR || 'uploads'
  await app.register(staticPlugin, {
    root: path.resolve(uploadDir),
    prefix: `/${uploadDir}/`,
  })

  await app.register(swagger, {
    openapi: {
      info: { title: 'MealDesk API', version: '1.0.0', description: 'REST API for the MealDesk meal selection app' },
      tags: [
        { name: 'Auth', description: 'Login / logout' },
        { name: 'Listings', description: 'Meal listings — HR creates, employees view' },
        { name: 'Selections', description: 'Employee meal selections' },
        { name: 'Meals', description: 'Menu option management (HR only)' },
        { name: 'Dashboard', description: 'HR dashboard statistics (HR only)' },
        { name: 'Admin', description: 'User account management (HR only)' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
  })

  await app.register(dbPlugin)
  await app.register(jwtPlugin)
  await app.register(multipartPlugin)

  app.get('/api/health', { schema: { hide: true } }, async () => ({ status: 'ok' }))

  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(listingsRoutes, { prefix: '/api' })
  await app.register(selectionsRoutes, { prefix: '/api' })
  await app.register(mealsRoutes, { prefix: '/api' })
  await app.register(dashboardRoutes, { prefix: '/api/dashboard' })
  await app.register(adminRoutes, { prefix: '/api/admin' })

  return app
}
