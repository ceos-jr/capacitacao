import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  Textarea,
} from "@chakra-ui/react";
import {
  type FieldErrorsImpl,
  useFieldArray,
  type UseFormRegister,
  type Control,
  useWatch,
} from "react-hook-form";
import { AiFillDelete, AiOutlineArrowUp, AiOutlinePlus } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type FormSchemaType } from "src/pages/lessons/[lessonId]/edit";

const EditProjects = ({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<FormSchemaType>;
  errors: FieldErrorsImpl<FormSchemaType>;
  control: Control<FormSchemaType>;
}) => {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "projects",
  });
  return (
    <>
      <div className="flex gap-x-4 justify-between">
        <Heading>Projetos</Heading>
        <Button
          leftIcon={<AiOutlinePlus />}
          colorScheme="green"
          variant="solid"
          onClick={() =>
            append({
              name: "",
              richText: "",
            })
          }
        >
          Novo Projeto
        </Button>
      </div>
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <div className="flex gap-x-4 justify-between items-center">
              <div className="flex flex-col w-full">
                <FormControl
                  isRequired
                  isInvalid={
                    !!errors?.projects && !!errors.projects[index]?.name
                  }
                >
                  <FormLabel>Nome do project</FormLabel>
                  <Input
                    placeholder="nome"
                    {...register(`projects.${index}.name` as const)}
                    bgColor="white"
                  />
                  {errors.projects && errors.projects[index]?.name && (
                    <FormErrorMessage>
                      {errors.projects[index]?.name?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    !!errors?.projects && !!errors.projects[index]?.richText
                  }
                >
                  <FormLabel className="mt-4">
                    Conteúdo do projeto (em Markdown)
                  </FormLabel>
                  {errors.projects && errors.projects[index]?.richText && (
                    <FormErrorMessage>
                      {errors.projects[index]?.richText?.message}
                    </FormErrorMessage>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <Textarea
                      placeholder="#hello meu men"
                      {...register(`projects.${index}.richText` as const)}
                      bgColor="white"
                    />
                    <PreviewText control={control} index={index} />
                  </div>
                </FormControl>
              </div>
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
            </div>
          </div>
        );
      })}
    </>
  );
};

const PreviewText = ({
  control,
  index,
}: {
  control: Control<FormSchemaType>;
  index: number;
}) => {
  const projects = useWatch({ control, name: "projects" });
  const getRichText = () => {
    if (projects) {
      return projects[index]?.richText ?? "";
    }
    return "";
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="p-4 max-w-none bg-white rounded-lg prose prose-lg"
    >
      {getRichText()}
    </ReactMarkdown>
  );
};

export default EditProjects;
