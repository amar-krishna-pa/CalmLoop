"use client";
import { useState } from "react";
import { LuPencil, LuCheck, LuX } from "react-icons/lu";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";
import LoadingSpinner from "../loaders/LoadingSpinner";

type Props = {
  initialName: string;
};

export default function EditNameField({ initialName }: Props) {
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialName);
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setDraft(name);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(name);
  }

  async function save() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (trimmed === name) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: trimmed });
      if (error) {
        toast.error("Failed to update name");
      } else {
        setName(trimmed);
        setEditing(false);
        toast.success("Name updated");
      }
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted">Name</span>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancelEdit();
            }}
            disabled={saving}
            className="px-2 py-1 rounded-lg text-sm border border-subtle bg-transparent text-primary focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60 w-44"
          />
          <button
            onClick={save}
            disabled={saving || !draft.trim()}
            className="cursor-pointer p-1.5 rounded-lg text-muted hover:text-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-40"
            aria-label="Save name"
          >
            {saving ? <LoadingSpinner /> : <LuCheck size={15} />}
          </button>
          <button
            onClick={cancelEdit}
            disabled={saving}
            className="cursor-pointer p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-40"
            aria-label="Cancel"
          >
            <LuX size={15} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">{name}</span>
          <button
            onClick={startEdit}
            className="cursor-pointer p-1.5 rounded-lg text-muted hover:text-primary hover:bg-subtle transition-colors"
            aria-label="Edit name"
          >
            <LuPencil size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
