import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>S</Text></View>
        <Text style={styles.eyebrow}>SITUM EXPLORE</Text>
        <Text style={styles.title}>Native foundation</Text>
        <Text style={styles.body}>The secure mobile workspace is ready for the next feature phases.</Text>
        <View style={styles.note}><Text style={styles.noteTitle}>Development build</Text><Text style={styles.noteBody}>Map and Realtime capabilities will appear after their evidence-backed implementation phases.</Text></View>
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
  note: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 28 },
  noteTitle: { color: '#111827', fontSize: 14, fontWeight: '700' },
  noteBody: { color: '#6a7380', fontSize: 13, lineHeight: 19, marginTop: 6 },
})
