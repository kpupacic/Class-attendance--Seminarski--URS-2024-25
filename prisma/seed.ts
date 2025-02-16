import { PrismaClient } from "@prisma/client";

// Define custom interfaces based on your Prisma schema
interface Group {
  id: string;
  name: string;
  subjectId: string;
  subjectTypeId: string;
  professorId: string;
}

interface Subject {
  id: string;
  name: string;
}

interface SubjectType {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

const SUBJECTS = ["Matematika", "Fizika", "Programiranje"];
const CLASS_TYPES = ["Predavanja", "Laboratorijske vježbe", "Auditorne vježbe"];

const prisma = new PrismaClient();

async function main() {
  // Create subject types
  const subjectTypes: SubjectType[] = await Promise.all(
    CLASS_TYPES.map((classType) =>
      prisma.subjectType.upsert({
        where: { name: classType },
        update: {},
        create: { name: classType },
      })
    )
  );

  // Create professors
  const professors = await Promise.all([
    prisma.professor.upsert({
      where: { email: "josipa.baric@example.com" },
      update: {},
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

  // Create subjects
  const subjects: Subject[] = await Promise.all(
    SUBJECTS.map((subjectName) =>
      prisma.subject.create({
        data: {
          name: subjectName,
        },
      })
    )
  );

  // Manually create SubjectSubjectType records to establish relationships and groups
  await Promise.all(
    subjects.map(async (subject) => {
      if (subject.name === "Matematika" || subject.name === "Fizika") {
        const predavanja = subjectTypes.find((type) => type.name === "Predavanja");
        const auditorneVjezbe = subjectTypes.find((type) => type.name === "Auditorne vježbe");
        if (predavanja) {
          await prisma.subjectSubjectType.create({
            data: {
              subjectId: subject.id,
              subjectTypeId: predavanja.id,
            },
          });
          if (subject.name === "Matematika") {
            await Promise.all(
              ["Grupa 1", "Grupa 2"].map((groupName) =>
                prisma.group.create({
                  data: {
                    name: groupName,
                    subjectId: subject.id,
                    subjectTypeId: predavanja.id,
                    professorId: professors[0].id, // Josipa Baric teaches all Matematika Predavanja groups
                  },
                })
              )
            );
          } else if (subject.name === "Fizika") {
            await Promise.all(
              ["Grupa 1", "Grupa 2"].map((groupName) =>
                prisma.group.create({
                  data: {
                    name: groupName,
                    subjectId: subject.id,
                    subjectTypeId: predavanja.id,
                    professorId: professors[2].id, // Damir Lelas teaches all Fizika Predavanja groups
                  },
                })
              )
            );
          }
        }
        if (auditorneVjezbe) {
          await prisma.subjectSubjectType.create({
            data: {
              subjectId: subject.id,
              subjectTypeId: auditorneVjezbe.id,
            },
          });
          if (subject.name === "Matematika") {
            await Promise.all(
              ["Grupa 1", "Grupa 2", "Grupa 3", "Grupa 4"].map((groupName) =>
                prisma.group.create({
                  data: {
                    name: groupName,
                    subjectId: subject.id,
                    subjectTypeId: auditorneVjezbe.id,
                    professorId: professors[1].id, // Dajana Dujic teaches all Matematika Auditorne Vježbe groups
                  },
                })
              )
            );
          } else if (subject.name === "Fizika") {
            await Promise.all(
              ["Grupa 1", "Grupa 2", "Grupa 3", "Grupa 4", "Grupa 5"].map((groupName) =>
                prisma.group.create({
                  data: {
                    name: groupName,
                    subjectId: subject.id,
                    subjectTypeId: auditorneVjezbe.id,
                    professorId: professors[3].id, // Duje Giljanovic teaches all Fizika Auditorne Vježbe groups
                  },
                })
              )
            );
          }
        }
      } else if (subject.name === "Programiranje") {
        const predavanja = subjectTypes.find((type) => type.name === "Predavanja");
        const laboratorijskeVjezbe = subjectTypes.find((type) => type.name === "Laboratorijske vježbe");
        if (predavanja) {
          await prisma.subjectSubjectType.create({
            data: {
              subjectId: subject.id,
              subjectTypeId: predavanja.id,
            },
          });
          await prisma.group.create({
            data: {
              name: "Grupa 1",
              subjectId: subject.id,
              subjectTypeId: predavanja.id,
              professorId: professors[4].id, // Mirjana Bonkovic teaches all Programiranje Predavanja groups
            },
          });
        }
        if (laboratorijskeVjezbe) {
          await prisma.subjectSubjectType.create({
            data: {
              subjectId: subject.id,
              subjectTypeId: laboratorijskeVjezbe.id,
            },
          });
          await Promise.all(
            ["Grupa 1", "Grupa 2", "Grupa 3"].map((groupName) =>
              prisma.group.create({
                data: {
                  name: groupName,
                  subjectId: subject.id,
                  subjectTypeId: laboratorijskeVjezbe.id,
                  professorId: professors[4].id, // Mirjana Bonkovic teaches all Programiranje Laboratorijske Vježbe groups
                },
              })
            )
          );
        }
      }
    })
  );

  // Create ProfessorSubject records to establish relationships between professors and subjects
  await prisma.professorSubject.createMany({
    data: [
      { professorId: professors[0].id, subjectId: subjects[0].id }, // Josipa Baric teaches Matematika
      { professorId: professors[1].id, subjectId: subjects[0].id }, // Dajana Dujic teaches Matematika
      { professorId: professors[2].id, subjectId: subjects[1].id }, // Damir Lelas teaches Fizika
      { professorId: professors[3].id, subjectId: subjects[1].id }, // Duje Giljanovic teaches Fizika
      { professorId: professors[4].id, subjectId: subjects[2].id }, // Mirjana Bonkovic teaches Programiranje
    ],
  });

  // Create Students (Example data)
  const students: Student[] = await Promise.all([
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

  // Create StudentSubject records to establish relationships between students and subjects
  await Promise.all(
    students.map(async (student) => {
      await Promise.all(
        subjects.map(async (subject) => {
          await prisma.studentSubject.create({
            data: {
              studentId: student.id,
              subjectId: subject.id,
            },
          });
        })
      );
    })
  );

  // Assign students to groups manually
  const groups: Group[] = await prisma.group.findMany();

  // Helper function to get group ID
  function getGroupId(groups: Group[], groupName: string, subjectId: string, subjectTypeId: string): string {
    const group = groups.find((g) => g.name === groupName && g.subjectId === subjectId && g.subjectTypeId === subjectTypeId);
    return group ? group.id : "";
  }

  // Assign each student to groups
  await Promise.all(
    students.map(async (student, index) => {
      // Matematika Predavanja
      if (index < 5) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 1", subjects[0].id, subjectTypes.find((st) => st.name === "Predavanja")?.id ?? "") }
        });
      } else {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 2", subjects[0].id, subjectTypes.find((st) => st.name === "Predavanja")?.id ?? "") }
        });
      }

      // Fizika Predavanja
      if (index < 5) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 1", subjects[1].id, subjectTypes.find((st) => st.name === "Predavanja")?.id ?? "") }
        });
      } else {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 2", subjects[1].id, subjectTypes.find((st) => st.name === "Predavanja")?.id ?? "") }
        });
      }

      // Matematika Auditorne Vježbe
      if (index < 2) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 1", subjects[0].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      } else if (index < 4) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 2", subjects[0].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      } else if (index < 7) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 3", subjects[0].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      } else {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 4", subjects[0].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      }

      // Fizika Auditorne Vježbe
      if (index < 2) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 1", subjects[1].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      } else if (index < 4) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 2", subjects[1].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      } else if (index < 6) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 3", subjects[1].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      } else if (index < 8) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 4", subjects[1].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      } else {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 5", subjects[1].id, subjectTypes.find((st) => st.name === "Auditorne vježbe")?.id ?? "") }
        });
      }

      // Programiranje Predavanja
      await prisma.groupStudent.create({
        data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 1", subjects[2].id, subjectTypes.find((st) => st.name === "Predavanja")?.id ?? "") }
      });

      // Programiranje Laboratorijske Vježbe
      if (index < 3) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 1", subjects[2].id, subjectTypes.find((st) => st.name === "Laboratorijske vježbe")?.id ?? "") }
        });
      } else if (index < 6) {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 2", subjects[2].id, subjectTypes.find((st) => st.name === "Laboratorijske vježbe")?.id ?? "") }
        });
      } else {
        await prisma.groupStudent.create({
          data: { studentId: student.id, groupId: getGroupId(groups, "Grupa 3", subjects[2].id, subjectTypes.find((st) => st.name === "Laboratorijske vježbe")?.id ?? "") }
        });
      }
    })
  );

  // Create Attendance records
  const dates = ["2025-02-05", "2025-02-12", "2025-02-19"];
  const attendanceProbability = {
    "Predavanja": 0.7,
    "Auditorne vježbe": 0.7,
    "Laboratorijske vježbe": 0.9
  };

  const attendancePromises = [];

  // Fetch the group assignments for each student
  const groupAssignments = await prisma.groupStudent.findMany();

  console.log(`Total group assignments: ${groupAssignments.length}`);

  for (const assignment of groupAssignments) {
    const student = students.find((s) => s.id === assignment.studentId);
    const group = groups.find((g) => g.id === assignment.groupId);
    const subjectType = subjectTypes.find((st) => st.id === group?.subjectTypeId);

    if (student && group && subjectType) {
      for (const date of dates) {
        const present = Math.random() < attendanceProbability[subjectType.name as keyof typeof attendanceProbability];
        attendancePromises.push(
          prisma.attendance.upsert({
            where: {
              studentId_groupId_date: {
                studentId: student.id,
                groupId: group.id,
                date: new Date(date),
              },
            },
            update: {
              present: present,
            },
            create: {
              studentId: student.id,
              groupId: group.id,
              subjectId: group.subjectId,
              subjectTypeId: group.subjectTypeId,
              date: new Date(date),
              present: present,
            },
          })
        );
      }
    }
  }
  console.log(`Total attendance records to add: ${attendancePromises.length}`);
  // Execute all attendance creation promises in smaller batches
  const batchSize = 100;
  for (let i = 0; i < attendancePromises.length; i += batchSize) {
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(attendancePromises.length / batchSize)}`);
    await Promise.all(attendancePromises.slice(i, i + batchSize));
  }

  // Hardcode a few missed classes for specific students
  const missedClasses = [
    { studentEmail: "ivan.horvat@example.com", groupName: "Grupa 1", subjectName: "Matematika", subjectTypeName: "Predavanja", date: "2025-02-05" },
    { studentEmail: "ana.kovac@example.com", groupName: "Grupa 2", subjectName: "Fizika", subjectTypeName: "Auditorne vježbe", date: "2025-02-12" },
    { studentEmail: "marko.maric@example.com", groupName: "Grupa 3", subjectName: "Programiranje", subjectTypeName: "Laboratorijske vježbe", date: "2025-02-19" },
  ];

  for (const missedClass of missedClasses) {
    const student = students.find((s) => s.email === missedClass.studentEmail);
    const group = groups.find((g) => g.name === missedClass.groupName && g.subjectId === subjects.find((sub) => sub.name === missedClass.subjectName)?.id && g.subjectTypeId === subjectTypes.find((st) => st.name === missedClass.subjectTypeName)?.id);

    if (student && group) {
      await prisma.attendance.updateMany({
        where: {
          studentId: student.id,
          groupId: group.id,
          date: new Date(missedClass.date),
        },
        data: {
          present: false,
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
