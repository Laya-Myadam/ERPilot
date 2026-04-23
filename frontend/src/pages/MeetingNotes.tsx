import { useRef, useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { extractMeetingNotes, transcribeAudio } from '../api/client'
import { NotebookPen, ChevronDown, Mic, MicOff, Loader2 } from 'lucide-react'

const MEETING_TYPES = ['Client Discovery Call', 'Project Status Update', 'Technical Design Session', 'UAT Review', 'Go-Live Planning', 'Executive Steering', 'Internal Team Sync']
const SAMPLE = `John (Denovo PM): Ok let's get started. Sarah, can you give us an update on the GL configuration?

Sarah (Consultant): Yes, we finished setting up the chart of accounts yesterday. There are 3 AAIs that still need client sign-off - GLBA, GLG, and GLC.

Mike (Client): I'll get those approved by Thursday. Also we have a concern about the period 13 setup for year-end.

Sarah: Good point. We need to schedule a separate call for that. I'd say by end of next week.

John: Ok, Mike can you own the AAI approval by Thursday? And Sarah, book a period 13 session for next Friday with Mike's team.

Mike: Yes confirmed. Also, we noticed the AP voucher aging report isn't pulling correctly. Something with the date range filter.

Sarah: I'll look at that today. Probably a processing option issue in P03B2002.

John: Great. Our next status call is in two weeks. I'll send the invite. Any blockers?

Mike: Resource availability during UAT week - we only have 2 people available instead of 5.

John: That's a risk. Let's flag it and adjust the UAT timeline. I'll update the project plan.`

type RecordState = 'idle' | 'recording' | 'transcribing'

export default function MeetingNotes() {
  const [transcript, setTranscript] = useState(SAMPLE)
  const [meetingType, setMeetingType] = useState('Project Status Update')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [recordError, setRecordError] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const run = async () => {
    if (!transcript.trim()) return
    setLoading(true); setOutput('')
    const res = await extractMeetingNotes(transcript, meetingType)
    setOutput(res.extracted)
    setLoading(false)
  }

  const startRecording = async () => {
    setRecordError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordState('transcribing')
        try {
          const res = await transcribeAudio(blob)
          setTranscript(prev => prev ? prev + '\n\n' + res.transcript : res.transcript)
        } catch {
          setRecordError('Transcription failed. Check that the backend is running.')
        }
        setRecordState('idle')
      }
      mr.start()
      mediaRecorderRef.current = mr
      setRecordState('recording')
    } catch {
      setRecordError('Microphone access denied. Please allow microphone permission.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
  }

  const recordLabel: Record<RecordState, string> = {
    idle: 'Record Audio',
    recording: 'Stop Recording',
    transcribing: 'Transcribing...',
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Meeting Notes → Actions" subtitle="Paste transcript or record audio — AI extracts tasks, owners, and decisions" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <label className="text-xs text-text-muted font-medium block mb-2">Meeting Type</label>
            <div className="relative">
              <select value={meetingType} onChange={e => setMeetingType(e.target.value)}
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Voice recorder */}
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-accent-purple" />
                <span className="text-xs text-text-muted font-medium">Voice Recording</span>
              </div>
              {recordState === 'recording' && (
                <span className="flex items-center gap-1.5 text-xs text-accent-red font-medium">
                  <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
                  Recording...
                </span>
              )}
            </div>
            <button
              onClick={recordState === 'recording' ? stopRecording : startRecording}
              disabled={recordState === 'transcribing'}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                recordState === 'recording'
                  ? 'bg-accent-red/10 border-accent-red/40 text-accent-red hover:bg-accent-red/20'
                  : recordState === 'transcribing'
                  ? 'bg-bg-hover border-border-dim text-text-muted cursor-not-allowed'
                  : 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/20'
              }`}
            >
              {recordState === 'transcribing'
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : recordState === 'recording'
                ? <MicOff className="w-4 h-4" />
                : <Mic className="w-4 h-4" />
              }
              {recordLabel[recordState]}
            </button>
            {recordError && <p className="text-xs text-accent-red mt-2">{recordError}</p>}
            <p className="text-[10px] text-text-muted mt-2">Transcribed text is appended to the transcript below</p>
          </div>

          <div className="flex-1 bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
              <div className="flex items-center gap-2">
                <NotebookPen className="w-4 h-4 text-text-muted" />
                <span className="text-xs text-text-muted font-medium">Meeting Transcript</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setTranscript('')} className="text-xs text-text-muted hover:text-accent-red transition-colors">Clear</button>
                <button onClick={() => setTranscript(SAMPLE)} className="text-xs text-accent-cyan hover:underline">Load Sample</button>
              </div>
            </div>
            <textarea value={transcript} onChange={e => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here, or record audio above to auto-fill..."
              className="flex-1 p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none" />
          </div>

          <button onClick={run} disabled={!transcript.trim() || loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Extracting...' : 'Extract Actions & Decisions'}
          </button>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Action items table, decisions, open questions, and next meeting agenda will appear here" />
      </div>
    </div>
  )
}
