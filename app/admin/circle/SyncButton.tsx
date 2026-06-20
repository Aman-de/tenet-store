"use client";

import { useState } from "react";
import { Database, Loader2, Check } from "lucide-react";

export default function SyncButton() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSync = async () => {
        setStatus("loading");
        try {
            const res = await fetch("/api/admin/sync-sanity", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setStatus("success");
                setMessage(`Synced ${data.count} partners`);
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
                setMessage("Sync failed");
            }
        } catch (e) {
            setStatus("error");
            setMessage("Network error");
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleSync}
                disabled={status === "loading"}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-[#1A1A1A] hover:bg-neutral-200 dark:hover:bg-[#222] transition-colors rounded-full text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED]"
            >
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? <Check className="w-4 h-4 text-emerald-500" /> : <Database className="w-4 h-4" />}
                Sync to Sanity
            </button>
            {message && <span className={`text-xs ${status === "error" ? "text-red-500" : "text-emerald-500"}`}>{message}</span>}
        </div>
    );
}
