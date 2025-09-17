<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { createHeroi, updateHeroi } from "@/services/heroService";
import { listSuperpoderes } from "@/services/superpoderService";
import type { Heroi, CreateHeroi, UpdateHeroi, Superpoder } from "@/types";

const props = defineProps<{ editing: Heroi | null }>();
const emit = defineEmits<{ (e: "close"): void; (e: "saved"): void }>();

const poderes = ref<Superpoder[]>([]);
const saving = ref(false);
const errorMsg = ref<string | null>(null);

const form = ref<CreateHeroi>({
  nome: "",
  nomeHeroi: "",
  dataNascimento: "",
  altura: 1.7,
  peso: 70,
  superpoderIds: [],
});

onMounted(async () => {
  try { poderes.value = await listSuperpoderes(); } catch {}
});

watchEffect(() => {
  if (props.editing) {
    const h = props.editing;
    form.value = {
      nome: h.nome,
      nomeHeroi: h.nomeHeroi,
      dataNascimento: h.dataNascimento.slice(0, 10),
      altura: h.altura,
      peso: h.peso,
      superpoderIds: h.superpoderes.map((p: Superpoder) => p.id),
    };
  } else {
    form.value = { nome: "", nomeHeroi: "", dataNascimento: "", altura: 1.7, peso: 70, superpoderIds: [] };
  }
});

async function submit() {
  errorMsg.value = null; saving.value = true;
  try {
    if (!form.value.nome || !form.value.nomeHeroi || !form.value.dataNascimento || form.value.superpoderIds.length === 0) {
      errorMsg.value = "Preencha todos os campos obrigatórios e selecione ao menos um superpoder.";
      return;
    }
    if (props.editing) {
      const payload: UpdateHeroi = { ...form.value };
      await updateHeroi(props.editing.id, payload);
    } else {
      await createHeroi(form.value);
    }
    emit("saved");
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Erro ao salvar o herói.";
  } finally { saving.value = false; }
}
</script>

<template>
  <!-- overlay com scroll de segurança -->
  <div class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 sm:p-8 overflow-y-auto" role="dialog" aria-modal="true">
    <!-- card com altura limitada e layout em coluna -->
    <div class="w-full max-w-xl sm:max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 max-h-[90dvh] flex flex-col">
      
      <!-- header sticky + erro sticky -->
      <div class="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
        <!-- linha do título/fechar -->
        <div class="px-6 py-4 flex items-start justify-between">
          <div>
            <h2 class="text-lg sm:text-xl font-semibold">
              {{ props.editing ? "Editar herói" : "Novo herói" }}
            </h2>
            <p class="text-xs sm:text-sm text-gray-500">
              Campos marcados com <span class="text-rose-600">*</span> são obrigatórios.
            </p>
          </div>
          <button
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Fechar formulário"
            @click="emit('close')"
          >✕</button>
        </div>

        <!-- barra de erro fixa no topo (opcional com transição) -->
        <transition name="fade">
          <div
            v-if="errorMsg"
            class="mx-6 mb-3 rounded-lg bg-rose-50 p-3 text-rose-700 ring-1 ring-rose-200 flex items-start justify-between gap-3"
            role="alert" aria-live="polite"
          >
            <span>{{ errorMsg }}</span>
            <button class="shrink-0 rounded-md px-2 py-1 hover:bg-rose-100"
                    @click="errorMsg = null">✕</button>
          </div>
        </transition>
      </div>


      <!-- corpo rolável -->
      <div class="px-6 py-4 overflow-y-auto flex-1">

        <form class="grid gap-4" @submit.prevent="submit">
          <div class="grid gap-2">
            <label for="nome" class="text-sm font-medium">Nome <span class="text-rose-600">*</span></label>
            <input id="nome" v-model="form.nome" class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2" placeholder="Clark Kent" required />
          </div>

          <div class="grid gap-2">
            <label for="nomeHeroi" class="text-sm font-medium">Nome do Herói <span class="text-rose-600">*</span></label>
            <input id="nomeHeroi" v-model="form.nomeHeroi" class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2" placeholder="Superman" required />
          </div>

          <div class="grid gap-2">
            <label for="nasc" class="text-sm font-medium">Data de Nascimento <span class="text-rose-600">*</span></label>
            <input id="nasc" type="date" v-model="form.dataNascimento" class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2" required />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label for="altura" class="text-sm font-medium">Altura (m) <span class="text-rose-600">*</span></label>
              <input id="altura" type="number" step="0.01" min="0" v-model.number="form.altura" class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2" required />
            </div>
            <div class="grid gap-2">
              <label for="peso" class="text-sm font-medium">Peso (kg) <span class="text-rose-600">*</span></label>
              <input id="peso" type="number" step="0.1" min="0" v-model.number="form.peso" class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2" required />
            </div>
          </div>

          <div class="grid gap-2">
            <label for="poderes" class="text-sm font-medium">
              Superpoderes <span class="text-rose-600">*</span>
              <span class="text-xs text-gray-500">(Ctrl/Cmd para múltiplos)</span>
            </label>
            <!-- reduzir a altura do select para caber melhor -->
            <select id="poderes" v-model="form.superpoderIds" multiple size="5"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2"
              required>
              <option v-for="p in poderes" :key="p.id" :value="p.id">{{ p.nome }}</option>
            </select>

            <div class="mt-1 flex flex-wrap gap-1" v-if="form.superpoderIds.length">
              <span v-for="pid in form.superpoderIds" :key="pid"
                class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 ring-1 ring-indigo-200">
                {{ poderes.find(sp => sp.id === pid)?.nome }}
              </span>
            </div>
          </div>
        </form>
      </div>

      <!-- footer fixo -->
      <div class="sticky bottom-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t px-6 py-3 flex justify-end gap-2">
        <button type="button" class="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50" @click="emit('close')">
          Cancelar
        </button>
        <button type="submit" :disabled="saving"
          class="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          @click="submit">
          <svg v-if="saving" class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" d="M4 12a8 8 0 018-8v4" stroke="currentColor" stroke-width="4" />
          </svg>
          {{ saving ? "Salvando..." : "Salvar" }}
        </button>
      </div>
    </div>
  </div>
</template>
