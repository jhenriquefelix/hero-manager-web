import { api } from "@/lib/api";
import type { Superpoder } from "@/types";

export async function listSuperpoderes(): Promise<Superpoder[]> {
  const { data } = await api.get<Superpoder[]>("/api/superpoderes");
  return data ?? [];
}
