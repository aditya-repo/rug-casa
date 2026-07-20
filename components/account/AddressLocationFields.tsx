"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  getCitiesOfState,
  getCountries,
  getStatesOfCountry,
} from "@countrystatecity/countries-browser";

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition-colors focus:border-rc-accent focus:ring-1 focus:ring-rc-accent disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-70";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-rc-muted md:text-neutral-500";

export type AddressLocationValue = {
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
};

type Option = { code: string; name: string };

type AddressLocationFieldsProps = {
  value: AddressLocationValue;
  onChange: (next: AddressLocationValue) => void;
};

export function AddressLocationFields({ value, onChange }: AddressLocationFieldsProps) {
  const countryId = useId();
  const stateId = useId();
  const cityId = useId();
  const valueRef = useRef(value);
  valueRef.current = value;

  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState("");

  // Load countries once; resolve country code from name when editing.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCountries(true);
      setError("");
      try {
        const list = await getCountries();
        if (cancelled) return;
        const options = list
          .map((c) => ({ code: c.iso2, name: c.name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(options);

        const current = valueRef.current;
        if (!current.countryCode && current.country) {
          const match = options.find(
            (c) => c.name.toLowerCase() === current.country.trim().toLowerCase(),
          );
          if (match) {
            onChange({
              ...current,
              country: match.name,
              countryCode: match.code,
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load countries");
          setCountries([]);
        }
      } finally {
        if (!cancelled) setLoadingCountries(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onChange]);

  // Load states when country changes.
  useEffect(() => {
    let cancelled = false;
    const countryCode = value.countryCode?.trim().toUpperCase() ?? "";

    if (!countryCode) {
      setStates([]);
      setCities([]);
      return;
    }

    (async () => {
      setLoadingStates(true);
      setError("");
      try {
        const list = await getStatesOfCountry(countryCode);
        if (cancelled) return;
        const options = list
          .map((s) => ({ code: s.iso2, name: s.name }))
          .filter((s) => Boolean(s.code))
          .sort((a, b) => a.name.localeCompare(b.name));
        setStates(options);

        const current = valueRef.current;
        if (!current.stateCode && current.state) {
          const match = options.find(
            (s) => s.name.toLowerCase() === current.state.trim().toLowerCase(),
          );
          if (match) {
            onChange({
              ...current,
              state: match.name,
              stateCode: match.code,
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load states");
          setStates([]);
        }
      } finally {
        if (!cancelled) setLoadingStates(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [value.countryCode, onChange]);

  // Load cities when state changes.
  useEffect(() => {
    let cancelled = false;
    const countryCode = value.countryCode?.trim().toUpperCase() ?? "";
    const stateCode = value.stateCode?.trim().toUpperCase() ?? "";

    if (!countryCode || !stateCode) {
      setCities([]);
      return;
    }

    (async () => {
      setLoadingCities(true);
      setError("");
      try {
        const list = await getCitiesOfState(countryCode, stateCode);
        if (cancelled) return;
        const options = list
          .map((c) => ({ code: String(c.id), name: c.name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCities(options);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load cities");
          setCities([]);
        }
      } finally {
        if (!cancelled) setLoadingCities(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [value.countryCode, value.stateCode]);

  const cityOptions =
    value.city && !cities.some((c) => c.name === value.city)
      ? [{ code: "custom", name: value.city }, ...cities]
      : cities;

  return (
    <>
      <div>
        <label htmlFor={countryId} className={labelClass}>
          Country
        </label>
        <select
          id={countryId}
          value={value.countryCode}
          disabled={loadingCountries}
          onChange={(e) => {
            const code = e.target.value;
            const match = countries.find((c) => c.code === code);
            onChange({
              country: match?.name ?? "",
              countryCode: code,
              state: "",
              stateCode: "",
              city: "",
            });
          }}
          className={inputClass}
          autoComplete="country"
          required
        >
          <option value="">
            {loadingCountries ? "Loading countries…" : "Select country"}
          </option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={stateId} className={labelClass}>
          State
        </label>
        <select
          id={stateId}
          value={value.stateCode}
          disabled={!value.countryCode || loadingStates}
          onChange={(e) => {
            const code = e.target.value;
            const match = states.find((s) => s.code === code);
            onChange({
              ...valueRef.current,
              state: match?.name ?? "",
              stateCode: code,
              city: "",
            });
          }}
          className={inputClass}
          autoComplete="address-level1"
          required
        >
          <option value="">
            {!value.countryCode
              ? "Select country first"
              : loadingStates
                ? "Loading states…"
                : states.length === 0
                  ? "No states found"
                  : "Select state"}
          </option>
          {states.map((s) => (
            <option key={`${s.code}-${s.name}`} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={cityId} className={labelClass}>
          City
        </label>
        {value.stateCode && !loadingCities && cities.length === 0 ? (
          <input
            id={cityId}
            value={value.city}
            onChange={(e) =>
              onChange({
                ...valueRef.current,
                city: e.target.value,
              })
            }
            className={inputClass}
            placeholder="Enter city"
            autoComplete="address-level2"
            required
          />
        ) : (
          <select
            id={cityId}
            value={value.city}
            disabled={!value.stateCode || loadingCities}
            onChange={(e) =>
              onChange({
                ...valueRef.current,
                city: e.target.value,
              })
            }
            className={inputClass}
            autoComplete="address-level2"
            required
          >
            <option value="">
              {!value.stateCode
                ? "Select state first"
                : loadingCities
                  ? "Loading cities…"
                  : "Select city"}
            </option>
            {cityOptions.map((c) => (
              <option key={`${c.code}-${c.name}`} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {error ? (
        <p className="sm:col-span-2 text-xs text-red-600">{error}</p>
      ) : null}
    </>
  );
}
