import * as SecureStore from 'expo-secure-store'
import { MobileApiClient } from '../api/client'
import type { MobileLoginResponse, User } from '../api/types'

const sessionStorageKey = 'situm-explore.session'

export class AuthSession {
  private value: string | null = null
  private userValue: User | null = null
  readonly api: MobileApiClient

  constructor() {
    this.api = new MobileApiClient(() => this.value)
  }

  get session() { return this.value }
  get user() { return this.userValue }
  get authenticated() { return Boolean(this.value && this.userValue) }

  async restore() {
    const stored = await SecureStore.getItemAsync(sessionStorageKey)
    if (!stored) return false
    this.value = stored
    try {
      const response = await this.api.get<{ user: User }>('/api/me')
      this.userValue = response.user
      return true
    } catch {
      await this.clearLocal()
      return false
    }
  }

  async login(email: string, password: string) {
    const response = await this.api.post<MobileLoginResponse>('/api/auth/mobile-login', { email, password })
    this.value = response.session
    this.userValue = response.user
    await SecureStore.setItemAsync(sessionStorageKey, response.session)
    return response.user
  }

  async logout() {
    try {
      if (this.value) await this.api.post('/api/auth/logout')
    } finally {
      await this.clearLocal()
    }
  }

  private async clearLocal() {
    this.value = null
    this.userValue = null
    await SecureStore.deleteItemAsync(sessionStorageKey)
  }
}
