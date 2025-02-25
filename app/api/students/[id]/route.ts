import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new Response("Student ID is required", { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
        attendance: {
          include: {
            subject: true,
            subjectType: true,
          },
        },
        groups: true,
      },
    });

    const subjectTypes = await prisma.subjectType.findMany();

    if (!student) {
      return new Response("Student not found", { status: 404 });
    }

    return new Response(JSON.stringify({ student, subjectTypes }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch student data", { status: 500 });
  }
}