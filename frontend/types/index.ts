// ─── Types ────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "voter" | "admin";
  is_verified: boolean;
  created_at: string;
}

export interface Candidate {
  id: string;
  election_id: string;
  name: string;
  bio?: string;
  photo_url?: string;
  party?: string;
  position: number;
  created_at: string;
  // results fields
  vote_count?: number;
  percentage?: number;
}

export interface Election {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "active" | "ended";
  start_time: string;
  end_time: string;
  results_public: boolean;
  created_at: string;
  candidates: Candidate[];
  total_votes?: number;
}

export interface VoteStatus {
  has_voted: boolean;
  cast_at?: string;
  receipt_hash?: string;
}

export interface VoteReceipt {
  id: string;
  election_id: string;
  cast_at: string;
  receipt_hash: string;
}

export interface SystemStats {
  total_elections: number;
  active_elections: number;
  total_votes: number;
  total_users: number;
  total_voters: number;
}

export interface ElectionAnalytics {
  election_id: string;
  title: string;
  total_votes: number;
  participation_rate: number | null;
  candidates: {
    candidate_id: string;
    name: string;
    party?: string;
    vote_count: number;
    percentage: number;
  }[];
  votes_over_time: { timestamp: string; count: number }[];
}
