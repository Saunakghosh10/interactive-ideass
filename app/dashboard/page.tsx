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
  Loader2,
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
  updatedAt: string
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
  const [page, setPage] = useState(1)
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

  const fetchIdeas = async (pageNum: number) => {
    try {
      const response = await fetch(
        `/api/ideas?page=${pageNum}&limit=${limit}`
      )
      if (!response.ok) throw new Error("Failed to fetch ideas")
      const data = await response.json()
      
      if (pageNum === 1) {
        setIdeas(data.ideas)
      } else {
        setIdeas((prev) => [...prev, ...data.ideas])
      }
      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (error) {
      console.error("Error fetching ideas:", error)
      toast({
        title: "Error",
        description: "Failed to load ideas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchIdeas(1)
      if (activeTab === 'overview') {
        fetchUserStats()
      }
    }
  }, [session, activeTab])

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchIdeas(nextPage)
    }
  }

  const handleIdeaCreated = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev])
    if (activeTab === 'overview') {
      fetchUserStats()
    }
    setIsCreateDialogOpen(false)
    toast({
      title: "Success",
      description: "Idea created successfully",
    })
  }

  const handleIdeaDeleted = (ideaId: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId))
    toast({
      title: "Success",
      description: "Idea deleted successfully",
    })
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
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your creative workspace overview</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Idea
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ideas, collaborators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : ideas.length > 0 ? (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onDelete={() => handleIdeaDeleted(idea.id)}
                  onUpdate={handleIdeaUpdated}
                />
              ))}
              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full max-w-xs"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No ideas yet. Create your first one!</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Idea
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="text-sm font-medium">{stat.label}</div>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="space-y-4">
            {trendingIdeas.map((idea) => (
              <Card key={idea.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                    </div>
                    <Avatar>
                      <AvatarFallback>{idea.authorInitials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {idea.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {idea.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {idea.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      {idea.shares}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateIdeaDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onIdeaCreated={handleIdeaCreated}
      />
    </div>
  )
}
