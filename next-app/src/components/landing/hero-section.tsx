// Hero section component for landing page
// This will be enhanced in later prompts

import { Button } from '../ui/button'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  onCtaClick?: () => void
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  onCtaClick
}: HeroSectionProps) {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
        {subtitle}
      </p>
      <div className="mt-8">
        <Button 
          onClick={onCtaClick}
          size="lg"
          className="text-lg px-8 py-4"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  )
}