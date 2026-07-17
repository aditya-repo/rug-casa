export const CART_STORAGE_KEY = "rugs-bhadohi-cart-v1";
export const CART_MAX_QTY = 10;

export type CartLineItem = {
  /** Stable line identity: product + size + color + services */
  key: string;
  productId: string;
  name: string;
  brand: string;
  imageSrc: string;
  imageAlt: string;
  sizeId: string;
  sizeLabel: string;
  colorId: string;
  colorLabel: string;
  /** Sale price per rug (rupees, no commas). */
  unitPrice: number;
  /** MRP per rug (rupees, no commas). */
  unitMrp: number;
  quantity: number;
  serviceIds: string[];
  serviceLabels: string[];
  /** Extra services cost per rug (rupees). */
  servicesPerUnit: number;
};

export type AddToCartInput = {
  productId: string;
  name: string;
  brand: string;
  imageSrc: string;
  imageAlt: string;
  sizeId: string;
  sizeLabel: string;
  colorId: string;
  colorLabel: string;
  unitPrice: number;
  unitMrp: number;
  quantity: number;
  serviceIds: string[];
  serviceLabels: string[];
  servicesPerUnit: number;
};

export function buildCartLineKey(input: {
  productId: string;
  sizeId: string;
  colorId: string;
  serviceIds: string[];
}): string {
  const services = [...input.serviceIds].sort().join(",");
  return `${input.productId}|${input.sizeId}|${input.colorId}|${services}`;
}

export function lineUnitTotal(line: CartLineItem): number {
  return line.unitPrice + line.servicesPerUnit;
}

export function lineTotal(line: CartLineItem): number {
  return lineUnitTotal(line) * line.quantity;
}

export function cartItemCount(lines: CartLineItem[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartSubtotal(lines: CartLineItem[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}
