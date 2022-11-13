import {
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
} from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import { FaUserCircle } from "react-icons/fa";
import NextImage from "next/image";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import React from "react";

const UserMembers = () => {
  const allMembers = trpc.admin.getAllMembers.useQuery();
  return (
    <>
      {!allMembers.data ? (
        <>
          <Skeleton height="30px" />
          <Skeleton height="40" />
        </>
      ) : (
        <>
          <Heading>Membros da CEOS</Heading>
          {allMembers.data.length === 0 ? (
            <Text>
              Nenhum membro da CEOS foi encontrado, veja se há alguma
              confirmação pendente
            </Text>
          ) : (
            <TableContainer className="bg-white rounded-lg shadow-lg">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Usuário</Th>
                    <Th>Cargo</Th>
                    <Th isNumeric>Módulos em progresso</Th>
                    <Th isNumeric>Módulos concluídos</Th>
                    <Th isNumeric>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allMembers.data.map((mem) => (
                    <Tr key={mem.id}>
                      <Td>
                        {" "}
                        <div className="flex gap-x-2 items-center">
                          <div className="relative w-8 h-8">
                            {mem?.image ? (
                              <NextImage
                                src={mem.image}
                                alt="user avatar"
                                fill
                                className="object-cover rounded-full"
                              />
                            ) : (
                              <FaUserCircle className="w-full h-full" />
                            )}
                          </div>
                          {mem.name}
                        </div>
                      </Td>
                      <Td>{mem.role}</Td>
                      <Td isNumeric>
                        {
                          mem.modulesProgress.filter((mod) => !mod.completed)
                            .length
                        }
                      </Td>
                      <Td isNumeric>
                        {
                          mem.modulesProgress.filter((mod) => mod.completed)
                            .length
                        }
                      </Td>
                      <Td className="flex justify-end">
                        <Menu>
                          <MenuButton as={IconButton} icon={<BsThreeDots />} />
                          <MenuList>
                            <MenuItem icon={<BsTrash />}>Delete User</MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </>
  );
};

export default UserMembers;
