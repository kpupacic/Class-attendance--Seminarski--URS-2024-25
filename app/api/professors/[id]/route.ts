import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new Response("Professor ID is required", { status: 400 });
  }

  try {
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: {
        subjects: {
          include: {
            subject: {
              include: {
                subjectTypes: {
                  include: {
                    subjectType: true,
                  },
                },
                students: {
                  include: {
                    student: {
                      include: {
                        attendance: {
                          include: {
                            subject: true,
                            subjectType: true,
                            group: true,
                          },
                        },
                      },
                    },
                  },
                },
                attendance: {
                  include: {
                    student: true,
                    subjectType: true,
                    group: true,
                  },
                },
              },
            },
          },
        },
        groups: true,
      },
    });

    if (!professor) {
      return new Response("Professor not found", { status: 404 });
    }

    return new Response(JSON.stringify(professor), { status: 200 });
  } catch (error) {
    console.error("Error fetching professor data:", error);
    return new Response("Failed to fetch professor data", { status: 500 });
  }
}