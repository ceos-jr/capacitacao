import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
} from "@chakra-ui/react";
import {
  type FieldErrorsImpl,
  useFieldArray,
  type UseFormRegister,
  type Control,
} from "react-hook-form";
import { AiFillDelete, AiOutlineArrowUp, AiOutlinePlus } from "react-icons/ai";
import { type FormSchemaType } from "src/pages/lessons/[lessonId]/edit";

const EditLinks = ({
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
    name: "links",
  });
  return (
    <>
      <div className="flex gap-x-4 justify-between">
        <Heading>Links</Heading>
        <Button
          leftIcon={<AiOutlinePlus />}
          colorScheme="green"
          variant="solid"
          onClick={() =>
            append({
              name: "",
              url: "",
              description: "",
            })
          }
        >
          Novo Link
        </Button>
      </div>
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <div className="flex gap-x-4 justify-between items-center">
              <div className="flex flex-col w-full">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <FormControl
                    isRequired
                    isInvalid={!!errors?.links && !!errors.links[index]?.name}
                  >
                    <FormLabel>Nome do link</FormLabel>
                    <Input
                      placeholder="nome"
                      {...register(`links.${index}.name` as const)}
                      bgColor="white"
                    />
                    {errors.links && errors.links[index]?.name && (
                      <FormErrorMessage>
                        {errors.links[index]?.name?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={!!errors?.links && !!errors.links[index]?.url}
                  >
                    <FormLabel>URL do link</FormLabel>
                    <Input
                      placeholder="url"
                      {...register(`links.${index}.url` as const)}
                      bgColor="white"
                      type="url"
                    />
                    {errors.links && errors.links[index]?.url && (
                      <FormErrorMessage>
                        {errors.links[index]?.url?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <FormLabel className="mt-4">Descrição do link</FormLabel>
                <Input
                  placeholder="descrição"
                  {...register(`links.${index}.description` as const)}
                  bgColor="white"
                />
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

export default EditLinks;
