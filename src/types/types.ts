export interface Superpoder {
  id: number;
  nome: string;        // mapeia SuperpoderDto.Nome
  descricao?: string | null;
}

export interface Heroi {
  id: number;
  nome: string;
  nomeHeroi: string;
  dataNascimento: string; // ISO
  altura: number;
  peso: number;
  superpoderes: Superpoder[];
}

export interface CreateHeroi {
  nome: string;
  nomeHeroi: string;
  dataNascimento: string; // ISO
  altura: number;
  peso: number;
  superpoderIds: number[];
}

export interface UpdateHeroi {
  nome?: string;
  nomeHeroi?: string;
  dataNascimento?: string;
  altura?: number;
  peso?: number;
  superpoderIds?: number[];
}
