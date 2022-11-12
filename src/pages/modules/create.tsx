import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
} from "@chakra-ui/react";
import DashboardLayout from "@components/Layout/DashboardLayout";
import Head from "next/head";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AiFillDelete,
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlinePlus,
} from "react-icons/ai";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";

export const FormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  lessons: z
    .array(
      z.object({
        name: z.string().min(1, { message: "O nome do tópico é obrigatório" }),
        richText: z.string(),
        index: z.number(),
      })
    )
    .min(1, { message: "Você deve incluir pelo menos 1 tópico" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const CreateModule = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const { fields, append, remove, move } = useFieldArray({
    name: "lessons",
    control,
  });

  const createModWLessons = trpc.module.createModWLessons.useMutation();
  const router = useRouter();

  const onSubmit = async (data: FormSchemaType) => {
    data.lessons.forEach((_, index) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      data.lessons[index]!.index = index + 1;
    });
    createModWLessons.mutate(data);
    router.push("/modules");
  };
  return (
    <>
      <Head>
        <title>Criar modulo • CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
      </Head>
      <main className="container flex flex-col p-4 mx-auto h-max">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl className="flex flex-col gap-y-4 mx-auto max-w-4xl">
            <Heading>Modulo</Heading>
            <Box>
              <FormLabel htmlFor="name">Nome do Modulo</FormLabel>
              <Input
                id="name"
                type="name"
                bgColor="white"
                aria-invalid={errors.name ? true : false}
                aria-errormessage="name-error"
                placeholder="o melhor modulo do mundo"
                {...register("name")}
              />
              {errors.name && "O nome do módulo é necessário"}
            </Box>
            <Box>
              <FormLabel htmlFor="description">Descrição do Modulo</FormLabel>
              <Input
                id="description"
                type="name"
                bgColor="white"
                placeholder="uma descrição concisa e util"
                {...register("description")}
              />
            </Box>
            <div className="flex gap-x-4 justify-between">
              <Heading>Tópicos</Heading>
              <Button
                leftIcon={<AiOutlinePlus />}
                colorScheme="green"
                variant="solid"
                onClick={() =>
                  append({
                    name: "",
                    richText: "",
                    index: fields.length + 1,
                  })
                }
              >
                Novo Tópico
              </Button>
            </div>
            {errors.lessons && (
              <div className="text-red-500">{errors.lessons.message}</div>
            )}
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <section className={"section"} key={field.id}>
                    <FormLabel>Nome do tópico</FormLabel>
                    <div className="flex gap-x-4 justify-between">
                      <Input
                        placeholder="nome"
                        {...register(`lessons.${index}.name` as const)}
                        bgColor="white"
                      />
                      <Button
                        leftIcon={<AiFillDelete />}
                        colorScheme="red"
                        variant="solid"
                        onClick={() => remove(index)}
                      >
                        Deletar
                      </Button>
                      <Icon
                        as={AiOutlineArrowUp}
                        w={6}
                        h={6}
                        className="transition-colors cursor-pointer hover:text-secondary"
                        onClick={() => {
                          move(index, index - 1);
                        }}
                      />
                      <Icon
                        as={AiOutlineArrowDown}
                        w={6}
                        h={6}
                        className="transition-colors cursor-pointer hover:text-secondary"
                        onClick={() => {
                          move(index, index + 1);
                        }}
                      />
                    </div>
                  </section>
                </div>
              );
            })}
            <Button
              variant="solid"
              colorScheme="red"
              className=""
              type="submit"
            >
              Criar Modulo
            </Button>
          </FormControl>
        </form>
      </main>
    </>
  );
};

export default CreateModule;

CreateModule.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
