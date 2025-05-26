'use client';

import { Layout, Menu, Button, Space, Typography } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  TrophyOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header } = Layout;
const { Text } = Typography;

export const Navigation = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">Home</Link>,
    },
    {
      key: '/lessons',
      icon: <BookOutlined />,
      label: <Link href="/lessons">Lessons</Link>,
    },
    {
      key: '/leaderboard',
      icon: <TrophyOutlined />,
      label: <Link href="/leaderboard">Leaderboard</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link href="/profile">Profile</Link>,
    },
  ];

  return (
    <Header className="flex items-center justify-between px-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <CrownOutlined className="text-2xl text-blue-600" />
          <Text className="text-xl font-bold">WPM</Text>
        </Link>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[pathname]}
        items={menuItems}
        className="flex-1 justify-center border-0"
      />

      <Space>
        <Button type="primary" ghost>
          Sign In
        </Button>
        <Button type="primary">Upgrade to Pro</Button>
      </Space>
    </Header>
  );
};
