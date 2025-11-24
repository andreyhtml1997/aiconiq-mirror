import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/voice-agent/utils';

const buttonVariants = cva(
  [
    'text-xs font-bold tracking-wider uppercase whitespace-nowrap',
    'inline-flex items-center justify-center gap-2 shrink-0 rounded-full cursor-pointer outline-none transition-colors duration-300',
    'focus-visible:border-[#bdbdbb] focus-visible:ring-[#bdbdbb]/50 focus-visible:ring-[3px]',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:ring-[#db1b06]/20 aria-invalid:border-[#db1b06]',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: 'bg-[#e2e2df] text-[#000000] hover:bg-[#f3f3f1] focus:bg-[#f3f3f1]',
        destructive: [
          'bg-[#db1b06] text-white',
          'hover:bg-[#b81505] focus:bg-[#b81505] focus-visible:ring-[#db1b06]/20',
        ],
        outline: [
          'border border-[#dbdbd8] bg-white',
          'hover:bg-[#f9f9f6] hover:text-[#000000]',
        ],
        primary: 'bg-[#d8008d] text-white hover:bg-[#0020b9] focus:bg-[#0020b9]',
        secondary: 'bg-[#f9f9f6] text-[#3b3b3b] hover:bg-[#f3f3f1]',
        ghost: 'hover:bg-[#f9f9f6] hover:text-[#000000]',
        link: 'text-[#d8008d] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
