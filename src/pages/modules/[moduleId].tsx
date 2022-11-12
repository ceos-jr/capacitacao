import {
  Heading,
  Text,
  Stack,
  Skeleton,
  SkeletonText,
  HStack,
  Button,
} from "@chakra-ui/react";
import DashboardLayout from "@components/Layout/DashboardLayout";
import LessonsList from "@components/modules/LessonsList";
import { trpc } from "@utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import { type UserModuleProgress } from "@prisma/client";

const UniqueModule = () => {
  const moduleId = useRouter().query.moduleId as string;
  const { data: module } = trpc.module.getUnique.useQuery({
    moduleId,
  });
  const { data: userRel } = trpc.module.getUserModStats.useQuery({ moduleId });
  const utils = trpc.useContext();

  const subsToModule = trpc.module.subsToModule.useMutation({
    async onMutate() {
      const dummyUser: UserModuleProgress = {
        userId: "123123",
        moduleId: moduleId,
        completed: false,
      };
      await utils.module.getUserModStats.cancel();
      const prevData = utils.module.getUserModStats.getData();
      utils.module.getUserModStats.setData(dummyUser);
      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.module.getUserModStats.setData(ctx?.prevData);
    },
    onSettled() {
      utils.module.getUserModStats.invalidate();
    },
  });

  const desubToModule = trpc.module.desubToModule.useMutation({
    async onMutate() {
      await utils.module.getUserModStats.cancel();
      const prevData = utils.module.getUserModStats.getData();
      utils.module.getUserModStats.setData(null);
      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.module.getUserModStats.setData(ctx?.prevData);
    },
    onSettled() {
      utils.module.getUserModStats.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>Dashboard - CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col p-4 mx-auto h-max">
        {!module ? (
          <UniqueModuleSkeleton />
        ) : (
          <>
            <HStack justifyContent="space-between">
              <Heading as="h1" size="3xl">
                {`Modulo de ${module.name}`}
              </Heading>
              <div className="hidden sm:inline-flex">
                {!userRel ? (
                  <Button
                    colorScheme="green"
                    onClick={() => subsToModule.mutate(module)}
                  >
                    Inscrever
                  </Button>
                ) : (
                  <Button
                    colorScheme="red"
                    onClick={() =>
                      desubToModule.mutate({ moduleId: module.id })
                    }
                  >
                    Desinscrever
                  </Button>
                )}
              </div>
            </HStack>
            <Text className="mb-4">{module?.description}</Text>
            <LessonsList lessons={module.lessons} userModRel={userRel} />
          </>
        )}
      </main>
    </>
  );
};

export default UniqueModule;

UniqueModule.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const UniqueModuleSkeleton = () => {
  return (
    <Stack>
      <Skeleton mb="10" noOfLines={1} height="8" />
      <SkeletonText mb="20" noOfLines={3} />
    </Stack>
  );
};
