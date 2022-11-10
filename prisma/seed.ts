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

const lessons: Prisma.LessonCreateManyInput[] = [
  {
    id: "cla8ssx1p000308l028yn0hnn",
    name: "Seletores, Especificidade, Cascata e Herança",
    moduleId: modules[0]?.id as string,
    richText: "",
  },
  {
    name: "Posicionamento CSS",
    moduleId: modules[0]?.id as string,
    richText: "",
  },
  {
    name: "Flexbox Layout",
    moduleId: modules[0]?.id as string,
    richText: "",
  },
  {
    name: "Grid Layout",
    moduleId: modules[0]?.id as string,
    richText: "",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  console.log("creating users");
  await prisma.user.upsert({
    create: {
      id: mU.ADMIN.id,
      name: mU.ADMIN.name,
      email: mU.ADMIN.email,
      role: "ADMIN",
    },
    update: {},
    where: { email: mU.ADMIN.email },
  });
  await prisma.user.upsert({
    create: {
      id: mU.MEMBER.id,
      name: mU.MEMBER.name,
      email: mU.MEMBER.email,
      role: "MEMBER",
    },
    update: {},
    where: { email: mU.MEMBER.email },
  });
  console.log("creating modules");
  await prisma.module.createMany({ data: modules });
  console.log("creating lessons");
  await prisma.lesson.createMany({ data: lessons });

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
