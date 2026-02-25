import { MultipartFile } from '@fastify/multipart'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const ALLOWED = ['image/png', 'image/jpeg']
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads'

export async function saveImage(file: MultipartFile): Promise<string> {
  if (!ALLOWED.includes(file.mimetype)) {
    throw Object.assign(new Error('Only PNG and JPEG allowed'), { statusCode: 400 })
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const ext = file.mimetype === 'image/png' ? '.png' : '.jpg'
  const filename = `${randomUUID()}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  await fs.promises.writeFile(filepath, await file.toBuffer())
  return `/${UPLOAD_DIR}/${filename}`
}

export function deleteImage(imageUrl: string) {
  const filepath = imageUrl.replace(/^\//, '')
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
}
