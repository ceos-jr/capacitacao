import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface SeeTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskname: string;
  username: string;
  text: string;
}

const SeeSubmissionModal = ({
  isOpen,
  onClose,
  taskname,
  username,
  text,
}: SeeTaskModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="self-center place-self-center">
        <ModalHeader>
          Atividade {taskname} de {username}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="max-w-none prose"
          >
            {text}
          </ReactMarkdown>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SeeSubmissionModal;
