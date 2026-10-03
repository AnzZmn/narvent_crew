/** Data shapes for the reimagined Profile. Map your API response onto ProfileData (see README). */

export type Personal = {
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
};

export type Address = {
  line: string;
  city: string;
  pin: string;
  district: string;
  state: string;
};

export type Education = {
  qualification: string;
  stream: string;
  studying: boolean;
  institution: string;
  board: string;
  institutionCity: string;
  course: string;
  // while studying
  currentYear?: string;
  classTimings?: string;
  expectedCompletion?: string;
  mode?: string;
  // after passing
  yearOfPassing?: string;
  grade?: string;
  certificate?: string;
  certificateVerified?: boolean;
};

export type PayoutMode = "bank" | "upi";
export type AccountType = "Savings" | "Current";

export type BankDetails = {
  mode: PayoutMode;
  holder: string;
  accountNumber: string;
  ifsc: string;
  /** filled by IFSC lookup */
  bankName?: string;
  branch?: string;
  accountType: AccountType;
  upi: string;
  upiVerified: boolean;
  /** name returned by UPI verification */
  upiName?: string;
};

export type DocStatus = "none" | "review" | "verified";
export type DocIcon = "card" | "doc" | "car";

export type DocumentItem = {
  id: string;
  name: string;
  /** masked or full number shown in the row */
  number?: string;
  status: DocStatus;
  required: boolean;
  hasBack: boolean;
  hasExpiry?: boolean;
  expiry?: string;
  icon: DocIcon;
  numberLabel: string;
  numberPlaceholder: string;
  hint: string;
};

/** What the upload sheet hands back. Upload the photos, then set status to "review". */
export type DocumentUpload = {
  id: string;
  number: string;
  expiry?: string;
  frontUri: string;
  backUri?: string;
};

export type ToolsAnswer = "Yes, full kit" | "Some tools" | "No";

export type WorkEntry = {
  role: string;
  org: string;
  from: string;
  to?: string;
  current?: boolean;
};

export type SkillsData = {
  trade: string;
  years: number;
  skills: string[];
  languages: string[];
  tools: ToolsAnswer;
  history: WorkEntry[];
};

/** A row in the "Profile completion" dropdown. id "skills" opens the Skills page. */
export type MissingItem = { id: string; label: string; sub: string };

export type ProfileData = {
  name: string;
  initials: string;
  photoUri?: string;
  nuId: string;
  verified: boolean;
  /** 0–1, drawn as the ring around the photo */
  workDone: number;
  rating: number;
  jobs: number;
  personal: Personal;
  address: Address;
  education: Education;
  bank: BankDetails;
  documents: DocumentItem[];
  /** null → "Add your skills" empty state */
  skills: SkillsData | null;
  completion: { total: number; missing: MissingItem[] };
};

/** Editable copy of the three text tabs while Edit is on. */
export type EditDraft = {
  personal: Personal;
  address: Address;
  education: Education;
};
