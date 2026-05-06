export type SessionType =
  | 'easy'
  | 'threshold'
  | 'interval'
  | 'long'
  | 'race'
  | 'strength'
  | 'tennis'
  | 'basketball'
  | 'cycling'
  | 'swimming'
  | 'hiking'
  | 'other'

export interface Lap {
  index: number
  distance: number   // km
  time: number       // seconds
  avgHR: number
  maxHR: number
  avgPace: number    // sec/km
  cadence: number    // spm
}

export interface HRZones {
  z1: number  // seconds < 130
  z2: number  // seconds 130-152
  z3: number  // seconds 152-170
  z4: number  // seconds 170-185
  z5: number  // seconds > 185
}

export interface Session {
  id: string
  date: string             // ISO date (YYYY-MM-DD)
  type: SessionType
  source: 'tcx' | 'manual'
  distance: number         // km
  duration: number         // seconds
  avgPace: number          // sec/km
  avgHR: number
  maxHR: number
  avgCadence: number       // spm
  elevationGain?: number   // meters
  laps: Lap[]
  hrZones: HRZones
  feeling: 1 | 2 | 3 | 4 | 5
  notes: string
  weight?: number          // kg at session time
  customLabel?: string     // free-form label for 'other' or cross-training
  aiReview?: string        // Claude AI analysis text
}

export interface GarminStats {
  id: string
  date: string
  vo2max: number
  lactatePace: number   // sec/km
  lactateHR: number
  predictions: {
    km5: number         // seconds
    km10: number
    semi: number
    marathon: number
  }
}

export interface WeightEntry {
  date: string
  weight: number        // kg
  bodyFatPct?: number
  leanMassKg?: number   // auto-calculated
}

export interface PlanProgress {
  weekId: string
  sessionIndex: number
  completed: boolean
  sessionId?: string    // linked TCX session
  feeling?: 1 | 2 | 3 | 4 | 5
  notes?: string
}

// Training plan types
export interface PlannedSession {
  type: SessionType
  label: string
  targetPace?: string     // e.g. "7:00-7:20/km"
  targetHR?: string       // e.g. "Z2 (130-152)"
  duration?: string       // e.g. "45 min"
  distance?: string       // e.g. "10 km"
  description: string
}

export interface PlanWeek {
  id: string
  weekNumber: number
  startDate: string       // YYYY-MM-DD (Monday)
  phase: number
  phaseName: string
  targetVolume: string    // e.g. "30 km"
  sessions: PlannedSession[]
  notes?: string
}

export type NavItem = {
  href: string
  label: string
  icon: string
}
