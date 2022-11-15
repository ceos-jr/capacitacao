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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="p-4 max-w-none bg-white rounded-lg prose prose-lg"
          >
            {task?.richText ?? ""}
          </ReactMarkdown>
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
