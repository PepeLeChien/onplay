import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    usuario: null,  
    token: ''        
  }),

  actions: {
    setUsuario(usuario) {
      this.usuario = usuario
    },

    setToken(token) {
      this.token = token
    },

    logout() {
      this.usuario = null
      this.token = ''
      localStorage.removeItem('authToken')
    }
  }
})