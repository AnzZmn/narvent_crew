import { Linking } from "react-native";
import type {
  SettingsPage,
  SettingsPageId,
  SettingsRowDef,
  SettingsUser,
} from "./types";

export const sampleUser: SettingsUser = {
  name: "Adhil ck",
  phone: "+91 98765 43210",
  initials: "AC",
  verified: true,
};

export const ACCOUNT_ROWS: SettingsRowDef[] = [
  {
    id: "profile",
    icon: "user",
    label: "My Profile",
    sub: "Name, phone, address",
  },
  {
    id: "payment",
    icon: "bank",
    label: "Edit Payment Details",
    sub: "Bank account, UPI ID",
  },
  { id: "docs", icon: "doc", label: "Documents", sub: "Aadhaar, PAN, ID card" },
];

export const ABOUT_ROWS: SettingsRowDef[] = [
  {
    id: "about",
    icon: "info",
    label: "About Narvent",
    sub: "Who we are and how payouts work",
  },
  {
    id: "terms",
    icon: "list",
    label: "Terms and Conditions",
    sub: "Rules for using Narvent",
  },
  {
    id: "privacy",
    icon: "shield",
    label: "Privacy Policy",
    sub: "How we handle your data",
  },
  {
    id: "contact",
    icon: "phone",
    label: "Contact Us",
    sub: "Call, WhatsApp or email support",
  },
];

// NOTE: legal copy, phone, email and address are placeholders — replace before release.
export const samplePages: Record<SettingsPageId, SettingsPage> = {
  profile: {
    title: "My Profile",
    blocks: [
      {
        type: "field",
        key: "name",
        label: "Full Name",
        value: "Adhil ck",
        autoCapitalize: "words",
      },
      {
        type: "field",
        key: "phone",
        label: "Phone No:",
        value: "+91 98765 43210",
        keyboardType: "phone-pad",
      },
      {
        type: "field",
        key: "email",
        label: "Email address",
        value: "adhil.ck@example.com",
        keyboardType: "email-address",
        autoCapitalize: "none",
      },
      {
        type: "field",
        key: "city",
        label: "City",
        value: "Thrissur",
        autoCapitalize: "words",
      },
      { type: "button", label: "Save changes" },
    ],
  },
  payment: {
    title: "Edit Payment Details",
    blocks: [
      {
        type: "field",
        key: "holder",
        label: "Account Holder Name",
        value: "Adhil ck",
        autoCapitalize: "words",
      },
      {
        type: "field",
        key: "bank",
        label: "Bank Name",
        value: "State Bank of India",
        autoCapitalize: "words",
      },
      {
        type: "field",
        key: "account",
        label: "Account Number",
        value: "XXXX XXXX 4821",
        keyboardType: "number-pad",
      },
      {
        type: "field",
        key: "ifsc",
        label: "IFSC Code",
        value: "SBIN0070123",
        autoCapitalize: "characters",
      },
      {
        type: "field",
        key: "upi",
        label: "UPI ID",
        value: "adhilck@okaxis",
        autoCapitalize: "none",
      },
      {
        type: "note",
        text: "Changes are verified before your next payout. Payouts already processing go to your current account.",
      },
      { type: "button", label: "Save changes" },
    ],
  },
  docs: {
    title: "Documents",
    blocks: [
      {
        type: "row",
        icon: "doc",
        title: "Aadhaar Card",
        value: "XXXX XXXX 5512",
        status: "Verified",
      },
      {
        type: "row",
        icon: "doc",
        title: "PAN Card",
        value: "ABCPX1234K",
        status: "Verified",
      },
      {
        type: "row",
        icon: "doc",
        title: "Worker ID Card",
        value: "Uploaded 28 Sep 2026",
        status: "Pending",
      },
    ],
  },
  about: {
    title: "About Narvent",
    blocks: [
      { type: "hero", tagline: "Work, tracked from job to payout." },
      {
        type: "text",
        heading: "Who we are",
        body: "Narvent connects skilled workers with verified clients for painting, electrical, delivery, carpentry and installation work across Kerala.",
      },
      {
        type: "text",
        heading: "How payouts work",
        body: "Clients pay Narvent once a job is complete. We deduct a published service fee and send your net earnings to your registered bank account or UPI ID.",
      },
      {
        type: "text",
        heading: "Our promise",
        body: "Every rupee is visible: what the client paid, what Narvent kept, and when the money reached you.",
      },
      { type: "meta", text: "Version 1.0.0 · Kochi, Kerala" },
    ],
  },
  terms: {
    title: "Terms and Conditions",
    blocks: [
      { type: "meta", text: "Last updated 1 Oct 2026" },
      {
        type: "text",
        heading: "1. Using Narvent",
        body: "You must be 18 or older and provide accurate identity and bank details to accept work through Narvent.",
      },
      {
        type: "text",
        heading: "2. Jobs and attendance",
        body: "Accepting a job commits you to the date, location and scope shown. Let the client and Narvent know early if you cannot attend.",
      },
      {
        type: "text",
        heading: "3. Payments and fees",
        body: "Earnings are paid after the client confirms completion. Narvent’s service fee is shown on every payment breakdown before payout.",
      },
      {
        type: "text",
        heading: "4. Cancellations",
        body: "Jobs cancelled by the client before work starts are not paid. Partial work is paid in proportion to what was completed.",
      },
      {
        type: "text",
        heading: "5. Account suspension",
        body: "Repeated no-shows, false documents or unsafe conduct can lead to suspension. You can appeal through Contact Us.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    blocks: [
      { type: "meta", text: "Last updated 1 Oct 2026" },
      {
        type: "text",
        heading: "What we collect",
        body: "Your name, phone number, address, identity documents, bank or UPI details, job history and in-app messages.",
      },
      {
        type: "text",
        heading: "How we use it",
        body: "To verify your identity, match you with jobs, process payouts and resolve disputes.",
      },
      {
        type: "text",
        heading: "Who we share it with",
        body: "Clients see your name, rating and job details. Banks and payment partners receive only what is needed to complete a payout.",
      },
      {
        type: "text",
        heading: "Your choices",
        body: "You can update your details in My Profile, download your data, or ask us to delete your account through Contact Us.",
      },
    ],
  },
  contact: {
    title: "Contact Us",
    blocks: [
      {
        type: "row",
        icon: "phone",
        title: "Call support",
        value: "+91 484 000 0000",
        onPress: () => Linking.openURL("tel:+914840000000"),
      },
      {
        type: "row",
        icon: "chat",
        title: "WhatsApp",
        value: "Chat with the Narvent team",
        onPress: () => Linking.openURL("https://wa.me/914840000000"),
      },
      {
        type: "row",
        icon: "mail",
        title: "Email",
        value: "support@narvent.in",
        onPress: () => Linking.openURL("mailto:support@narvent.in"),
      },
      {
        type: "row",
        icon: "pin",
        title: "Office",
        value: "Kochi, Kerala 682001",
      },
      {
        type: "note",
        text: "Support is available Monday to Saturday, 9 AM to 7 PM.",
      },
    ],
  },
};
