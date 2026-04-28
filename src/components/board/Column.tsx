"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { CardType, ColumnType } from "./BoardView";
import Card from "./Card";

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  cardIds: string[];
  index: number;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (card: CardType) => void;
  onUpdateTitle: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export default function Column({
  column,
  cards,
  cardIds,
  index: _index,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onUpdateTitle,
  onDeleteColumn,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const { ref: droppableRef, isDropTarget } = useDroppable({
    id: column.id,
    type: "column",
    accept: ["item"],
    collisionPriority: CollisionPriority.Low,
  });

  const handleTitleSubmit = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdateTitle(column.id, trimmed);
    } else {
      setTitleValue(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  return (
    <div className="flex-shrink-0 w-72 sm:w-80 flex flex-col max-h-full animate-fade-in">
      <div
        ref={droppableRef}
        className={`flex flex-col rounded-2xl transition-all duration-300 ${
          isDropTarget
            ? "glass-strong glow-accent-strong ring-2 ring-accent/40"
            : "glass"
        }`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-violet flex-shrink-0" />

            {isEditingTitle ? (
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSubmit();
                  if (e.key === "Escape") {
                    setTitleValue(column.title);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="flex-1 px-2 py-0.5 rounded-lg bg-bg-tertiary border border-accent text-text-primary text-sm font-semibold focus:outline-none min-w-0"
              />
            ) : (
              <h3
                className="text-sm font-semibold text-text-primary truncate cursor-pointer hover:text-accent transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {column.title}
              </h3>
            )}

            <span className="text-xs text-text-muted bg-bg-tertiary rounded-full px-2 py-0.5 flex-shrink-0">
              {cards.length}
            </span>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setIsAddingCard(true)}
              className="p-1 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent transition-all duration-200"
              title="Kart ekle"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                if (
                  confirm("Bu sütunu ve tüm kartlarını silmek istiyor musunuz?")
                ) {
                  onDeleteColumn(column.id);
                }
              }}
              className="p-1 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-all duration-200"
              title="Sütunu sil"
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
        </div>

        {/* Cards Container */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-[60px] max-h-[calc(100vh-260px)]">
          {cardIds.map((cardId, cardIndex) => {
            const card = cards.find((c) => c.id === cardId);
            if (!card) return null;

            return (
              <Card
                key={cardId}
                card={card}
                index={cardIndex}
                columnId={column.id}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            );
          })}

          {cardIds.length === 0 && !isAddingCard && (
            <div
              className={`text-center py-8 text-text-muted text-sm transition-all duration-200 ${
                isDropTarget ? "text-accent" : ""
              }`}
            >
              {isDropTarget ? "Buraya bırak" : "Kart yok"}
            </div>
          )}
        </div>

        {/* Add Card Form */}
        {isAddingCard && (
          <div className="px-3 pb-3 animate-fade-in">
            <form onSubmit={handleAddCard}>
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Kart başlığı girin..."
                autoFocus
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCard(e);
                  }
                  if (e.key === "Escape") {
                    setIsAddingCard(false);
                    setNewCardTitle("");
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-bg-card border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={!newCardTitle.trim()}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCard(false);
                    setNewCardTitle("");
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border text-text-secondary text-sm hover:text-text-primary transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Card Bottom Button */}
        {!isAddingCard && (
          <button
            onClick={() => setIsAddingCard(true)}
            className="mx-3 mb-3 py-2 rounded-xl border border-dashed border-border/50 text-text-muted hover:border-accent/50 hover:text-accent text-sm flex items-center justify-center gap-1.5 transition-all duration-200"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Kart Ekle
          </button>
        )}
      </div>
    </div>
  );
}
