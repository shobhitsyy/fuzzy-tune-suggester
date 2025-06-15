
import React, { useState } from "react";

// Settings for mild access restriction (improvement: edit this to your specs!)
const isLaptopDevice = () => {
  const laptopHosts = ["localhost", "127.0.0.1", "your-laptop-hostname.local"];
  const curHost = window.location.hostname;
  // Update "your-laptop-hostname.local" if needed
  return laptopHosts.includes(curHost);
};

const Discovery: React.FC = () => {
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Both'>('Both');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  // Mild device restriction
  if (!isLaptopDevice()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-6 bg-white border rounded-xl shadow-lg">
          <h2 className="font-bold text-lg mb-2">Discovery Page Restricted</h2>
          <p className="text-sm">Access to the discovery page is only permitted from your laptop.</p>
        </div>
      </div>
    );
  }

  // This should match your deployed edge function
  const edgeFunctionUrl = "https://zqtdyfzxzatzymyfitqg.supabase.co/functions/v1/fetch-and-enrich-songs";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    setProgress(0);

    // We'll map 'Both' to two runs (English and Hindi)
    const runs = (language === 'Both') ? ['English', 'Hindi'] : [language];

    let allResults: any[] = [];
    try {
      for (let i = 0; i < runs.length; i++) {
        setProgress(Math.round((i / runs.length) * 100));
        const res = await fetch(edgeFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: searchTerm || undefined,
            limit: quantity,
            market: runs[i] === "Hindi" ? "IN" : "US",
          }),
        });
        const data = await res.json();
        if (res.ok) {
          allResults.push({ language: runs[i], ...data });
        } else {
          throw new Error(data.error || `Failed fetching songs for ${runs[i]}`);
        }
        setProgress(Math.round(((i + 1) / runs.length) * 100));
      }
      setResult(allResults);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-16">
      <div className="bg-white border shadow rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold">Song Discovery Panel</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Language:</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as any)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="Both">Both</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Search Term (optional):</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Genre, artist, or keyword"
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Quantity per language:</label>
            <input
              type="number"
              min={1}
              max={50}
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 transition"
            disabled={loading}
          >
            {loading ? "Running Discovery..." : "Run Discovery"}
          </button>
        </form>
        {(progress > 0 && loading) && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-blue-400 h-2 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{progress}%</p>
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {result && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Results</h3>
            {result.map((res: any, idx: number) => (
              <div key={idx} className="mb-4 border rounded p-2">
                <div className="font-semibold">{res.language} Results</div>
                <div>Status: {res.status}</div>
                <div>{res.message}</div>
                <ul className="list-disc pl-5 text-xs mt-1">
                  {res.results?.slice(0, 5).map((r: any, i: number) => (
                    <li key={i}>{r.title ?? r.id} {r.inserted ? "(new)" : r.updated ? "(updated)" : ""}</li>
                  ))}
                  {res.results && res.results.length > 5 && (
                    <li>...and {res.results.length - 5} more</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;

