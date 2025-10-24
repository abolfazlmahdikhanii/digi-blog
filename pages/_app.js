import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/sonner";
import AppHeader from "@/components/app-header";
import { RightSidebar } from "@/components/right-sidebar";

import LeftSidebar from "@/components/left-sidebar";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;
  const hiddenSidebarPages = ["/post", "/setting"];

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isEditorPage = pathname.startsWith("/editor");
  const isHome = pathname==="/";
  const showSidebars = !isAuthPage && !isAdminPage && !isEditorPage;

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={pageProps.user}>
        <Head></Head>
        <div className=" min-h-screen flex flex-col">
          <AppHeader />
          <div className="container mx-auto flex flex-1">
            {showSidebars && <LeftSidebar />}
            <main className="flex-grow py-8">
              <Component {...pageProps} />
            </main>
            {showSidebars && isHome && <RightSidebar />}
          </div>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
