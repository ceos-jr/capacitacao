import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogContent,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import AutoResizeTextarea from "@components/Layout/AutoResizeTextarea";
import { type Task } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

interface SubmitTaskAlertProps {
  task: Task | null;
  isOpen: boolean;
  initialData?: string | null;
  onClose: () => void;
  cancelRef: React.MutableRefObject<null>;
}

const SubmitTaskAlert = ({
  task,
  isOpen,
  onClose,
  cancelRef,
  initialData,
}: SubmitTaskAlertProps) => {
  const toast = useToast();
  const utils = trpc.useContext();
  const mutation = trpc.user.submitTask.useMutation({
    onError(err) {
      toast({
        title: "Não foi possível submeter a atividade",
        description: `Erro: ${err.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
    onSuccess() {
      toast({
        title: "A atividade foi submetida com sucesso",
        description: `A atividade ${task?.name} foi submetida.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      utils.user.getTasks4Less.refetch(task!.lessonId);
    },
  });
  const [message, setMessage] = useState(initialData);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Atividade {task?.name}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <FormControl
            id="message"
            isRequired
            isInvalid={!!message && message.length < 1}
          >
            <FormLabel>Messagem</FormLabel>
            <AutoResizeTextarea onChange={(e) => setMessage(e.target.value)}>
              {initialData}
            </AutoResizeTextarea>
            <FormErrorMessage>
              O conteúdo da mensagem é obrigatório
            </FormErrorMessage>
          </FormControl>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            leftIcon={<AiOutlineSend />}
            colorScheme="red"
            ml={3}
            onClick={() => {
              mutation.mutate({
                id: task?.id as string,
                richText: message as string,
              });
              setMessage("");
              onClose();
            }}
          >
            Enviar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubmitTaskAlert;
