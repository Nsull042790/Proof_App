'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function LoadingSpinner({ size = 'md', color = '#FFD700' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-transparent`}
      style={{
        borderTopColor: color,
        borderRightColor: color,
      }}
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <span className="text-white font-medium">{message}</span>
      </div>
    </div>
  );
}

export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-[#2a2a2a] rounded animate-pulse ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBox className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <SkeletonBox className="h-4 w-24 mb-2" />
          <SkeletonBox className="h-3 w-16" />
        </div>
      </div>
      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-3/4" />
    </div>
  );
}

export function SkeletonFeedItem() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-3 flex items-center gap-2">
        <SkeletonBox className="w-8 h-8 rounded-full" />
        <div>
          <SkeletonBox className="h-4 w-20 mb-1" />
          <SkeletonBox className="h-3 w-12" />
        </div>
      </div>
      <SkeletonBox className="aspect-square w-full" />
      <div className="p-3">
        <SkeletonBox className="h-4 w-3/4 mb-3" />
        <div className="flex gap-2">
          <SkeletonBox className="h-8 w-16 rounded-full" />
          <SkeletonBox className="h-8 w-16 rounded-full" />
          <SkeletonBox className="h-8 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
