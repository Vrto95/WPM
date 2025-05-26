'use client';

import { ReactNode } from 'react';
import { Card } from 'antd';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className = '' }: ContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        {children}
      </Card>
    </div>
  );
};
