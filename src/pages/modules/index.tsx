import DashboardLayout from "@components/Layout/DashboardLayout";
import Head from "next/head";
import AllModules from "@components/modules/AllModules";
import UnfinishedUserModules from "@components/modules/UnfinishedUserModules";

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
