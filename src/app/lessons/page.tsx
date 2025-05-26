'use client';

import { Container } from '@/shared/ui/container/container';
import { Typography, Tabs, Card, List, Tag, Button, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockLessons, Lesson } from './mock-lessons';

const { Title, Text } = Typography;

const lessonsByDifficulty = mockLessons.reduce<Record<string, Lesson[]>>(
  (acc, lesson) => {
    if (!acc[lesson.difficulty]) {
      acc[lesson.difficulty] = [];
    }
    acc[lesson.difficulty].push(lesson);
    return acc;
  },
  {}
);

export default function LessonsPage() {
  const router = useRouter();

  const handleStartLesson = (lesson: Lesson) => {
    if (lesson.isPro) {
      // TODO: Show upgrade modal
      return;
    }
    router.push(`/lessons/${lesson.id}`);
  };

  return (
    <Container>
      <Title level={1} className="text-center mb-8">
        Typing Lessons
      </Title>

      <Tabs
        items={[
          {
            key: 'beginner',
            label: 'Beginner',
            children: (
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={lessonsByDifficulty.beginner}
                renderItem={(lesson) => (
                  <List.Item>
                    <Card
                      title={lesson.title}
                      extra={
                        <Tag color={lesson.isPro ? 'blue' : 'green'}>
                          {lesson.isPro ? 'Pro' : 'Free'}
                        </Tag>
                      }
                    >
                      <Space direction="vertical" className="w-full">
                        <Text type="secondary">
                          {lesson.content.substring(0, 50)}...
                        </Text>
                        <Button
                          type="primary"
                          block
                          onClick={() => handleStartLesson(lesson)}
                        >
                          Start Lesson
                        </Button>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'intermediate',
            label: 'Intermediate',
            children: (
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={lessonsByDifficulty.intermediate}
                renderItem={(lesson) => (
                  <List.Item>
                    <Card
                      title={lesson.title}
                      extra={
                        <Space>
                          <Tag color="blue">Pro</Tag>
                          <LockOutlined />
                        </Space>
                      }
                    >
                      <Space direction="vertical" className="w-full">
                        <Text type="secondary">
                          {lesson.content.substring(0, 50)}...
                        </Text>
                        <Button
                          type="primary"
                          block
                          disabled
                          onClick={() => handleStartLesson(lesson)}
                        >
                          Upgrade to Pro
                        </Button>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'advanced',
            label: 'Advanced',
            children: (
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={lessonsByDifficulty.advanced}
                renderItem={(lesson) => (
                  <List.Item>
                    <Card
                      title={lesson.title}
                      extra={
                        <Space>
                          <Tag color="blue">Pro</Tag>
                          <LockOutlined />
                        </Space>
                      }
                    >
                      <Space direction="vertical" className="w-full">
                        <Text type="secondary">
                          {lesson.content.substring(0, 50)}...
                        </Text>
                        <Button
                          type="primary"
                          block
                          disabled
                          onClick={() => handleStartLesson(lesson)}
                        >
                          Upgrade to Pro
                        </Button>
                      </Space>
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
