import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const schemaSwagger = {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        firstSemesterGrade: { type: 'number' },
        secondSemesterGrade: { type: 'number' },
        teacherName: { type: 'string' },
        roomNumber: { type: 'number' },
      },
    },
  },
}

export async function studentsRoutes(app: FastifyInstance) {
  app.post('/api/v1/student', schemaSwagger, async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      age: z.number().min(1).max(100),
      firstSemesterGrade: z.number().min(0).max(10),
      secondSemesterGrade: z.number().min(0).max(10),
      teacherName: z.string(),
      roomNumber: z.number(),
    })

    const {
      name,
      age,
      firstSemesterGrade,
      secondSemesterGrade,
      teacherName,
      roomNumber,
    } = bodySchema.parse(request.body)

    const student = await prisma.student.create({
      data: {
        name,
        age,
        firstSemesterGrade,
        secondSemesterGrade,
        teacherName,
        roomNumber,
      },
    })

    reply.code(201).send(student)
  })

  app.get('/api/v1/students', async () => {
    const students = await prisma.student.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return students
  })

  app.get('/api/v1/student/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    })

    if (!student) {
      reply.code(404).send({ message: 'student not found' })
    }

    reply.code(200).send(student)
  })

  app.put('/api/v1/student/:id', schemaSwagger, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      age: z.number().min(1).max(100),
      firstSemesterGrade: z.number().min(0).max(10),
      secondSemesterGrade: z.number().min(0).max(10),
      teacherName: z.string(),
      roomNumber: z.number(),
    })

    const {
      name,
      age,
      firstSemesterGrade,
      secondSemesterGrade,
      teacherName,
      roomNumber,
    } = bodySchema.parse(request.body)

    const studentExists = await prisma.student.findUnique({
      where: {
        id,
      },
    })

    if (!studentExists) {
      reply.code(404).send({ message: 'student not found!' })
    }

    await prisma.student.update({
      where: { id },
      data: {
        name,
        age,
        firstSemesterGrade,
        secondSemesterGrade,
        teacherName,
        roomNumber,
      },
    })

    reply.code(204).send()
  })

  app.delete('/api/v1/student/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    })

    if (!student) {
      reply.code(404).send({ message: 'student not found!' })
    }

    await prisma.student.delete({
      where: {
        id,
      },
    })

    reply.code(204).send()
  })
}
