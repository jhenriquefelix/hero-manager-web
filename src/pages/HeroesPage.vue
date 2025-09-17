<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listHerois, deleteHeroi } from "@/services/heroService";
import type { Heroi } from "@/types";
import HeroForm from "@/components/HeroForm.vue";

const herois = ref<Heroi[]>([]);
const loading = ref(false);
const showForm = ref(false);
const editHero = ref<Heroi | null>(null);
const errorMsg = ref<string | null>(null);

async function load() {
  loading.value = true; errorMsg.value = null;
  try { herois.value = await listHerois(); }
  catch (e: any) { errorMsg.value = e?.response?.data?.message ?? "Erro ao carregar"; }
  finally { loading.value = false; }
}

function novo() { editHero.value = null; showForm.value = true; }
function editar(h: Heroi) { editHero.value = h; showForm.value = true; }

async function excluir(id: number) {
  if (!confirm("Excluir este herói?")) return;
  await deleteHeroi(id);
  await load();
}

onMounted(load);
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Gerenciamento de Heróis</h1>
      <button
        class="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 active:scale-[.98] transition"
        @click="novo"
      >
        + Novo herói
      </button>
    </header>

    <div v-if="loading" class="p-4 rounded-lg bg-white shadow ring-1 ring-gray-200">
      Carregando...
    </div>

    <div v-else-if="errorMsg" class="p-4 rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200">
      {{ errorMsg }}
    </div>

    <div v-else-if="herois.length === 0" class="p-8 rounded-xl bg-white shadow ring-1 ring-gray-200 text-center text-gray-500">
      Nenhum herói cadastrado.
    </div>

    <div v-else class="overflow-x-auto rounded-xl bg-white shadow ring-1 ring-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Nome</th>
            <th class="px-4 py-3">Herói</th>
            <th class="px-4 py-3">Nascimento</th>
            <th class="px-4 py-3">Altura</th>
            <th class="px-4 py-3">Peso</th>
            <th class="px-4 py-3">Poderes</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="h in herois" :key="h.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-mono text-sm text-gray-700">{{ h.id }}</td>
            <td class="px-4 py-3">{{ h.nome }}</td>
            <td class="px-4 py-3 font-medium">{{ h.nomeHeroi }}</td>
            <td class="px-4 py-3">{{ new Date(h.dataNascimento).toLocaleDateString() }}</td>
            <td class="px-4 py-3">{{ h.altura.toFixed(2) }} m</td>
            <td class="px-4 py-3">{{ h.peso.toFixed(1) }} kg</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span v-for="p in h.superpoderes" :key="p.id"
                      class="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs ring-1 ring-indigo-200">
                  {{ p.nome }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex gap-2">
                <button class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                        @click="editar(h)">
                  Editar
                </button>
                <button class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-700"
                        @click="excluir(h.id)">
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <HeroForm v-if="showForm" :editing="editHero" @close="showForm=false" @saved="showForm=false; load()" />
  </div>
</template>
