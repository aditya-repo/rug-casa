"use client";

import { useCallback, useState } from "react";

export type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
};

const initialProfile: ProfileFormState = {
  name: "Arjun Sharma",
  email: "arjun@example.com",
  phone: "+91 98765 43210",
  gender: "male",
  dateOfBirth: "1992-08-14",
};

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "unspecified", label: "Prefer not to say" },
] as const;

function genderLabel(value: string) {
  return genderOptions.find((o) => o.value === value)?.label ?? value;
}

function formatDobForDisplay(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const inputClass =
  "mt-1 w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition-colors focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-rc-muted md:text-neutral-500";

export function ProfileInformationBody() {
  const [saved, setSaved] = useState<ProfileFormState>(initialProfile);
  const [draft, setDraft] = useState<ProfileFormState>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = useCallback(() => {
    setDraft(saved);
    setIsEditing(true);
  }, [saved]);

  const cancel = useCallback(() => {
    setDraft(saved);
    setIsEditing(false);
  }, [saved]);

  const save = useCallback(() => {
    setSaved(draft);
    setIsEditing(false);
  }, [draft]);

  return (
    <div className="rounded-lg border border-rc-border bg-white p-4 shadow-none md:rounded-[10px] md:border-neutral-200 md:p-5 md:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-rc-border pb-3 md:border-neutral-100">
        <h2 className="text-sm font-semibold text-rc-navy md:text-base md:text-neutral-900">
          Your details
        </h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={startEdit}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-rc-navy shadow-sm transition-colors hover:bg-neutral-50 md:border-neutral-300 md:text-rc-accent md:hover:border-rc-accent/40"
          >
            Edit
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-rc-navy px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <dl className="space-y-4 text-sm md:space-y-3">
          <div>
            <dt className={labelClass}>Name</dt>
            <dd className="mt-0.5 font-semibold text-rc-navy md:font-medium md:text-neutral-900">
              {saved.name}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Email</dt>
            <dd className="mt-0.5 font-semibold text-rc-navy md:font-medium md:text-neutral-900">
              {saved.email}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Phone</dt>
            <dd className="mt-0.5 font-semibold text-rc-navy md:font-medium md:text-neutral-900">
              {saved.phone}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Gender</dt>
            <dd className="mt-0.5 font-semibold text-rc-navy md:font-medium md:text-neutral-900">
              {genderLabel(saved.gender)}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Date of birth</dt>
            <dd className="mt-0.5 font-semibold text-rc-navy md:font-medium md:text-neutral-900">
              {formatDobForDisplay(saved.dateOfBirth)}
            </dd>
          </div>
        </dl>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div>
            <label htmlFor="profile-name" className={labelClass}>
              Name
            </label>
            <input
              id="profile-name"
              name="name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className={inputClass}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="profile-email" className={labelClass}>
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="profile-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              className={inputClass}
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="profile-gender" className={labelClass}>
              Gender
            </label>
            <select
              id="profile-gender"
              name="gender"
              value={draft.gender}
              onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value }))}
              className={inputClass}
            >
              {genderOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="profile-dob" className={labelClass}>
              Date of birth
            </label>
            <input
              id="profile-dob"
              name="dateOfBirth"
              type="date"
              value={draft.dateOfBirth}
              onChange={(e) =>
                setDraft((d) => ({ ...d, dateOfBirth: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </form>
      )}

      <p className="mt-4 text-xs text-neutral-500">
        Demo only — wire Save to your profile API when ready.
      </p>
    </div>
  );
}
