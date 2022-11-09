import { PrismaClient, type Prisma } from "@prisma/client";
import { mockUsers as mU } from "../src/utils/mock-user";
const prisma = new PrismaClient();

const modules: Prisma.ModuleCreateInput[] = [
  {
    id: "cla8sob6p000008l0dzndfppl",
    name: "css",
    description: "Seja bem vindos ao módulo CSS",
  },
  {
    id: "cla8sqsem000108l01awh980f",
    name: "javascript",
    description: "Seja bem vindos ao módulo javascript",
  },
  {
    id: "cla8sr63h000208l04vnz5mzk",
    name: "DOM",
    description: "Seja bem vindos ao módulo de DOM",
  },
];

// const lessons: Prisma.LessonCreateManyInput[] = [
//   {
//     id: "cla8ssx1p000308l028yn0hnn",
//     name: "Seletores, Especificidade, Cascata e Herança",
//     moduleId: modules[0]?.id as string,
//   },
//   {
//     name: "Posicionamento CSS",
//     moduleId: modules[0]?.id as string,
//   },
//   {
//     name: "Flexbox Layout",
//     moduleId: modules[0]?.id as string,
//   },
//   {
//     name: "Grid Layout",
//     moduleId: modules[0]?.id as string,
//   },
// ];

async function main() {
  console.log(`Start seeding ...`);
  console.log("creating users");
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
  // console.log("creating modules");
  // await prisma.module.createMany({ data: modules });
  console.log("creating lessons");
  // await prisma.lesson.createMany({ data: lessons });

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
