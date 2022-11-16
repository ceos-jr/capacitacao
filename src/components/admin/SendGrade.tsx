import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Button,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

interface SendGradeProps {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.MutableRefObject<null>;
  username: string;
  userId: string;
  taskname: string;
  taskId: string;
}

const SendGrade = ({
  username,
  taskname,
  userId,
  taskId,
  isOpen,
  onClose,
  cancelRef,
}: SendGradeProps) => {
  const toast = useToast();
  const mutation = trpc.admin.attributeGrade.useMutation({
    onError(err) {
      toast({
        title: "Não foi possível atribuir uma nota",
        description: `Erro: ${err.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
    onSuccess() {
      toast({
        title: "A nota do usuário foi atualizada com sucesso",
        description: `A atividade do ${username} teve uma nota atribuida.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    },
  });
  const [grade, setGrade] = useState(3);
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
        <AlertDialogHeader>Atribuindo nota para a atividade</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody className="flex flex-col gap-4">
          <Text>
            Atribua uma nota entre <span className="font-bold">0 e 5</span> para
            a atividade {taskname} do usuário {username}
          </Text>
          <NumberInput
            max={5}
            min={0}
            precision={1}
            defaultValue={3}
            step={0.1}
            clampValueOnBlur={false}
            onChange={(value) => setGrade(parseFloat(value))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            leftIcon={<AiOutlineSend />}
            isDisabled={grade < 0 || grade > 5}
            colorScheme="twitter"
            ml={3}
            onClick={() => {
              mutation.mutate({ taskId, userId });
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

export default SendGrade;
