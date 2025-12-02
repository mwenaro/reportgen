'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Shield,
  Camera,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  Book,
  Users,
  Award,
  Star,
  FileText,
  Settings,
  Lock,
  Bell
} from 'lucide-react'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'admin' | 'teacher' | 'student' | 'parent'
  avatar?: string
  bio?: string
  address: string
  dateOfBirth: string
  joinedDate: string
  department?: string
  position?: string
  qualifications?: string[]
  subjects?: string[]
  classes?: string[]
  employeeId?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

interface Activity {
  id: string
  type: 'report' | 'grade' | 'meeting' | 'assignment' | 'announcement'
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'pending' | 'in-progress'
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock user data - in real app, this would come from authentication/database
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+254-700-123-456',
    role: 'teacher',
    avatar: '',
    bio: 'Experienced Mathematics teacher with over 8 years of teaching experience. Passionate about helping students achieve their academic goals and develop problem-solving skills.',
    address: 'Nairobi, Kenya',
    dateOfBirth: '1985-03-15',
    joinedDate: '2016-02-01',
    department: 'Mathematics Department',
    position: 'Senior Mathematics Teacher',
    qualifications: ['Bachelor of Education (Mathematics)', 'Diploma in Educational Leadership'],
    subjects: ['Mathematics', 'Additional Mathematics', 'Statistics'],
    classes: ['Form 1A', 'Form 2B', 'Form 3A', 'Form 4C'],
    employeeId: 'EMP-2016-001',
    emergencyContact: {
      name: 'John Johnson',
      phone: '+254-700-987-654',
      relationship: 'Spouse'
    }
  })

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)

  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'report',
      title: 'Term 1 Reports Generated',
      description: 'Generated and submitted term reports for Form 3A (38 students)',
      timestamp: '2024-04-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'grade',
      title: 'Mathematics CAT Grading',
      description: 'Completed grading for Form 2B Mathematics CAT assessment',
      timestamp: '2024-04-12T14:20:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Department Meeting',
      description: 'Mathematics department monthly meeting scheduled',
      timestamp: '2024-04-18T09:00:00Z',
      status: 'pending'
    },
    {
      id: '4',
      type: 'assignment',
      title: 'Lesson Plan Review',
      description: 'Submit updated lesson plans for Term 2 curriculum',
      timestamp: '2024-04-20T17:00:00Z',
      status: 'in-progress'
    }
  ]

  const achievements = [
    { title: 'Best Teacher Award 2023', date: '2023-12-15', type: 'award' },
    { title: 'Mathematics Excellence Certificate', date: '2023-08-20', type: 'certificate' },
    { title: '100% Pass Rate - Form 3A', date: '2023-04-30', type: 'achievement' },
    { title: 'Professional Development Completion', date: '2023-01-15', type: 'training' }
  ]

  const handleSaveProfile = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'in-progress':
        return <Settings className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'grade':
        return <Award className="h-4 w-4 text-green-500" />
      case 'meeting':
        return <Users className="h-4 w-4 text-purple-500" />
      case 'assignment':
        return <Book className="h-4 w-4 text-orange-500" />
      case 'announcement':
        return <Bell className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
      parent: 'bg-purple-100 text-purple-800'
    }
    return (
      <Badge className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-xl">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Profile Picture</DialogTitle>
                      <DialogDescription>
                        Upload a new profile picture or remove the current one.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-6">
                      <p className="text-sm text-muted-foreground">
                        Profile picture upload functionality would be implemented here.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Remove Picture</Button>
                      <Button>Upload New Picture</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h3>
                {getRoleBadge(profile.role)}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {profile.email}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  {profile.phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {profile.address}
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-sm text-gray-600 max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'details', label: 'Personal Details', icon: FileText },
            { id: 'activity', label: 'Recent Activity', icon: Clock },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'security', label: 'Security', icon: Lock }
          ].map((tab) => (
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Professional Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Employee ID</Label>
                  <p className="mt-1">{profile.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Department</Label>
                  <p className="mt-1">{profile.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Position</Label>
                  <p className="mt-1">{profile.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Joined Date</Label>
                  <p className="mt-1">{new Date(profile.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Subjects Teaching</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.subjects?.map((subject, index) => (
                    <Badge key={index} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-500">Classes</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.classes?.map((className, index) => (
                    <Badge key={index} variant="outline">{className}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Classes Teaching</span>
                    <span className="font-semibold">{profile.classes?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Subjects</span>
                    <span className="font-semibold">{profile.subjects?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Years of Service</span>
                    <span className="font-semibold">
                      {new Date().getFullYear() - new Date(profile.joinedDate).getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Achievements</span>
                    <span className="font-semibold">{achievements.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.qualifications?.map((qualification, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{qualification}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update your personal information and contact details.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={isEditing ? editedProfile.firstName : profile.firstName}
                  onChange={(e) => isEditing && setEditedProfile({...editedProfile, firstName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={isEditing ? editedProfile.lastName : profile.lastName}
                  onChange={(e) => isEditing && setEditedProfile({...editedProfile, lastName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedProfile.email : profile.email}
                  onChange={(e) => isEditing && setEditedProfile({...editedProfile, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={(e) => isEditing && setEditedProfile({...editedProfile, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
                  onChange={(e) => isEditing && setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={isEditing ? editedProfile.address : profile.address}
                  onChange={(e) => isEditing && setEditedProfile({...editedProfile, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                className="mt-2"
                rows={4}
                value={isEditing ? editedProfile.bio : profile.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => isEditing && setEditedProfile({...editedProfile, bio: e.target.value})}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
              />
            </div>

            {profile.emergencyContact && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    <Input value={profile.emergencyContact.name} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={profile.emergencyContact.phone} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input value={profile.emergencyContact.relationship} disabled={!isEditing} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your recent actions and upcoming tasks.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(activity.type)}
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={
                    activity.status === 'completed' ? 'default' :
                    activity.status === 'pending' ? 'secondary' : 'outline'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Achievements & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {achievement.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Password</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Last changed 2 months ago
                </p>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Login Sessions</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Manage your active login sessions
                </p>
                <Button variant="outline" size="sm">
                  View Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive urgent updates via SMS
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Browser push notifications
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}