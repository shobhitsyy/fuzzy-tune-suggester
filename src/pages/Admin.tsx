
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SongAdminImportPanel from "@/components/SongAdminImportPanel";

const ADMIN_PASSKEY = "letmein123"; // Change this to your desired passkey

const AdminPage: React.FC = () => {
  const [entered, setEntered] = useState(
    typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true"
  );
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === ADMIN_PASSKEY) {
      setEntered(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      setError("Invalid passkey.");
      setTimeout(() => setError(""), 2500);
    }
  };

  if (!entered) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <Card className="max-w-sm w-full">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <Input
                type="password"
                placeholder="Enter admin passkey"
                value={passkey}
                onChange={e => setPasskey(e.target.value)}
                autoFocus
              />
              {error && <div className="text-sm text-red-500">{error}</div>}
              <Button type="submit" className="w-full">Enter Admin</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-blue-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Admin: Song Import Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <SongAdminImportPanel />
        </CardContent>
      </Card>
      <Button variant="ghost" className="mt-5 text-blue-500"
        onClick={() => {
          localStorage.removeItem("isAdmin");
          setEntered(false);
          navigate("/");
        }}>
        Log Out
      </Button>
    </div>
  );
};

export default AdminPage;
