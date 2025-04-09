// app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/_lib/utils/prisma";

// Gestione della richiesta GET
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  console.log("[GET] email ricevuta:", email);

  const user = await prisma.user.findUnique({ where: { email } });

  console.log("[GET] user ricevuto:", user);
  if (!user) return NextResponse.error();

  const notes = await prisma.folder.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json(notes);
}

//Gestione della richiesta POST
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  const body = await request.json();
  const { name } = body;
  console.log('[POST] userId ricevuto:', name);

  const user = await prisma.user.findUnique({ where: { email } });

  console.log("[GET] user ricevuto:", user);
  if (!user) return NextResponse.error();

  const newNote = await prisma.folder.create({
    data: {
      name,
      userId: user.id,
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
    },
  );
}
