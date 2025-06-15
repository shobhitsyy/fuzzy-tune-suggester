
import React, { useEffect, useState } from "react";
import { refreshAllSongSimilarities } from "@/utils/RefreshAllSongSimilarities";

export default function AdminRefreshSimilarities() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function doRefresh() {
      setStatus("loading");
      try {
        const updatedCount = await refreshAllSongSimilarities();
        setStatus("done");
        setMessage(`Refreshed similarities for ${updatedCount} songs.`);
      } catch (e) {
        setStatus("error");
        setMessage("Error: " + (e instanceof Error ? e.message : String(e)));
      }
    }
    doRefresh();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow rounded p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Refresh Similar Songs</h2>
      {status === "idle" || status === "loading" ? (
        <p>Processing...</p>
      ) : (
        <p className={status === "error" ? "text-red-600" : "text-green-700"}>{message}</p>
      )}
      <p className="text-sm text-gray-400 mt-3">Visit this page to refresh all song similarities in the DB. No UI changes will be made.</p>
    </div>
  );
}
