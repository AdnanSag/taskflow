import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { columnId } = await params;
  const { title, order } = await request.json();

  // Verify ownership through board relation
  const column = await prisma.column.findFirst({
    where: {
      id: columnId,
      board: { userId: session.user.id },
    },
  });

  if (!column) {
    return NextResponse.json({ error: "Column not found" }, { status: 404 });
  }

  const updateData: { title?: string; order?: number } = {};
  if (title !== undefined) updateData.title = title;
  if (order !== undefined) updateData.order = order;

  const updated = await prisma.column.update({
    where: { id: columnId },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { columnId } = await params;

  // Verify ownership
  const column = await prisma.column.findFirst({
    where: {
      id: columnId,
      board: { userId: session.user.id },
    },
  });

  if (!column) {
    return NextResponse.json({ error: "Column not found" }, { status: 404 });
  }

  await prisma.column.delete({
    where: { id: columnId },
  });

  return NextResponse.json({ success: true });
}
