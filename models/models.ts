import { Timestamp } from "firebase/firestore";

export interface Flock {
  id: string;
  name: string;
  description: string;
  type: "egg-layers" | "meat-birds";
  imageUrl: string;
  owner: string;
  default: boolean;
  breeds: Breed[];
  stats: any;
}

export interface Breed {
  name: string;
  averageProduction: number;
  count: number;
  imageUrl?: string;
}

export interface Log {
  id: string;
  date: Timestamp;
  count: number;
  notes: string;
  flock: string;
}

export interface Expense {
  id: string;
  date: Timestamp;
  amount: number;
  memo: string;
  flock: string;
}
