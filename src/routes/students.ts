import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function studentsRoutes(app: FastifyInstance) {
  app.post(
    '/api/v1/student',
    {
      schema: {
        description:
          'Envia os dodos via POST e retorna http code 200, ao cadastrar com sucesso!',
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
    },
    async (request, reply) => {
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

      return reply.code(201).send(student)
    },
  )

  app.get(
    '/api/v1/students',
    {
      schema: {
        description:
          'Retorna todos os estudantes cadastrado no banco de dados!',
      },
    },
    async () => {
      const students = await prisma.student.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return students
    },
  )

  app.get(
    '/api/v1/student/:id',
    {
      schema: {
        description:
          'Retorna o estudante especifico de acordo com o parametro passado, neste caso o {id}!',
      },
    },
    async (request, reply) => {
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
        return reply.code(404).send({ message: 'student not found' })
      }

      return reply.code(200).send(student)
    },
  )

  app.put(
    '/api/v1/student/:id',
    {
      schema: {
        description:
          'Envia os dados via PUT, passando o {id} como parâmentro e retorna http code 204!',
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
    },
    async (request, reply) => {
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
        return reply.code(404).send({ message: 'student not found!' })
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

      return reply.code(204).send()
    },
  )

  app.delete(
    '/api/v1/student/:id',
    {
      schema: {
        description:
          'Recebe o {id} como parâmetro e retorna http code 204 caso a exclusão seja bem sucedida!',
      },
    },
    async (request, reply) => {
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
        return reply.code(404).send({ message: 'student not found!' })
      }

      await prisma.student.delete({
        where: {
          id,
        },
      })

      return reply.code(204).send()
    },
  )
}
