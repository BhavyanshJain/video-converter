import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession, signIn, getProviders } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <button
        className="absolute top-5 left-5 cursor-pointer"
        onClick={() => {
          setLoading(true);
          router.replace("/");
        }}
      >
        <ArrowLeftIcon className="w-6 h-6 sm:w-8 sm:h-8 " />
      </button>

      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="text-2xl mx-auto text-white rounded-lg bg-[#4f46e5] h-12 w-12 font-bold flex items-center justify-center sm:cursor-pointer">
              VC
            </div>

            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div>
            <button
              onClick={() => {
                setLoading(true);
                signIn(providers.google.id);
              }}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Continue with {providers.google.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/converter",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
};
