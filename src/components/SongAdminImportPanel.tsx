
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

const ADMIN_FUNCTION_URL = "https://zqtdyfzxzatzymyfitqg.supabase.co/functions/v1/fetch-and-enrich-songs";

type Result = {
  status: string;
  message: string;
  results?: any[];
  error?: string;
};

const DEFAULTS = [
  { language: "Hindi", market: "IN", q: "pop", limit: 50 },
  { language: "English", market: "US", q: "pop", limit: 50 },
];

const SongAdminImportPanel: React.FC = () => {
  const [form, setForm] = useState({ market: "IN", q: "pop", limit: 50 });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<Result | null>(null);

  const submitImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setProgress(0);

    try {
      setProgress(10);
      const response = await fetch(ADMIN_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setProgress(80);

      const data = await response.json();
      setProgress(100);
      setResult(data);

      if (data.status === "success") {
        toast({
          title: "Success 🎉",
          description: data.message,
        });
      } else {
        toast({
          title: "Something went wrong",
          description: data.error ?? "Unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Failed to Import",
        description: err.message,
        variant: "destructive",
      });
      setResult({ status: "error", message: "", error: err.message });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const applyPreset = (i: number) => {
    setForm({
      market: DEFAULTS[i].market,
      q: DEFAULTS[i].q,
      limit: DEFAULTS[i].limit,
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submitImport} className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button type="button" variant="outline" onClick={() => applyPreset(0)}>
            Hindi (50 Pop)
          </Button>
          <Button type="button" variant="outline" onClick={() => applyPreset(1)}>
            English (50 Pop)
          </Button>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div>
            <label className="text-sm font-semibold">Market</label>
            <Input
              value={form.market}
              onChange={e => setForm(f => ({ ...f, market: e.target.value }))}
              placeholder="IN (Hindi) or US (English)"
              maxLength={2}
              autoCapitalize="characters"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Search Term (q)</label>
            <Input
              value={form.q}
              onChange={e => setForm(f => ({ ...f, q: e.target.value }))}
              placeholder="pop, artist, etc"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">How many?</label>
            <Input
              type="number"
              min={1}
              max={50}
              value={form.limit}
              onChange={e => setForm(f => ({ ...f, limit: Number(e.target.value) }))}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Importing...</>
          ) : (
            <>Import Songs</>
          )}
        </Button>
      </form>
      {loading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-center text-gray-600">{progress}%</p>
        </div>
      )}
      {result && (
        <div className="rounded bg-gray-50 border px-4 py-3 mt-2 space-y-2 text-sm">
          {result.status === "success" ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span>{result.message}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{result.error || "Import failed"}</span>
            </div>
          )}
          {result.results && (
            <div>
              {result.results.slice(0, 10).map((r, i) => (
                <div key={i} className="text-xs">{r.title}: {r.inserted ? "Added" : r.updated ? "Updated" : "?"}</div>
              ))}
              {result.results.length > 10 && (
                <div className="text-xs text-gray-400">
                  ...and {result.results.length - 10} more.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongAdminImportPanel;
