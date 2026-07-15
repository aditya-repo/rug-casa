/**
 * Customer care numbers — sourced from `company` so storefront contact stays in one place.
 */
import { company, companyWhatsAppUrl } from "@/lib/data/company";

export const SUPPORT_DISPLAY_PHONE = company.phone.display;
export const SUPPORT_PHONE_TEL = company.phone.tel;

export const SUPPORT_DISPLAY_WHATSAPP = company.whatsapp.display;
export const SUPPORT_WHATSAPP_E164 = company.whatsapp.e164;

export const SUPPORT_WHATSAPP_URL = companyWhatsAppUrl();
