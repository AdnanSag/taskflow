"use client";

import { useState, useEffect, useRef } from "react";
import { CardType } from "./BoardView";

interface CardModalProps {
  card: CardType;
  onClose: () => void;
  onSave: (data: { title?: string; description?: string }) => void;
  onDelete: () => void;
}

export default function CardModal({
  card,
  onClose,
  onSave,
  onDelete,
}: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSave = () => {
    const updates: { title?: string; description?: string } = {};

    if (title.trim() && title !== card.title) {
      updates.title = title.trim();
    }

    if (description !== (card.description || "")) {
      updates.description = description;
    }

    if (Object.keys(updates).length > 0) {
      onSave(updates);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg glass-strong rounded-2xl animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-lg font-semibold text-text-primary">
            Kart Düzenle
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-all"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
              placeholder="Kart başlığı"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200 resize-none"
              placeholder="Kart hakkında detaylar ekleyin..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/30">
          <button
            onClick={() => {
              if (confirm("Bu kartı silmek istediğinize emin misiniz?")) {
                onDelete();
              }
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-all duration-200"
          >
            Kartı Sil
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-text-primary transition-all duration-200"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-accent to-violet text-white text-sm font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
