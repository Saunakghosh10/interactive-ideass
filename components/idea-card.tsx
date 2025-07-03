import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditIdeaDialog } from "@/components/edit-idea-dialog"
import { CommentDialog } from "@/components/comment-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface IdeaCardProps {
  idea: {
    id: string
    title: string
    description: string
    skills: string[]
    industries: string[]
    author: {
      id: string
      name: string | null
      image: string | null
    }
    likes: {
      userId: string
    }[]
    _count: {
      comments: number
      likes: number
    }
    createdAt: string
    updatedAt: string
  }
  onDelete?: () => void
  onUpdate?: (updatedIdea: any) => void
}

export function IdeaCard({ idea, onDelete, onUpdate }: IdeaCardProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(() =>
    idea.likes.some((like) => like.userId === session?.user?.id)
  )
  const [likesCount, setLikesCount] = useState(idea._count.likes)
  const [commentsCount, setCommentsCount] = useState(idea._count.comments)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleLike = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to like ideas",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/ideas/${idea.id}/like`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to update like")

      const { liked } = await response.json()
      setIsLiked(liked)
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1))

      toast({
        title: "Success",
        description: liked ? "Idea liked" : "Like removed",
      })
    } catch (error) {
      console.error("Error updating like:", error)
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/ideas/${idea.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete idea")

      toast({
        title: "Success",
        description: "Idea deleted successfully",
      })

      onDelete?.()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting idea:", error)
      toast({
        title: "Error",
        description: "Failed to delete idea",
        variant: "destructive",
      })
    }
  }

  const handleCommentAdded = () => {
    setCommentsCount((prev) => prev + 1)
  }

  const handleCommentDeleted = () => {
    setCommentsCount((prev) => prev - 1)
  }

  const handleIdeaUpdated = (updatedIdea: any) => {
    onUpdate?.(updatedIdea)
  }

  const isAuthor = session?.user?.id === idea.author.id

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <img
                src={idea.author.image || "/placeholder-user.jpg"}
                alt={idea.author.name || "User"}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">{idea.author.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
          <p className="text-gray-600 mb-4">{idea.description}</p>

          <div className="space-y-3">
            {idea.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {idea.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            {idea.industries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {idea.industries.map((industry) => (
                  <Badge key={industry} variant="outline">
                    {industry}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${isLiked ? "text-blue-600" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              {likesCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setIsCommentDialogOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              {commentsCount}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <EditIdeaDialog
        idea={idea}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />

      <CommentDialog
        ideaId={idea.id}
        open={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 