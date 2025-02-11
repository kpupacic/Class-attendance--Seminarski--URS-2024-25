import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const professors = await prisma.professor.findMany();
    return new Response(JSON.stringify(professors), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch professors", { status: 500 });
  }
}
