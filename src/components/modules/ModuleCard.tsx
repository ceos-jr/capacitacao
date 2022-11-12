import { Heading, Box, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import moment from "moment";
import NextLink from "next/link";

type ModuleCardProps = {
  id: string;
  name: string;
  updatedAt: Date;
  description: string | null;
};

export const ModuleCard = ({
  updatedAt,
  name,
  description,
  id,
}: ModuleCardProps) => {
  return (
    <NextLink href={`/modules/${id}`}>
      <LinkBox
        as="article"
        maxW="sm"
        p="5"
        h="full"
        borderWidth="1px"
        rounded="md"
        bg="white"
        role="group"
      >
        <Box as="time" dateTime="2021-01-15 15:30:00 +0000 UTC">
          {moment(updatedAt).fromNow()}
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
    </NextLink>
  );
};

export default ModuleCard;