import { LoginModalProvider } from "@/components/common/LoginModalContext";

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoginModalProvider>
      <div className="bg-white">{children}</div>
    </LoginModalProvider>
  );
}
