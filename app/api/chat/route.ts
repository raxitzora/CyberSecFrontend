import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Call your FastAPI backend hosted on Render
  const response = await fetch("https://cybersecbackend.onrender.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Failed to connect backend" }), { status: 500 });
  }

  return new Response(response.body, {
    headers: { "Content-Type": "application/json" },
  });
}
