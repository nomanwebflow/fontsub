import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    const apiUrl = process.env.API_URL || 'http://localhost:8000'

    const response = await fetch(`${apiUrl}/api/session/${sessionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return NextResponse.json(
        { detail: 'Failed to delete session' },
        { status: response.status }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Session cleanup error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
