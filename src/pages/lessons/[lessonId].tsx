import { Heading, Skeleton, SkeletonText, Stack, Text } from "@chakra-ui/react";
import DashboardLayout from "@components/Layout/DashboardLayout";
import ResourceTab from "@components/lessons/ResourceTab";
import { trpc } from "@utils/trpc";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Lesson = () => {
  const lessonId = useRouter().query.lessonId as string;
  const lesson = trpc.lesson.getLesson.useQuery({
    lessonId,
  });

  return (
    <>
      <Head>
        <title>{lesson?.data?.name} • CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col gap-4 p-4 mx-auto">
        {!lesson.data ? (
          <LessonSkeleton />
        ) : (
          <>
            <Heading as="h1" size="2xl">
              {lesson.data?.name}
            </Heading>
            <Text as="i">
              Last update {moment(lesson.data?.updatedAt).fromNow()}
            </Text>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="max-w-none prose prose-lg"
            >
              {lesson.data.richText}
            </ReactMarkdown>
            <ResourceTab
              links={lesson.data.links}
              videos={lesson.data.videos}
              projects={lesson.data.projects}
            />
          </>
        )}
      </main>
    </>
  );
};

export default Lesson;
Lesson.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const LessonSkeleton = () => {
  return (
    <Stack>
      <Skeleton mb="10" noOfLines={1} height="8" />
      <SkeletonText mb="20" noOfLines={3} />
      <Skeleton mb="20" height="56" />
    </Stack>
  );
};
