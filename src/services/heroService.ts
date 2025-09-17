import { api } from "@/lib/api";
import type { Heroi, CreateHeroi, UpdateHeroi } from "@/types";

const base = "/api/herois";

export async function listHerois(): Promise<Heroi[]> {
  const res = await api.get<Heroi[]>(base);
  return res.status === 204 ? [] : (res.data ?? []);
}

export async function getHeroi(id: number): Promise<Heroi> {
  const { data } = await api.get<Heroi>(`${base}/${id}`);
  return data;
}

export async function createHeroi(payload: CreateHeroi): Promise<Heroi> {
  const { data } = await api.post<Heroi>(base, payload);
  return data;
}

export async function updateHeroi(id: number, payload: UpdateHeroi): Promise<Heroi> {
  const { data } = await api.put<Heroi>(`${base}/${id}`, payload);
  return data;
}

export async function deleteHeroi(id: number): Promise<void> {
  await api.delete(`${base}/${id}`);
}
