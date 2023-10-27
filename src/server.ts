import fastify from 'fastify'
import { studentsRoutes } from './routes/students'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

const app = fastify()

app.register(fastifySwagger)

app.register(fastifySwaggerUi)

app.register(studentsRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })