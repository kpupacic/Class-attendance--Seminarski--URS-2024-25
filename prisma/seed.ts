import { PrismaClient } from "@prisma/client";

// Constants with subjects, class types, and groups
export const SUBJECTS = ["Matematika", "Fizika", "Programiranje"];
export const CLASS_TYPES = ["Predavanja", "Laboratorijske vježbe", "Auditorne vježbe"];
export const GROUPS = ["Grupa 1", "Grupa 2", "Grupa 3"];

const prisma = new PrismaClient();

// Helper function to map CLASS_TYPES to the enum
const mapClassTypeToEnum = (classType: string) => {
  switch (classType) {
    case "Predavanja":
      return "PREDAVANJE";
    case "Laboratorijske vježbe":
      return "LABORATORIJSKE_VJEZBE";
    case "Auditorne vježbe":
      return "AUDITORNE_VJEZBE";
    default:
      throw new Error(`Unknown class type: ${classType}`);
  }
};

async function main() {
  // Create Subjects and Class Types (now mapped to SubjectType enum)
  const subjects = await Promise.all(
    SUBJECTS.map((subjectName, index) =>
      prisma.subject.create({
        data: {
          name: subjectName,
          type: mapClassTypeToEnum(CLASS_TYPES[index % CLASS_TYPES.length]), // Use the enum mapping here
        },
      })
    )
  );

  const professors = await Promise.all([
    prisma.professor.upsert({
      where: { email: "josipa.baric@example.com" },
      update: {}, // No changes needed if the professor already exists
      create: {
        name: "Josipa Baric",
        email: "josipa.baric@example.com",
      },
    }),
    prisma.professor.upsert({
      where: { email: "dajana.dujic@example.com" },
      update: {},
      create: {
        name: "Dajana Dujic",
        email: "dajana.dujic@example.com",
      },
    }),
    prisma.professor.upsert({
      where: { email: "damir.lelas@example.com" },
      update: {},
      create: {
        name: "Damir Lelas",
        email: "damir.lelas@example.com",
      },
    }),
    prisma.professor.upsert({
      where: { email: "duje.giljanovic@example.com" },
      update: {},
      create: {
        name: "Duje Giljanovic",
        email: "duje.giljanovic@example.com",
      },
    }),
    prisma.professor.upsert({
      where: { email: "mirjana.bonkovic@example.com" },
      update: {},
      create: {
        name: "Mirjana Bonkovic",
        email: "mirjana.bonkovic@example.com",
      },
    }),
  ]);

  // Create Groups and link them to subjects and professors
  const groups = await Promise.all(
    GROUPS.map((groupName, index) =>
      prisma.group.create({
        data: {
          name: groupName,
          subjectId: subjects[index % subjects.length].id,
          professorId: professors[index % professors.length].id, // Selecting professor based on index
        },
      })
    )
  );

  // Create Students (Example data)
  const students = await Promise.all([
    prisma.student.upsert({
      where: { email: "ivan.horvat@example.com" },
      update: {},
      create: {
        name: "Ivan Horvat",
        email: "ivan.horvat@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "ana.kovac@example.com" },
      update: {},
      create: {
        name: "Ana Kovac",
        email: "ana.kovac@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "marko.maric@example.com" },
      update: {},
      create: {
        name: "Marko Maric",
        email: "marko.maric@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "petra.novak@example.com" },
      update: {},
      create: {
        name: "Petra Novak",
        email: "petra.novak@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "lucija.juric@example.com" },
      update: {},
      create: {
        name: "Lucija Juric",
        email: "lucija.juric@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "stjepan.bosnjak@example.com" },
      update: {},
      create: {
        name: "Stjepan Bosnjak",
        email: "stjepan.bosnjak@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "marija.saric@example.com" },
      update: {},
      create: {
        name: "Marija Saric",
        email: "marija.saric@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "nikola.mikic@example.com" },
      update: {},
      create: {
        name: "Nikola Mikic",
        email: "nikola.mikic@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "ivana.babic@example.com" },
      update: {},
      create: {
        name: "Ivana Babic",
        email: "ivana.babic@example.com",
      },
    }),
    prisma.student.upsert({
      where: { email: "matej.vidovic@example.com" },
      update: {},
      create: {
        name: "Matej Vidovic",
        email: "matej.vidovic@example.com",
      },
    }),
  ]);

  // Add Students to all Groups
  for (const group of groups) {
    for (const student of students) {
      await prisma.group.update({
        where: { id: group.id },
        data: {
          students: {
            connect: { id: student.id },
          },
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
