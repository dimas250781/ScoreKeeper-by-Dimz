import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn('fill-primary', props.className)}
    >
      <defs>
        <clipPath id="circleClip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <g clipPath="url(#circleClip)">
        <rect width="100" height="100" className="fill-background" />
        <path
          d="M40 25 H 60 Q 75 25 75 40 V 55 L 40 90 V 65 H 55 V 50 H 40 Z M 40 40 H 55 V 35 H 40 Z"
          className="fill-primary"
        />
        <path
          d="M 68 65 C 68 55, 85 55, 85 65 S 76.5 95, 68 90 C 59.5 95, 51 55, 51 65 S 68 75, 68 65 Z"
          className="fill-accent"
        />
      </g>
      <circle cx="50" cy="50" r="48" strokeWidth="4" stroke="hsl(var(--border))" fill="none" />
    </svg>
  );
}
