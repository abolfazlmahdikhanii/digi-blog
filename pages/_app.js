import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/sonner";
import AppHeader from "@/components/app-header";
import { RightSidebar } from "@/components/right-sidebar";

import LeftSidebar from "@/components/left-sidebar";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isEditorPage = pathname.startsWith("/editor");
  const showSidebars = !isAuthPage && !isAdminPage && !isEditorPage;
  const isSetting = !pathname.startsWith("/setting");
  console.log(isAuthPage);
  return (
    <AuthProvider initialUser={pageProps.user}>
      <Head></Head>
      <div className=" min-h-screen flex flex-col">
        <AppHeader />
        <div className="container mx-auto flex flex-1">
          {showSidebars && <LeftSidebar />}
          <main className="flex-grow py-8">
            <Component {...pageProps} />
          </main>
          {showSidebars && isSetting && <RightSidebar />}
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
