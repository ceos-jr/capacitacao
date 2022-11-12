/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import DashboardLayout from "@components/Layout/DashboardLayout";
import EditLinks from "@components/lessons/EditLinks";
import EditProjects from "@components/lessons/EditProjects";
import EditVideos from "@components/lessons/EditVideos";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { type Control, useForm, useWatch } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";

export const LessonWUtils = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "o nome do tópico é necessário" }),
  richText: z.string().min(1, { message: "o conteúdo do tópico é necessário" }),
  videos: z.array(
    z.object({
      name: z.string().min(1, { message: "o nome do video é necessário" }),
      url: z.string().min(1, { message: "o URL do video é necessário" }),
      description: z.string(),
    })
  ),
  links: z.array(
    z.object({
      name: z.string().min(1, { message: "o nome do link é necessário" }),
      url: z.string().min(1, { message: "o URL do link é necessário" }),
      description: z.string(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string().min(1, { message: "o nome do projeto é necessário" }),
      richText: z
        .string()
        .min(1, { message: "o conteúdo do projeto é necessário" }),
    })
  ),
});

export type FormSchemaType = z.infer<typeof LessonWUtils>;

const Edit = () => {
  const router = useRouter();
  const lessonId = useRouter().query.lessonId as string;
  const lesson = trpc.lesson.getLesson.useQuery(
    {
      lessonId,
    },
    { refetchOnWindowFocus: false }
  );

  const mutation = trpc.lesson.updateLessonWUtils.useMutation();

  const {
    handleSubmit,
    control,
    register,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(LessonWUtils),
    defaultValues: {
      id: lesson?.data?.id ?? "",
      name: lesson?.data?.name ?? "",
      richText: lesson?.data?.richText ?? "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormSchemaType) => {
    mutation.mutate(data);
    router.push(`/modules/${lesson.data?.moduleId}`);
  };

  useEffect(() => {
    if (lesson.data) {
      const format: FormSchemaType = {
        id: lesson.data.id,
        name: lesson.data.name,
        richText: lesson.data.richText,
        videos: lesson.data.videos.map((video) => ({
          name: video.name,
          url: video.url,
          description: video.description ?? "",
        })),
        links: lesson.data.links.map((link) => ({
          name: link.name,
          url: link.url,
          description: link.description ?? "",
        })),
        projects: lesson.data.projects.map((proj) => ({
          name: proj.name,
          richText: proj.richText,
        })),
      };

      reset(format);
    }
  }, [lesson.data]);

  return (
    <>
      <Head>
        <title>{lesson.data?.name} - CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col gap-4 p-4 mx-auto">
        {!lesson.data ? (
          "loading..."
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <Heading> Tópico</Heading>
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel htmlFor="name">Nome do tópico</FormLabel>
                <Input
                  id="name"
                  type="name"
                  bgColor="white"
                  aria-invalid={errors.name ? true : false}
                  aria-errormessage="name-error"
                  placeholder="um tópico excelente"
                  {...register("name")}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.richText} isRequired>
                <FormLabel htmlFor="richText">
                  Conteúdo do tópico (em markdown)
                </FormLabel>
                {errors.richText && (
                  <FormErrorMessage className="mb-2">
                    {errors.richText.message}
                  </FormErrorMessage>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Textarea
                    id="richText"
                    bgColor="white"
                    {...register("richText")}
                  />
                  <PreviewText control={control} />
                </div>
              </FormControl>
              <EditVideos
                errors={errors}
                register={register}
                control={control}
              />
              <EditLinks
                errors={errors}
                register={register}
                control={control}
              />
              <EditProjects
                errors={errors}
                register={register}
                control={control}
              />
            </div>
            <Button type="submit">Criar</Button>
          </form>
        )}
      </main>
    </>
  );
};

export default Edit;

Edit.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const PreviewText = ({ control }: { control: Control<FormSchemaType> }) => {
  const text = useWatch({ control, name: "richText" });
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="p-4 max-w-none bg-white rounded-lg prose prose-lg"
    >
      {text}
    </ReactMarkdown>
  );
};
