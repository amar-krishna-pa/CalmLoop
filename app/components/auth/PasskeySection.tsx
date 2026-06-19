"use client";
import { useEffect, useState } from "react";
import { GoPasskeyFill } from "react-icons/go";
import { LuTrash2 } from "react-icons/lu";
import { authClient } from "@/app/lib/auth/auth-client";
import { toast } from "sonner";
import LoadingSpinner from "../loaders/LoadingSpinner";
import PasskeyTableSkeleton from "../loaders/PasskeyTableSkeleton";

type Passkey = {
  id: string;
  name?: string | null;
  createdAt: Date;
};

export default function PasskeySection() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loadingPasskeys, setLoadingPasskeys] = useState(true);
  const [addingPasskey, setAddingPasskey] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [passkeyName, setPasskeyName] = useState("");
  const [nameError, setNameError] = useState("");

  async function fetchPasskeys() {
    setLoadingPasskeys(true);
    try {
      const { data: passkeys, error } =
        await authClient.passkey.listUserPasskeys();
      if (error) {
        toast.error("Failed to load passkeys");
      } else {
        setPasskeys(passkeys ?? []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load passkeys");
    } finally {
      setLoadingPasskeys(false);
    }
  }

  useEffect(() => {
    fetchPasskeys();
  }, []);

  async function handleAddPasskey() {
    if (!passkeyName.trim()) {
      setNameError(
        "Please give this passkey a name so you can recognise it later."
      );
      return;
    }
    setNameError("");
    setAddingPasskey(true);
    try {
      const { error } = await authClient.passkey.addPasskey({
        name: passkeyName.trim(),
      });
      if (error) {
        console.error(error);
        if (
          "code" in error &&
          error.code === "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED"
        ) {
          toast.error("This device is already registered as a passkey");
        } else {
          toast.error("Failed to add passkey");
        }
      } else {
        toast.success("Passkey added");
        setPasskeyName("");
        await fetchPasskeys();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add passkey");
    } finally {
      setAddingPasskey(false);
    }
  }

  async function handleDeletePasskey(id: string) {
    setDeletingId(id);
    try {
      const { error } = await authClient.passkey.deletePasskey({ id });
      if (error) {
        toast.error("Failed to delete passkey");
      } else {
        toast.success("Passkey removed");
        setPasskeys((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete passkey");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-semibold text-primary">Passkeys</h2>
        <p className="text-xs text-muted mt-0.5">
          Sign in using only your device.
        </p>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={passkeyName}
            onChange={(e) => {
              setPasskeyName(e.target.value);
              if (nameError) setNameError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAddPasskey()}
            placeholder="e.g. My iPhone"
            disabled={addingPasskey}
            className={`flex-1 px-3 py-2 rounded-lg text-sm border bg-transparent text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60 ${
              nameError ? "border-danger focus:ring-danger" : "border-subtle"
            }`}
          />
          <button
            onClick={handleAddPasskey}
            disabled={addingPasskey}
            className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-accent disabled:opacity-60 transition-all shrink-0"
          >
            {addingPasskey ? (
              <>
                <LoadingSpinner />
                Adding…
              </>
            ) : (
              <>
                <GoPasskeyFill size={15} />
                Add a passkey
              </>
            )}
          </button>
        </div>
        <p
          className={`text-xs text-danger mt-1 mb-2 ${
            nameError ? "visible" : "invisible"
          }`}
        >
          {nameError || "placeholder"}
        </p>
      </div>

      <div className="rounded-xl border border-subtle divide-y divide-subtle">
        {loadingPasskeys ? (
          <PasskeyTableSkeleton />
        ) : passkeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted">
            <GoPasskeyFill size={28} className="opacity-30" />
            <p className="text-sm">No passkeys added yet.</p>
          </div>
        ) : (
          passkeys.map((pk) => (
            <div
              key={pk.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <GoPasskeyFill size={18} className="text-muted shrink-0" />
                <div>
                  <p className="text-sm font-medium text-primary">
                    {pk.name ?? "Passkey"}
                  </p>
                  <p className="text-xs text-muted">
                    Added{" "}
                    {new Date(pk.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeletePasskey(pk.id)}
                disabled={deletingId === pk.id}
                className="cursor-pointer p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-40"
                aria-label="Delete passkey"
              >
                {deletingId === pk.id ? <LoadingSpinner /> : <LuTrash2 />}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
