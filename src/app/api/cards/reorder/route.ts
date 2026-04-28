import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId, columnId, order } = await request.json();

  if (!cardId || !columnId || order === undefined) {
    return NextResponse.json(
      { error: "cardId, columnId, and order are required" },
      { status: 400 }
    );
  }

  // Verify ownership
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      column: { board: { userId: session.user.id } },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Verify target column belongs to same board
  const targetColumn = await prisma.column.findFirst({
    where: {
      id: columnId,
      board: { userId: session.user.id },
    },
  });

  if (!targetColumn) {
    return NextResponse.json(
      { error: "Target column not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.card.update({
    where: { id: cardId },
    data: {
      columnId,
      order,
    },
  });

  return NextResponse.json(updated);
}
