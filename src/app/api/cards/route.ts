import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, columnId } = await request.json();

  if (!title || !columnId) {
    return NextResponse.json(
      { error: "Title and columnId are required" },
      { status: 400 }
    );
  }

  // Verify column ownership through board
  const column = await prisma.column.findFirst({
    where: {
      id: columnId,
      board: { userId: session.user.id },
    },
  });

  if (!column) {
    return NextResponse.json({ error: "Column not found" }, { status: 404 });
  }

  // Get the max order of existing cards in the column
  const lastCard = await prisma.card.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
  });

  const newOrder = lastCard ? lastCard.order + 1000 : 1000;

  const card = await prisma.card.create({
    data: {
      title,
      order: newOrder,
      columnId,
    },
  });

  return NextResponse.json(card, { status: 201 });
}
