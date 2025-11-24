import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/sonner";
import AppHeader from "@/components/app-header";
import { RightSidebar } from "@/components/right-sidebar";

import LeftSidebar from "@/components/left-sidebar";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@bprogress/next/pages";
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;
  const hiddenSidebarPages = ["/post", "/setting"];

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isEditorPage = pathname.startsWith("/editor");
  const isWelcome = pathname.startsWith("/welcome");
  const isStarted = pathname.startsWith("/get-started");
  const isHome = pathname === "/";
  const showSidebars =
    !isAuthPage && !isAdminPage && !isEditorPage && !isWelcome && !isStarted;
  const showHeader = !isAuthPage && !isStarted && !isWelcome;

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={pageProps.user}>
        <Head></Head>
        <ThemeProvider
          attribute={"class"}
          enableSystem={false}
          defaultTheme="dark"
        >
          <div className=" min-h-screen flex flex-col ">
            {showHeader && <AppHeader />}
            <div className="container mx-auto flex flex-1">
              {showSidebars && <LeftSidebar />}
              <ProgressProvider
                height="4px"
                color="#3D3CD7"
                options={{ showSpinner: false }}
                shallowRouting
              >
                <main className="flex-grow py-8 px-2 md:px-0">
                  <Component {...pageProps} />
                </main>
              </ProgressProvider>
              {showSidebars && isHome && <RightSidebar />}
            </div>
            <Toaster richColors />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
