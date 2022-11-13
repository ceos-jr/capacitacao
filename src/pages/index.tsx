import Head from "next/head";
import { signIn, signOut } from "next-auth/react";

import { trpc } from "../utils/trpc";
import ChangeRoleFooter from "@components/Layout/ChangeRoleFooter";
import { useSession } from "@utils/useSession";

import DashboardLayout from "@components/Layout/DashboardLayout";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import Stats from "@components/home/Stats";
import MostRecentModules from "@components/home/MostRecentModules";

const Home = () => {
  return (
    <>
      <Head>
        <title>Dashboard • CEOS</title>
        <meta name="description" content="CEOS Capacitacao" />
      </Head>
      <main className="flex flex-col gap-4 p-4 h-max">
        <Stats />
        <MostRecentModules />
        <AuthShowcase />
        <ChangeRoleFooter />
      </main>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-center font-inter">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="py-2 px-4 text-xl bg-violet-50 rounded-md border border-black shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerAuthSession(context);

  console.log("session", session);

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
}
