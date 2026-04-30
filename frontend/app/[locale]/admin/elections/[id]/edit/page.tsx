"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, CheckCircle, Loader2, UserPlus, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { adminApi, electionApi } from "@/lib/api";

interface CandidateInput {
  id?: string;
  name: string;
  party: string;
  bio: string;
  photo_url: string;
  isNew?: boolean;
}

const defaultCandidate: CandidateInput = { name: "", party: "", bio: "", photo_url: "", isNew: true };

export default function EditElectionPage() {
  const router = useRouter();
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

  const addCandidate = () => setCandidates([...candidates, { ...defaultCandidate }]);
  
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
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  const labelClass = "block text-xs font-medium text-slate-400 mb-2";
  const reqField = <span className="text-red-400 ml-0.5">*</span>;

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Admin
        </Link>

        <h1 className="text-2xl font-bold text-slate-100 mb-8">Edit Election</h1>

        <div className="card p-8">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Title {reqField}</label>
              <input
                className="input-field"
                placeholder="Election Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                placeholder="Brief description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date {reqField}</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>End Date {reqField}</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Status {reqField}</label>
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#26262f]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-200">Candidates</h2>
              <button onClick={addCandidate} className="btn-secondary text-xs py-1.5">
                <UserPlus size={14} /> Add Candidate
              </button>
            </div>

            <div className="space-y-4">
              {candidates.map((c, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#26262f] bg-[#1e1e28] space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-400">Candidate {i + 1}</span>
                    <button onClick={() => removeCandidate(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    className="input-field text-sm"
                    placeholder="Full Name *"
                    value={c.name}
                    onChange={(e) => updateCandidateField(i, "name", e.target.value)}
                  />
                  <input
                    className="input-field text-sm"
                    placeholder="Party / Organization"
                    value={c.party}
                    onChange={(e) => updateCandidateField(i, "party", e.target.value)}
                  />
                  <textarea
                    className="input-field text-sm resize-none"
                    placeholder="Short bio..."
                    rows={2}
                    value={c.bio}
                    onChange={(e) => updateCandidateField(i, "bio", e.target.value)}
                  />
                  <input
                    className="input-field text-sm"
                    placeholder="Photo URL (optional)"
                    value={c.photo_url}
                    onChange={(e) => updateCandidateField(i, "photo_url", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end mt-8 pt-6 border-t border-[#26262f]">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
