import { buildApp } from './app'

const start = async () => {
  const app = await buildApp()
  const port = Number(process.env.PORT) || 3001
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`Server running on port ${port}`)
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
