import {
  Heading,
  Text,
  Stack,
  Skeleton,
  SkeletonText,
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
  const { data: moduleData } = trpc.module.getUnique.useQuery({
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
        startedAt: new Date(),
        lastTimeSeen: new Date(),
        completedAt: null,
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
        <title>{moduleData?.name} • CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
      </Head>
      <main className="container flex flex-col p-4 mx-auto h-max">
        {!moduleData ? (
          <UniqueModuleSkeleton />
        ) : (
          <>
            <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
              <Heading as="h1" size="3xl">
                {`Modulo de ${moduleData.name}`}
              </Heading>
              {!userRel ? (
                <Button
                  colorScheme="green"
                  onClick={() => subsToModule.mutate(moduleData)}
                >
                  Inscrever
                </Button>
              ) : (
                <Button
                  colorScheme="red"
                  onClick={() =>
                    desubToModule.mutate({ moduleId: moduleData.id })
                  }
                >
                  Desinscrever
                </Button>
              )}
            </div>
            <Text className="my-4">{moduleData?.description}</Text>
            <LessonsList lessons={moduleData.lessons} userModRel={userRel} />
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
