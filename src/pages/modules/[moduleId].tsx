import { Heading, Text, Stack, Skeleton, SkeletonText } from "@chakra-ui/react";
import DashboardLayout from "@components/Layout/DashboardLayout";
import LessonsList from "@components/modules/LessonsList";
import { trpc } from "@utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";

const UniqueModule = () => {
  const id = useRouter().query.id as string;
  const { data: module } = trpc.module.getUnique.useQuery({
    id,
  });
  return (
    <>
      <Head>
        <title>Dashboard - CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <main className="container flex flex-col p-4 mx-auto h-max">
          {!module ? (
            <UniqueModuleSkeleton />
          ) : (
            <>
              <Heading as="h1" size="3xl">
                {`Modulo de ${module.name}`}
              </Heading>
              <Text>{module?.description}</Text>
              <LessonsList lessons={module.lessons} />
            </>
          )}
        </main>
      </DashboardLayout>
    </>
  );
};

export default UniqueModule;

const UniqueModuleSkeleton = () => {
  return (
    <Stack>
      <Skeleton mb="10" noOfLines={1} height="8" />
      <SkeletonText mb="20" noOfLines={3} />
    </Stack>
  );
};
