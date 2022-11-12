import DashboardLayout from "@components/Layout/DashboardLayout";
import Head from "next/head";
import { Button, Heading, SimpleGrid } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import ModuleLoadingSke from "@components/modules/ModuleLoadingSkeleton";
import ModuleCard from "@components/modules/ModuleCard";
import { useSession } from "@utils/useSession";
import { Roles } from "@utils/constants";
import { BsJournalPlus } from "react-icons/bs";
import NextLink from "next/link";

const Modules = () => {
  const { data: allModules, error } = trpc.module.getAll.useQuery();
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard - CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col gap-4 p-4 mx-auto min-h-screen">
        <div className="flex flex-col gap-2 justify-between sm:flex-row">
          {" "}
          <Heading as="h1" size="3xl">
            Todos os Modulos
          </Heading>
          {session?.user?.role === Roles.Admin && (
            <NextLink href="/modules/create">
              {" "}
              <Button
                colorScheme="whatsapp"
                variant="solid"
                className="hidden sm:inline-flex"
                leftIcon={<BsJournalPlus />}
              >
                Criar
              </Button>
            </NextLink>
          )}
        </div>
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} gap={6}>
          {!allModules && !error ? (
            <>
              <ModuleLoadingSke /> <ModuleLoadingSke />
              <ModuleLoadingSke />
              <ModuleLoadingSke />
            </>
          ) : (
            allModules?.map((module) => (
              <ModuleCard
                id={module.id}
                name={module.name}
                description={module?.description}
                key={module.id}
                updatedAt={module.updatedAt}
              />
            ))
          )}
        </SimpleGrid>
      </main>
    </>
  );
};

export default Modules;

Modules.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
