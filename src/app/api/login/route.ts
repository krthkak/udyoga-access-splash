export async function POST(req: Request) {
  try {
    const body = await req.json();
    return new Response(JSON.stringify({ error: "Not implemented", body }), {
      status: 501,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}
