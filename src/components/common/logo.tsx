import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Trophy {...props} className={cn('fill-primary', props.className)} />
  );
}
