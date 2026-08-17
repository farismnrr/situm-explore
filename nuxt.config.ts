export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['@nuxt/ui', 'nuxt-auth-utils', '@nuxt/eslint', 'nuxt-agentation'],
  icon: {
    provider: 'none',
    clientBundle: { scan: true }
  },
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'light', fallback: 'light', classSuffix: '' },
  runtimeConfig: {
    session: { password: process.env.NUXT_SESSION_PASSWORD || '', cookie: { secure: process.env.NUXT_SESSION_COOKIE_SECURE === 'true' } },
    databaseUrl: process.env.DATABASE_URL,
    otel: { serviceName: process.env.OTEL_SERVICE_NAME || 'situm-explore', endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || '', protocol: process.env.OTEL_EXPORTER_OTLP_PROTOCOL || 'http/protobuf' },
    oauth: { google: { clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID || '', clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET || '', redirectURL: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URL || '' } },
    workspaceCredentialEncryptionKey: process.env.NUXT_WORKSPACE_CREDENTIAL_ENCRYPTION_KEY || '',
    clickhouse: { url: process.env.CLICKHOUSE_URL || 'http://localhost:8124', user: process.env.CLICKHOUSE_USER || '', password: process.env.CLICKHOUSE_PASSWORD || '', database: process.env.CLICKHOUSE_DB || '' }
  }
})
