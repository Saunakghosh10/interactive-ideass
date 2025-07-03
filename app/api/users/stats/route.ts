import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Get total ideas created by user
    const totalIdeas = await prisma.idea.count({
      where: {
        authorId: userId,
      },
    })

    // Get ideas created this month
    const ideasThisMonth = await prisma.idea.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    })

    // Get total likes received
    const totalLikesReceived = await prisma.like.count({
      where: {
        idea: {
          authorId: userId,
        },
      },
    })

    // Get likes received this month
    const likesThisMonth = await prisma.like.count({
      where: {
        idea: {
          authorId: userId,
        },
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    })

    // Get total comments received
    const totalCommentsReceived = await prisma.comment.count({
      where: {
        idea: {
          authorId: userId,
        },
      },
    })

    // Get comments received this month
    const commentsThisMonth = await prisma.comment.count({
      where: {
        idea: {
          authorId: userId,
        },
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    })

    // Get trending ideas (most liked/commented this month)
    const trendingIdeas = await prisma.idea.findMany({
      where: {
        authorId: userId,
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
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
      orderBy: [
        {
          likes: {
            _count: 'desc',
          },
        },
        {
          comments: {
            _count: 'desc',
          },
        },
      ],
      take: 5,
    })

    return NextResponse.json({
      stats: {
        ideas: {
          total: totalIdeas,
          thisMonth: ideasThisMonth,
        },
        likes: {
          total: totalLikesReceived,
          thisMonth: likesThisMonth,
        },
        comments: {
          total: totalCommentsReceived,
          thisMonth: commentsThisMonth,
        },
      },
      trendingIdeas,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
} 