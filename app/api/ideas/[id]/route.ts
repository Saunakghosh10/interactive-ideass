import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db/client"

// DELETE /api/ideas/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const ideaId = context.params.id

    // Check if user owns the idea
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { authorId: true },
    })

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    if (idea.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this idea" },
        { status: 403 }
      )
    }

    await prisma.idea.delete({
      where: { id: ideaId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting idea:", error)
    return NextResponse.json(
      { error: "Failed to delete idea" },
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
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const ideaId = context.params.id

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
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
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const ideaId = context.params.id
    const { title, description, skills, industries } = await request.json()

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Check if user owns the idea
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { authorId: true },
    })

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    if (idea.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this idea" },
        { status: 403 }
      )
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        title: title.trim(),
        description: description.trim(),
        skills,
        industries,
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