import React from 'react'
import { useAppStore } from '@/lib/state'
import { cn } from '@/lib/utils'

export function Footer() {
  const currentSchool = useAppStore((state) => state.currentSchool)
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>© 2024 ReportGen</span>
          {currentSchool && (
            <>
              <span>•</span>
              <span>{currentSchool.name}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a 
            href="/help" 
            className="hover:text-foreground transition-colors"
          >
            Help
          </a>
          <a 
            href="/privacy" 
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a 
            href="/terms" 
            className="hover:text-foreground transition-colors"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer