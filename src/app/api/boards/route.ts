import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boards = await prisma.board.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      columns: {
        include: {
          _count: { select: { cards: true } },
        },
      },
    },
  });

  return NextResponse.json(boards);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await request.json();

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const board = await prisma.board.create({
    data: {
      title,
      userId: session.user.id,
      columns: {
        create: [
          { title: "Yapılacak", order: 1000 },
          { title: "Devam Eden", order: 2000 },
          { title: "Tamamlanan", order: 3000 },
        ],
      },
    },
    include: {
      columns: true,
    },
  });

  return NextResponse.json(board, { status: 201 });
}
