import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// FORMAT UTILITIES
// ============================================================================

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return dateObj.toLocaleDateString('en-US', options || defaultOptions)
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateObj, { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export function kebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function camelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '')
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], keyFn: (item: T) => any, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function uniqueBy<T>(array: T[], keyFn: (item: T) => any): T[] {
  const seen = new Set()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export function isEmpty(obj: any): boolean {
  if (obj == null) return true
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0
  return Object.keys(obj).length === 0
}

export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false
  
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every((item, index) => isEqual(item, b[index]))
  }
  
  if (typeof a === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every(key => isEqual(a[key], b[key]))
  }
  
  return false
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// ============================================================================
// DEBOUNCE AND THROTTLE
// ============================================================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// ============================================================================
// RANDOM UTILITIES
// ============================================================================

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// ============================================================================
// DOWNLOAD UTILITIES
// ============================================================================

export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  downloadFile(jsonString, filename, 'application/json')
}

export function downloadCSV(data: any[], filename: string): void {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  )
  
  const csv = [headers, ...rows].join('\n')
  downloadFile(csv, filename, 'text/csv')
}

// ============================================================================
// ERROR UTILITIES
// ============================================================================

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}

export function handleAsyncError<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  return promise
    .then<[T, null]>((data: T) => [data, null])
    .catch<[null, Error]>((error: Error) => [null, error])
}

// ============================================================================
// THEME UTILITIES
// ============================================================================

export function getThemeColors(theme: 'light' | 'dark') {
  return {
    background: theme === 'light' ? 'hsl(0 0% 100%)' : 'hsl(222.2 84% 4.9%)',
    foreground: theme === 'light' ? 'hsl(222.2 84% 4.9%)' : 'hsl(210 40% 98%)',
    primary: theme === 'light' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(217.2 91.2% 59.8%)',
    secondary: theme === 'light' ? 'hsl(210 40% 96%)' : 'hsl(217.2 32.6% 17.5%)',
    muted: theme === 'light' ? 'hsl(210 40% 96%)' : 'hsl(217.2 32.6% 17.5%)',
    accent: theme === 'light' ? 'hsl(210 40% 96%)' : 'hsl(217.2 32.6% 17.5%)',
    destructive: theme === 'light' ? 'hsl(0 84.2% 60.2%)' : 'hsl(0 62.8% 30.6%)',
    border: theme === 'light' ? 'hsl(214.3 31.8% 91.4%)' : 'hsl(217.2 32.6% 17.5%)',
    input: theme === 'light' ? 'hsl(214.3 31.8% 91.4%)' : 'hsl(217.2 32.6% 17.5%)',
    ring: theme === 'light' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(224.3 76.3% 94.1%)',
  }
}

// ============================================================================
// STUDENT MANAGEMENT UTILITIES
// ============================================================================

/**
 * Generate unique admission number
 */
export function generateAdmissionNumber(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 9000) + 1000 // 4-digit random number
  return `STD/${year}/${randomNum.toString().padStart(4, '0')}`
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Format age as string
 */
export function formatAge(dateOfBirth: Date): string {
  const age = calculateAge(dateOfBirth)
  return `${age}`
}

/**
 * Get academic year from date
 */
export function getAcademicYear(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // January is 1
  
  // Academic year typically starts in September (month 9)
  if (month >= 9) {
    return `${year}/${year + 1}`
  } else {
    return `${year - 1}/${year}`
  }
}

/**
 * Get current term based on date
 */
export function getCurrentTerm(date: Date = new Date()): string {
  const month = date.getMonth() + 1 // January is 1
  
  if (month >= 9 || month <= 12) return 'Term 1'
  if (month >= 1 && month <= 4) return 'Term 2'
  if (month >= 5 && month <= 8) return 'Term 3'
  
  return 'Term 1'
}

/**
 * Calculate grade from mark
 */
export function calculateGrade(mark: number): { grade: string; points: number } {
  if (mark >= 80) return { grade: 'A', points: 12 }
  if (mark >= 75) return { grade: 'A-', points: 11 }
  if (mark >= 70) return { grade: 'B+', points: 10 }
  if (mark >= 65) return { grade: 'B', points: 9 }
  if (mark >= 60) return { grade: 'B-', points: 8 }
  if (mark >= 55) return { grade: 'C+', points: 7 }
  if (mark >= 50) return { grade: 'C', points: 6 }
  if (mark >= 45) return { grade: 'C-', points: 5 }
  if (mark >= 40) return { grade: 'D+', points: 4 }
  if (mark >= 35) return { grade: 'D', points: 3 }
  if (mark >= 30) return { grade: 'D-', points: 2 }
  return { grade: 'E', points: 1 }
}

/**
 * Calculate GPA from grades
 */
export function calculateGPA(grades: Array<{ points: number }>): number {
  if (grades.length === 0) return 0
  
  const totalPoints = grades.reduce((sum, grade) => sum + grade.points, 0)
  return Math.round((totalPoints / grades.length) * 100) / 100 // Round to 2 decimal places
}

/**
 * Get class level from class name
 */
export function getClassLevel(className: string): number {
  const match = className.match(/Form\s*(\d+)|Class\s*(\d+)|Grade\s*(\d+)|Year\s*(\d+)/i)
  if (match) {
    return parseInt(match[1] || match[2] || match[3] || match[4])
  }
  return 1 // Default to level 1
}