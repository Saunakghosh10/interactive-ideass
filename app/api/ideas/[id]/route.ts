import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// DELETE /api/ideas/[id]
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idea = await prisma.idea.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    if (idea.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized - You can only delete your own ideas' }, { status: 403 })
    }

    await prisma.idea.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Idea deleted successfully' })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    )
  }
}

// PATCH /api/ideas/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, skills, industries } = await req.json()

    const idea = await prisma.idea.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    if (idea.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: params.id },
      data: {
        title,
        description,
        skills,
        industries,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error("Error fetching idea:", error)
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const idea = await prisma.idea.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    // Check if the user is the author of the idea
    if (idea.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - You can only edit your own ideas" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, skills, industries } = body

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        description: description.trim(),
        skills,
        industries,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error("Error updating idea:", error)
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    )
  }
} 