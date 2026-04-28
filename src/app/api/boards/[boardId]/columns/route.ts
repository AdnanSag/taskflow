import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await params;
  const { title } = await request.json();

  // Verify board ownership
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId: session.user.id },
  });

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  // Get the max order of existing columns
  const lastColumn = await prisma.column.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
  });

  const newOrder = lastColumn ? lastColumn.order + 1000 : 1000;

  const column = await prisma.column.create({
    data: {
      title: title || "Yeni Sütun",
      order: newOrder,
      boardId,
    },
    include: {
      cards: true,
    },
  });

  return NextResponse.json(column, { status: 201 });
}
