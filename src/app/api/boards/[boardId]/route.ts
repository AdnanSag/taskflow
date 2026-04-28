import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await params;

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      userId: session.user.id,
    },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          cards: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json(board);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await params;
  const { title } = await request.json();

  const board = await prisma.board.updateMany({
    where: {
      id: boardId,
      userId: session.user.id,
    },
    data: { title },
  });

  if (board.count === 0) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await params;

  const board = await prisma.board.deleteMany({
    where: {
      id: boardId,
      userId: session.user.id,
    },
  });

  if (board.count === 0) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
