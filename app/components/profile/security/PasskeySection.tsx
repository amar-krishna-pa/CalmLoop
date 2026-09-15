"use client";
import { useEffect, useState } from "react";
import { GoPasskeyFill } from "react-icons/go";
import { LuTrash2 } from "react-icons/lu";
import { authClient } from "@/app/lib/auth/auth-client";
import { toast } from "sonner";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import PasskeyTableSkeleton from "@/app/components/loaders/PasskeyTableSkeleton";
import { cn } from "@/app/lib/cn";

type Passkey = {
  id: string;
  name?: string | null;
  createdAt: Date;
};

export default function PasskeySection() {
  const [passkeys, setPasskeys] = useState<Passkey[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingPasskeys, setLoadingPasskeys] = useState(true);
  const [addingPasskey, setAddingPasskey] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [passkeyName, setPasskeyName] = useState("");
  const [nameError, setNameError] = useState("");

  async function fetchPasskeys() {
    try {
      const { data: passkeys, error } =
        await authClient.passkey.listUserPasskeys();
      if (error) {
        setLoadError("We couldn’t load your passkeys. You can try again.");
        toast.error("We couldn’t load your passkeys. You can try again.");
      } else {
        setPasskeys(passkeys ?? []);
        setLoadError(null);
      }
    } catch (error) {
      setLoadError("We couldn’t load your passkeys. You can try again.");
      console.log(error);
      toast.error("We couldn’t load your passkeys. You can try again.");
    } finally {
      setLoadingPasskeys(false);
    }
  }

  useEffect(() => {
    let active = true;
    authClient.passkey.listUserPasskeys()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setLoadError("We couldn’t load your passkeys. You can try again.");
        else setPasskeys(data ?? []);
      })
      .catch(() => {
        if (active) setLoadError("We couldn’t load your passkeys. You can try again.");
      })
      .finally(() => {
        if (active) setLoadingPasskeys(false);
      });
    return () => { active = false; };
  }, []);

  async function handleAddPasskey() {
    if (!passkeyName.trim()) {
      setNameError(
        "A name helps you recognise this passkey later. For example, My phone."
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
          toast.error("We couldn’t add your passkey. You can try again.");
        }
      } else {
        toast.success("Passkey added");
        setPasskeyName("");
        await fetchPasskeys();
      }
    } catch (err) {
      console.error(err);
      toast.error("We couldn’t add your passkey. You can try again.");
    } finally {
      setAddingPasskey(false);
    }
  }

  async function handleDeletePasskey(id: string) {
    setDeletingId(id);
    try {
      const { error } = await authClient.passkey.deletePasskey({ id });
      if (error) {
        toast.error("We couldn’t remove your passkey. You can try again.");
      } else {
        toast.success("Passkey removed");
        setPasskeys((prev) => prev?.filter((p) => p.id !== id) ?? null);
      }
    } catch (error) {
      console.log(error);
      toast.error("We couldn’t remove your passkey. You can try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-semibold text-primary">Passkeys</h2>
        <p className="text-xs text-muted mt-0.5">
          A passkey lets you sign in with your fingerprint, face or device PIN.
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
            className={cn("min-w-0 flex-1 px-3 py-2 rounded-lg text-sm border bg-transparent text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60",
              nameError ? "border-danger focus:ring-danger" : "border-subtle"
            )}
          />
          <button
            onClick={handleAddPasskey}
            disabled={addingPasskey}
            className="cursor-pointer flex h-10 sm:w-44 items-center justify-center gap-2 px-4 py-0 rounded-lg text-sm font-medium btn-accent disabled:opacity-60 shrink-0"
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
          aria-live="polite"
          className="h-12 overflow-y-auto text-xs text-danger mt-1 mb-2"
        >
          {nameError}
        </p>
      </div>

      <div className="h-60 overflow-y-auto rounded-xl border border-subtle space-y-2">
        {loadError && passkeys === null ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <p role="alert" className="text-sm text-muted">{loadError}</p>
            <button type="button" disabled={loadingPasskeys} aria-label="Retry loading passkeys" className="btn-accent flex h-8 w-24 items-center justify-center py-0" onClick={() => { setLoadingPasskeys(true); void fetchPasskeys(); }}>
              {loadingPasskeys ? <LoadingSpinner /> : "Try again"}
            </button>
          </div>
        ) : passkeys === null ? (
          <PasskeyTableSkeleton />
        ) : passkeys.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
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
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-40"
                aria-label="Remove passkey"
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
