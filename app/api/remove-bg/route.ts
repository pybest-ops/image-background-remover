import { NextResponse } from 'next/server'

// Use edge runtime for Cloudflare Pages/Workers compatibility
export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      console.error('No file provided in request')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.REMOVE_BG_API_KEY
    console.log('API Key present:', !!apiKey)

    if (!apiKey) {
      console.error('API key not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Convert File to Blob
    const blob = new Blob([file], { type: file.type })
    console.log('File size:', file.size, 'bytes')
    console.log('File type:', file.type)

    // Create FormData for remove.bg API
    const apiFormData = new FormData()
    apiFormData.append('image_file', blob, file.name)

    console.log('Calling remove.bg API')
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        // Note: Don't set Content-Type when using FormData, let the browser set it with boundary
      },
      body: apiFormData,
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Remove.bg API error:', errorText)
      return NextResponse.json(
        { error: `Failed to process image: ${errorText}` },
        { status: response.status }
      )
    }

    // Get the processed image as blob
    const processedBlob = await response.blob()
    console.log('Processed image size:', processedBlob.size, 'bytes')

    return new NextResponse(processedBlob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
