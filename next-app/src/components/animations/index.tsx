// Animation wrapper components
// These will be enhanced with Framer Motion in later prompts

import { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  // Placeholder for Framer Motion animation
  // Will be implemented in Prompt 9
  return (
    <div 
      className={className}
      style={{
        animation: `fadeIn 0.6s ease-in-out ${delay}s both`
      }}
    >
      {children}
    </div>
  )
}

interface SlideInProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className 
}: SlideInProps) {
  // Placeholder for Framer Motion animation
  // Will be implemented in Prompt 9
  return (
    <div 
      className={className}
      style={{
        animation: `slideIn${direction.charAt(0).toUpperCase() + direction.slice(1)} 0.6s ease-out ${delay}s both`
      }}
    >
      {children}
    </div>
  )
}