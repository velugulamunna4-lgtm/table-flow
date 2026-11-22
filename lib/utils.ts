import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currencySymbol: string = '₹'): string {
  return `${currencySymbol}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatTimeElapsed(createdAt: string): string {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - created) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 min ago';
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
}

export function getEstimatedDeliveryText(minutes: number): string {
  if (minutes <= 0) return 'Ready to serve!';
  return `~${minutes} mins`;
}
