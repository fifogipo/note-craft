// app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/_lib/utils/prisma";

//Gestione della richiesta PATCH
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const folderId = Number(id);
  const body = await request.json();
  const { name } = body;
  console.log("[PATCH] userId ricevuto:", name);

  const newNote = await prisma.folder.update({
    where: { id: folderId },
    data: { name },
  });

  return NextResponse.json(newNote, { status: 201 });
}

// Gestione della richiesta DELETE
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const folderId = Number(id);
  console.log("[DELETE] Cartella da eliminare:", folderId);

  try {
    const deletedFolder = await prisma.$transaction(async (tx) => {
      await tx.note.deleteMany({
        where: { folderId },
      });

      return tx.folder.delete({
        where: { id: folderId },
      });
    });

    return NextResponse.json(deletedFolder, { status: 200 });
  } catch (error) {
    console.error("Errore durante l'eliminazione della cartella e delle note associate:", error);
    return NextResponse.json({ error: "Errore durante l'eliminazione" }, { status: 500 });
  }
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
