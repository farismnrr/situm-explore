import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ApiError } from './src/api/errors'
import { AuthSession } from './src/auth/session'

export default function App() {
  const auth = useMemo(() => new AuthSession(), [])
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { auth.restore().then((ok) => { setAuthenticated(ok); setReady(true) }).catch(() => setReady(true)) }, [auth])
  if (!ready) return <SafeAreaView style={styles.safeArea}><ActivityIndicator color="#111827" /></SafeAreaView>
  if (authenticated) return <SafeAreaView style={styles.safeArea}><View style={styles.container}><Text style={styles.eyebrow}>SITUM EXPLORE</Text><Text style={styles.title}>Workspace foundation</Text><Text style={styles.body}>Signed in securely. Map and Realtime will be enabled in their planned phases.</Text><TouchableOpacity style={styles.button} onPress={() => auth.logout().then(() => setAuthenticated(false))}><Text style={styles.buttonText}>Sign out</Text></TouchableOpacity></View></SafeAreaView>
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>S</Text></View>
        <Text style={styles.eyebrow}>SITUM EXPLORE</Text>
        <Text style={styles.title}>Sign in to Explore</Text>
        <Text style={styles.body}>Use your existing Situm Explore account. Your session is stored only in the device secure store.</Text>
        <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="Email" placeholderTextColor="#8b939e" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput autoComplete="password" placeholder="Password" placeholderTextColor="#8b939e" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity disabled={busy} style={[styles.button, busy && styles.disabled]} onPress={() => { setBusy(true); setError(''); auth.login(email, password).then(() => setAuthenticated(true)).catch((e: unknown) => setError(e instanceof ApiError ? e.message : 'Sign in could not be completed.')).finally(() => setBusy(false)) }}><Text style={styles.buttonText}>{busy ? 'Signing in…' : 'Sign in'}</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fa' },
  container: { flex: 1, padding: 24, justifyContent: 'center', maxWidth: 720, width: '100%', alignSelf: 'center' },
  brandMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  brandMarkText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  eyebrow: { color: '#8b939e', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#111827', fontSize: 32, fontWeight: '800', letterSpacing: -1, marginTop: 8 },
  body: { color: '#555d67', fontSize: 16, lineHeight: 24, marginTop: 12 },
  input: { backgroundColor: '#fff', borderColor: '#d6dbe0', borderWidth: 1, borderRadius: 10, color: '#111827', fontSize: 15, minHeight: 48, paddingHorizontal: 13, marginTop: 12 },
  error: { color: '#a83832', fontSize: 13, marginTop: 10 },
  button: { alignItems: 'center', backgroundColor: '#111827', borderRadius: 10, justifyContent: 'center', minHeight: 48, marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  note: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 28 },
  noteTitle: { color: '#111827', fontSize: 14, fontWeight: '700' },
  noteBody: { color: '#6a7380', fontSize: 13, lineHeight: 19, marginTop: 6 },
})
