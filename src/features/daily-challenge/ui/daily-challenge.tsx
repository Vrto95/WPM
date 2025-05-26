'use client';

import { Card, Typography, Button, Progress } from 'antd';
import { observer } from 'mobx-react-lite';
import { useRef, useEffect } from 'react';
import { useDisableDeleteKeys } from '@/shared/hooks/use-disable-delete-keys';
import { DailyChallengeStore } from '../model/daily-challenge-store';
import { useLocalObservable } from 'mobx-react-lite';

const { Text } = Typography;

export const DailyChallenge = observer(() => {
  const store = useLocalObservable(() => new DailyChallengeStore());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleKeyDown = useDisableDeleteKeys();

  useEffect(() => {
    if (store.isStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [store.isStarted]);

  useEffect(() => {
    if (store.stats.isComplete) {
      store.saveResult();
    }
  }, [store.stats.isComplete]);

  return (
    <Card className="w-full">
      {!store.isStarted ? (
        <div className="text-center">
          <Text className="block mb-4">Ready for today&apos;s challenge?</Text>
          <Button type="primary" size="large" onClick={store.startTyping}>
            Start Challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <Text className="text-lg">
              {store.challengeText.split('').map((char, index) => {
                let color = 'text-gray-600';
                if (index < store.input.length) {
                  color =
                    store.input[index] === char
                      ? 'text-green-600'
                      : 'text-red-600';
                }
                return (
                  <span key={index} className={color}>
                    {char}
                  </span>
                );
              })}
            </Text>
          </div>
          <textarea
            ref={inputRef}
            className="w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Start typing here..."
            value={store.input}
            onChange={(e) => store.setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={store.isFinished}
          />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text>Time: {store.timeLeft}s</Text>
              <Text>WPM: {store.stats.wpm}</Text>
              <Text>Accuracy: {store.stats.accuracy}%</Text>
            </div>
            <Progress
              percent={(store.timeLeft / store.challengeTimeLimit) * 100}
              status={store.timeLeft === 0 ? 'exception' : 'active'}
              showInfo={false}
            />
            {store.isFinished && (
              <div className="text-center mt-4">
                <Button type="primary" onClick={store.reset}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
});
