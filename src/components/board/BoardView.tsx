"use client";

import { useState, useRef, useCallback } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import Column from "./Column";
import CardModal from "./CardModal";

export interface CardType {
  id: string;
  title: string;
  description: string;
  order: number;
  columnId: string;
}

export interface ColumnType {
  id: string;
  title: string;
  order: number;
  boardId: string;
  cards: CardType[];
}

interface BoardType {
  id: string;
  title: string;
  columns: ColumnType[];
}

interface BoardViewProps {
  board: BoardType;
}

export default function BoardView({ board }: BoardViewProps) {
  // State: items grouped by column ID
  const [items, setItems] = useState<Record<string, string[]>>(() => {
    const result: Record<string, string[]> = {};
    board.columns.forEach((col) => {
      result[col.id] = col.cards.map((c) => c.id);
    });
    return result;
  });

  // All cards data by ID
  const [cardsMap, setCardsMap] = useState<Record<string, CardType>>(() => {
    const result: Record<string, CardType> = {};
    board.columns.forEach((col) => {
      col.cards.forEach((card) => {
        result[card.id] = card;
      });
    });
    return result;
  });

  // Column order
  const [columnOrder, setColumnOrder] = useState<string[]>(
    board.columns.map((c) => c.id)
  );

  // Columns data by ID
  const [columnsMap, setColumnsMap] = useState<Record<string, ColumnType>>(
    () => {
      const result: Record<string, ColumnType> = {};
      board.columns.forEach((col) => {
        result[col.id] = col;
      });
      return result;
    }
  );

  // For rollback on cancel
  const previousItems = useRef(items);

  // Modal state
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  // Calculate order value for a card at a given index in a column
  const calculateOrder = useCallback(
    (columnId: string, index: number, currentItems: Record<string, string[]>) => {
      const columnCards = currentItems[columnId] || [];

      if (columnCards.length <= 1) {
        return 1000;
      }

      // Get the actual order values of surrounding cards
      const getCardOrder = (cardId: string) => {
        return cardsMap[cardId]?.order ?? 0;
      };

      if (index === 0) {
        // First position
        const nextCard = columnCards[1];
        if (nextCard) {
          return getCardOrder(nextCard) / 2;
        }
        return 1000;
      }

      if (index >= columnCards.length - 1) {
        // Last position
        const prevCard = columnCards[columnCards.length - 2];
        if (prevCard) {
          return getCardOrder(prevCard) + 1000;
        }
        return 1000;
      }

      // Middle position
      const prevCard = columnCards[index - 1];
      const nextCard = columnCards[index + 1];
      if (prevCard && nextCard) {
        return (getCardOrder(prevCard) + getCardOrder(nextCard)) / 2;
      }

      return (index + 1) * 1000;
    },
    [cardsMap]
  );

  // Persist card reorder to API
  const persistReorder = useCallback(
    async (
      cardId: string,
      newColumnId: string,
      newItems: Record<string, string[]>
    ) => {
      const cardIndex = newItems[newColumnId]?.indexOf(cardId) ?? 0;
      const order = calculateOrder(newColumnId, cardIndex, newItems);

      // Update local card data
      setCardsMap((prev) => ({
        ...prev,
        [cardId]: {
          ...prev[cardId],
          columnId: newColumnId,
          order,
        },
      }));

      try {
        await fetch("/api/cards/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId,
            columnId: newColumnId,
            order,
          }),
        });
      } catch (error) {
        console.error("Failed to persist reorder:", error);
      }
    },
    [calculateOrder]
  );

  // Add a new column
  const addColumn = async (title: string) => {
    try {
      const res = await fetch(`/api/boards/${board.id}/columns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        const newColumn = await res.json();
        setColumnsMap((prev) => ({ ...prev, [newColumn.id]: newColumn }));
        setColumnOrder((prev) => [...prev, newColumn.id]);
        setItems((prev) => ({ ...prev, [newColumn.id]: [] }));
      }
    } catch (err) {
      console.error("Failed to add column:", err);
    }
  };

  // Delete a column
  const deleteColumn = async (columnId: string) => {
    try {
      const res = await fetch(`/api/columns/${columnId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setColumnOrder((prev) => prev.filter((id) => id !== columnId));
        setItems((prev) => {
          const next = { ...prev };
          // Remove card data
          next[columnId]?.forEach((cardId) => {
            setCardsMap((cm) => {
              const copy = { ...cm };
              delete copy[cardId];
              return copy;
            });
          });
          delete next[columnId];
          return next;
        });
        setColumnsMap((prev) => {
          const next = { ...prev };
          delete next[columnId];
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to delete column:", err);
    }
  };

  // Update column title
  const updateColumnTitle = async (columnId: string, title: string) => {
    setColumnsMap((prev) => ({
      ...prev,
      [columnId]: { ...prev[columnId], title },
    }));

    try {
      await fetch(`/api/columns/${columnId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    } catch (err) {
      console.error("Failed to update column title:", err);
    }
  };

  // Add a card
  const addCard = async (columnId: string, title: string) => {
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, columnId }),
      });

      if (res.ok) {
        const newCard = await res.json();
        setCardsMap((prev) => ({ ...prev, [newCard.id]: newCard }));
        setItems((prev) => ({
          ...prev,
          [columnId]: [...(prev[columnId] || []), newCard.id],
        }));
      }
    } catch (err) {
      console.error("Failed to add card:", err);
    }
  };

  // Delete a card
  const deleteCard = async (cardId: string) => {
    const card = cardsMap[cardId];
    if (!card) return;

    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((colId) => {
            next[colId] = next[colId].filter((id) => id !== cardId);
          });
          return next;
        });
        setCardsMap((prev) => {
          const next = { ...prev };
          delete next[cardId];
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  };

  // Update card details
  const updateCard = async (
    cardId: string,
    data: { title?: string; description?: string }
  ) => {
    setCardsMap((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], ...data },
    }));

    try {
      await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Failed to update card:", err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <DragDropProvider
        onDragStart={() => {
          previousItems.current = items;
        }}
        onDragOver={(event) => {
          const { source } = event.operation;
          if (source?.type === "column") return;
          setItems((currentItems) => move(currentItems, event));
        }}
        onDragEnd={(event) => {
          const { source } = event.operation;

          if (event.canceled) {
            if (source?.type !== "column") {
              setItems(previousItems.current);
            }
            return;
          }

          if (source?.type === "column") {
            setColumnOrder((columns) => move(columns, event));
          } else {
            // Persist the card reorder
            const cardId = source?.id as string;
            if (cardId) {
              // Find which column the card is now in
              const newItems = items;
              for (const [colId, cardIds] of Object.entries(newItems)) {
                if (cardIds.includes(cardId)) {
                  persistReorder(cardId, colId, newItems);
                  break;
                }
              }
            }
          }
        }}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-4 h-full items-start">
            {columnOrder.map((columnId, index) => {
              const column = columnsMap[columnId];
              if (!column) return null;

              const cardIds = items[columnId] || [];
              const cards = cardIds
                .map((id) => cardsMap[id])
                .filter(Boolean) as CardType[];

              return (
                <Column
                  key={columnId}
                  column={column}
                  cards={cards}
                  cardIds={cardIds}
                  index={index}
                  onAddCard={addCard}
                  onDeleteCard={deleteCard}
                  onEditCard={setEditingCard}
                  onUpdateTitle={updateColumnTitle}
                  onDeleteColumn={deleteColumn}
                />
              );
            })}

            {/* Add Column Button */}
            <AddColumnButton onAdd={addColumn} />
          </div>
        </div>
      </DragDropProvider>

      {/* Card Edit Modal */}
      {editingCard && (
        <CardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={(data) => {
            updateCard(editingCard.id, data);
            setEditingCard(null);
          }}
          onDelete={() => {
            deleteCard(editingCard.id);
            setEditingCard(null);
          }}
        />
      )}
    </div>
  );
}

function AddColumnButton({ onAdd }: { onAdd: (title: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="flex-shrink-0 w-72 sm:w-80">
        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-4 animate-scale-in"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sütun adı..."
            autoFocus
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm"
          />
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              Ekle
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setTitle("");
              }}
              className="px-3 py-1.5 rounded-lg border border-border text-text-secondary text-sm hover:text-text-primary transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="flex-shrink-0 w-72 sm:w-80 h-12 rounded-2xl border-2 border-dashed border-border/50 text-text-muted hover:border-accent/50 hover:text-accent flex items-center justify-center gap-2 transition-all duration-200"
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
      Sütun Ekle
    </button>
  );
}
