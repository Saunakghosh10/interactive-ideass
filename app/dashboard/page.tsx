"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { CreateIdeaDialog } from "@/components/create-idea-dialog"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("feed")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Interactive Ideas
                </span>
              </Link>
              <div className="relative max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas, collaborators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 lg:w-80 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">New Idea</span>
                <span className="sm:hidden">New</span>
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent hover:bg-gray-50">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="relative bg-transparent hover:bg-gray-50">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="outline" size="icon" className="hidden sm:flex bg-transparent hover:bg-gray-50">
                <Settings className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8 ring-2 ring-purple-100">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
                  S
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          {/* Mobile Search */}
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
                  <Lightbulb className="w-4 h-4" />
                  Unleash Your Creativity
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Transform Ideas into Reality</h2>
                <p className="text-base sm:text-lg text-purple-100 mb-6">
                  Discover a more organized way to capture, develop, and share your ideas. Join thousands of creators
                  building the future together.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Start Creating
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                    Explore Ideas
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
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{stat.period}</p>
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

            {/* Trending Ideas */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg sm:text-xl font-semibold">Trending Ideas</h3>
                </div>
                <Button variant="ghost" className="text-purple-600 self-start sm:self-auto">
                  View all →
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {trendingIdeas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="mb-2 bg-purple-100 text-purple-700">
                          {idea.skills[0]}
                        </Badge>
                        <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      <h4 className="font-semibold text-gray-900 leading-tight text-sm sm:text-base">{idea.title}</h4>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3">{idea.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {idea.skills.slice(1).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 sm:w-6 h-5 sm:h-6">
                            <AvatarFallback className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                              {idea.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm text-gray-600 truncate">{idea.author}</span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 sm:w-4 h-3 sm:h-4" />
                            <span>{idea.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                            <span>{idea.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            {/* Enhanced Feed Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Your Feed</h3>
                <p className="text-gray-600">Discover the latest ideas from your network and trending topics</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Following
                </Button>
              </div>
            </div>

            {/* Feed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm text-purple-100">New Ideas Today</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">43</div>
                <div className="text-sm text-blue-100">Active Discussions</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-green-100">Collaborations</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">256</div>
                <div className="text-sm text-orange-100">Ideas This Week</div>
              </div>
            </div>

            {/* Enhanced Feed Items */}
            <div className="space-y-6">
              {mockIdeas.map((idea, index) => (
                <Card key={idea.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
                            {idea.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{idea.author}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{idea.authorRole}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{idea.timeAgo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`${
                                idea.industry === "Education"
                                  ? "bg-purple-100 text-purple-700"
                                  : idea.industry === "Environment"
                                    ? "bg-green-100 text-green-700"
                                    : idea.industry === "Healthcare"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {idea.industry}
                            </Badge>
                            {idea.trending && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{idea.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{idea.description}</p>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {idea.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className={`hover:bg-gray-50 cursor-pointer ${
                              skillIndex === 0
                                ? "border-purple-200 text-purple-700"
                                : skillIndex === 1
                                  ? "border-blue-200 text-blue-700"
                                  : "border-gray-200 text-gray-700"
                            }`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Engagement Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            <span className="font-medium">{idea.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">{idea.comments}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-green-500 hover:bg-green-50 p-2"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{idea.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-6">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Load More Ideas
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Popular Ideas</h3>
                <p className="text-gray-600">Discover trending and popular ideas from the community</p>
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
              {mockIdeas.slice(0, 2).map((idea) => (
                <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {idea.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{idea.author}</span>
                              <span className="text-sm text-gray-500">{idea.authorRole}</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-400">{idea.timeAgo}</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h4>
                            {idea.trending && <Badge className="bg-green-100 text-green-700 mb-2">Trending</Badge>}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{idea.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {idea.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{idea.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>Comment</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ExternalLink className="w-4 h-4" />
                              <span>Share</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{idea.views} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateIdeaDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
