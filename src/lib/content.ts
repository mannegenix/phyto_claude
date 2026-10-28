import "server-only";
import { products } from "@/content/products";
import * as company from "@/content/company";
import type { Product } from "@/content/types";

/**
 * Content access layer.
 *
 * Every page reads content through these async functions. Today they return the
 * typed local files in src/content. When the CMS (Sanity or Payload) is connected,
 * replace the bodies with CMS queries and keep the signatures unchanged.
 */
export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getCompany() {
  return company;
}
