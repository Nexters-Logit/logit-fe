import { Header } from "@/components/common/Header";
import { LoginModalProvider } from "../_components/LoginModalContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginModalProvider>
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <Header />
        {children}
      </div>
    </LoginModalProvider>
  );
}
