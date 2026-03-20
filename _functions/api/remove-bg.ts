export async function onRequestPost(context: { request: Request; env: { REMOVE_BG_API_KEY: string } }) {
  try {
    const { request, env } = context
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      console.error('No file provided in request')
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const apiKey = env.REMOVE_BG_API_KEY
    console.log('API Key present:', !!apiKey)

    if (!apiKey) {
      console.error('API key not configured')
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Convert File to Blob
    const blob = file instanceof Blob ? file : new Blob([file as BlobPart], { type: 'image/jpeg' })
    console.log('File size:', blob.size, 'bytes')

    // Create FormData for remove.bg API
    const apiFormData = new FormData()
    apiFormData.append('image_file', blob, 'image.jpg')

    console.log('Calling remove.bg API')
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: apiFormData,
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Remove.bg API error:', errorText)
      return new Response(JSON.stringify({ error: `Failed to process image: ${errorText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get the processed image as blob
    const processedBlob = await response.blob()
    console.log('Processed image size:', processedBlob.size, 'bytes')

    return new Response(processedBlob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(JSON.stringify({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
