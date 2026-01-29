import { Header } from '@/components/common/Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />
      {children}
    </div>
  );
}
