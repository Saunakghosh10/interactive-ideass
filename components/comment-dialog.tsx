import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    name: string | null
    image: string | null
  }
}

interface CommentDialogProps {
  ideaId: string
  isOpen: boolean
  onClose: () => void
  onCommentAdded?: () => void
}

export function CommentDialog({
  ideaId,
  isOpen,
  onClose,
  onCommentAdded,
}: CommentDialogProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 10

  const fetchComments = async (pageNum: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/ideas/${ideaId}/comments?page=${pageNum}&limit=${limit}`
      )
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      if (pageNum === 1) {
        setComments(data.comments)
      } else {
        setComments((prev) => [...prev, ...data.comments])
      }
      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setPage(1)
      fetchComments(1)
    }
  }, [isOpen, ideaId])

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchComments(nextPage)
    }
  }

  const handleSubmit = async () => {
    if (!session) {
      toast({
        title: 'Error',
        description: 'You must be logged in to comment',
        variant: 'destructive',
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) throw new Error('Failed to post comment')

      const comment = await response.json()
      setComments((prev) => [comment, ...prev])
      setNewComment('')
      onCommentAdded?.()

      toast({
        title: 'Success',
        description: 'Comment posted successfully',
      })
    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !session}
              className="self-start"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Post'
              )}
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-4 flex gap-4 rounded-lg border p-4"
              >
                <Avatar>
                  <AvatarImage src={comment.author.image || undefined} />
                  <AvatarFallback>
                    {comment.author.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {comment.author.name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}

            {hasMore && (
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="mb-4 w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Load More'
                )}
              </Button>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
} 