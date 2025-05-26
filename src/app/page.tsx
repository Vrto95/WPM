'use client';

import { Container } from '@/shared/ui/container/container';
import { Typography } from 'antd';
import { DailyChallenge } from '@/features/daily-challenge/ui/daily-challenge';

const { Title } = Typography;

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Container className="mb-8">
          <Title level={1} className="text-center mb-8">
            WPM Typing Game
          </Title>

          {/* Daily Challenge Section */}
          <section className="mb-8">
            <Title level={2}>Daily Challenge</Title>
            <DailyChallenge />
          </section>
        </Container>
      </main>
    </div>
  );
}
