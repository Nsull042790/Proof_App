// Utility functions for PROOF App

import { v4 as uuidv4 } from 'uuid';
import { ROAST_LINES } from './constants';

export const generateId = (): string => uuidv4();

export const getRandomRoast = (): string => {
  return ROAST_LINES[Math.floor(Math.random() * ROAST_LINES.length)];
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const calculateTotal = (scores: number[]): number => {
  return scores.reduce((sum, score) => sum + (score || 0), 0);
};

export const calculateFrontNine = (scores: number[]): number => {
  return scores.slice(0, 9).reduce((sum, score) => sum + (score || 0), 0);
};

export const calculateBackNine = (scores: number[]): number => {
  return scores.slice(9, 18).reduce((sum, score) => sum + (score || 0), 0);
};

export const getPlayerDisplayName = (player: { name: string; nickname: string }): string => {
  return player.nickname || player.name;
};

export const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const compressImage = async (file: File, maxWidth = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
