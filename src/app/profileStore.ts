/* ══════════════════════════════════════════════
   Lightweight profile store (MVP1 prototype)
   Persists to localStorage for session continuity.
   ══════════════════════════════════════════════ */

export interface UserProfile {
  fullName: string;
  district: string;
  areaTown: string;
  dob: string;       // yyyy-mm-dd or empty
  gender: string;    // "Male" | "Female" | "Other" | ""
  memberId: string;
  phone: string;
  email: string;
  emergencyName: string;
  emergencyPhone: string;
  profileComplete: boolean;
}

const STORAGE_KEY = "aba_user_profile";

const defaultProfile: UserProfile = {
  fullName: "",
  district: "",
  areaTown: "",
  dob: "",
  gender: "",
  memberId: "",
  phone: "",
  email: "",
  emergencyName: "",
  emergencyPhone: "",
  profileComplete: false,
};

export function getProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
  } catch (_e) {
    // ignore parse errors
  }
  return { ...defaultProfile };
}

export function saveProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isProfileComplete(): boolean {
  const p = getProfile();
  return p.profileComplete;
}

/** Returns first name for greeting, or fallback */
export function getGreetingName(): string {
  const p = getProfile();
  if (!p.fullName) return "Catherine";
  return p.fullName.split(" ")[0];
}