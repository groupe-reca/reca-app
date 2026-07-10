import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-reca-gray-light bg-white p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
