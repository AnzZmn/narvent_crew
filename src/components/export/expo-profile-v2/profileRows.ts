import type { FieldRow } from "./components/FieldCell";
import {
  Address,
  BankDetails,
  DocumentItem,
  Education,
  Personal,
  ProfileData,
} from "./types";

/** Turns profile data into the rows each tab shows. Edit labels / order here. */

export const PROFILE_TABS = ["Personal", "Address", "Education", "ID & Bank"];

export const maskAccount = (a: string) => (a ? "XXXX " + a.slice(-4) : "—");

export const docStatusLabel = (d: DocumentItem) =>
  d.status === "verified"
    ? "Verified"
    : d.status === "review"
      ? "Under review"
      : "Not uploaded";

export function personalRows(p: Personal): FieldRow[] {
  return [
    { key: "fullName", label: "Full Name", value: p.fullName },
    { key: "dob", label: "Date of birth", value: p.dob, half: true },
    { key: "gender", label: "Gender", value: p.gender, half: true },
    { key: "phone", label: "Phone", value: p.phone, keyboardType: "phone-pad" },
    {
      key: "email",
      label: "Email",
      value: p.email,
      keyboardType: "email-address",
    },
  ];
}

export function addressRows(a: Address): FieldRow[] {
  return [
    { key: "line", label: "Address", value: a.line },
    { key: "city", label: "City", value: a.city, half: true },
    {
      key: "pin",
      label: "PIN",
      value: a.pin,
      half: true,
      keyboardType: "number-pad",
    },
    { key: "district", label: "District", value: a.district, half: true },
    { key: "state", label: "State", value: a.state, half: true },
  ];
}

/** "Still studying" swaps current-year fields for year-of-passing fields. */
export function educationRows(e: Education): FieldRow[] {
  const head: FieldRow[] = [
    {
      key: "qualification",
      label: "Highest qualification",
      value: e.qualification,
      half: true,
    },
    { key: "stream", label: "Stream", value: e.stream, half: true },
    {
      key: "studying",
      label: "Still studying",
      value: e.studying ? "Yes" : "No",
      toggle: true,
      toggleValue: e.studying,
    },
    { key: "institution", label: "Institution", value: e.institution },
    { key: "board", label: "Board / University", value: e.board, half: true },
    {
      key: "institutionCity",
      label: "Institution city",
      value: e.institutionCity,
      half: true,
    },
    { key: "course", label: "Course", value: e.course, half: true },
  ];
  if (e.studying) {
    return [
      ...head,
      {
        key: "currentYear",
        label: "Current year",
        value: e.currentYear ?? "",
        half: true,
      },
      {
        key: "classTimings",
        label: "Class timings",
        value: e.classTimings ?? "",
      },
      {
        key: "expectedCompletion",
        label: "Expected completion",
        value: e.expectedCompletion ?? "",
        half: true,
      },
      { key: "mode", label: "Mode", value: e.mode ?? "", half: true },
    ];
  }
  return [
    ...head,
    {
      key: "yearOfPassing",
      label: "Year of passing",
      value: e.yearOfPassing ?? "",
      half: true,
      keyboardType: "number-pad",
    },
    { key: "grade", label: "Grade / %", value: e.grade ?? "", half: true },
    {
      key: "certificate",
      label: "Certificate",
      value: e.certificate ?? "",
      half: true,
      chip: e.certificateVerified ? "Verified" : undefined,
      locked: !!e.certificateVerified,
    },
  ];
}

export function bankSummary(b: BankDetails) {
  return b.mode === "upi"
    ? `Payouts to UPI · ${b.upi}`
    : `${b.bankName ?? "Bank"} · ${maskAccount(b.accountNumber)}`;
}

export function docSummary(docs: DocumentItem[]) {
  const verified = docs.filter((d) => d.status === "verified").length;
  const requiredLeft = docs.filter(
    (d) => d.required && d.status === "none",
  ).length;
  return {
    verified,
    requiredLeft,
    sub: `${verified} verified · ${requiredLeft ? requiredLeft + " required missing" : "all required uploaded"}`,
  };
}

/** ID & Bank tab: read-only. Changes happen on the Bank details and Documents pages. */
export function idRows(p: ProfileData): FieldRow[] {
  const doc = (id: string) => p.documents.find((d) => d.id === id);
  const value = (d?: DocumentItem) =>
    !d || d.status === "none"
      ? "Not uploaded"
      : d.status === "review"
        ? `${d.number ?? ""} · Under review`
        : (d.number ?? "Uploaded");
  const chip = (d?: DocumentItem) =>
    d?.status === "verified" ? "Verified" : undefined;
  const aadhaar = doc("aadhaar");
  const pan = doc("pan");
  const dl = doc("dl");
  return [
    {
      key: "aadhaar",
      label: "Aadhaar",
      value: value(aadhaar),
      chip: chip(aadhaar),
      locked: true,
    },
    {
      key: "pan",
      label: "PAN",
      value: value(pan),
      chip: chip(pan),
      locked: true,
    },
    {
      key: "dl",
      label: "Driving License",
      value: value(dl),
      chip: chip(dl),
      locked: true,
    },
    {
      key: "bank",
      label: "Bank account",
      value: `${p.bank.bankName ?? "Bank"} · ${maskAccount(p.bank.accountNumber)}`,
      locked: true,
    },
    { key: "upi", label: "UPI ID", value: p.bank.upi || "—", locked: true },
    {
      key: "payout",
      label: "Payouts to",
      value: p.bank.mode === "upi" ? "UPI" : "Bank account",
      locked: true,
    },
  ];
}
