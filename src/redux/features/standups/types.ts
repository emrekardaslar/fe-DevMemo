// Standup model
export interface Standup {
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  isBlockerResolved: boolean;
  tags: string[];
  mood: number;
  productivity: number;
  isHighlight: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type for creating a new standup
export type CreateStandupDto = Omit<Standup, 'createdAt' | 'updatedAt'> & {
  mood?: number;
  productivity?: number;
};

// Type for updating an existing standup
export type UpdateStandupDto = Partial<Standup>;

// State type for the standups slice
export interface StandupsState {
  standups: Standup[];
  currentStandup: Standup | null;
  loading: boolean;
  error: string | null;
  success: boolean;
} 