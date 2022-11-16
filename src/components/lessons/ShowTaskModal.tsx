import { type Task } from "@prisma/client";
import {
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import DisplayMarkdown from "@components/Layout/DisplayMarkdown";

interface ShowTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const ShowTaskModal = ({ task, isOpen, onClose }: ShowTaskModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="self-center place-self-center">
        <ModalHeader>{task?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DisplayMarkdown text={task?.richText ?? ""} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShowTaskModal;
