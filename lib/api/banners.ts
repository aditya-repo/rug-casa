import { clientApi, publicApi, serverApi } from "./fetch";
import { imageUrl } from "./mappers";
import type { HeroSlide } from "@/lib/data/hero-slides";

export const MAX_HOMEPAGE_BANNERS = 3;

export type BannerStatus = "ENABLED" | "DISABLED" | "SCHEDULED";
export type BannerType =
  | "HOMEPAGE"
  | "CATEGORY"
  | "OFFER"
  | "COLLECTION"
  | "POPUP"
  | "MOBILE"
  | "DESKTOP";

export interface ApiBanner {
  id: string;
  title: string;
  type: BannerType;
  image: string;
  mobileImage?: string | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  sortOrder: number;
  status: BannerStatus;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormPayload {
  title: string;
  type?: BannerType;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  linkUrl?: string;
  sortOrder?: number;
  status?: BannerStatus;
}

export function mapBannerToHeroSlide(banner: ApiBanner): HeroSlide {
  return {
    id: banner.id,
    eyebrow: "",
    title: banner.title,
    description: "",
    ctaLabel: banner.buttonText?.trim() || "Explore More",
    ctaHref: banner.buttonUrl?.trim() || banner.linkUrl?.trim() || "/shop",
    imageSrc: imageUrl(banner.image),
    imageAlt: banner.title,
  };
}

export async function fetchPublicHomepageBanners(): Promise<HeroSlide[]> {
  const res = await publicApi<ApiBanner[]>("/banners/public/homepage");
  return (res.data ?? []).map(mapBannerToHeroSlide);
}

export async function fetchHomepageBanners() {
  const res = await serverApi<ApiBanner[]>("/banners", {
    searchParams: { type: "HOMEPAGE", limit: MAX_HOMEPAGE_BANNERS },
  });
  return { items: res.data ?? [], meta: res.meta };
}

export async function fetchHomepageBannersClient() {
  const res = await clientApi<ApiBanner[]>("/banners", {
    searchParams: { type: "HOMEPAGE", limit: MAX_HOMEPAGE_BANNERS },
  });
  return { items: res.data ?? [], meta: res.meta };
}

export async function createBannerClient(payload: BannerFormPayload) {
  const res = await clientApi<ApiBanner>("/banners", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      type: payload.type ?? "HOMEPAGE",
      status: payload.status ?? "ENABLED",
    }),
  });
  return res.data!;
}

export async function updateBannerClient(id: string, payload: Partial<BannerFormPayload>) {
  const res = await clientApi<ApiBanner>(`/banners/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function deleteBannerClient(id: string) {
  await clientApi(`/banners/${id}`, { method: "DELETE" });
}
