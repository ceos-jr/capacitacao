import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Badge,
} from "@chakra-ui/react";
import { TaskStatus } from "@utils/constants";
import { trpc, type RouterTypes } from "@utils/trpc";

type TasksType = NonNullable<
  RouterTypes["lesson"]["getLesson"]["output"]
>["tasks"];

interface TasklistProps {
  lessonId: string;
  tasks: TasksType | null;
}

const Tasklist = ({ lessonId, tasks }: TasklistProps) => {
  const { data: userTasksStts } = trpc.user.getTasks4Less.useQuery(lessonId);

  const getTaskStatus = (taskId: string) => {
    return userTasksStts?.find((uTask) => uTask.taskId === taskId)
      ?.status as TaskStatus;
  };

  const getGrade = (taskId: string) => {
    return userTasksStts?.find((uTask) => uTask.taskId === taskId)?.grade;
  };
  return (
    <>
      {!tasks ? (
        "loading..."
      ) : (
        <TableContainer className="bg-white rounded-lg shadow-lg">
          <Table>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Status</Th>
                <Th isNumeric>Nota</Th>
                <Th isNumeric>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task.id}>
                  <Td>{task.name}</Td>
                  <Td>
                    {userTasksStts &&
                    getTaskStatus(task.id) === TaskStatus.Completed ? (
                      <Badge colorScheme="green">Completado</Badge>
                    ) : getTaskStatus(task.id) === TaskStatus.Submitted ? (
                      <Badge colorScheme="purple">Submetido</Badge>
                    ) : (
                      <Badge colorScheme="red">Pendente</Badge>
                    )}
                  </Td>
                  <Td isNumeric>
                    {getGrade(task.id) ? getGrade(task.id) : "sem nota"}
                  </Td>
                  <Td isNumeric>
                    <Button>...</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default Tasklist;
