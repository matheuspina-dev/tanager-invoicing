/**
 * Shared helpers for server actions — form parsing and ownership checks.
 */

/**
 * Extract a required string field from FormData or throw.
 */
export function requireFormId(
  formData: FormData,
  field = "id",
  label = "ID",
): string {
  const value = formData.get(field)?.toString();
  if (!value) throw new Error(`${label} required`);
  return value;
}

/**
 * Run a query and throw if the record is missing.
 * Keeps the ownership-check boilerplate in one place.
 */
export async function requireRecord<T>(
  queryFn: () => Promise<T | null>,
  label: string,
): Promise<T> {
  const record = await queryFn();
  if (!record) throw new Error(`${label} not found`);
  return record;
}

export interface ParsedItem {
  description: string;
  price: number;
}

/**
 * Parse invoice line-items encoded as `items[0][description]`, `items[0][price]`
 * from FormData. Throws on invalid prices when `strict` is true (default).
 */
export function parseFormItems(
  formData: FormData,
  { strict = true }: { strict?: boolean } = {},
): ParsedItem[] {
  const items: ParsedItem[] = [];

  for (let i = 0; ; i++) {
    const description = formData
      .get(`items[${i}][description]`)
      ?.toString()
      .trim();
    const priceRaw = formData.get(`items[${i}][price]`)?.toString();

    if (!description || !priceRaw) break;

    const price = parseInt(priceRaw, 10);

    if (isNaN(price) || price <= 0) {
      if (strict) throw new Error("Invalid item price");
      continue;
    }

    items.push({ description, price });
  }

  return items;
}
