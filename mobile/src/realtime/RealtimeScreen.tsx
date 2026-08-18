import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ApiError } from '../api/errors'
import type { SitumRealtimePosition } from '../../../shared/situm-realtime'
import type { WorkspaceContext } from '../workspaces/context'
import { filterRealtimePositions, formatSourceTime, normalizeRealtimeResponse, realtimePollIntervalMs, type RealtimeLoadState } from './state'
import { colors, radii } from '../ui/theme'
import type { LayoutMode } from '../ui/layout'

export function RealtimeScreen({ workspaces, lifecycle, layout = 'phone' }: { workspaces: WorkspaceContext, lifecycle: string, layout?: LayoutMode }) {
  const workspaceId = workspaces.selectedWorkspaceId
  const [positions, setPositions] = useState<SitumRealtimePosition[]>([])
  const [state, setState] = useState<RealtimeLoadState>('idle')
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [refreshNonce, setRefreshNonce] = useState(0)
  const [search, setSearch] = useState(''); const [buildingFilter, setBuildingFilter] = useState<number | null>(null)
  const buildings = useMemo(() => [...new Set(positions.map(position => position.buildingId))], [positions])
  const filteredPositions = useMemo(() => filterRealtimePositions(positions, buildingFilter, search), [positions, buildingFilter, search])
  const selected = useMemo(() => filteredPositions.find(position => position.id === selectedId) ?? filteredPositions[0] ?? null, [filteredPositions, selectedId])

  const load = useCallback(async (signal: AbortSignal) => {
    if (!workspaceId || lifecycle !== 'active') return
    setState('loading'); setError('')
    try {
      const response = await workspaces.auth.api.get<unknown>(`/api/workspaces/${workspaceId}/situm/realtime`, { signal, timeoutMs: 10_000 })
      const nextPositions = normalizeRealtimeResponse(response)
      if (signal.aborted) return
      setPositions(nextPositions); setSelectedId(current => nextPositions.some(position => position.id === current) ? current : nextPositions[0]?.id ?? null); setState(nextPositions.length ? 'ready' : 'empty')
    } catch (cause: unknown) {
      if (signal.aborted) return
      if (cause instanceof ApiError && (cause.code === 'UNAUTHENTICATED' || cause.code === 'FORBIDDEN')) { setPositions([]); setSelectedId(null) }
      setState('error'); setError(cause instanceof ApiError ? cause.message : 'Realtime positions are unavailable.')
    }
  }, [lifecycle, workspaceId, workspaces])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    if (lifecycle !== 'active') return () => controller.abort()
    const interval = setInterval(() => { void load(controller.signal) }, realtimePollIntervalMs)
    return () => { controller.abort(); clearInterval(interval) }
  }, [lifecycle, load, refreshNonce])

  if (!workspaceId) return <StateCard title="Select a workspace" body="Realtime loads only after an owned workspace is selected." />
  if (state === 'loading' && !positions.length) return <LoadingState />
  if (state === 'error' && !positions.length) return <StateCard title="Realtime unavailable" body={error || 'Check your connection and try again.'} action={() => setRefreshNonce(value => value + 1)} />
  return <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
    <View style={styles.header}><Text style={styles.eyebrow}>OPERATIONS</Text><Text style={styles.title}>Realtime positions</Text><Text style={styles.muted}>Latest device-produced positions reported for this workspace.</Text></View>
    <View style={styles.notice}><Text style={styles.noticeTitle}>Reported positions, not online presence</Text><Text style={styles.muted}>Source time and accuracy stay visible. No online, idle, or offline state is inferred.</Text></View>
    <View style={styles.toolbar}><View style={styles.filterRow}>{buildings.map(building => <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: buildingFilter === building }} key={building} style={[styles.filter, buildingFilter === building && styles.filterSelected]} onPress={() => setBuildingFilter(current => current === building ? null : building)}><Text style={[styles.filterText, buildingFilter === building && styles.filterTextSelected]}>Building {building}</Text></TouchableOpacity>)}</View><TouchableOpacity accessibilityRole="button" style={styles.smallButton} onPress={() => setRefreshNonce(value => value + 1)}><Text style={styles.smallButtonText}>Refresh</Text></TouchableOpacity></View>
    <TextInput accessibilityLabel="Search realtime positions" placeholder="Search device ID or floor" placeholderTextColor={colors.muted} value={search} onChangeText={setSearch} style={styles.search} />
    {state === 'error' ? <View style={styles.warning}><Text style={styles.warningText}>{error || 'The latest refresh failed; showing the last successful positions.'}</Text></View> : null}
    {state === 'empty' ? <StateCard title="No positions reported" body="This workspace has no current device-position records." /> : <View style={[styles.columns, layout !== 'phone' && styles.columnsWide]}>
      <View style={styles.list}><Text style={styles.listHeading}>{filteredPositions.length} {filteredPositions.length === 1 ? 'position' : 'positions'}</Text><ScrollView nestedScrollEnabled contentContainerStyle={styles.listContent}>{filteredPositions.map(position => <PositionRow key={position.id} position={position} selected={position.id === selected?.id} onPress={() => setSelectedId(position.id)} />)}</ScrollView></View>
      {selected ? <PositionDetail position={selected} /> : null}
    </View>}
  </ScrollView>
}

function PositionRow({ position, selected, onPress }: { position: SitumRealtimePosition, selected: boolean, onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Position ${position.deviceId || position.id}`} accessibilityState={{ selected }} onPress={onPress} style={[styles.row, selected && styles.rowSelected]}><View style={styles.rowBody}><Text style={styles.rowTitle}>{position.deviceId || `Position ${position.id}`}</Text><Text style={styles.rowMeta}>Building {position.buildingId} · Floor {position.floorId}</Text><Text style={styles.rowMeta}>Accuracy {position.accuracy.toFixed(1)} m · Source {formatSourceTime(position.time)}</Text></View></TouchableOpacity>
}

function PositionDetail({ position }: { position: SitumRealtimePosition }) {
  return <View style={styles.detail}><Text style={styles.eyebrow}>POSITION DETAIL</Text><Text style={styles.detailTitle}>{position.deviceId || `Position ${position.id}`}</Text><DetailRow label="Source time" value={formatSourceTime(position.time)} /><DetailRow label="Building / floor" value={`${position.buildingId} / ${position.floorId}`} /><DetailRow label="Accuracy" value={`${position.accuracy.toFixed(1)} m`} /><DetailRow label="Coordinates" value={`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`} /><Text style={styles.detailNote}>Coordinates are shown as reported by the workspace Realtime service. Map markers and remote focus are not enabled without a proven native capability.</Text></View>
}

function DetailRow({ label, value }: { label: string, value: string }) { return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View> }
function LoadingState() { return <View style={styles.loading}><ActivityIndicator color="#111827" /><Text style={styles.muted}>Loading reported positions…</Text></View> }
function StateCard({ title, body, action }: { title: string, body: string, action?: () => void }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{body}</Text>{action ? <TouchableOpacity style={styles.smallButton} onPress={action}><Text style={styles.smallButtonText}>Try again</Text></TouchableOpacity> : null}</View> }

const styles = StyleSheet.create({ screen: { flex: 1 }, scrollContent: { paddingBottom: 20 }, loading: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' }, header: { marginBottom: 12 }, eyebrow: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, title: { color: colors.ink, fontSize: 25, fontWeight: '800', marginTop: 4 }, muted: { color: colors.tertiary, fontSize: 13, lineHeight: 20, marginTop: 5 }, notice: { backgroundColor: colors.infoSoft, borderColor: '#cfe0ff', borderRadius: radii.card, borderWidth: 1, marginBottom: 12, padding: 14 }, noticeTitle: { color: colors.info, fontSize: 13, fontWeight: '800' }, toolbar: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', marginBottom: 8 }, filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flexShrink: 1 }, filter: { borderColor: colors.strongBorder, borderRadius: radii.control, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 7 }, filterSelected: { backgroundColor: colors.action, borderColor: colors.action }, filterText: { color: colors.secondary, fontSize: 11 }, filterTextSelected: { color: '#fff', fontWeight: '700' }, search: { backgroundColor: colors.surface, borderColor: colors.strongBorder, borderRadius: radii.control, borderWidth: 1, color: colors.ink, fontSize: 13, minHeight: 44, paddingHorizontal: 12, marginBottom: 10 }, smallButton: { alignItems: 'center', backgroundColor: colors.action, borderRadius: radii.control, justifyContent: 'center', minHeight: 40, paddingHorizontal: 12 }, smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' }, warning: { backgroundColor: colors.warningSoft, borderColor: '#f0d49b', borderRadius: radii.control, borderWidth: 1, marginBottom: 10, padding: 10 }, warningText: { color: colors.warning, fontSize: 12 }, columns: { gap: 10 }, columnsWide: { flexDirection: 'row' }, list: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.card, borderWidth: 1, flex: 1, maxHeight: 460, minWidth: 0 }, listHeading: { color: colors.tertiary, fontSize: 11, fontWeight: '700', paddingHorizontal: 14, paddingTop: 13 }, listContent: { padding: 8 }, row: { alignItems: 'flex-start', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: 10, padding: 11 }, rowSelected: { backgroundColor: colors.infoSoft, borderRadius: radii.control }, rowBody: { flex: 1 }, rowTitle: { color: colors.ink, fontSize: 13, fontWeight: '800' }, rowMeta: { color: colors.tertiary, fontSize: 11, marginTop: 4 }, detail: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.card, borderWidth: 1, flex: 1, minWidth: 0, padding: 14 }, detailTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginBottom: 8, marginTop: 4 }, detailRow: { borderTopColor: colors.border, borderTopWidth: 1, paddingVertical: 9 }, detailLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' }, detailValue: { color: colors.ink, fontSize: 13, marginTop: 3 }, detailNote: { color: colors.tertiary, fontSize: 11, lineHeight: 17, marginTop: 9 }, card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.panel, borderWidth: 1, marginTop: 14, padding: 16 }, cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginTop: 5 } })
