import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db/client"

export async function POST(
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
    const userId = session.user.id

    // Check if user already liked the idea
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    })

    if (existingLike) {
      // Unlike if already liked
      await prisma.like.delete({
        where: {
          userId_ideaId: {
            userId,
            ideaId,
          },
        },
      })
      return NextResponse.json({ liked: false })
    } else {
      // Like if not already liked
      await prisma.like.create({
        data: {
          userId,
          ideaId,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}

export async function GET(
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
    const userId = session.user.id

    const like = await prisma.like.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json(
      { error: "Failed to check like status" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { params } = context
    const ideaId = params.id

    const like = await prisma.like.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId,
        },
      },
    })

    if (!like) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      )
    }

    await prisma.like.delete({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId,
        },
      },
    })

    return NextResponse.json({ message: 'Like removed successfully' })
  } catch (error) {
    console.error('Error removing like:', error)
    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 }
    )
  }
} 