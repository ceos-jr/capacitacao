import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  useToast,
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
  name: z.string().min(1, { message: "O nome do módulo é necessário" }),
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
    defaultValues: { lessons: [{ name: "", richText: "", index: 0 }] },
    mode: "all",
  });

  const { fields, append, remove, move } = useFieldArray({
    name: "lessons",
    control,
  });

  const router = useRouter();
  const toast = useToast();
  const createModWLessons = trpc.module.createModWLessons.useMutation({
    onError(err) {
      toast({
        title: "Não foi possível criar o módulo",
        description: `Erro: ${err.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
    onSuccess() {
      toast({
        title: "O módulo foi criado com sucesso",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      router.push("/modules");
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    data.lessons.forEach((_, index) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      data.lessons[index]!.index = index + 1;
    });
    createModWLessons.mutate(data);
  };
  return (
    <>
      <Head>
        <title>Criar modulo • CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
      </Head>
      <main className="container flex flex-col p-4 mx-auto h-max">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-4 mx-auto max-w-4xl">
            <Heading>Modulo</Heading>
            <FormControl id="name" isInvalid={!!errors.name} isRequired>
              <FormLabel>Nome do Modulo</FormLabel>
              <Input
                bgColor="white"
                placeholder="o melhor modulo do mundo"
                {...register("name")}
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="description">
              <FormLabel>Descrição do Modulo</FormLabel>
              <Input
                bgColor="white"
                placeholder="uma descrição concisa e util"
                {...register("description")}
              />
            </FormControl>
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
            {errors.lessons?.message && (
              <div className="text-red-500">{errors.lessons.message}</div>
            )}
            {fields.map((field, index) => {
              return (
                <FormControl
                  key={field.id}
                  id={`lessons_${index}_name`}
                  isInvalid={!!errors.lessons && !!errors.lessons[index]}
                  isRequired
                >
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
                  {errors.lessons && errors.lessons[index]?.name && (
                    <FormErrorMessage>
                      {errors.lessons[index]?.name?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
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
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateModule;

CreateModule.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
