import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function studentsRoutes(app: FastifyInstance) {
  app.post('/api/v1/student', async (request) => {
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

    return student
  })

  app.get('/api/v1/students', async () => {
    const students = await prisma.student.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return students
  })

  app.get('/api/v1/student/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const student = await prisma.student.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return student
  })

  app.put('/api/v1/student/:id', async (request) => {
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

    const student = await prisma.student.update({
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

    return student
  })

  app.delete('/api/v1/student/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.student.delete({
      where: {
        id,
      },
    })
  })
}
