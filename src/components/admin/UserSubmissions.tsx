import {
  Button,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Skeleton,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  useDisclosure,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import NextImage from "next/image";
import { trpc } from "@utils/trpc";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineEye, AiOutlineSend, AiOutlineStar } from "react-icons/ai";

const UserSubmissions = () => {
  const lastSubmissions = trpc.admin.getLatestSubmissions.useQuery();
  return (
    <>
      {!lastSubmissions.data ? (
        "loading"
      ) : (
        <>
          <Heading>Envio dos usuários</Heading>
          <TableContainer className="bg-white rounded-lg shadow-lg">
            <Table>
              <Thead>
                <Tr>
                  <Th>Usuário</Th>
                  <Th>Atividade</Th>
                  <Th isNumeric>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lastSubmissions.data.map((sub) => (
                  <Tr key={sub.taskId}>
                    <Td>
                      <div className="flex gap-x-2 items-center">
                        <div className="relative w-8 h-8">
                          {sub?.user.image ? (
                            <NextImage
                              src={sub.user.image}
                              alt="user avatar"
                              fill
                              className="object-cover rounded-full"
                            />
                          ) : (
                            <FaUserCircle className="w-full h-full" />
                          )}
                        </div>
                        {sub.user.name}
                      </div>
                    </Td>
                    <Td>{sub.task.name}</Td>
                    <Td className="flex justify-end">
                      <Menu>
                        <MenuButton as={IconButton} icon={<BsThreeDots />} />
                        <MenuList>
                          <MenuItem
                            icon={<AiOutlineEye />}
                            onClick={() => {
                              console.log("change me daddy");
                            }}
                          >
                            Ver atividade
                          </MenuItem>
                          <MenuItem
                            icon={<AiOutlineSend />}
                            onClick={() => {
                              console.log("change me daddy");
                            }}
                          >
                            Ver envio
                          </MenuItem>
                          <MenuItem
                            icon={<AiOutlineStar />}
                            onClick={() => {
                              console.log("change me daddy");
                            }}
                          >
                            Atribuir nota
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default UserSubmissions;
