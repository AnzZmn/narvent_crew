export type PersonalInfo = {
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  aadhar: string;
};

export type Address = {line: string; city: string; pin: string};

export type BankDetails = {accountNo: string; ifsc: string; accountName: string; upiId: string};

export type ProfileDocument = {id: 'licence' | 'voter' | 'passport' | string; label: string; uri?: string};

export type ProfileData = {
  displayName: string;
  nuId: string;
  phone: string;
  /** 0–100 */
  completion: number;
  photoUri?: string;
  personal: PersonalInfo;
  currentAddress: Address;
  permanentAddress: Address;
  bank: BankDetails;
  documents: ProfileDocument[];
};

/** Mockup content, kept verbatim (incl. "Nasar" / "Nazar"). Replace with API data. */
export const sampleProfile: ProfileData = {
  displayName: 'Abdul Bathwin Nasar',
  nuId: 'KL11ST03AK',
  phone: '9123456789',
  completion: 65,
  personal: {
    fullName: 'Abdul Bathwin Nazar',
    dob: '31-12-2026',
    gender: 'Male',
    phone: '9123456789',
    email: 'abdulbathwin123@gmail.com',
    aadhar: '7123 4567 8910',
  },
  currentAddress: {line: 'Arakkal house Mavoor, po Mavoor', city: 'Kozhikode', pin: '680009'},
  permanentAddress: {line: 'GEC Thrissur', city: 'Thrissur', pin: '680009'},
  bank: {accountNo: 'SBI94094294NRD', ifsc: '12345SBI', accountName: 'ABDUL BATHWIN', upiId: 'abd@123sbi'},
  documents: [
    {id: 'licence', label: 'Licence (image upload)'},
    {id: 'voter', label: 'Voter ID (Upload)'},
    {id: 'passport', label: 'Passport (Upload)'},
  ],
};
