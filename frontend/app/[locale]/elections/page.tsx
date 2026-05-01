"use client";
import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import Navbar from "@/components/Navbar";
import { electionApi } from "@/lib/api";
import ElectionCard from "@/components/voting/ElectionCard";
import { useTranslations } from "next-intl";

export default function ElectionsPage() {
  const t = useTranslations("Auth"); // Using Auth or Landing for translation fallback if needed
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await electionApi.list();
      setElections(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-2">Public Elections</h1>
          <p className="text-muted-foreground">View and participate in ongoing democratic processes.</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 skeleton" />)}
          </div>
        ) : elections.length === 0 ? (
          <div className="card p-12 text-center text-muted-foreground">
            No public elections found.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up stagger-children">
            {Array.isArray(elections) && elections.map((election: any) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
