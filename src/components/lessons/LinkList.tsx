import {
  Text,
  Highlight,
  List,
  ListItem,
  Heading,
  ListIcon,
} from "@chakra-ui/react";
import { type Link } from "@prisma/client";
import { BsGlobe } from "react-icons/bs";
import NextLink from "next/link";

interface LinkListProps {
  links: Link[];
}

const LinkList = ({ links }: LinkListProps) => {
  return (
    <>
      {links.length !== 0 ? (
        <List spacing={4}>
          {links.map((link) => (
            <ListItem key={link.id}>
              <NextLink
                href={link.url}
                className="flex gap-x-4 items-center group"
              >
                <ListIcon
                  as={BsGlobe}
                  className="transition-colors group-hover:text-accent"
                />
                <div className="flex flex-col">
                  <Heading
                    as="h4"
                    size="md"
                    className="transition-colors group-hover:text-accent"
                  >
                    {link.name}
                  </Heading>
                  <Text noOfLines={2}>{link.description}</Text>
                </div>
              </NextLink>
            </ListItem>
          ))}
        </List>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <Text>
            {" "}
            Nenhuma documentação foi disponíbilizada para esse tópico
          </Text>
          <Text>
            {" "}
            Entre em contato com seu{" "}
            <Highlight
              query="ADMIN"
              styles={{ px: "2", py: "1", rounded: "full", bg: "secondary" }}
            >
              ADMIN
            </Highlight>{" "}
            para adicionar a documentação necessária ou adicione uma sugestão
          </Text>
        </div>
      )}
    </>
  );
};

export default LinkList;
