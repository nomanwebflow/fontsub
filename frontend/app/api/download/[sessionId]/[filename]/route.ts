import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; filename: string }> }
) {
  try {
    const { sessionId, filename } = await params

    const apiUrl = process.env.API_URL || 'http://localhost:8000'

    const response = await fetch(`${apiUrl}/api/download/${sessionId}/${filename}`)

    if (!response.ok) {
      return NextResponse.json(
        { detail: 'File not found' },
        { status: response.status }
      )
    }

    // Get the file content and headers
    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition')

    // Create response with file
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    if (contentDisposition) {
      headers.set('Content-Disposition', contentDisposition)
    }

    return new NextResponse(blob, { headers })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}
