import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { AppState, ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Circle, Path, Svg } from 'react-native-svg'
import { ApiError } from './src/api/errors'
import { AuthSession } from './src/auth/session'
import { WorkspaceContext } from './src/workspaces/context'
import { NativeMapScreen } from './src/map/NativeMapScreen'

export default function App() {
  const auth = useMemo(() => new AuthSession(), [])
  const workspaces = useMemo(() => new WorkspaceContext(auth), [auth])
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [workspaceError, setWorkspaceError] = useState('')
  const [activeTab, setActiveTab] = useState<'explore' | 'realtime' | 'recent' | 'settings'>('explore')
  const [lifecycle, setLifecycle] = useState(AppState.currentState)
  const { width } = useWindowDimensions()
  const showRail = width >= 700
  const wide = width >= 1050

  useEffect(() => {
    auth.restore().then((ok) => { setAuthenticated(ok); setReady(true) }).catch(() => setReady(true))
    const subscription = AppState.addEventListener('change', setLifecycle)
    return () => subscription.remove()
  }, [auth, workspaces])
  if (!ready) return <SafeAreaView style={styles.safeArea}><ActivityIndicator color="#111827" /></SafeAreaView>
  if (authenticated) return <AuthenticatedShell auth={auth} workspaces={workspaces} activeTab={activeTab} setActiveTab={setActiveTab} lifecycle={lifecycle} showRail={showRail} wide={wide} workspaceError={workspaceError} setWorkspaceError={setWorkspaceError} onLogout={() => auth.logout().then(() => setAuthenticated(false))} />
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.loginBrandMark}><BrandIcon /></View>
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

function AuthenticatedShell(props: { auth: AuthSession, workspaces: WorkspaceContext, activeTab: 'explore' | 'realtime' | 'recent' | 'settings', setActiveTab: (tab: 'explore' | 'realtime' | 'recent' | 'settings') => void, lifecycle: string, showRail: boolean, wide: boolean, workspaceError: string, setWorkspaceError: (value: string) => void, onLogout: () => void }) {
  const { workspaces, activeTab, setActiveTab, lifecycle, showRail, wide, workspaceError, setWorkspaceError, onLogout } = props
  useSyncExternalStore(workspaces.subscribe, workspaces.getSnapshot, workspaces.getSnapshot)
  const [loading, setLoading] = useState(workspaces.state === 'idle')
  useEffect(() => { if (workspaces.state === 'idle') workspaces.load().then(() => workspaces.loadConfiguration()).catch((e: unknown) => setWorkspaceError(e instanceof ApiError ? e.message : 'Workspaces are unavailable.')).finally(() => setLoading(false)) }, [workspaces, setWorkspaceError])
  const selected = workspaces.selectedWorkspace
  const select = (id: string) => { try { workspaces.select(id); void workspaces.loadConfiguration().catch(() => undefined) } catch (e) { setWorkspaceError(e instanceof ApiError ? e.message : 'Workspace could not be selected.') } }
  const title = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.shell}>
      {showRail ? <View style={[styles.rail, !wide && styles.compactRail]}><Brand compact={!wide} /><NavItems compact={!wide} activeTab={activeTab} setActiveTab={setActiveTab} /><TouchableOpacity style={styles.railSignOut} onPress={onLogout}><Text style={styles.railSignOutText}>{wide ? 'Sign out' : '×'}</Text></TouchableOpacity></View> : null}
      <View style={styles.main}>
        <View style={styles.topbar}><Brand compact={!showRail} /><Text style={styles.crumb}>{selected?.name || 'Workspace'} <Text style={styles.crumbStrong}>/ {title}</Text></Text><View style={styles.flex} /><Text style={styles.lifecycle}>{lifecycle === 'active' ? 'Foreground' : 'Background'}</Text></View>
        <View style={styles.content}>
          {loading ? <ActivityIndicator color="#111827" /> : workspaces.state === 'error' ? <StateCard title="Workspaces unavailable" body={workspaceError || 'Check your connection and try again.'} action={() => workspaces.load().catch(() => undefined)} /> : workspaces.state === 'empty' ? <StateCard title="No workspaces yet" body="Create your first workspace in Situm Explore web to continue." /> : <>
            <View style={styles.workspacePicker}><Text style={styles.eyebrow}>ACTIVE WORKSPACE</Text><Text style={styles.workspaceName}>{selected?.name || 'Select a workspace'}</Text><View style={styles.workspaceChoices}>{workspaces.workspaces.map(workspace => <TouchableOpacity key={workspace.id} onPress={() => select(workspace.id)} style={[styles.choice, workspace.id === selected?.id && styles.choiceActive]}><Text style={[styles.choiceText, workspace.id === selected?.id && styles.choiceTextActive]}>{workspace.name}</Text></TouchableOpacity>)}</View></View>
            {workspaceError ? <StateCard title="Workspace notice" body={workspaceError} /> : null}
            {activeTab === 'explore' ? <NativeMapScreen key={workspaces.selectedWorkspaceId || 'no-workspace'} workspaces={workspaces} lifecycle={lifecycle} /> : activeTab === 'realtime' ? <Placeholder title="Realtime is coming in Plan 031" body="Reported device positions will appear here after the server-mediated Realtime phase." /> : activeTab === 'recent' ? <Placeholder title="Recent is coming in a later plan" body="Recent activity is not enabled in this foundation build." /> : <SettingsCard onLogout={onLogout} />}
          </>}
        </View>
        {!showRail ? <View style={styles.bottom}><NavItems bottom activeTab={activeTab} setActiveTab={setActiveTab} /></View> : null}
      </View>
    </View>
  </SafeAreaView>
}

function Brand({ compact = false }: { compact?: boolean }) { return <View style={styles.brand}><View style={styles.brandMark}><BrandIcon /></View>{compact ? null : <Text style={styles.brandText}>Situm Explore</Text>}</View> }
function BrandIcon() { return <Svg width={18} height={18} viewBox="0 0 24 24" accessibilityLabel="Situm Explore"><Path d="M21 3 3 10.5l7.5 3L14 21 21 3Z" fill="#fff" /></Svg> }
type IconName = 'explore' | 'realtime' | 'recent' | 'settings'
function Icon({ name, size = 17 }: { name: IconName, size?: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'explore') return <Svg width={size} height={size} viewBox="0 0 24 24"><Path {...common} d="M12 2a10 10 0 1 0 10 10" /><Path {...common} d="m16 8-4 8-4-4 8-4Z" /></Svg>
  if (name === 'realtime') return <Svg width={size} height={size} viewBox="0 0 24 24"><Path {...common} d="M4.9 19.1a10 10 0 0 1 0-14.2M7.8 16.2a6 6 0 0 1 0-8.4" /><Circle {...common} cx="12" cy="12" r="2" /><Path {...common} d="M16.2 7.8a6 6 0 0 1 0 8.4M19.1 4.9a10 10 0 0 1 0 14.2" /></Svg>
  if (name === 'recent') return <Svg width={size} height={size} viewBox="0 0 24 24"><Path {...common} d="M3 12a9 9 0 1 0 3-6.7" /><Path {...common} d="M3 4v5h5M12 7v5l3 2" /></Svg>
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Path {...common} d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /><Circle {...common} cx="12" cy="12" r="4" /></Svg>
}
function NavItems({ activeTab, setActiveTab, compact = false, bottom = false }: { activeTab: string, setActiveTab: (tab: 'explore' | 'realtime' | 'recent' | 'settings') => void, compact?: boolean, bottom?: boolean }) { return <View style={[styles.nav, bottom && styles.navBottom]}>{(['explore', 'realtime', 'recent', 'settings'] as const).map(tab => <TouchableOpacity accessibilityRole="button" accessibilityLabel={tab} key={tab} style={[styles.navItem, bottom && styles.navItemBottom, compact && styles.navItemCompact, activeTab === tab && styles.navActive]} onPress={() => setActiveTab(tab)}><Icon name={tab} /><Text style={[styles.navText, compact && styles.navTextCompact, activeTab === tab && styles.navTextActive]}>{compact ? '' : `${tab[0]?.toUpperCase()}${tab.slice(1)}`}</Text></TouchableOpacity>)}</View> }
function HomeCard({ configuration }: { configuration: { positioningConfigured: boolean } | null }) { return <View style={styles.card}><Text style={styles.cardTitle}>Your workspace is ready</Text><Text style={styles.body}>The native foundation shares your existing account and owner-authorized workspace.</Text><View style={styles.status}><Text style={styles.statusDot}>{configuration?.positioningConfigured ? '●' : '○'}</Text><Text style={styles.statusText}>{configuration?.positioningConfigured ? 'Positioning authority configured' : 'Positioning setup is still required'}</Text></View></View> }
function Placeholder({ title, body }: { title: string, body: string }) { return <View style={styles.card}><Text style={styles.eyebrow}>FOUNDATION PLACEHOLDER</Text><Text style={styles.cardTitle}>{title}</Text><Text style={styles.body}>{body}</Text></View> }
function SettingsCard({ onLogout }: { onLogout: () => void }) { return <View style={styles.card}><Text style={styles.cardTitle}>Settings</Text><Text style={styles.body}>Session, workspace access, and device lifecycle are managed safely for this build.</Text><TouchableOpacity style={styles.button} onPress={onLogout}><Text style={styles.buttonText}>Sign out</Text></TouchableOpacity></View> }
function StateCard({ title, body, action }: { title: string, body: string, action?: () => void }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action ? <TouchableOpacity style={styles.button} onPress={action}><Text style={styles.buttonText}>Try again</Text></TouchableOpacity> : null}</View> }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fa' },
  shell: { flex: 1, flexDirection: 'row' },
  rail: { backgroundColor: '#fff', borderRightColor: '#e2e5e9', borderRightWidth: 1, padding: 16, width: 220 },
  compactRail: { paddingHorizontal: 8, width: 72 },
  brand: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  brandText: { color: '#111827', fontSize: 14, fontWeight: '700' },
  railSignOut: { marginTop: 'auto', padding: 10 },
  railSignOutText: { color: '#6a7380', fontSize: 12 },
  main: { flex: 1 },
  topbar: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.96)', borderBottomColor: '#e2e5e9', borderBottomWidth: 1, flexDirection: 'row', gap: 16, minHeight: 64, paddingHorizontal: 18 },
  crumb: { color: '#8b939e', fontSize: 13 },
  crumbStrong: { color: '#111827', fontWeight: '700' },
  flex: { flex: 1 },
  lifecycle: { color: '#6a7380', fontSize: 11, fontWeight: '700' },
  content: { alignSelf: 'center', maxWidth: 900, padding: 22, width: '100%' },
  nav: { gap: 4, marginTop: 28 },
  navBottom: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 0 },
  navItem: { borderRadius: 9, minHeight: 42, justifyContent: 'center', paddingHorizontal: 10 },
  navItemBottom: { alignItems: 'center', flex: 1, minHeight: 52, paddingHorizontal: 3 },
  navItemCompact: { alignItems: 'center', paddingHorizontal: 0 },
  navActive: { backgroundColor: '#eef0f2' },
  navText: { color: '#6a7380', fontSize: 12, fontWeight: '600' },
  navTextActive: { color: '#111827' },
  navTextCompact: { fontSize: 0 },
  bottom: { backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#e2e5e9', borderRadius: 14, borderWidth: 1, bottom: 10, left: 10, padding: 5, position: 'absolute', right: 10 },
  workspacePicker: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderRadius: 14, borderWidth: 1, padding: 16 },
  workspaceName: { color: '#111827', fontSize: 24, fontWeight: '800', marginTop: 5 },
  workspaceChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  choice: { borderColor: '#d6dbe0', borderRadius: 9, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 },
  choiceActive: { backgroundColor: '#111827', borderColor: '#111827' },
  choiceText: { color: '#555d67', fontSize: 12 },
  choiceTextActive: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderRadius: 14, borderWidth: 1, marginTop: 14, padding: 18 },
  cardTitle: { color: '#111827', fontSize: 18, fontWeight: '800', marginTop: 5 },
  status: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 18 },
  statusDot: { color: '#126d45', fontSize: 16 },
  statusText: { color: '#555d67', fontSize: 13 },
  container: { flex: 1, padding: 24, justifyContent: 'center', maxWidth: 720, width: '100%', alignSelf: 'center' },
  brandMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  loginBrandMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
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
