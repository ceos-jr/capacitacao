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

const LessonSuggestions = () => {
  const utils = trpc.useContext();
  const lessSuggestions = trpc.admin.getLessSuggestions.useQuery();
  const changeLessStts = trpc.lesson.updSttsOnLessSugg.useMutation({
    async onMutate(data) {
      await utils.admin.getLessSuggestions.cancel();
      const prevData = utils.admin.getLessSuggestions.getData();
      prevData?.forEach((el) => {
        if (el.id === data.id) el.readed = !el.readed;
      });
      utils.admin.getLessSuggestions.setData(prevData);
    },
  });
  return (
    <>
      {!lessSuggestions.data ? (
        "loading"
      ) : (
        <>
          <Heading>Sugestões para os tópicos</Heading>
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
                {lessSuggestions.data.filter((sugg) => !sugg.readed).length ===
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
                          <Th>Tópico</Th>
                          <Th>Usuário</Th>
                          <Th isNumeric>Data</Th>
                          <Th isNumeric>Ação</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {lessSuggestions.data
                          .filter((sugg) => !sugg.readed)
                          .map((sugg) => (
                            <Tr key={sugg.id}>
                              <Td>{sugg.lesson.name}</Td>
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
                                      changeLessStts.mutate({
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
                                      changeLessStts.mutate({
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
                {lessSuggestions.data.length === 0 ? (
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
                          <Th>Tópico</Th>
                          <Th>Usuário</Th>
                          <Th isNumeric>Data</Th>
                          <Th isNumeric>Ação</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {lessSuggestions.data.map((sugg) => (
                          <Tr key={sugg.id}>
                            <Td>{sugg.lesson.name}</Td>
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
                                    changeLessStts.mutate({
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
                                    changeLessStts.mutate({
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

export default LessonSuggestions;
