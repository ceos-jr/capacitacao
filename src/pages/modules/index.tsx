import DashboardLayout from "@components/Layout/DashboardLayout";
import Head from "next/head";
import AllModules from "@components/modules/AllModules";
import UnfinishedUserModules from "@components/modules/UnfinishedUserModules";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const Modules = () => {
  return (
    <>
      <Head>
        <title>Modulos • CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
      </Head>
      <main className="container flex flex-col gap-4 p-4 mx-auto h-max">
        <UnfinishedUserModules />
        <AllModules />
      </main>
    </>
  );
};

export default Modules;

Modules.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
