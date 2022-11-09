import { Heading, Text } from "@chakra-ui/react";
import DashboardLayout from "@components/Layout/DashboardLayout";
import { trpc } from "@utils/trpc";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";

const Lesson = () => {
  const lessonId = useRouter().query.lessonId as string;
  const lesson = trpc.lesson.getLesson.useQuery({
    lessonId,
  });
  return (
    <>
      <Head>
        <title>Lesson - CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <main className="container flex flex-col p-4 mx-auto h-max">
          {lesson.status !== "success" ? (
            "loading"
          ) : (
            <>
              <Heading>{lesson.data?.name}</Heading>
              <Text as="i">
                Last update {moment(lesson.data?.createdAt).fromNow()}
              </Text>
            </>
          )}
        </main>
      </DashboardLayout>
    </>
  );
};

export default Lesson;
