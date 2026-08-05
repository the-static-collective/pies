import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Upload, FileText, Volume2, Loader2, RefreshCw, Wand2, Play, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMPLE_REFLECTIONS } from '../data/initialEncounters';

interface VoiceInputCardProps {
  onProcessReflection: (transcript: string, audioBase64?: string, mimeType?: string) => Promise<void>;
  isLoading: boolean;
  onSaveUnprocessedLocally?: (transcript: string) => void;
  onOpenManualEntry?: () => void;
}

export const VoiceInputCard: React.FC<VoiceInputCardProps> = ({
  onProcessReflection,
  isLoading,
  onSaveUnprocessedLocally,
  onOpenManualEntry,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('audio/webm');
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition status:', e.error);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition setup issue:', err);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        } else {
          options = { mimeType: '' };
        }
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      setMimeType(recorder.mimeType || 'audio/webm');

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(500);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition start error:', e);
        }
      }
    } catch (err) {
      console.error('Failed to access microphone:', err);
      alert('Microphone permission or hardware access failed. You can type or click a story sample!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setMimeType(file.type || 'audio/webm');
    }
  };

  const handleSubmit = async () => {
    if (!transcript.trim() && !audioBlob) {
      alert('Please speak, type a reflection, or click a story sample first!');
      return;
    }

    let audioBase64: string | undefined;

    if (audioBlob) {
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const res = reader.result as string;
            // strip data url header
            const base64 = res.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
        });
        reader.readAsDataURL(audioBlob);
        audioBase64 = await base64Promise;
      } catch (err) {
        console.warn('Error encoding audio file:', err);
      }
    }

    await onProcessReflection(transcript, audioBase64, mimeType);
  };

  const handleApplyPreset = (sampleText: string) => {
    setTranscript(sampleText);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="voice-reflection-section" className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-600/10 border-2 border-amber-300/80 rounded-3xl p-6 shadow-lg relative overflow-hidden backdrop-blur-xs">
      {/* Decorative Pie Background Slice */}
      <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none text-9xl">
        🥧
      </div>

      <div className="relative z-10 space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 font-bold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Voice Storyteller & AI Extractor</span>
            </div>
            <h2 className="text-2xl font-serif font-extrabold text-amber-950 tracking-tight">
              Tell Paula About a Pie Delivery 🥧
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/80 font-sans mt-0.5">
              Speak naturally, type a memory, or pick a sample story. Gemini AI extracts recipient names, meals, needs, & gifts for your review!
            </p>
          </div>

          {onOpenManualEntry && (
            <button
              onClick={onOpenManualEntry}
              className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 self-start md:self-auto cursor-pointer"
            >
              ✍️ Prefer Manual Form?
            </button>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
            ✨ Click to load a sample story:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_REFLECTIONS.map((sample, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApplyPreset(sample.text)}
                className={`text-left p-3 rounded-2xl border transition-all text-xs cursor-pointer ${
                  transcript === sample.text
                    ? 'bg-amber-500 text-amber-950 font-semibold border-amber-600 shadow-md ring-2 ring-amber-400'
                    : 'bg-white/80 hover:bg-white text-stone-800 border-amber-200 hover:border-amber-400 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
                  <span>🥧 {sample.title}</span>
                  {transcript === sample.text && <CheckCircle2 className="w-3.5 h-3.5 text-amber-950" />}
                </div>
                <p className="line-clamp-2 text-[11px] text-stone-600 font-sans leading-relaxed">
                  {sample.text}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recording Controls & Mic Section */}
        <div className="bg-white/90 border border-amber-200/80 rounded-2xl p-5 shadow-inner space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Record Button & Timer */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {!isRecording ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-sm"
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Recording</span>
                </motion.button>
              ) : (
                <motion.button
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  onClick={stopRecording}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-sm ring-4 ring-rose-300"
                >
                  <MicOff className="w-5 h-5" />
                  <span>Stop ({formatTimer(recordingSeconds)})</span>
                </motion.button>
              )}

              {/* Upload Audio Option */}
              <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-semibold px-3.5 py-3 rounded-2xl transition-colors flex items-center gap-1.5 shrink-0">
                <Upload className="w-4 h-4 text-stone-600" />
                <span className="hidden sm:inline">Upload Audio</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Audio Preview if available */}
            {audioUrl && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl w-full sm:w-auto">
                <Volume2 className="w-4 h-4 text-amber-800" />
                <audio src={audioUrl} controls className="h-8 max-w-[200px]" />
              </div>
            )}
          </div>

          {/* Transcript Textarea */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-amber-950">
              <label className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-amber-800" />
                <span>Story Transcript / Notes</span>
              </label>
              {transcript && (
                <button
                  onClick={() => {
                    setTranscript('');
                    setAudioBlob(null);
                    setAudioUrl(null);
                  }}
                  className="text-stone-500 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. Shared 2 slices of peach pie with Mrs. Gable today. She mentioned she needs help lifting heavy boxes in her garage and offered fresh garden tomatoes..."
              className="w-full bg-amber-50/40 border border-amber-300/80 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans leading-relaxed"
            />
          </div>

          {/* Submit / Extract Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-amber-900/70 italic font-serif">
              ✨ Gemini AI processes this reflection into a structured proposal for your approval.
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onSaveUnprocessedLocally && transcript.trim() && (
                <button
                  type="button"
                  onClick={() => onSaveUnprocessedLocally(transcript)}
                  className="text-xs text-stone-600 hover:text-stone-900 font-medium underline px-2 py-1"
                >
                  Save Transcript Only
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={isLoading || (!transcript.trim() && !audioBlob)}
                className={`w-full sm:w-auto font-bold px-6 py-3 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isLoading || (!transcript.trim() && !audioBlob)
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Extracting Pie Story...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    <span>Bake Story into Ledger ✨</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
