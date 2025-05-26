'use client';

import { Container } from '@/shared/ui/container/container';
import {
  Typography,
  Card,
  Row,
  Col,
  Progress,
  Statistic,
  Avatar,
  Button,
  Tabs,
  List,
  Tag,
  Space,
} from 'antd';
import {
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Mock user data
const mockUser = {
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  isPro: true,
  stats: {
    averageWpm: 85,
    highestWpm: 120,
    totalTests: 150,
    accuracy: 95,
    timeSpent: '12h 30m',
  },
  achievements: [
    {
      id: '1',
      title: 'Speed Demon',
      description: 'Achieve 100 WPM in a test',
      icon: <TrophyOutlined style={{ color: 'gold' }} />,
      unlocked: true,
      date: '2024-03-15',
    },
    {
      id: '2',
      title: 'Accuracy Master',
      description: 'Complete a test with 98% accuracy',
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      unlocked: true,
      date: '2024-03-18',
    },
    {
      id: '3',
      title: 'Consistent Typist',
      description: 'Complete 100 typing tests',
      icon: <ClockCircleOutlined style={{ color: 'blue' }} />,
      unlocked: false,
      progress: 75,
    },
  ],
  recentTests: [
    {
      id: '1',
      date: '2024-03-20',
      wpm: 115,
      accuracy: 97,
      type: 'Daily Challenge',
    },
    {
      id: '2',
      date: '2024-03-19',
      wpm: 110,
      accuracy: 96,
      type: 'Lesson',
    },
    {
      id: '3',
      date: '2024-03-18',
      wpm: 105,
      accuracy: 95,
      type: 'Practice',
    },
  ],
};

export default function ProfilePage() {
  return (
    <Container>
      <div className="text-center mb-8">
        <Avatar size={120} src={mockUser.avatar} className="mb-4" />
        <Title level={2}>{mockUser.name}</Title>
        {mockUser.isPro ? (
          <Tag color="blue" className="text-lg px-4 py-1">
            Pro Member
          </Tag>
        ) : (
          <Button type="primary" size="large">
            Upgrade to Pro
          </Button>
        )}
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average WPM"
              value={mockUser.stats.averageWpm}
              suffix="WPM"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Highest WPM"
              value={mockUser.stats.highestWpm}
              suffix="WPM"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Tests" value={mockUser.stats.totalTests} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Time Spent" value={mockUser.stats.timeSpent} />
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'achievements',
            label: 'Achievements',
            children: (
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={mockUser.achievements}
                renderItem={(achievement) => (
                  <List.Item>
                    <Card>
                      <Space direction="vertical" className="w-full">
                        <Space>
                          {achievement.icon}
                          <Text strong>{achievement.title}</Text>
                        </Space>
                        <Text type="secondary">{achievement.description}</Text>
                        {achievement.unlocked ? (
                          <Tag color="success">Unlocked {achievement.date}</Tag>
                        ) : (
                          <Progress percent={achievement.progress} />
                        )}
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'recent',
            label: 'Recent Tests',
            children: (
              <List
                dataSource={mockUser.recentTests}
                renderItem={(test) => (
                  <List.Item>
                    <Card className="w-full">
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text strong>{test.type}</Text>
                          <br />
                          <Text type="secondary">{test.date}</Text>
                        </Col>
                        <Col>
                          <Space>
                            <Tag color="blue">{test.wpm} WPM</Tag>
                            <Tag
                              color={test.accuracy >= 95 ? 'green' : 'orange'}
                            >
                              {test.accuracy}% Accuracy
                            </Tag>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </Container>
  );
}
