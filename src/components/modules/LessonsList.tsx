import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Roles } from "@utils/constants";
import { useSession } from "@utils/useSession";
import NextLink from "next/link";
import { type RouterTypes } from "@utils/trpc";

interface LessonListProps {
  lessons: { id: string; name: string; tasks: { id: string }[] }[];
  userModRel: RouterTypes["module"]["getUserModStats"]["output"] | undefined;
}

const LessonList = ({ lessons, userModRel }: LessonListProps) => {
  const { data: session } = useSession();
  return (
    <TableContainer>
      <Table colorScheme="blackAlpha" bgColor="white" rounded="md">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th isNumeric>Atividades</Th>
            <Th isNumeric>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lessons.map((lesson) => (
            <Tr key={lesson.id}>
              <Td className="flex gap-x-2 items-center">{lesson.name}</Td>
              <Td isNumeric>{lesson.tasks.length}</Td>
              <Td isNumeric>
                {userModRel && (
                  <NextLink
                    href={`/lessons/${lesson.id}`}
                    className="p-3 mr-2 font-bold bg-gray-200 rounded-md transition-colors cursor-pointer hover:bg-gray-300"
                  >
                    View
                  </NextLink>
                )}
                {session?.user?.role === Roles.Admin && (
                  <NextLink
                    href={`/lessons/${lesson.id}/edit`}
                    className="p-3 mr-2 font-bold bg-gray-200 rounded-md transition-colors cursor-pointer hover:bg-gray-300"
                  >
                    Edit
                  </NextLink>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default LessonList;
