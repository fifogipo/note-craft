// app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/_lib/utils/prisma";

// Gestione della richiesta GET
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  const { id } = await params;
  const noteId = Number(id);
  console.log("[GET] email ricevuta:", email, id);

  const user = await prisma.user.findUnique({ where: { email } });

  console.log("[GET] user ricevuto:", user);
  if (!user) return NextResponse.error();

  const note = await prisma.note.findUnique({
    where: { userId: user.id, id: noteId },
  });

  return NextResponse.json(note);
}

// Gestione della richiesta PATCH
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noteId = Number(id);
  const body = await request.json();

  console.log("[POST] userId ricevuto:", id);

  const newNote = await prisma.note.update({
    where: { id: noteId },
    data: body,
  });

  return NextResponse.json(newNote, { status: 201 });
}

// Gestione della richiesta DELETE
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noteId = Number(id);
  console.log("[DELETE] Nota da eliminare:", id);

  const newNote = await prisma.note.delete({
    where: { id: noteId },
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
