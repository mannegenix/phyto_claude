import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { env } from "@/lib/env";
import { buildChatInstructions } from "@/lib/chat-context";

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

export async function POST(req: Request) {
  if (!env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Chat is not configured." }, { status: 503 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Invalid conversation." }, { status: 400 });
  }
  const tooLong = messages.some((m) => m.parts.some((p) => p.type === "text" && p.text.length > MAX_CHARS));
  if (tooLong) return Response.json({ error: "Message too long." }, { status: 413 });

  const result = streamText({
    model: anthropic(env.CHAT_MODEL),
    instructions: await buildChatInstructions(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
    temperature: 0.2,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
