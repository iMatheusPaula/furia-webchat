<script setup>
import apiClient from '@/services/apiClient.js';
import {onMounted, reactive} from "vue";
import {useToast} from "vue-toastification";
import IconLoading from "@/components/IconLoading.vue";
import {useAuthStore} from "@/stores/useAuthStore.js";
import {formatarData} from "../utils/dateFormatter.js";

const authStore = useAuthStore();
const toast = useToast();
const state = reactive({
  chats: [],
  isLoading: false,
  chatActive: null,
  messages: [],
  message: '',
  userJoined: true,
});

async function loadChats() {
  state.isLoading = true;
  await apiClient.get('/chat').then((response) => {
    state.chats = response.data;
  }).catch((error) => {
    toast.error("Erro ao carregar os contatos.");
  })
  state.isLoading = false;
}

async function loadMessages(chatId) {
  state.isLoading = true;
  await apiClient.get(`/chat/${chatId}/messages`).then((response) => {
    state.messages = response.data;
    state.chatActive = chatId;
  }).catch((error) => {
    toast.error("Erro ao carregar as mensagens.");
  })
  state.isLoading = false;
}

async function sendMessage() {
  if (state.message === '') {
    toast.error("Digite uma mensagem.");
    return;
  }

  await apiClient.post('/message', {
    content: state.message,
    chatId: state.chatActive,
  }).then((response) => {
    state.messages.push(response.data);
    state.message = '';
  }).catch((error) => {
    toast.error("Erro ao enviar a mensagem.");
  })
}

async function joinChat() {
  await apiClient.post(`/chat/${state.chatActive}/join`)
      .then(() => state.userJoined = true)
      .catch(() => toast.error("Erro ao entrar no chat."))
}

onMounted(loadChats);
</script>
<template>
  <div v-if="state.isLoading">
    <IconLoading/>
  </div>

  <div v-else class="w-96 py-10 justify-center px-6 lg:w-full lg:h-full lg:px-8">
    <div class="bg-gray-600 overflow-hidden animate-rainbow-glow sm:rounded-lg flex"
         style="min-height: 600px;">
      <!--list chats-->
      <div class="w-3/12 bg-gray-200 bg-opacity-25 border-r border-gray-700 overflow-y-scroll">
        <ul>
          <li
              v-for="chat in state.chats"
              :key="chat.id"
              @click="() => loadMessages(chat.id)"
              :class="(state.chatActive === chat.id) ? 'bg-gray-200 bg-opacity-50' : ''"
              class="p-6 text-lg text-gray-600 leading-7 font-semibold border-b border-gray-700
                                hover:bg-gray-200 hover:bg-opacity-50 hover:cursor-pointer"
          >
            <p class="flex items-center text-gray-200 hover:text-white">
              {{ chat.name }}
              <span class="ml-2 w-2 h-2 bg-custom-blue rounded-full"></span>
            </p>
          </li>
        </ul>
      </div>

      <!--box message-->
      <div v-if="state.chatActive" class="w-9/12 flex flex-col justify-between">
        <div class="w-full p-6 flex flex-col overflow-y-scroll">
          <!-- message -->
          <div v-for="message in state.messages"
               :key="message.id"
               class="w-full mb-3 msg-scroll"
               :class="(message.userId === authStore.user.id) ? 'text-right' : 'text-left'"
          >
            <p class="inline-block p-2 rounded-md"
               style="max-width: 75%;"
               :class="(message.userId === authStore.user.id) ? 'messageFromMe' : 'message'"
            >
              {{ message.content }}
            </p>
            <span class="block mt-1 text-xs text-gray-500">{{ formatarData(message.createdAt) }}</span>
          </div>
        </div>
        <!-- send message -->
        <div v-if="state.userJoined" class="w-full bg-gray-200 bg-opacity-25 p-6 border-t border-gray-200">
          <form v-on:submit.prevent="sendMessage" class="flex rounded-md overflow-hidden">
            <input v-model="state.message" type="text" class="flex-1 px-4 py-2 text-sm focus:outline-none">
            <button class="bg-custom-blue text-white px-4 py-2">Enviar</button>
          </form>
        </div>

        <!-- join chat -->
        <div v-else-if="!state.userJoined && state.chatActive" class="w-full bg-gray-200 bg-opacity-25 p-6 border-t border-gray-800 space-x-4">
          <span class="text-gray-800 text-lg">Modo espectador.
            <span @click="joinChat" class="cursor-pointer">Clique aqui para participar {{ state.userJoined}} {{ state.chatActive}}</span>
          </span>
        </div>
      </div>
      <div v-else class="w-9/12 relative">
        <div class="w-full h-full flex items-center justify-center">
          <p class="text-gray-400 text-lg">Selecione um chat para ver as mensagens.</p>
        </div>
        <div class="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-10"
             style="background-image: url('/images/cs-1.png');">
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.messageFromMe {
  @apply bg-indigo-300 bg-opacity-25;
}

.message {
  @apply bg-custom-blue bg-opacity-25;
}

@keyframes rainbow-glow {
  0% { box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.7); }
  33% { box-shadow: 0 0 10px 5px rgba(0, 255, 0, 0.7); }
  66% { box-shadow: 0 0 10px 5px rgba(0, 0, 255, 0.7); }
  100% { box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.7); }
}

.animate-rainbow-glow {
  animation: rainbow-glow 3s linear infinite;
}
</style>
