"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Board {
  id: string;
  title: string;
  createdAt: string;
  columns: { _count: { cards: number } }[];
}

export default function DashboardContent() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  async function fetchBoards() {
    try {
      const res = await fetch("/api/boards");
      if (res.ok) {
        const data = await res.json();
        setBoards(data);
      }
    } catch (err) {
      console.error("Failed to fetch boards:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        setNewTitle("");
        setShowCreate(false);
        fetchBoards();
      }
    } catch (err) {
      console.error("Failed to create board:", err);
    } finally {
      setCreating(false);
    }
  }

  async function deleteBoard(boardId: string) {
    if (!confirm("Bu board'u silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBoards((prev) => prev.filter((b) => b.id !== boardId));
      }
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Board&apos;larım
          </h1>
          <p className="text-text-secondary mt-1">
            Projelerinizi organize edin
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-violet text-white font-medium hover:opacity-90 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">Yeni Board</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form
          onSubmit={createBoard}
          className="glass rounded-2xl p-6 mb-8 animate-slide-up"
        >
          <h3 className="text-lg font-semibold mb-4">Yeni Board Oluştur</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Board adı..."
              autoFocus
              className="flex-1 px-4 py-2.5 rounded-xl bg-bg-tertiary border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
            />
            <button
              type="submit"
              disabled={creating || !newTitle.trim()}
              className="px-6 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "..." : "Oluştur"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setNewTitle("");
              }}
              className="px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary transition-all duration-200"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-violet/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Henüz board yok
          </h3>
          <p className="text-text-secondary mb-6">
            İlk board&apos;unuzu oluşturarak başlayın
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-violet text-white font-medium hover:opacity-90 transition-all duration-200"
          >
            Board Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board, idx) => {
            const totalCards = board.columns.reduce(
              (sum, col) => sum + col._count.cards,
              0
            );

            return (
              <div
                key={board.id}
                className="group glass rounded-2xl p-6 hover:glow-accent transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Link
                    href={`/board/${board.id}`}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                      {board.title}
                    </h3>
                  </Link>
                  <button
                    onClick={() => deleteBoard(board.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-all duration-200"
                    title="Board'u sil"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <Link href={`/board/${board.id}`}>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      {board.columns.length} sütun
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      {totalCards} kart
                    </span>
                  </div>

                  <div className="mt-4 flex gap-1">
                    {board.columns.map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full bg-gradient-to-r from-accent/40 to-violet/40"
                      />
                    ))}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
