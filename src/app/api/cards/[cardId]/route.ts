import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId } = await params;
  const { title, description } = await request.json();

  // Verify ownership through column -> board
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      column: { board: { userId: session.user.id } },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const updateData: { title?: string; description?: string } = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;

  const updated = await prisma.card.update({
    where: { id: cardId },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId } = await params;

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      column: { board: { userId: session.user.id } },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  await prisma.card.delete({
    where: { id: cardId },
  });

  return NextResponse.json({ success: true });
}
