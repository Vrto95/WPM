'use client';

import { Card, Table, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'John Doe', wpm: 85, accuracy: 98 },
  { id: '2', name: 'Jane Smith', wpm: 82, accuracy: 97 },
  { id: '3', name: 'Bob Johnson', wpm: 80, accuracy: 96 },
];

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    width: 80,
    render: (_: unknown, __: unknown, index: number) => index + 1,
  },
  {
    title: 'User',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => (
      <div className="flex items-center gap-2">
        <Avatar icon={<UserOutlined />} />
        <span>{name}</span>
      </div>
    ),
  },
  {
    title: 'WPM',
    dataIndex: 'wpm',
    key: 'wpm',
    sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.wpm - b.wpm,
  },
  {
    title: 'Accuracy',
    dataIndex: 'accuracy',
    key: 'accuracy',
    render: (accuracy: number) => `${accuracy}%`,
  },
];

export const Leaderboard = () => {
  return (
    <Card>
      <Title level={4} className="mb-4">
        Top Typists
      </Title>
      <Table
        dataSource={mockLeaderboard}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
    </Card>
  );
};
