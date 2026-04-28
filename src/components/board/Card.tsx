"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import { CardType } from "./BoardView";

interface CardProps {
  card: CardType;
  index: number;
  columnId: string;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

export default function Card({
  card,
  index,
  columnId,
  onEdit,
  onDelete,
}: CardProps) {
  const { ref, isDragSource } = useSortable({
    id: card.id,
    index,
    type: "item",
    group: columnId,
    accept: ["item"],
  });

  return (
    <div
      ref={ref}
      data-dragging={isDragSource}
      className={`group relative rounded-xl bg-bg-card border border-border/50 px-3 py-2.5 cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 ${
        isDragSource
          ? "opacity-50 scale-[1.02] rotate-[2deg] shadow-2xl shadow-accent/20 z-50 ring-2 ring-accent/40"
          : ""
      }`}
      onClick={() => onEdit(card)}
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-all duration-200"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Card Title */}
      <h4 className="text-sm text-text-primary font-medium pr-6 leading-snug">
        {card.title}
      </h4>

      {/* Description preview */}
      {card.description && (
        <p className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Description indicator */}
      {card.description && (
        <div className="mt-2 flex items-center gap-1 text-text-muted">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
