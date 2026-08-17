import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ApiError } from '../api/errors'
import type { SitumRealtimePosition } from '../../../shared/situm-realtime'
import type { WorkspaceContext } from '../workspaces/context'
import { formatSourceTime, normalizeRealtimeResponse, realtimeFreshness, realtimePollIntervalMs, type RealtimeFreshness, type RealtimeLoadState } from './state'

export function RealtimeScreen({ workspaces, lifecycle }: { workspaces: WorkspaceContext, lifecycle: string }) {
  const workspaceId = workspaces.selectedWorkspaceId
  const [positions, setPositions] = useState<SitumRealtimePosition[]>([])
  const [state, setState] = useState<RealtimeLoadState>('idle')
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [refreshNonce, setRefreshNonce] = useState(0)
  const selected = useMemo(() => positions.find(position => position.id === selectedId) ?? positions[0] ?? null, [positions, selectedId])

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
  return <View style={styles.screen}>
    <View style={styles.header}><Text style={styles.eyebrow}>OPERATIONS</Text><Text style={styles.title}>Realtime positions</Text><Text style={styles.muted}>Latest device-produced positions reported for this workspace.</Text></View>
    <View style={styles.notice}><Text style={styles.noticeTitle}>Reported positions, not online presence</Text><Text style={styles.muted}>Source time and accuracy stay visible. No online, idle, or offline state is inferred.</Text></View>
    <View style={styles.toolbar}><Text style={styles.count}>{positions.length} {positions.length === 1 ? 'position' : 'positions'}</Text><TouchableOpacity style={styles.smallButton} onPress={() => setRefreshNonce(value => value + 1)}><Text style={styles.smallButtonText}>Refresh</Text></TouchableOpacity></View>
    {state === 'error' ? <View style={styles.warning}><Text style={styles.warningText}>{error || 'The latest refresh failed; showing the last successful positions.'}</Text></View> : null}
    {state === 'empty' ? <StateCard title="No positions reported" body="This workspace has no current device-position records." /> : <View style={styles.columns}>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>{positions.map(position => <PositionRow key={position.id} position={position} selected={position.id === selected?.id} onPress={() => setSelectedId(position.id)} />)}</ScrollView>
      {selected ? <PositionDetail position={selected} /> : null}
    </View>}
  </View>
}

function PositionRow({ position, selected, onPress }: { position: SitumRealtimePosition, selected: boolean, onPress: () => void }) {
  const freshness = realtimeFreshness(position.time)
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Position ${position.deviceId || position.id}`} onPress={onPress} style={[styles.row, selected && styles.rowSelected]}><View style={[styles.dot, freshness === 'stale' && styles.dotStale, freshness === 'older' && styles.dotOlder]} /><View style={styles.rowBody}><Text style={styles.rowTitle}>{position.deviceId || `Position ${position.id}`}</Text><Text style={styles.rowMeta}>Building {position.buildingId} · Floor {position.floorId}</Text><Text style={styles.rowMeta}>Accuracy {position.accuracy.toFixed(1)} m · {freshnessLabel(freshness)}</Text></View></TouchableOpacity>
}

function PositionDetail({ position }: { position: SitumRealtimePosition }) {
  const freshness = realtimeFreshness(position.time)
  return <View style={styles.detail}><Text style={styles.eyebrow}>POSITION DETAIL</Text><Text style={styles.detailTitle}>{position.deviceId || `Position ${position.id}`}</Text><DetailRow label="Source time" value={formatSourceTime(position.time)} /><DetailRow label="Record age" value={freshnessLabel(freshness)} /><DetailRow label="Building / floor" value={`${position.buildingId} / ${position.floorId}`} /><DetailRow label="Accuracy" value={`${position.accuracy.toFixed(1)} m`} /><DetailRow label="Coordinates" value={`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`} /><Text style={styles.detailNote}>Coordinates are shown as reported by the workspace Realtime service. Map markers and remote focus are not enabled without a proven native capability.</Text></View>
}

function DetailRow({ label, value }: { label: string, value: string }) { return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View> }
function freshnessLabel(value: RealtimeFreshness) { return value === 'fresh' ? 'Recently reported' : value === 'older' ? 'Older source record' : value === 'stale' ? 'Stale source record' : 'Source time unavailable' }
function LoadingState() { return <View style={styles.loading}><ActivityIndicator color="#111827" /><Text style={styles.muted}>Loading reported positions…</Text></View> }
function StateCard({ title, body, action }: { title: string, body: string, action?: () => void }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{body}</Text>{action ? <TouchableOpacity style={styles.smallButton} onPress={action}><Text style={styles.smallButtonText}>Try again</Text></TouchableOpacity> : null}</View> }

const styles = StyleSheet.create({ screen: { flex: 1 }, loading: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' }, header: { marginBottom: 12 }, eyebrow: { color: '#8b939e', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, title: { color: '#111827', fontSize: 25, fontWeight: '800', marginTop: 4 }, muted: { color: '#6a7380', fontSize: 13, lineHeight: 20, marginTop: 5 }, notice: { backgroundColor: '#eef5ff', borderColor: '#cfe0ff', borderRadius: 12, borderWidth: 1, marginBottom: 10, padding: 12 }, noticeTitle: { color: '#173b70', fontSize: 13, fontWeight: '800' }, toolbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }, count: { color: '#555d67', fontSize: 12, fontWeight: '700' }, smallButton: { alignItems: 'center', backgroundColor: '#111827', borderRadius: 8, justifyContent: 'center', minHeight: 38, paddingHorizontal: 12 }, smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' }, warning: { backgroundColor: '#fff7e8', borderColor: '#f0d49b', borderRadius: 10, borderWidth: 1, marginBottom: 10, padding: 10 }, warningText: { color: '#805b10', fontSize: 12 }, columns: { flex: 1, gap: 10 }, list: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderRadius: 12, borderWidth: 1, maxHeight: 330 }, listContent: { padding: 8 }, row: { alignItems: 'flex-start', borderBottomColor: '#eef0f2', borderBottomWidth: 1, flexDirection: 'row', gap: 10, padding: 11 }, rowSelected: { backgroundColor: '#eef5ff', borderRadius: 9 }, dot: { backgroundColor: '#168754', borderRadius: 7, height: 10, marginTop: 4, width: 10 }, dotOlder: { backgroundColor: '#d59a16' }, dotStale: { backgroundColor: '#a8afb8' }, rowBody: { flex: 1 }, rowTitle: { color: '#111827', fontSize: 13, fontWeight: '800' }, rowMeta: { color: '#6a7380', fontSize: 11, marginTop: 4 }, detail: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderRadius: 12, borderWidth: 1, padding: 14 }, detailTitle: { color: '#111827', fontSize: 18, fontWeight: '800', marginBottom: 8, marginTop: 4 }, detailRow: { borderTopColor: '#eef0f2', borderTopWidth: 1, paddingVertical: 9 }, detailLabel: { color: '#8b939e', fontSize: 11, fontWeight: '700' }, detailValue: { color: '#111827', fontSize: 13, marginTop: 3 }, detailNote: { color: '#6a7380', fontSize: 11, lineHeight: 17, marginTop: 9 }, card: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderRadius: 14, borderWidth: 1, marginTop: 14, padding: 16 }, cardTitle: { color: '#111827', fontSize: 18, fontWeight: '800', marginTop: 5 } })
