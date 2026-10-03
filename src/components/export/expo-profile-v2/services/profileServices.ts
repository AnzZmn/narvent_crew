/**
 * Everything that talks to the outside world. Pass your own implementations to
 * <ProfileFlow services={{…}} />; anything you leave out falls back to these defaults.
 */

export type IfscResult = { bank: string; branch: string; city?: string };
export type UpiResult =
  | { ok: true; name: string }
  | { ok: false; reason: string };
export type PhotoSide = "front" | "back";

export type ProfileServices = {
  /** null = no bank for this IFSC. Throw on network errors. */
  lookupIfsc: (ifsc: string) => Promise<IfscResult | null>;
  /** Verify a VPA and return the registered name. Must go through YOUR backend. */
  verifyUpi: (vpa: string) => Promise<UpiResult>;
  /** Open camera / gallery for a document side. Return a local file uri, or null if cancelled. */
  pickDocumentPhoto: (docId: string, side: PhotoSide) => Promise<string | null>;
};

export const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const UPI_RE = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

/** Razorpay's free public IFSC API. No key needed. 404 → not found. */
async function lookupIfsc(ifsc: string): Promise<IfscResult | null> {
  const res = await fetch(
    `https://ifsc.razorpay.com/${encodeURIComponent(ifsc)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`IFSC lookup failed: ${res.status}`);
  const j = await res.json();
  return { bank: j.BANK, branch: j.BRANCH, city: j.CITY };
}

/**
 * MOCK. UPI name lookup needs a payout provider (Razorpay X, Cashfree, Decentro…) and a
 * secret key, so it has to live on your server. Replace with a call to your endpoint.
 */
async function verifyUpi(vpa: string): Promise<UpiResult> {
  await new Promise((r) => setTimeout(r, 700));
  if (!UPI_RE.test(vpa))
    return { ok: false, reason: "Enter a UPI ID like name@bank" };
  return { ok: true, name: "Abdul Bathwin Nasar" };
}

/** MOCK. Returns a fake uri so the flow can be clicked through. Use expo-image-picker (README). */
async function pickDocumentPhoto(
  docId: string,
  side: PhotoSide,
): Promise<string | null> {
  return `mock://${side}_${docId}.jpg`;
}

export const defaultServices: ProfileServices = {
  lookupIfsc,
  verifyUpi,
  pickDocumentPhoto,
};
