import prisma from "@/app/utils/prisma";

export async function POST(req: Request) {
  try {
    const { slug, name, age, message } = await req.json();
    const result = await prisma.cards.create({
      data: { slug, name, age: Number(age), message },
    });
    console.log("card created:",result)
    return Response.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Database operation failed:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request){
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if(!slug){
      return Response.json({ error: "Slug is required" }, {status: 400});
    }

    const card = await prisma.cards.findUnique({
      where: { slug},
    });

    if(!card) {
      return Response.json({ error: "Card not found"}, {status: 404});
    }

    return Response.json({ success: true,card}, {status:200});
  } catch (error) {
    console.error("db operation failed", error);
    return Response.json(
      {
        error:"internal server error",
        details: error instanceof Error ? error.message :  String(error),
      },
      {status:500 }
    );
  }
} 