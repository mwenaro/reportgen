'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import {
  School,
  Calendar,
  Users,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  Phone,
  Save,
  Upload,
  Download,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Settings as SettingsIcon,
  Book,
  GraduationCap,
  Clock,
  MapPin,
  FileText,
  Zap,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

interface SchoolSettings {
  name: string
  level: string
  address: string
  phone: string
  email: string
  website: string
  box: string
  motto: string
  logo: string
  principalName: string
  foundedYear: number
  description: string
}

interface AcademicSettings {
  currentYear: string
  currentTerm: string
  termStartDates: {
    term1: string
    term2: string
    term3: string
  }
  termEndDates: {
    term1: string
    term2: string
    term3: string
  }
  gradingSystem: 'kenyan' | 'international'
  passMarks: number
  maxPoints: number
  classSize: number
  examTypes: string[]
}

interface SystemSettings {
  language: string
  timezone: string
  dateFormat: string
  currency: string
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    reportGenerated: boolean
    lowPerformance: boolean
    attendanceAlerts: boolean
  }
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  autoReports: boolean
  dataRetention: number
}

interface SecuritySettings {
  passwordRequirements: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
  }
  sessionTimeout: number
  twoFactorAuth: boolean
  loginAttempts: number
  ipRestrictions: boolean
  auditLogs: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('school')
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>({
    name: 'Tsagwa Secondary School',
    level: 'Secondary',
    address: 'Kaloleni, Kilifi County',
    phone: '0714-050682',
    email: 'info@tsagwasecondary.edu',
    website: 'www.tsagwasecondary.edu',
    box: '236-80105, Kaloleni',
    motto: 'Success By Effort',
    logo: '/images/school-logo.png',
    principalName: 'Dr. Mary Wanjiku',
    foundedYear: 1985,
    description: 'A leading secondary school committed to academic excellence and character development.'
  })

  const [academicSettings, setAcademicSettings] = useState<AcademicSettings>({
    currentYear: '2024-2025',
    currentTerm: 'Term 1',
    termStartDates: {
      term1: '2024-01-15',
      term2: '2024-05-06',
      term3: '2024-09-02'
    },
    termEndDates: {
      term1: '2024-04-05',
      term2: '2024-08-02',
      term3: '2024-12-06'
    },
    gradingSystem: 'kenyan',
    passMarks: 40,
    maxPoints: 12,
    classSize: 45,
    examTypes: ['CAT', 'Mid-Term', 'End-Term', 'Mock', 'Final']
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    language: 'en',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    currency: 'KES',
    theme: 'light',
    notifications: {
      email: true,
      sms: true,
      push: false,
      reportGenerated: true,
      lowPerformance: true,
      attendanceAlerts: true
    },
    backupFrequency: 'daily',
    autoReports: true,
    dataRetention: 365
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    sessionTimeout: 120,
    twoFactorAuth: false,
    loginAttempts: 5,
    ipRestrictions: false,
    auditLogs: true
  })

  const handleSaveSettings = (section: string) => {
    // In real app, this would save to database
    console.log(`Saving ${section} settings`)
    setIsEditing(false)
  }

  const tabs = [
    { id: 'school', label: 'School Information', icon: School },
    { id: 'academic', label: 'Academic Settings', icon: GraduationCap },
    { id: 'system', label: 'System Preferences', icon: SettingsIcon },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'backup', label: 'Backup & Export', icon: Database }
  ]

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Configure school settings, academic year, and system preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Config
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Config
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* School Information Tab */}
      {activeTab === 'school' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <School className="mr-2 h-5 w-5" />
                    School Information
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Basic information about your school
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={schoolSettings.name}
                    onChange={(e) => setSchoolSettings({...schoolSettings, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolLevel">Education Level</Label>
                  <Select
                    value={schoolSettings.level}
                    onValueChange={(value) => setSchoolSettings({...schoolSettings, level: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Secondary">Secondary</SelectItem>
                      <SelectItem value="Mixed">Mixed (Primary & Secondary)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principalName">Principal Name</Label>
                  <Input
                    id="principalName"
                    value={schoolSettings.principalName}
                    onChange={(e) => setSchoolSettings({...schoolSettings, principalName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={schoolSettings.foundedYear}
                    onChange={(e) => setSchoolSettings({...schoolSettings, foundedYear: parseInt(e.target.value)})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolSettings.email}
                    onChange={(e) => setSchoolSettings({...schoolSettings, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={schoolSettings.phone}
                    onChange={(e) => setSchoolSettings({...schoolSettings, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={schoolSettings.website}
                    onChange={(e) => setSchoolSettings({...schoolSettings, website: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="box">P.O. Box</Label>
                  <Input
                    id="box"
                    value={schoolSettings.box}
                    onChange={(e) => setSchoolSettings({...schoolSettings, box: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Input
                  id="address"
                  value={schoolSettings.address}
                  onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motto">School Motto</Label>
                <Input
                  id="motto"
                  value={schoolSettings.motto}
                  onChange={(e) => setSchoolSettings({...schoolSettings, motto: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={schoolSettings.description}
                  onChange={(e) => setSchoolSettings({...schoolSettings, description: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSaveSettings('school')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Academic Settings Tab */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Academic Year & Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current Academic Year</Label>
                  <Select
                    value={academicSettings.currentYear}
                    onValueChange={(value) => setAcademicSettings({...academicSettings, currentYear: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Term</Label>
                  <Select
                    value={academicSettings.currentTerm}
                    onValueChange={(value) => setAcademicSettings({...academicSettings, currentTerm: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Term 1">Term 1</SelectItem>
                      <SelectItem value="Term 2">Term 2</SelectItem>
                      <SelectItem value="Term 3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Term Dates</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-4">
                    <h5 className="font-medium text-blue-600">Term 1</h5>
                    <div className="space-y-2">
                      <Label className="text-xs">Start Date</Label>
                      <Input
                        type="date"
                        value={academicSettings.termStartDates.term1}
                        onChange={(e) => setAcademicSettings({
                          ...academicSettings,
                          termStartDates: {...academicSettings.termStartDates, term1: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">End Date</Label>
                      <Input
                        type="date"
                        value={academicSettings.termEndDates.term1}
                        onChange={(e) => setAcademicSettings({
                          ...academicSettings,
                          termEndDates: {...academicSettings.termEndDates, term1: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-medium text-green-600">Term 2</h5>
                    <div className="space-y-2">
                      <Label className="text-xs">Start Date</Label>
                      <Input
                        type="date"
                        value={academicSettings.termStartDates.term2}
                        onChange={(e) => setAcademicSettings({
                          ...academicSettings,
                          termStartDates: {...academicSettings.termStartDates, term2: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">End Date</Label>
                      <Input
                        type="date"
                        value={academicSettings.termEndDates.term2}
                        onChange={(e) => setAcademicSettings({
                          ...academicSettings,
                          termEndDates: {...academicSettings.termEndDates, term2: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-medium text-purple-600">Term 3</h5>
                    <div className="space-y-2">
                      <Label className="text-xs">Start Date</Label>
                      <Input
                        type="date"
                        value={academicSettings.termStartDates.term3}
                        onChange={(e) => setAcademicSettings({
                          ...academicSettings,
                          termStartDates: {...academicSettings.termStartDates, term3: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">End Date</Label>
                      <Input
                        type="date"
                        value={academicSettings.termEndDates.term3}
                        onChange={(e) => setAcademicSettings({
                          ...academicSettings,
                          termEndDates: {...academicSettings.termEndDates, term3: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Grading System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Grading System</Label>
                  <Select
                    value={academicSettings.gradingSystem}
                    onValueChange={(value: 'kenyan' | 'international') => setAcademicSettings({
                      ...academicSettings,
                      gradingSystem: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kenyan">Kenyan System (A-E)</SelectItem>
                      <SelectItem value="international">International (A-F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pass Marks</Label>
                  <Input
                    type="number"
                    value={academicSettings.passMarks}
                    onChange={(e) => setAcademicSettings({
                      ...academicSettings,
                      passMarks: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Points</Label>
                  <Input
                    type="number"
                    value={academicSettings.maxPoints}
                    onChange={(e) => setAcademicSettings({
                      ...academicSettings,
                      maxPoints: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Average Class Size</Label>
                  <Input
                    type="number"
                    value={academicSettings.classSize}
                    onChange={(e) => setAcademicSettings({
                      ...academicSettings,
                      classSize: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('academic')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Academic Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Preferences Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Kiswahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={systemSettings.currency}
                    onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={systemSettings.notifications.email}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      notifications: {...systemSettings.notifications, email: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive urgent updates via SMS</p>
                  </div>
                  <Switch
                    checked={systemSettings.notifications.sms}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      notifications: {...systemSettings.notifications, sms: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Report Generation Alerts</h4>
                    <p className="text-sm text-muted-foreground">Notify when reports are generated</p>
                  </div>
                  <Switch
                    checked={systemSettings.notifications.reportGenerated}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      notifications: {...systemSettings.notifications, reportGenerated: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Performance Alerts</h4>
                    <p className="text-sm text-muted-foreground">Alert for low performance issues</p>
                  </div>
                  <Switch
                    checked={systemSettings.notifications.lowPerformance}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      notifications: {...systemSettings.notifications, lowPerformance: checked}
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('system')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Password Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum Length</Label>
                  <Input
                    type="number"
                    value={securitySettings.passwordRequirements.minLength}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      passwordRequirements: {
                        ...securitySettings.passwordRequirements,
                        minLength: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Uppercase Letters</h4>
                    <p className="text-sm text-muted-foreground">At least one uppercase letter (A-Z)</p>
                  </div>
                  <Switch
                    checked={securitySettings.passwordRequirements.requireUppercase}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      passwordRequirements: {
                        ...securitySettings.passwordRequirements,
                        requireUppercase: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Numbers</h4>
                    <p className="text-sm text-muted-foreground">At least one number (0-9)</p>
                  </div>
                  <Switch
                    checked={securitySettings.passwordRequirements.requireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      passwordRequirements: {
                        ...securitySettings.passwordRequirements,
                        requireNumbers: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Audit Logs</h4>
                    <p className="text-sm text-muted-foreground">Track all user activities</p>
                  </div>
                  <Switch
                    checked={securitySettings.auditLogs}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      auditLogs: checked
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('security')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backup & Export Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Data Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={systemSettings.backupFrequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSystemSettings({
                      ...systemSettings,
                      backupFrequency: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Input
                    type="number"
                    value={systemSettings.dataRetention}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      dataRetention: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-4">
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Create Backup
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Restore Backup
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <Trash2 className="mr-2 h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">Reset All Settings</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This will reset all configurations to default values. This action cannot be undone.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Reset Settings
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently reset all settings to their default values.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Reset All Settings
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}