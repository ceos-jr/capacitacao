import { PrismaClient } from "@prisma/client";
import { mockUsers as mU } from "../src/utils/mock-user";
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  await prisma.user.upsert({
    create: {
      id: mU.TEACHER.id,
      name: mU.TEACHER.name,
      email: mU.TEACHER.email,
      role: "TEACHER",
    },
    update: {},
    where: { email: mU.TEACHER.email },
  });
  await prisma.user.upsert({
    create: {
      id: mU.STUDENT.id,
      name: mU.STUDENT.name,
      email: mU.STUDENT.email,
      role: "STUDENT",
    },
    update: {},
    where: { email: mU.STUDENT.email },
  });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
