'use client';

import { Container } from '@/shared/ui/container/container';
import {
  Typography,
  Card,
  Progress,
  Space,
  Button,
  Alert,
  List,
  Row,
  Col,
  Statistic,
  Tooltip,
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { mockLessons, Lesson, LessonPassingCriteria } from '../mock-lessons';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
  ArrowLeftOutlined,
  RedoOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useDisableDeleteKeys } from '@/shared/hooks/use-disable-delete-keys';

const { Title, Text } = Typography;

interface LessonStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  isComplete: boolean;
  errors: number;
  passed: boolean;
  criteriaResults: {
    wpm: { passed: boolean; required: number };
    accuracy: { passed: boolean; required: number };
    errors: { passed: boolean; allowed: number };
    time: { passed: boolean; allowed: number };
  };
}

const checkPassingCriteria = (
  stats: Omit<LessonStats, 'passed' | 'criteriaResults'>,
  criteria: LessonPassingCriteria
): LessonStats['criteriaResults'] => {
  const timeInSeconds = stats.timeElapsed / 1000;
  return {
    wpm: {
      passed: stats.wpm >= criteria.minWpm,
      required: criteria.minWpm,
    },
    accuracy: {
      passed: stats.accuracy >= criteria.minAccuracy,
      required: criteria.minAccuracy,
    },
    errors: {
      passed: stats.errors <= criteria.maxErrors,
      allowed: criteria.maxErrors,
    },
    time: {
      passed: timeInSeconds <= criteria.maxTimeInSeconds,
      allowed: criteria.maxTimeInSeconds,
    },
  };
};

export default function LessonPracticePage() {
  const params = useParams();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [stats, setStats] = useState<LessonStats>({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    isComplete: false,
    errors: 0,
    passed: false,
    criteriaResults: {
      wpm: { passed: false, required: 0 },
      accuracy: { passed: false, required: 0 },
      errors: { passed: false, allowed: 0 },
      time: { passed: false, allowed: 0 },
    },
  });
  const [isStarted, setIsStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const handleKeyDown = useDisableDeleteKeys();

  const lesson = mockLessons.find((l: Lesson) => l.id === params.id);

  // Timer effect
  useEffect(() => {
    if (isStarted && !stats.isComplete) {
      timerRef.current = setInterval(() => {
        if (startTime) {
          const newTimeElapsed = Date.now() - startTime;
          setCurrentTime(newTimeElapsed);

          // Update stats with new time
          setStats((prevStats) => {
            const timeInSeconds = newTimeElapsed / 1000;
            const criteriaResults = checkPassingCriteria(
              {
                ...prevStats,
                timeElapsed: newTimeElapsed,
              },
              lesson!.passingCriteria
            );

            return {
              ...prevStats,
              timeElapsed: newTimeElapsed,
              passed:
                prevStats.isComplete &&
                criteriaResults.wpm.passed &&
                criteriaResults.accuracy.passed &&
                criteriaResults.errors.passed &&
                criteriaResults.time.passed,
              criteriaResults,
            };
          });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, startTime, stats.isComplete, lesson]);

  useEffect(() => {
    if (!lesson) {
      router.push('/lessons');
      return;
    }

    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lesson, router]);

  if (!lesson) {
    return null;
  }

  const handleStart = () => {
    setIsStarted(true);
    const now = Date.now();
    setStartTime(now);
    setCurrentTime(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculateWPM = (timeElapsed: number, correctChars: number) => {
    const minutes = timeElapsed / 60000; // Convert ms to minutes
    return Math.round(correctChars / 5 / minutes); // Assuming 5 chars per word
  };

  const calculateAccuracy = (totalChars: number, errors: number) => {
    return Math.round(((totalChars - errors) / totalChars) * 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted) {
      handleStart();
    }

    const value = e.target.value;
    setInput(value);

    const timeElapsed = currentTime; // Use the current time from state
    let errors = 0;

    // Count errors
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== lesson.content[i]) {
        errors++;
      }
    }

    const correctChars = value.length - errors;
    const wpm = calculateWPM(timeElapsed, correctChars);
    const accuracy = calculateAccuracy(value.length, errors);

    const isComplete = value.length === lesson.content.length;
    const criteriaResults = checkPassingCriteria(
      { wpm, accuracy, timeElapsed, isComplete, errors },
      lesson.passingCriteria
    );

    const passed =
      isComplete &&
      criteriaResults.wpm.passed &&
      criteriaResults.accuracy.passed &&
      criteriaResults.errors.passed &&
      criteriaResults.time.passed;

    setStats({
      wpm,
      accuracy,
      timeElapsed,
      isComplete,
      errors,
      passed,
      criteriaResults,
    });

    // If lesson is complete
    if (isComplete) {
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Save lesson completion to localStorage
      const completedLessons = JSON.parse(
        localStorage.getItem('completedLessons') || '[]'
      );
      if (!completedLessons.includes(lesson.id)) {
        completedLessons.push(lesson.id);
        localStorage.setItem(
          'completedLessons',
          JSON.stringify(completedLessons)
        );
      }

      // Save stats
      const lessonStats = JSON.parse(
        localStorage.getItem('lessonStats') || '[]'
      );
      lessonStats.push({
        lessonId: lesson.id,
        wpm,
        accuracy,
        errors,
        timeElapsed,
        passed,
        date: new Date().toISOString(),
      });
      localStorage.setItem('lessonStats', JSON.stringify(lessonStats));
    }
  };

  return (
    <Container>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Space direction="vertical" size="large" className="w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/lessons')}
                className="hover:scale-105 transition-transform"
              >
                Back
              </Button>
              <div>
                <Title level={3} className="!mb-0">
                  {lesson.title}
                </Title>
                <Space>
                  <Tooltip title="Difficulty Level">
                    <Text type="secondary" className="flex items-center">
                      <BulbOutlined className="mr-1" />
                      {lesson.difficulty.charAt(0).toUpperCase() +
                        lesson.difficulty.slice(1)}
                    </Text>
                  </Tooltip>
                  {lesson.isPro && (
                    <Tooltip title="Pro Lesson">
                      <Text type="secondary" className="flex items-center">
                        <TrophyOutlined className="mr-1 text-yellow-500" />
                        Pro
                      </Text>
                    </Tooltip>
                  )}
                </Space>
              </div>
            </div>
            <Tooltip title="Lesson Requirements">
              <Button
                icon={<InfoCircleOutlined />}
                type="text"
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Requirements
              </Button>
            </Tooltip>
          </div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <Statistic
                  title="WPM"
                  value={stats.wpm}
                  suffix={
                    <Tooltip
                      title={`Required: ${stats.criteriaResults.wpm.required} WPM`}
                    >
                      <span
                        className={
                          stats.criteriaResults.wpm.passed
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {stats.criteriaResults.wpm.passed ? '✓' : '✗'}
                      </span>
                    </Tooltip>
                  }
                  valueStyle={{
                    color:
                      stats.wpm >= stats.criteriaResults.wpm.required
                        ? '#3f8600'
                        : '#cf1322',
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <Statistic
                  title="Accuracy"
                  value={stats.accuracy}
                  suffix={
                    <Tooltip
                      title={`Required: ${stats.criteriaResults.accuracy.required}%`}
                    >
                      <span
                        className={
                          stats.criteriaResults.accuracy.passed
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {stats.criteriaResults.accuracy.passed ? '✓' : '✗'}
                      </span>
                    </Tooltip>
                  }
                  valueStyle={{
                    color:
                      stats.accuracy >= stats.criteriaResults.accuracy.required
                        ? '#3f8600'
                        : '#cf1322',
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <Statistic
                  title="Errors"
                  value={stats.errors}
                  suffix={
                    <Tooltip
                      title={`Maximum allowed: ${stats.criteriaResults.errors.allowed}`}
                    >
                      <span
                        className={
                          stats.criteriaResults.errors.passed
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {stats.criteriaResults.errors.passed ? '✓' : '✗'}
                      </span>
                    </Tooltip>
                  }
                  valueStyle={{
                    color:
                      stats.errors <= stats.criteriaResults.errors.allowed
                        ? '#3f8600'
                        : '#cf1322',
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <Statistic
                  title="Time"
                  value={Math.round(currentTime / 1000)}
                  suffix={
                    <Tooltip
                      title={`Time limit: ${stats.criteriaResults.time.allowed}s`}
                    >
                      <span
                        className={
                          stats.criteriaResults.time.passed
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {stats.criteriaResults.time.passed ? '✓' : '✗'}
                      </span>
                    </Tooltip>
                  }
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{
                    color:
                      currentTime / 1000 <= stats.criteriaResults.time.allowed
                        ? '#3f8600'
                        : '#cf1322',
                    transition: 'color 0.3s',
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Progress Bar */}
          <Card className="hover:shadow-md transition-shadow">
            <Progress
              percent={Math.round((input.length / lesson.content.length) * 100)}
              status={
                stats.isComplete
                  ? stats.passed
                    ? 'success'
                    : 'exception'
                  : 'active'
              }
              strokeWidth={12}
              className="custom-progress"
            />
          </Card>

          {/* Typing Area */}
          <Card
            className={`text-lg font-mono p-8 rounded-lg transition-all duration-300 ${
              stats.isComplete
                ? stats.passed
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="whitespace-pre-wrap leading-relaxed">
              {lesson.content.split('').map((char: string, index: number) => {
                let className = 'text-gray-400';
                if (index < input.length) {
                  className =
                    input[index] === char
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
                } else if (index === input.length) {
                  className =
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400';
                }
                return (
                  <span
                    key={index}
                    className={`${className} transition-colors duration-150`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </Card>

          {/* Input Area */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                handleKeyDown(e);
                if (e.key === 'Escape') {
                  router.push('/lessons');
                }
              }}
              className={`w-full p-6 text-lg border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                ${
                  stats.isComplete
                    ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800'
                }`}
              placeholder={isStarted ? '' : 'Start typing to begin...'}
              disabled={stats.isComplete}
            />
            {!isStarted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Text type="secondary" className="text-lg">
                  Start typing to begin...
                </Text>
              </div>
            )}
          </div>

          {/* Results Alert */}
          {stats.isComplete && (
            <Alert
              message={
                <Space>
                  {stats.passed ? (
                    <>
                      <TrophyOutlined className="text-yellow-500" />
                      <span>Lesson Passed!</span>
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined className="text-red-500" />
                      <span>Lesson Failed</span>
                    </>
                  )}
                </Space>
              }
              description={
                <Space direction="vertical" className="w-full mt-4">
                  <Text>
                    {stats.passed
                      ? `Congratulations! You completed the lesson with ${stats.wpm} WPM and ${stats.accuracy}% accuracy.`
                      : 'You need to meet all the criteria to pass this lesson. Try again!'}
                  </Text>
                  <List
                    size="small"
                    className="mt-2"
                    dataSource={[
                      renderCriteriaResult(
                        stats.criteriaResults.wpm.passed,
                        stats.wpm,
                        stats.criteriaResults.wpm.required,
                        'WPM'
                      ),
                      renderCriteriaResult(
                        stats.criteriaResults.accuracy.passed,
                        stats.accuracy,
                        stats.criteriaResults.accuracy.required,
                        'Accuracy',
                        '%'
                      ),
                      renderCriteriaResult(
                        stats.criteriaResults.errors.passed,
                        stats.errors,
                        stats.criteriaResults.errors.allowed,
                        'Errors',
                        ' errors'
                      ),
                      renderCriteriaResult(
                        stats.criteriaResults.time.passed,
                        Math.round(stats.timeElapsed / 1000),
                        stats.criteriaResults.time.allowed,
                        'Time',
                        's'
                      ),
                    ]}
                    renderItem={(item) => item}
                  />
                </Space>
              }
              type={stats.passed ? 'success' : 'error'}
              showIcon
              className="rounded-lg"
              action={
                <Space>
                  <Button
                    type="primary"
                    icon={<RedoOutlined />}
                    onClick={() => {
                      setInput('');
                      setStats({
                        wpm: 0,
                        accuracy: 100,
                        timeElapsed: 0,
                        isComplete: false,
                        errors: 0,
                        passed: false,
                        criteriaResults: stats.criteriaResults,
                      });
                      setIsStarted(false);
                      setStartTime(null);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    Try Again
                  </Button>
                  <Button
                    icon={<HomeOutlined />}
                    onClick={() => router.push('/lessons')}
                  >
                    Back to Lessons
                  </Button>
                </Space>
              }
            />
          )}
        </Space>
      </div>

      <style jsx global>{`
        .custom-progress .ant-progress-bg {
          transition: width 0.3s ease-in-out;
        }
        .custom-progress .ant-progress-text {
          font-weight: 500;
        }
      `}</style>
    </Container>
  );
}
