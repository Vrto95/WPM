'use client';

import { ConfigProvider, Layout } from 'antd';
import { antdTheme } from '@/shared/config/antd.config';
import { Navigation } from '@/widgets/header/ui/navigation';

const { Content } = Layout;

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout className="min-h-screen">
        <Navigation />
        <Content className="bg-gray-50 dark:bg-gray-900">{children}</Content>
      </Layout>
    </ConfigProvider>
  );
}
