import { SessionProvider, useSession } from "next-auth/react";
import { myNextComponentType } from "../types/myTypes";
import { FC, ReactNode, useEffect } from "react";
import "@tremor/react/dist/esm/tremor.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/globals.css";

type Props = {
  children: ReactNode;
};

type myAppProps = AppProps & {
  Component: myNextComponentType;
  pageProps: any;
};

export default function App({ Component, pageProps }: myAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

// Dosen't need to check session on all authentificated pages , just add <pagename>.auth=true to the page
const Auth: FC<Props> = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isUser = !!session?.user;
  useEffect(() => {
    if (status === "loading") return;
    if (!isUser) router.replace("/login");
  }, [isUser, status, router]);

  if (isUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
      Loading...
    </div>
  );
};
