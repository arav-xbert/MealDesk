import { FastifyInstance } from 'fastify'
import path from 'path'
import staticPlugin from '@fastify/static'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/authorize'
import { saveImage, deleteImage } from '../lib/saveImage'

export async function mealsRoutes(app: FastifyInstance) {
  const uploadDir = process.env.UPLOAD_DIR || 'uploads'
  await app.register(staticPlugin, {
    root: path.resolve(uploadDir),
    prefix: `/${uploadDir}/`,
    decorateReply: false,
  })

  const mealResponseSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string', nullable: true },
      imageUrl: { type: 'string', nullable: true },
      category: { type: 'string', nullable: true },
      active: { type: 'boolean' },
    },
  }

  app.post(
    '/meals',
    {
      preHandler: [authenticate, requireRole('HR')],
      schema: {
        tags: ['Meals'],
        summary: 'Add a new menu option',
        description: 'Multipart form: fields name (required), description, category; file field image (PNG/JPEG ≤ 5MB)',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        response: {
          201: mealResponseSchema,
          400: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (request, reply) => {
      const parts = request.parts()
      const fields: Record<string, string> = {}
      let imageUrl: string | undefined

      for await (const part of parts) {
        if (part.type === 'file') {
          imageUrl = await saveImage(part)
        } else {
          fields[part.fieldname] = part.value as string
        }
      }

      if (!fields.name) return reply.code(400).send({ error: 'name is required' })

      const meal = await app.db.menuOption.create({
        data: { name: fields.name, description: fields.description, category: fields.category, imageUrl },
      })
      return reply.code(201).send(meal)
    }
  )

  app.put(
    '/meals/:id',
    {
      preHandler: [authenticate, requireRole('HR')],
      schema: {
        tags: ['Meals'],
        summary: 'Update a menu option (partial update)',
        description: 'Multipart form: any of name, description, category; file field image to replace',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          200: mealResponseSchema,
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parts = request.parts()
      const fields: Record<string, string> = {}
      let newImageUrl: string | undefined

      for await (const part of parts) {
        if (part.type === 'file') {
          newImageUrl = await saveImage(part)
        } else {
          fields[part.fieldname] = part.value as string
        }
      }

      const existing = await app.db.menuOption.findUnique({ where: { id } })
      if (!existing) return reply.code(404).send({ error: 'Meal not found' })

      if (newImageUrl && existing.imageUrl) deleteImage(existing.imageUrl)

      const meal = await app.db.menuOption.update({
        where: { id },
        data: {
          ...(fields.name && { name: fields.name }),
          ...(fields.description !== undefined && { description: fields.description }),
          ...(fields.category !== undefined && { category: fields.category }),
          ...(newImageUrl && { imageUrl: newImageUrl }),
        },
      })
      return meal
    }
  )

  app.delete(
    '/meals/:id',
    {
      preHandler: [authenticate, requireRole('HR')],
      schema: {
        tags: ['Meals'],
        summary: 'Delete a menu option (soft-deletes if it has existing selections)',
        security: [{ bearerAuth: [] }],
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          204: { type: 'null' },
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }

      const existing = await app.db.menuOption.findUnique({ where: { id } })
      if (!existing) return reply.code(404).send({ error: 'Meal not found' })

      const selectionCount = await app.db.selection.count({ where: { menuOptionId: id } })

      if (selectionCount > 0) {
        await app.db.menuOption.update({ where: { id }, data: { active: false } })
      } else {
        if (existing.imageUrl) deleteImage(existing.imageUrl)
        await app.db.menuOption.delete({ where: { id } })
      }

      return reply.code(204).send()
    }
  )
}
