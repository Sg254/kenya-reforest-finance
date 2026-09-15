export type Role = "public" | "donor" | "cfa" | "field" | "admin";
export type Currency = "KES" | "USD";
export type MRVStage = "Baseline" | "Planted" | "3-Month" | "6-Month" | "12-Month" | "24-Month" | "Verified";
export type Ecosystem = "Montane Forest" | "Riparian" | "Coastal Mangrove" | "Tropical Rainforest" | "Water Tower" | "Savanna Woodland";
export type LedgerKind = "disbursement" | "labor" | "materials" | "mrv" | "incentive" | "verification";

export interface Species {
  id: string;
  name: string;
  latin: string;
  type: "Timber" | "Medicinal" | "Fruit" | "Coastal";
  growthRate: number; // kg CO2e / tree / yr at maturity
  survivalBias: number; // 0.7 - 0.98
  waterRequirement: "Low" | "Moderate" | "High";
  uses: string[];
  emoji: string;
}

export interface LedgerEntry {
  id: string;
  projectId: string;
  date: string;
  kind: LedgerKind;
  amountKsh: number;
  description: string;
  payee: string;
  verified: boolean;
}

export interface Milestone {
  id: string;
  date: string;
  label: string;
  detail: string;
  complete: boolean;
}

export interface Project {
  id: string;
  name: string;
  county: string;
  region: string;
  ecosystem: Ecosystem;
  image: string;
  cfaId: string;
  cfaName: string;
  hectares: number;
  targetTrees: number;
  plantedTrees: number;
  fundedKsh: number;
  targetKsh: number;
  survivalRate: number; // 0..1
  averageTreeAgeMonths: number;
  mrvStage: MRVStage;
  verifiedSurvival: boolean;
  biodiversityScore: number; // 0..100
  speciesMix: { speciesId: string; pct: number }[];
  ledger: LedgerEntry[];
  milestones: Milestone[];
  co2ePerTree20yr: number; // tonnes
  recoveryDetail: string;
}

export interface DonorContribution {
  id: string;
  donor: string;
  kind: "cash" | "in-kind";
  inKindKshEquivalent: number;
  projectId: string;
  amountKsh: number;
  date: string;
  treesAttributed: number;
  verifiedSurviving: number;
  certificateIssued: boolean;
  note: string;
}

export interface MRVSurvey {
  id: string;
  batchId: string;
  period: "3-Month" | "6-Month" | "12-Month" | "24-Month";
  date: string;
  surveyedTrees: number;
  survivingTrees: number;
  mortalityCount: number;
  gpsLat: number;
  gpsLng: number;
  canopyCoveragePct: number;
  photoProof: boolean;
  officerName: string;
  notes: string;
}

export interface MRVBatch {
  id: string;
  projectId: string;
  batchName: string;
  speciesId: string;
  plantedCount: number;
  plantDate: string;
  plot: string;
  gpsLat: number;
  gpsLng: number;
  nurserySource: string;
  surveys: MRVSurvey[];
}

export interface CFAGroup {
  id: string;
  name: string;
  county: string;
  members: number;
  phoneNumber: string;
  walletKsh: number;
  lifetimeEarnedKsh: number;
  plantedBatches: number;
  payoutHistory: PayoutRecord[];
}

export interface PayoutRecord {
  id: string;
  projectId: string;
  batchId: string;
  amountKsh: number;
  reason: string;
  date: string;
  mpesaRef: string;
  recipient: string;
  status: "Paid" | "Failed" | "Pending";
}

export interface RegulationItem {
  id: string;
  title: string;
  authority: string;
  description: string;
  required: true;
  status: "Approved" | "In Review" | "Missing" | "Expiring";
  dueDate: string;
}

export interface AllocationPreset {
  id: string;
  name: string;
  seedlings: number; // percent
  cfaMaintenance: number;
  mrvTech: number;
  communityIncentives: number;
}

export interface ImpactMetrics {
  totalTreesPlanted: number;
  verifiedSurviving: number;
  totalCO2eSequestred20yr: number; // tonnes
  totalFundedKsh: number;
  communityEarningsKsh: number;
  activeProjects: number;
  cfaMembersInvolved: number;
}

export interface AppState {
  role: Role;
  currency: Currency;
  projects: Project[];
  contributions: DonorContribution[];
  batches: MRVBatch[];
  cfas: CFAGroup[];
  regulations: RegulationItem[];
  allocation: AllocationPreset;
  payouts: PayoutRecord[];
}