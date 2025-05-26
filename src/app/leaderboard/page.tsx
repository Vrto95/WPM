'use client';

import { Container } from '@/shared/ui/container/container';
import { Typography, Table, Tag, Select, Card, Avatar, Space } from 'antd';
import { TrophyOutlined, CrownOutlined, StarOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface LeaderboardEntry {
  key: string;
  rank: number;
  user: {
    name: string;
    avatar: string;
    isPro: boolean;
  };
  wpm: number;
  accuracy: number;
  date: string;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    key: '1',
    rank: 1,
    user: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      isPro: true,
    },
    wpm: 120,
    accuracy: 98,
    date: '2024-03-20',
  },
  {
    key: '2',
    rank: 2,
    user: {
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      isPro: true,
    },
    wpm: 115,
    accuracy: 97,
    date: '2024-03-19',
  },
  {
    key: '3',
    rank: 3,
    user: {
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      isPro: false,
    },
    wpm: 110,
    accuracy: 96,
    date: '2024-03-18',
  },
  // Add more mock data as needed
];

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    width: 100,
    render: (rank: number) => {
      if (rank === 1)
        return <CrownOutlined style={{ color: 'gold', fontSize: '24px' }} />;
      if (rank === 2)
        return <TrophyOutlined style={{ color: 'silver', fontSize: '24px' }} />;
      if (rank === 3)
        return <StarOutlined style={{ color: '#cd7f32', fontSize: '24px' }} />;
      return <span className="text-lg font-semibold">{rank}</span>;
    },
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: (user: { name: string; avatar: string; isPro: boolean }) => (
      <Space>
        <Avatar src={user.avatar} />
        <span>{user.name}</span>
        {user.isPro && <Tag color="blue">Pro</Tag>}
      </Space>
    ),
  },
  {
    title: 'WPM',
    dataIndex: 'wpm',
    key: 'wpm',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.wpm - b.wpm,
    render: (wpm: number) => <span className="font-semibold">{wpm}</span>,
  },
  {
    title: 'Accuracy',
    dataIndex: 'accuracy',
    key: 'accuracy',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) =>
      a.accuracy - b.accuracy,
    render: (accuracy: number) => (
      <Tag color={accuracy >= 95 ? 'green' : accuracy >= 90 ? 'orange' : 'red'}>
        {accuracy}%
      </Tag>
    ),
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) =>
      new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
];

export default function LeaderboardPage() {
  return (
    <Container>
      <Title level={1} className="text-center mb-8">
        Leaderboard
      </Title>

      <Card className="mb-6">
        <Space className="w-full justify-end">
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ]}
          />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'pro', label: 'Pro Users' },
              { value: 'free', label: 'Free Users' },
            ]}
          />
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={mockLeaderboardData}
        pagination={{ pageSize: 10 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow"
      />
    </Container>
  );
}
