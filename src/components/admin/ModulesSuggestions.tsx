import {
  Button,
  Heading,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Highlight,
  Tr,
} from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import NextLink from "next/link";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

const ModSuggTabAdmin = () => {
  const utils = trpc.useContext();
  const modSuggestions = trpc.admin.getModSuggestions.useQuery();
  const changeSuggStts = trpc.module.updSttsOnModSugg.useMutation({
    async onMutate(data) {
      await utils.admin.getModSuggestions.cancel();
      const prevData = utils.admin.getModSuggestions.getData();
      prevData?.forEach((el) => {
        if (el.id === data.id) el.readed = !el.readed;
      });
      utils.admin.getModSuggestions.setData(prevData);
    },
  });
  return (
    <>
      {!modSuggestions.data ? (
        "loading"
      ) : (
        <>
          <Heading>Sugestões para os módulos</Heading>
          <Tabs
            className="p-4 bg-white rounded-lg shadow-lg"
            variant="soft-rounded"
          >
            <TabList>
              <Tab _selected={{ color: "white", bg: "red.500" }}>Não lidos</Tab>
              <Tab _selected={{ color: "white", bg: "primary" }}>Todos</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {modSuggestions.data.filter((sugg) => !sugg.readed).length ===
                0 ? (
                  <Text>
                    <Highlight
                      query="não lida"
                      styles={{
                        px: "2",
                        py: "1",
                        rounded: "full",
                        bg: "red.100",
                      }}
                    >
                      Nenhuma sugestão não lida foi encontrada
                    </Highlight>
                  </Text>
                ) : (
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Módulo</Th>
                          <Th>Usuário</Th>
                          <Th isNumeric>Data</Th>
                          <Th isNumeric>Ação</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {modSuggestions.data
                          .filter((sugg) => !sugg.readed)
                          .map((sugg) => (
                            <Tr key={sugg.id}>
                              <Td>{sugg.module.name}</Td>
                              <Td>{sugg.user.name}</Td>
                              <Td isNumeric>
                                {moment(sugg.createdAt).fromNow()}
                              </Td>
                              <Td
                                isNumeric
                                className="flex gap-x-2 justify-end items-center"
                              >
                                {" "}
                                <NextLink
                                  href={`/admin/modsuggestions/${sugg.id}`}
                                  className="p-3 mr-2 font-bold bg-gray-200 rounded-md transition-colors cursor-pointer hover:bg-gray-300"
                                >
                                  View
                                </NextLink>
                                {sugg.readed ? (
                                  <Button
                                    colorScheme="red"
                                    onClick={() =>
                                      changeSuggStts.mutate({
                                        id: sugg.id,
                                        readed: !sugg.readed,
                                      })
                                    }
                                  >
                                    Marcar como não Lido
                                  </Button>
                                ) : (
                                  <Button
                                    colorScheme="whatsapp"
                                    onClick={() =>
                                      changeSuggStts.mutate({
                                        id: sugg.id,
                                        readed: !sugg.readed,
                                      })
                                    }
                                  >
                                    Marcar como Lido
                                  </Button>
                                )}
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
              <TabPanel>
                {modSuggestions.data.length === 0 ? (
                  <Text>
                    <Highlight
                      query="nenhuma sugestão"
                      styles={{
                        px: "2",
                        py: "1",
                        rounded: "full",
                        bg: "red.100",
                      }}
                    >
                      Nenhuma sugestão foi encontrada
                    </Highlight>
                  </Text>
                ) : (
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Módulo</Th>
                          <Th>Usuário</Th>
                          <Th isNumeric>Data</Th>
                          <Th isNumeric>Ação</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {modSuggestions.data.map((sugg) => (
                          <Tr key={sugg.id}>
                            <Td>{sugg.module.name}</Td>
                            <Td>{sugg.user.name}</Td>
                            <Td isNumeric>
                              {moment(sugg.createdAt).fromNow()}
                            </Td>
                            <Td
                              isNumeric
                              className="flex gap-x-2 justify-end items-center"
                            >
                              {" "}
                              <NextLink
                                href={`/admin/modsuggestions/${sugg.id}`}
                                className="p-3 mr-2 font-bold bg-gray-200 rounded-md transition-colors cursor-pointer hover:bg-gray-300"
                              >
                                View
                              </NextLink>
                              {sugg.readed ? (
                                <Button
                                  colorScheme="red"
                                  onClick={() =>
                                    changeSuggStts.mutate({
                                      id: sugg.id,
                                      readed: !sugg.readed,
                                    })
                                  }
                                >
                                  Marcar como não Lido
                                </Button>
                              ) : (
                                <Button
                                  colorScheme="whatsapp"
                                  onClick={() =>
                                    changeSuggStts.mutate({
                                      id: sugg.id,
                                      readed: !sugg.readed,
                                    })
                                  }
                                >
                                  Marcar como Lido
                                </Button>
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </>
  );
};

export default ModSuggTabAdmin;
