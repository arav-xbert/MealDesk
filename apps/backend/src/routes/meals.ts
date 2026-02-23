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

  app.post(
    '/meals',
    { preHandler: [authenticate, requireRole('HR')] },
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
    { preHandler: [authenticate, requireRole('HR')] },
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
    { preHandler: [authenticate, requireRole('HR')] },
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
