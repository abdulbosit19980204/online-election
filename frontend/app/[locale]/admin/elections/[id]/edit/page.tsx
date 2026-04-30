"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2, Loader2, UserPlus, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { adminApi, electionApi } from "@/lib/api";
import { useTranslations } from "next-intl";

interface CandidateInput {
  id?: string;
  name: string;
  party: string;
  bio: string;
  photo_url: string;
  isNew?: boolean;
}

export default function EditElectionPage() {
  const router = useRouter();
  const tAdmin = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    status: "draft"
  });

  const [candidates, setCandidates] = useState<CandidateInput[]>([]);

  useEffect(() => {
    fetchElection();
  }, [id]);

  const fetchElection = async () => {
    try {
      const res = await electionApi.get(id);
      const data = res.data;
      setForm({
        title: data.title,
        description: data.description || "",
        start_time: data.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : "",
        end_time: data.end_time ? new Date(data.end_time).toISOString().slice(0, 16) : "",
        status: data.status
      });
      setCandidates(data.candidates.map((c: any) => ({
        id: c.id,
        name: c.name,
        party: c.party || "",
        bio: c.bio || "",
        photo_url: c.photo_url || ""
      })));
    } catch (err) {
      toast.error("Failed to load election");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = () => setCandidates([...candidates, { name: "", party: "", bio: "", photo_url: "", isNew: true }]);
  
  const removeCandidate = async (index: number) => {
    const cand = candidates[index];
    if (cand.id && !cand.isNew) {
      if (!confirm("Are you sure you want to delete this candidate? This will remove all associated votes.")) return;
      try {
        await adminApi.deleteCandidate(cand.id);
        toast.success("Candidate deleted");
      } catch {
        toast.error("Failed to delete candidate");
        return;
      }
    }
    setCandidates(candidates.filter((_, idx) => idx !== index));
  };

  const updateCandidateField = (i: number, field: keyof CandidateInput, value: string) => {
    const updated = [...candidates];
    updated[i] = { ...updated[i], [field]: value };
    setCandidates(updated);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      };
      await adminApi.updateElection(id, payload);
      
      // Save candidates
      for (const cand of candidates) {
        if (cand.isNew) {
          if (cand.name.trim()) {
            await adminApi.addCandidate(id, {
              name: cand.name,
              party: cand.party || undefined,
              bio: cand.bio || undefined,
              photo_url: cand.photo_url || undefined,
            });
          }
        } else if (cand.id) {
          await adminApi.updateCandidate(cand.id, {
            name: cand.name,
            party: cand.party,
            bio: cand.bio,
            photo_url: cand.photo_url,
          });
        }
      }
      
      toast.success("Election updated successfully!");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update election");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  const labelClass = "block text-xs font-medium text-muted-foreground mb-2";
  const reqField = <span className="text-red-400 ml-0.5">*</span>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={14} /> {tAdmin("back_to_admin")}
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-8">{tAdmin("edit_title")}</h1>

        <div className="card p-8 border-none shadow-xl bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">{tAdmin("election_info")}</h2>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>{tAdmin("election_title_label")} {reqField}</label>
              <input
                className="input-field bg-muted/20"
                placeholder="Election Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>{tAdmin("description")}</label>
              <textarea
                className="input-field bg-muted/20 min-h-[100px] resize-none"
                placeholder="Brief description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{tAdmin("start_date")} {reqField}</label>
                <input
                  type="datetime-local"
                  className="input-field bg-muted/20"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>{tAdmin("end_date")} {reqField}</label>
                <input
                  type="datetime-local"
                  className="input-field bg-muted/20"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>{tAdmin("status")} {reqField}</label>
              <select
                className="input-field bg-muted/20"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">DRAFT</option>
                <option value="active">ACTIVE</option>
                <option value="ended">ENDED</option>
              </select>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-foreground">{tAdmin("candidates")}</h2>
              <button onClick={addCandidate} className="btn-secondary text-xs py-1.5 px-4 shadow-sm">
                <UserPlus size={14} className="mr-2" /> {tAdmin("add_candidate")}
              </button>
            </div>

            <div className="space-y-6">
              {candidates.map((c, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-muted/10 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{tAdmin("candidates")} {i + 1}</span>
                    <button onClick={() => removeCandidate(i)} className="text-muted-foreground hover:text-red-500 transition-colors p-1" title={tAdmin("delete_candidate")}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      className="input-field bg-card"
                      placeholder={tAdmin("candidate_name")}
                      value={c.name}
                      onChange={(e) => updateCandidateField(i, "name", e.target.value)}
                    />
                    <input
                      className="input-field bg-card"
                      placeholder={tAdmin("party_org")}
                      value={c.party}
                      onChange={(e) => updateCandidateField(i, "party", e.target.value)}
                    />
                  </div>
                  <textarea
                    className="input-field bg-card resize-none"
                    placeholder={tAdmin("bio")}
                    rows={2}
                    value={c.bio}
                    onChange={(e) => updateCandidateField(i, "bio", e.target.value)}
                  />
                  <input
                    className="input-field bg-card"
                    placeholder={tAdmin("photo_url")}
                    value={c.photo_url}
                    onChange={(e) => updateCandidateField(i, "photo_url", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-10 pt-8 border-t border-border">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="btn-primary px-8"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="mr-2" /> {tAdmin("save_changes")}</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
