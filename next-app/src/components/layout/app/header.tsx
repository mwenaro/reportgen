import React from 'react'
import Link from 'next/link'
import { Menu, Bell, Search, User, Settings, LogOut, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppStore, useUnreadNotifications } from '@/lib/state'
import { useHybridAuth } from '@/lib/auth'
import { cn, initials } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'
import { NotificationDropdown } from './notification-dropdown'

export function Header() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const currentUser = useAppStore((state) => state.currentUser)
  const currentSchool = useAppStore((state) => state.currentSchool)
  const isOffline = useAppStore((state) => state.isOffline)
  const unreadNotifications = useUnreadNotifications()
  
  const hybridAuth = useHybridAuth()

  const handleLogout = async () => {
    await hybridAuth.logout()
  }

  const handleProfileClick = () => {
    // Navigate to profile page
    window.location.href = '/profile'
  }

  const handleSettingsClick = () => {
    // Navigate to settings page
    window.location.href = '/settings'
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Menu toggle and Search */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden sm:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[300px]"
            />
          </div>
        </div>

        {/* Center - School name (on larger screens) */}
        <div className="hidden lg:flex items-center">
          {currentSchool && (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">
                {currentSchool.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Academic Year: {currentSchool.settings?.academicYear || '2024-2025'}
              </p>
            </div>
          )}
        </div>

        {/* Right side - Notifications, Theme, Connection status, User menu */}
        <div className="flex items-center gap-2">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            {isOffline ? (
              <div className="flex items-center gap-1 text-red-500">
                <WifiOff className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Offline</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-green-500">
                <Wifi className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Online</span>
              </div>
            )}
          </div>

          {/* Mobile search */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-[200px]">
              <SheetHeader>
                <SheetTitle>Search</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Input
                  type="search"
                  placeholder="Search students, teachers, classes..."
                  className="w-full"
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Notifications */}
          <NotificationDropdown>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </NotificationDropdown>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={currentUser?.avatar} 
                    alt={currentUser?.firstName} 
                  />
                  <AvatarFallback>
                    {currentUser ? initials(currentUser.firstName, currentUser.lastName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {currentUser?.role?.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header