import fastify from 'fastify'
import { studentsRoutes } from './routes/students'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

const schema = {
  swagger: {
    info: {
      title: '@fastify/swagger | challenge generation by Izael Silva',
      description:
        'Construa uma API com um CRUD para armazenar dados dos alunos de uma escola. Os dados a serem armazenados são: ID, NOME, IDADE, NOTA DO PRIMEIRO SEMESTRE, NOTA DO SEGUNDO SEMESTRE, NOME DO PROFESSOR e NÚMERO DA SALA.',
      contact: {
        name: 'API',
        url: 'https://github.com/ias4g/desafio-generation',
        email: 'izaell.oficial@gmail.com',
      },
      version: '8.12.0',
    },
  },
}

const app = fastify()

app.register(fastifySwagger, schema)

app.register(fastifySwaggerUi, {
  theme: {
    title: 'challenge Generation',
  },
})

app.register(studentsRoutes)

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })
