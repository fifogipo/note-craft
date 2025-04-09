// app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/_lib/utils/prisma";

// Gestione della richiesta GET
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  const id = Number(params.id);
  console.log('[GET] email ricevuta:', email, id);

  const user = await prisma.user.findUnique({ where: {email}})

  console.log('[GET] user ricevuto:', user);
  if (!user) return NextResponse.error();

  const note = await prisma.note.findUnique({
    where: { userId: user.id, id },
  });

  return NextResponse.json(note);
}

// Gestione della richiesta POST
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content, userId } = body;
  console.log('[POST] userId ricevuto:', userId);

  const newNote = await prisma.note.create({
    data: {
      title,
      content,
      userId,
    },
  });

  return NextResponse.json(newNote, { status: 201 });
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      status: 200,
    }
  );
}
