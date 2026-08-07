const fallbackPlan = {
  source: "demo",
  message: "Using Kai Connect's reliable offline recommendation engine.",
};

export async function POST(request: Request) {
  const input = await request.json().catch(() => ({}));
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) return Response.json({ ...fallbackPlan, input });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "You plan simple, affordable NZ household meals. Prioritise expiring pantry food, realistic servings, nutrition, budget, and minimal extra purchases. Return valid JSON only.",
          },
          { role: "user", content: JSON.stringify(input) },
        ],
        text: { format: { type: "json_object" } },
      }),
    });
    if (!response.ok) throw new Error("AI service unavailable");
    const data = await response.json();
    return Response.json({ source: "openai", data });
  } catch {
    return Response.json(fallbackPlan);
  }
}
