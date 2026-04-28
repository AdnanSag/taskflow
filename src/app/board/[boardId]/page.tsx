import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import BoardView from "@/components/board/BoardView";

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
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
    redirect("/dashboard");
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar userName={session.user.name} boardTitle={board.title} />
      <main className="flex-1 overflow-hidden">
        <BoardView board={board} />
      </main>
    </div>
  );
}
