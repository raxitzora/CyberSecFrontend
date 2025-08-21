import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { UIMessage } from 'ai';
import type { ComponentProps, HTMLAttributes } from 'react';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full items-end gap-2 py-4',
      from === 'user'
        ? 'is-user justify-end'
        : 'is-assistant flex-row-reverse justify-start',
      '[&>div]:max-w-full', // <-- fixed here
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      'flex flex-col gap-2 overflow-auto rounded-lg px-4 py-3 text-sm', // changed overflow-hidden → overflow-auto
      'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground',
      'group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src?: string;
  name?: string;
};

export const MessageAvatar = ({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar
    className={cn('size-8 ring ring-border', className)}
    {...props}
  >
    <AvatarImage alt={name || 'avatar'} src={src} />
    <AvatarFallback>
      {name?.slice(0, 2).toUpperCase() || 'ME'}
    </AvatarFallback>
  </Avatar>
);
