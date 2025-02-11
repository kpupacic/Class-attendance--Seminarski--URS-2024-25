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

  // Create Professor (Example data)
  const professor = await prisma.professor.create({
    data: {
      name: "Dr. John Doe",
      email: "john.doe@example.com",
    },
  });

  // Create Groups and link them to subjects and professors
  const groups = await Promise.all(
    GROUPS.map((groupName, index) =>
      prisma.group.create({
        data: {
          name: groupName, // Group name can be simplified since we already have subjectId
          subjectId: subjects[index % subjects.length].id, // Link to subject
          professorId: professor.id, // Link to professor
        },
      })
    )
  );

  // Create a Student (Example data)
  const student = await prisma.student.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  });

  // Add Student to all Groups
  for (const group of groups) {
    await prisma.group.update({
      where: { id: group.id },
      data: {
        students: {
          connect: { id: student.id },
        },
      },
    });
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
