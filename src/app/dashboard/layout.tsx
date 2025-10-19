import { AdminContainer } from '@/components/admin/layout/AdminContainer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminContainer>{children}</AdminContainer>;
}

