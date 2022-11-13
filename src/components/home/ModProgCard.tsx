import {
  Progress,
  Box,
  Text,
  Heading,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import moment from "moment";
import NextLink from "next/link";
import "moment/locale/pt-br";
import { trpc } from "@utils/trpc";
moment.locale("pt-br");

interface ModProgCardProps {
  id: string;
  name: string;
  description: string | null;
  lastTimeSeen: Date;
  lessonProg: { completed: boolean }[];
}

const ModProgCard = ({
  id,
  name,
  description,
  lastTimeSeen,
  lessonProg,
}: ModProgCardProps) => {
  const updateLastSeen = trpc.user.updModLastSeen.useMutation();
  return (
    <NextLink
      href={`/modules/${id}`}
      className="overflow-hidden relative shadow-lg"
      onClick={() => updateLastSeen.mutate(id)}
    >
      <LinkBox
        p="5"
        h="full"
        borderWidth="1px"
        rounded="md"
        bg="white"
        role="group"
      >
        <Box
          as="time"
          dateTime="2021-01-15 15:30:00 +0000 UTC"
          className="italic"
        >
          Ultima vez visto {moment(lastTimeSeen).fromNow()}
        </Box>
        <Heading
          size="md"
          my="2"
          _groupHover={{ color: "secondary" }}
          className="transition-colors"
        >
          <LinkOverlay href={`/modules/${id}`}>{name}</LinkOverlay>
        </Heading>
        <Text>{description && description}</Text>
      </LinkBox>
      <Progress
        hasStripe
        isAnimated
        colorScheme="whatsapp"
        value={
          lessonProg.filter((less) => less.completed).length / lessonProg.length
        }
        className="absolute right-0 left-0 -inset-3 w-full rounded-b-lg"
      />
    </NextLink>
  );
};

export default ModProgCard;
