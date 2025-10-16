import type { SVGProps } from 'react';

export function VedaMotrixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l7.79 7.79a5 5 0 010 7.07L12 22l-7.79-7.79a5 5 0 010-7.07L12 2z" />
      <path d="M12 8v8" />
      <path d="M8.5 14.5L12 18l3.5-3.5" />
      <path d="M15.5 9.5L12 6 8.5 9.5" />
    </svg>
  );
}
