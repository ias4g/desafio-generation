"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
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
};
async function studentsRoutes(app) {
    app.post('/api/v1/student', schemaSwagger, async (request, reply) => {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            age: zod_1.z.number().min(1).max(100),
            firstSemesterGrade: zod_1.z.number().min(0).max(10),
            secondSemesterGrade: zod_1.z.number().min(0).max(10),
            teacherName: zod_1.z.string(),
            roomNumber: zod_1.z.number(),
        });
        const { name, age, firstSemesterGrade, secondSemesterGrade, teacherName, roomNumber, } = bodySchema.parse(request.body);
        const student = await prisma_1.prisma.student.create({
            data: {
                name,
                age,
                firstSemesterGrade,
                secondSemesterGrade,
                teacherName,
                roomNumber,
            },
        });
        return reply.code(201).send(student);
    });
    app.get('/api/v1/students', async () => {
        const students = await prisma_1.prisma.student.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        return students;
    });
    app.get('/api/v1/student/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const student = await prisma_1.prisma.student.findUnique({
            where: {
                id,
            },
        });
        if (!student) {
            return reply.code(404).send({ message: 'student not found' });
        }
        return reply.code(200).send(student);
    });
    app.put('/api/v1/student/:id', schemaSwagger, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            age: zod_1.z.number().min(1).max(100),
            firstSemesterGrade: zod_1.z.number().min(0).max(10),
            secondSemesterGrade: zod_1.z.number().min(0).max(10),
            teacherName: zod_1.z.string(),
            roomNumber: zod_1.z.number(),
        });
        const { name, age, firstSemesterGrade, secondSemesterGrade, teacherName, roomNumber, } = bodySchema.parse(request.body);
        const studentExists = await prisma_1.prisma.student.findUnique({
            where: {
                id,
            },
        });
        if (!studentExists) {
            return reply.code(404).send({ message: 'student not found!' });
        }
        await prisma_1.prisma.student.update({
            where: { id },
            data: {
                name,
                age,
                firstSemesterGrade,
                secondSemesterGrade,
                teacherName,
                roomNumber,
            },
        });
        return reply.code(204).send();
    });
    app.delete('/api/v1/student/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const student = await prisma_1.prisma.student.findUnique({
            where: {
                id,
            },
        });
        if (!student) {
            return reply.code(404).send({ message: 'student not found!' });
        }
        await prisma_1.prisma.student.delete({
            where: {
                id,
            },
        });
        return reply.code(204).send();
    });
}
exports.studentsRoutes = studentsRoutes;
