export async function POST(req) {
  const formData = await req.formData();

  // Example: Access form fields
  const name = formData.get("name");
  const title = formData.get("title");
  const article = formData.get("article");
  const photo = formData.get("photo");
  const file = formData.get("file");

  console.log("Received:", { name, title, article, photo, file });

  // TODO: Save to database / upload to storage

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
