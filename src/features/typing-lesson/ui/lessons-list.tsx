'use client';

import { Card, List, Tag } from 'antd';
import { Lesson } from '@/shared/types';

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Home Row',
    content: 'asdf jkl;',
    difficulty: 'beginner',
    isPro: false,
  },
  {
    id: '2',
    title: 'Advanced Speed',
    content: 'The quick brown fox jumps over the lazy dog.',
    difficulty: 'advanced',
    isPro: true,
  },
];

export const LessonsList = () => {
  return (
    <Card>
      <List
        dataSource={mockLessons}
        renderItem={(lesson) => (
          <List.Item
            key={lesson.id}
            actions={[
              <Tag key="pro-status" color={lesson.isPro ? 'blue' : 'green'}>
                {lesson.isPro ? 'Pro' : 'Free'}
              </Tag>,
            ]}
          >
            <List.Item.Meta
              title={lesson.title}
              description={
                <div>
                  <Tag
                    color={
                      lesson.difficulty === 'beginner'
                        ? 'green'
                        : lesson.difficulty === 'intermediate'
                        ? 'orange'
                        : 'red'
                    }
                  >
                    {lesson.difficulty}
                  </Tag>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
