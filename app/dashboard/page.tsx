"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { IdeaCard } from "@/components/idea-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Share,
  Bell,
  Settings,
  Filter,
  Heart,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Users,
  Lightbulb,
  MoreHorizontal,
  Eye,
  Rocket,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { CreateIdeaDialog } from "@/components/create-idea-dialog"
import { useToast } from "@/hooks/use-toast"

interface Idea {
  id: string
  title: string
  description: string
  skills: string[]
  industries: string[]
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
  likes: {
    userId: string
  }[]
}

interface UserStats {
  stats: {
    ideas: {
      total: number
      thisMonth: number
    }
    likes: {
      total: number
      thisMonth: number
    }
    comments: {
      total: number
      thisMonth: number
    }
  }
  trendingIdeas: Idea[]
}

const mockIdeas = [
  {
    id: 1,
    title: "AI-Powered Learning Platform",
    description: "Created a new idea about personalized education using machine learning algorithms...",
    author: "Alex Chen",
    authorRole: "Education Technologist",
    timeAgo: "2 hours ago",
    industry: "Education",
    skills: ["AI", "Education", "Machine Learning"],
    likes: 0,
    comments: 5,
    views: 1200,
    trending: true,
  },
  {
    id: 2,
    title: "Sustainable Urban Planning",
    description: "Started collaborating on eco-friendly city design concepts with the Green Cities team...",
    author: "Maria Rodriguez",
    authorRole: "Urban Designer",
    timeAgo: "4 hours ago",
    industry: "Environment",
    skills: ["Sustainability", "Urban Planning", "Community"],
    likes: 0,
    comments: 3,
    views: 850,
  },
  {
    id: 3,
    title: "Blockchain for Healthcare",
    description: "Received valuable feedback on your healthcare blockchain implementation idea...",
    author: "David Kim",
    authorRole: "Blockchain Developer",
    timeAgo: "6 hours ago",
    industry: "Healthcare",
    skills: ["Blockchain", "Healthcare", "Security"],
    likes: 0,
    comments: 1,
    views: 650,
  },
  {
    id: 4,
    title: "Virtual Reality Therapy",
    description: "Your VR mental health solution received 15 new likes from the community...",
    author: "Sarah Johnson",
    authorRole: "Clinical Psychologist",
    timeAgo: "1 day ago",
    industry: "Healthcare",
    skills: ["VR", "Mental Health", "Therapy"],
    likes: 0,
    comments: 0,
    views: 420,
  },
]

const trendingIdeas = [
  {
    id: 1,
    title: "AI-Powered Personal Assistant for Developers",
    description:
      "A smart coding assistant that learns from your coding patterns and helps you write better code faster with intelligent suggestions.",
    author: "Alex Chen",
    authorInitials: "AC",
    skills: ["AI", "Education", "Machine Learning"],
    likes: 0,
    comments: 42,
    shares: 12,
  },
  {
    id: 2,
    title: "Sustainable Urban Farming Network",
    description:
      "Connecting urban farmers with local communities to promote sustainable living and fresh produce in cities.",
    author: "Maria Garcia",
    authorInitials: "MG",
    skills: ["Sustainability", "Urban Planning", "Community"],
    likes: 0,
    comments: 36,
    shares: 8,
  },
  {
    id: 3,
    title: "Virtual Reality Learning Platform",
    description:
      "Immersive educational experiences that make learning complex subjects engaging and interactive through VR technology.",
    author: "James Wilson",
    authorInitials: "JW",
    skills: ["Education", "VR", "Technology"],
    likes: 0,
    comments: 28,
    shares: 15,
  },
]

const stats = [
  { label: "Ideas Created", value: 47, period: "This month", icon: Lightbulb },
  { label: "Active Collaborations", value: 12, period: "In progress", icon: Users },
  { label: "Trending Ideas", value: 8, period: "Your ideas trending", icon: TrendingUp },
]

export default function Dashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 10

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/users/stats')
      if (!response.ok) throw new Error('Failed to fetch user stats')
      const data = await response.json()
      setUserStats(data)
    } catch (error) {
      console.error('Error fetching user stats:', error)
      toast({
        title: 'Error',
        description: 'Failed to load user statistics',
        variant: 'destructive',
      })
    }
  }

  const fetchIdeas = async (page: number) => {
    try {
      const response = await fetch(
        `/api/ideas?page=${page}&limit=${limit}`
      )
      if (!response.ok) throw new Error("Failed to fetch ideas")
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching ideas:", error)
      toast({
        title: "Error",
        description: "Failed to fetch ideas",
        variant: "destructive",
      })
      return { ideas: [], hasMore: false }
    }
  }

  const loadInitialIdeas = async () => {
    setIsLoading(true)
    const { ideas: newIdeas, hasMore: moreAvailable } = await fetchIdeas(1)
    setIdeas(newIdeas)
    setHasMore(moreAvailable)
    setIsLoading(false)
  }

  const loadMoreIdeas = async () => {
    const nextPage = currentPage + 1
    const { ideas: newIdeas, hasMore: moreAvailable } = await fetchIdeas(
      nextPage
    )
    setIdeas((prev) => [...prev, ...newIdeas])
    setCurrentPage(nextPage)
    setHasMore(moreAvailable)
  }

  useEffect(() => {
    if (session?.user) {
      loadInitialIdeas()
      if (activeTab === 'overview') {
        fetchUserStats()
      }
    }
  }, [session, activeTab])

  const handleIdeaCreated = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev])
    if (activeTab === 'overview') {
      fetchUserStats()
    }
  }

  const handleIdeaDeleted = async (id: string) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete idea')

      setIdeas((prev) => prev.filter((idea) => idea.id !== id))
      toast({
        title: 'Success',
        description: 'Idea deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting idea:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete idea',
        variant: 'destructive',
      })
    }
  }

  const handleIdeaUpdated = (updatedIdea: Idea) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === updatedIdea.id ? updatedIdea : idea
      )
    )
  }

  const stats = [
    {
      label: 'Ideas Created',
      value: userStats?.stats.ideas.thisMonth || 0,
      total: userStats?.stats.ideas.total || 0,
      period: 'This Month',
      icon: Lightbulb,
    },
    {
      label: 'Likes Received',
      value: userStats?.stats.likes.thisMonth || 0,
      total: userStats?.stats.likes.total || 0,
      period: 'This Month',
      icon: Heart,
    },
    {
      label: 'Comments Received',
      value: userStats?.stats.comments.thisMonth || 0,
      total: userStats?.stats.comments.total || 0,
      period: 'This Month',
      icon: MessageCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Interactive Ideas
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 ml-8">
                <Search className="text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas, collaborators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback>
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="mt-4 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search ideas, collaborators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Your creative workspace overview</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="grid w-full sm:w-fit grid-cols-3 bg-gray-100">
              <TabsTrigger value="feed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Feed
              </TabsTrigger>
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="popular" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Popular
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="bg-transparent hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Target className="w-4 h-4" />
                  Your Progress
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Welcome back, {session?.user?.name}!
                </h2>
                <p className="text-base sm:text-lg text-purple-100 mb-6">
                  Track your creative journey and see how your ideas are making an impact.
                  You've created {userStats?.stats.ideas.total || 0} ideas and received{" "}
                  {userStats?.stats.likes.total || 0} likes so far.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    New Idea
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                    View Analytics
                  </Button>
                </div>
              </div>
              <div className="absolute right-4 sm:right-8 top-4 sm:top-8 opacity-20">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-16 sm:w-24 h-12 sm:h-16 bg-white/20 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {stat.period} ({stat.total} total)
                        </p>
                      </div>
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-2">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Your Trending Ideas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Trending Ideas</h3>
                <Button variant="ghost" size="sm" className="text-purple-600">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userStats?.trendingIdeas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={idea.author.image || undefined} />
                        <AvatarFallback>
                          {idea.author.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold line-clamp-1">{idea.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {idea.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {idea.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{idea._count.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{idea._count.comments}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/ideas/${idea.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="w-full h-48 animate-pulse bg-gray-100" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onDelete={handleIdeaDeleted}
                    onUpdate={handleIdeaUpdated}
                  />
                ))}

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={loadMoreIdeas}
                      className="w-full max-w-xs"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Popular Ideas</h3>
                <p className="text-gray-600">
                  Discover trending and popular ideas from the community
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  This Week
                </Button>
                <Button variant="outline" size="sm">
                  This Month
                </Button>
                <Button variant="outline" size="sm">
                  All Time
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onDelete={handleIdeaDeleted}
                  onUpdate={handleIdeaUpdated}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateIdeaDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onIdeaCreated={handleIdeaCreated}
      />
    </div>
  )
}
