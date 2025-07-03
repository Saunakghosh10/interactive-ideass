import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
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

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId,
        },
      },
    })

    if (existingLike) {
      // Unlike if already liked
      await prisma.like.delete({
        where: {
          userId_ideaId: {
            userId: session.user.id,
            ideaId,
          },
        },
      })
      return NextResponse.json({ liked: false })
    } else {
      // Like if not already liked
      await prisma.like.create({
        data: {
          userId: session.user.id,
          ideaId,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error handling like:', error)
    return NextResponse.json(
      { error: 'Failed to handle like' },
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