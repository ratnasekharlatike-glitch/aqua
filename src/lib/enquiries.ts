import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const FORMSPREE_CONTACT_ENDPOINT = "https://formspree.io/f/mjyboapb";

export type EnquiryKind = "contact_form" | "whatsapp";

export interface EnquiryRecord {
  id: string;
  kind: EnquiryKind;
  source: string;
  message: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  createdAt: Date | null;
}

export function persistContactEnquiry(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return addDoc(collection(db, "enquiries"), {
    kind: "contact_form" as const,
    source: "Contact form",
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function submitContactToFormspree(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const response = await fetch(FORMSPREE_CONTACT_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      subject: input.subject.trim(),
      message: input.message.trim(),
      _subject: `WaterFilterStore enquiry: ${input.subject.trim()}`,
      source: "Website contact form",
    }),
  });

  if (!response.ok) {
    throw new Error("Formspree rejected the contact submission.");
  }
}

export function persistWhatsAppEnquiry(source: string, message: string) {
  return addDoc(collection(db, "enquiries"), {
    kind: "whatsapp" as const,
    source,
    message,
    createdAt: serverTimestamp(),
  });
}

function mapDoc(id: string, data: Record<string, unknown>): EnquiryRecord {
  const rawKind = data.kind;
  const kind: EnquiryKind =
    rawKind === "contact_form" ? "contact_form" : "whatsapp";
  const created = data.createdAt as Timestamp | undefined;
  return {
    id,
    kind,
    source: String(data.source ?? ""),
    message: String(data.message ?? ""),
    name: typeof data.name === "string" && data.name.trim() ? data.name.trim() : undefined,
    email: typeof data.email === "string" && data.email.trim() ? data.email.trim() : undefined,
    phone: typeof data.phone === "string" && data.phone.trim() ? data.phone.trim() : undefined,
    subject: typeof data.subject === "string" && data.subject.trim() ? data.subject.trim() : undefined,
    createdAt: created?.toDate?.() ?? null,
  };
}

export function subscribeEnquiries(
  onUpdate: (items: EnquiryRecord[]) => void,
  onError?: (e: Error) => void
) {
  const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      onUpdate(snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>)));
    },
    (err) => onError?.(err as Error)
  );
}
