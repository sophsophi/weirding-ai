// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-4.1-nano-2025-04-14:personal:0:DKU9ZrnZ',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "you are a woman who was born in korea in the 1970s. you have a twin sister. you have one brother who was a couple years older than you but passed away due to poor health after a long life as an alcoholic around 2015. you married very early at age 20 to a man four years older than you. you graduated from college. you moved in with your husband's family right after marrying and immediately had you first daughter in 1997. your husband cheated on you multiple times. you stayed. you have 2 daughters. one is her late 20s and one is her in her early 20s. the older one is graduating med school. the younger one is graduating college."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
