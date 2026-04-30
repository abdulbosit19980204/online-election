"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, CheckCircle, Loader2, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { adminApi } from "@/lib/api";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface CandidateInput {
  name: string;
  party: string;
  bio: string;
  photo_url: string;
}

const defaultCandidate: CandidateInput = { name: "", party: "", bio: "", photo_url: "" };

const STEPS = ["Election Details", "Add Candidates", "Review & Create"];

export default function NewElectionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  const [candidates, setCandidates] = useState<CandidateInput[]>([{ ...defaultCandidate }]);

  const addCandidate = () => setCandidates([...candidates, { ...defaultCandidate }]);
  const removeCandidate = (i: number) => setCandidates(candidates.filter((_, idx) => idx !== i));
  const updateCandidate = (i: number, field: keyof CandidateInput, value: string) => {
    const updated = [...candidates];
    updated[i] = { ...updated[i], [field]: value };
    setCandidates(updated);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      };
      const res = await adminApi.createElection(payload);
      const electionId = res.data.id;

      // Add candidates
      const validCandidates = candidates.filter((c) => c.name.trim());
      for (const c of validCandidates) {
        await adminApi.addCandidate(electionId, {
          name: c.name,
          party: c.party || undefined,
          bio: c.bio || undefined,
          photo_url: c.photo_url || undefined,
        });
      }

      toast.success("Election created successfully!");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create election");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-xs font-medium text-slate-400 mb-2";
  const reqField = <span className="text-red-400 ml-0.5">*</span>;

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Admin
        </Link>

        <h1 className="text-2xl font-bold text-slate-100 mb-8">Create New Election</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${i === step ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : i < step ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-600 border border-[#26262f]"}`}
              >
                {i < step ? <CheckCircle size={10} /> : <span>{i + 1}</span>}
                {s}
              </div>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#26262f]" />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {/* Step 1: Details */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Title {reqField}</label>
                <input
                  id="election-title"
                  className="input-field"
                  placeholder="e.g. 2026 Student Council Election"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <RichTextEditor
                  value={form.description}
                  onChange={(content) => setForm({ ...form, description: content })}
                  placeholder="Detailed description of this election..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date {reqField}</label>
                  <input
                    id="election-start"
                    type="datetime-local"
                    className="input-field"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date {reqField}</label>
                  <input
                    id="election-end"
                    type="datetime-local"
                    className="input-field"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Candidates */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">Add at least 2 candidates to the election.</p>
              {candidates.map((c, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#26262f] bg-[#1e1e28] space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-400">Candidate {i + 1}</span>
                    {candidates.length > 1 && (
                      <button onClick={() => removeCandidate(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <input
                    className="input-field text-sm"
                    placeholder="Full Name *"
                    value={c.name}
                    onChange={(e) => updateCandidate(i, "name", e.target.value)}
                  />
                  <input
                    className="input-field text-sm"
                    placeholder="Party / Organization"
                    value={c.party}
                    onChange={(e) => updateCandidate(i, "party", e.target.value)}
                  />
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Candidate Bio & Program</label>
                    <RichTextEditor
                      value={c.bio}
                      onChange={(content) => updateCandidate(i, "bio", content)}
                      placeholder="Candidate's background and election program..."
                    />
                  </div>
                  <input
                    className="input-field text-sm"
                    placeholder="Photo URL (optional)"
                    value={c.photo_url}
                    onChange={(e) => updateCandidate(i, "photo_url", e.target.value)}
                  />
                </div>
              ))}
              <button onClick={addCandidate} className="btn-secondary w-full justify-center text-sm py-2.5">
                <UserPlus size={14} /> Add Another Candidate
              </button>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#1e1e28] border border-[#26262f] space-y-2">
                <h3 className="font-semibold text-slate-100">{form.title}</h3>
                {form.description && (
                  <div 
                    className="text-sm text-slate-500 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: form.description }}
                  />
                )}
                <div className="flex gap-4 text-xs text-slate-600 pt-1">
                  <span>Starts: {form.start_time}</span>
                  <span>Ends: {form.end_time}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-3 font-medium">{candidates.filter((c) => c.name).length} Candidates</p>
                <div className="space-y-2">
                  {candidates.filter((c) => c.name).map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#1e1e28] border border-[#26262f]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{c.name}</p>
                        {c.party && <p className="text-xs text-slate-500">{c.party}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#26262f]">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className={`btn-secondary ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
            >
              ← Back
            </button>

            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && (!form.title || !form.start_time || !form.end_time)}
                className="btn-primary disabled:opacity-40"
              >
                Continue →
              </button>
            ) : (
              <button
                id="create-election-submit"
                onClick={handleCreate}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <><Plus size={14} /> Create Election</>}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
