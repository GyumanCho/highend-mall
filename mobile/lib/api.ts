// API base URL — change to your server address
// For iOS simulator: http://localhost:3000
// For Android emulator: http://10.0.2.2:3000
// For physical device: http://<your-ip>:3000
const API_BASE = "http://localhost:3000";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Product types matching the web API
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly priceTier: string;
  readonly titleDisplay: string;
  readonly descriptionHero: string;
  readonly descriptionFull: string;
  readonly categoryPath: string;
  readonly collection: string | null;
  readonly materials: Record<string, string>;
  readonly brand: {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly tier: string;
  };
  readonly prices: readonly { readonly amount: string; readonly currency: string; readonly isDefault: boolean }[];
  readonly images: readonly { readonly id: string; readonly url: string; readonly type: string; readonly altText: string | null }[];
}

export interface Brand {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly tier: string;
  readonly description: string | null;
}

export function formatPrice(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(num);
}
