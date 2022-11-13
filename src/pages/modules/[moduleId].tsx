import {
  Heading,
  Text,
  Stack,
  Skeleton,
  SkeletonText,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import DashboardLayout from "@components/Layout/DashboardLayout";
import ModSuggestionModal from "@components/Layout/ModSuggestionModal";
import LessonsList from "@components/modules/LessonsList";
import { trpc } from "@utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import { AiOutlineInbox } from "react-icons/ai";

const UniqueModule = () => {
  const moduleId = useRouter().query.moduleId as string;
  const { data: moduleData } = trpc.module.getUnique.useQuery({
    moduleId,
  });
  const { data: userRel } = trpc.module.getUserModStats.useQuery({ moduleId });
  const utils = trpc.useContext();

  const toast = useToast();
  const subsToModule = trpc.module.subsToModule.useMutation({
    onError(err) {
      toast({
        title: "Não foi possível se inscrever no módulo",
        description: `Erro: ${err.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
    onSuccess() {
      toast({
        title: "Você foi inscrito com sucesso no módulo",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      utils.module.getUserModStats.refetch({ moduleId });
    },
  });

  const desubToModule = trpc.module.desubToModule.useMutation({
    async onMutate() {
      await utils.module.getUserModStats.cancel({ moduleId });
      const prevData = utils.module.getUserModStats.getData({ moduleId });
      utils.module.getUserModStats.setData(null, { moduleId });
      return { prevData };
    },
    onError(err, _, ctx) {
      utils.module.getUserModStats.setData(ctx?.prevData);
      toast({
        title: "Não foi possível se desincrever do módulo",
        description: `Erro: ${err.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
    onSuccess() {
      toast({
        title: "Você foi desenscrevido com sucesso no módulo",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>{moduleData?.name} • CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
      </Head>
      <main className="container flex flex-col p-4 mx-auto h-max">
        <ModSuggestionModal
          isOpen={isOpen}
          onClose={onClose}
          moduleId={moduleId}
        />
        {!moduleData ? (
          <UniqueModuleSkeleton />
        ) : (
          <>
            <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
              <Heading as="h1" size="3xl">
                {`Modulo de ${moduleData.name}`}
              </Heading>
              {!userRel ? (
                <Button
                  colorScheme="green"
                  onClick={() => subsToModule.mutate(moduleData)}
                >
                  Inscrever
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={onOpen}
                    leftIcon={<AiOutlineInbox />}
                    colorScheme="twitter"
                  >
                    Sugestões
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() =>
                      desubToModule.mutate({ moduleId: moduleData.id })
                    }
                  >
                    Desinscrever
                  </Button>
                </div>
              )}
            </div>
            <Text className="my-4">{moduleData?.description}</Text>
            <LessonsList lessons={moduleData.lessons} userModRel={userRel} />
          </>
        )}
      </main>
    </>
  );
};

export default UniqueModule;

UniqueModule.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const UniqueModuleSkeleton = () => {
  return (
    <Stack>
      <Skeleton mb="10" noOfLines={1} height="8" />
      <SkeletonText mb="20" noOfLines={3} />
    </Stack>
  );
};
