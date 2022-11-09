import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { type Lesson } from "@prisma/client";
import NextLink from "next/link";

interface LessonListProps {
  lessons: (Lesson & { _count: { tasks: number } })[];
}

const LessonList = ({ lessons }: LessonListProps) => {
  return (
    <TableContainer>
      <Table colorScheme="blackAlpha" bgColor="white" rounded="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Tasks</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lessons.map((lesson) => (
            <Tr key={lesson.id}>
              <Td className="flex gap-x-2 items-center">{lesson.name}</Td>
              <Td isNumeric>/{lesson._count.tasks}</Td>
              <Td isNumeric>
                <NextLink
                  href={`/lessons/${lesson.id}`}
                  className="p-3 font-bold bg-gray-200 rounded-md transition-colors cursor-pointer hover:bg-gray-300"
                >
                  View
                </NextLink>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default LessonList;
