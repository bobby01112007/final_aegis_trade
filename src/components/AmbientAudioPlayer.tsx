import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Music, Volume2, ShieldAlert, MousePointer, Power, HelpCircle, AudioLines, Info } from 'lucide-react';
import { APP_TRANSLATIONS } from '../translations';

interface ScalePreset {
  name: string;
  desc: string;
  notes: string[];
  freqs: number[];
  color: string;
  waveType: 'sine' | 'triangle' | 'sine-triangle';
  decay: number;
}

const SCALE_PRESETS: ScalePreset[] = [
  {
    name: "Golden Chimes",
    desc: "Crystalline pentatonic bell tones mapped to the horizontal horizon.",
    notes: ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5", "C6"],
    freqs: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50],
    color: '#d4af37', // gold
    waveType: 'sine',
    decay: 0.7
  },
  {
    name: "Red River Harp",
    desc: "Mysterious wind melody loops with warm resonant reflections.",
    notes: ["A3", "C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"],
    freqs: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00],
    color: '#10b981', // emerald
    waveType: 'triangle',
    decay: 1.1
  },
  {
    name: "Cyber Echoes",
    desc: "Dual wave frequency blips custom-made for spatial radar layouts.",
    notes: ["E4", "G#4", "B4", "C#5", "E5", "G#5", "B5", "C#6", "E6"],
    freqs: [329.63, 415.30, 493.88, 554.37, 659.25, 830.61, 987.77, 1108.73, 1318.51],
    color: '#3b82f6', // bright blue
    waveType: 'sine-triangle',
    decay: 0.35
  }
];

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface AmbientAudioPlayerProps {
  language?: 'vi' | 'en';
}

export const AmbientAudioPlayer: React.FC<AmbientAudioPlayerProps> = ({ language = 'vi' }) => {
  const t = APP_TRANSLATIONS[language].audio;
  const [enabled, setEnabled] = useState(false);
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [lastTriggeredNote, setLastTriggeredNote] = useState<string>('---');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Track parameters to prevent flooding
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);

  const activePreset = SCALE_PRESETS[activePresetIdx];

  // Initialize Web Audio safely on first interaction/toggle
  const handleToggleEnable = async () => {
    if (!enabled) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
          await audioCtxRef.current.resume();
        }
        setEnabled(true);
      } catch (err) {
        console.error("Failed to initialize Acoustic Cursor Engine:", err);
      }
    } else {
      setEnabled(false);
      setLastTriggeredNote('---');
    }
  };

  // Sound synthesis function
  const playChimeNode = (freq: number, x: number, y: number, noteLabel: string) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const preset = SCALE_PRESETS[activePresetIdx];
    const now = ctx.currentTime;

    // Create volume node for the chime
    const oscGain = ctx.createGain();
    
    // Create soft filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    
    // Map vertical Y (0 to window.innerHeight) to filter cutoff frequency (lower physical point -> lower cutoff)
    const pctY = 1 - (y / window.innerHeight);
    const filterFreq = 350 + (pctY * 1800);
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.Q.setValueAtTime(1.8, now);

    // Map horizontal X to Stereo Pan (if browser supports it)
    const pctX = x / window.innerWidth;
    let finalNode: AudioNode = filter;

    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(pctX * 2 - 1, now); // Stereo spatialization
      filter.connect(panner);
      finalNode = panner;
    }

    finalNode.connect(oscGain);
    oscGain.connect(ctx.destination);

    // Pluck Envelope
    const pluckVolume = volume * 0.12 * (0.3 + pctY * 0.7); // slightly louder chimes higher up
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(pluckVolume, now + 0.012);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + preset.decay);

    // Oscillator 1
    if (preset.waveType === 'sine' || preset.waveType === 'sine-triangle') {
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.connect(filter);
      osc1.start(now);
      osc1.stop(now + preset.decay + 0.05);
    }

    // Oscillator 2
    if (preset.waveType === 'triangle' || preset.waveType === 'sine-triangle') {
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, now);
      
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(preset.waveType === 'sine-triangle' ? 0.45 : 0.9, now);
      
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      
      osc2.start(now);
      osc2.stop(now + preset.decay + 0.05);
    }

    setLastTriggeredNote(noteLabel);
  };

  // Cursor Tracker Effect
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const now = Date.now();

      const dx = clientX - lastXRef.current;
      const dy = clientY - lastYRef.current;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Trigger condition: mouse moved 140px AND 160ms has passed since the last note
      if (distance > 130 && now - lastTimeRef.current > 160) {
        const pctX = clientX / window.innerWidth;
        const freqs = activePreset.freqs;
        const notes = activePreset.notes;
        
        // Select matching note from pentatonic array
        const noteIdx = Math.min(Math.floor(pctX * freqs.length), freqs.length - 1);
        const freq = freqs[noteIdx];
        const noteName = notes[noteIdx];

        // Synthesize audio chime
        playChimeNode(freq, clientX, clientY, noteName);

        // Generate particle
        const pid = `${now}-${Math.random()}`;
        const newParticle: Particle = {
          id: pid,
          x: clientX,
          y: clientY,
          color: activePreset.color,
          size: 8 + Math.random() * 12
        };
        
        setParticles(prev => [...prev, newParticle].slice(-10));
        
        // Auto-cleanup particles
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== pid));
        }, 850);

        // Save position
        lastXRef.current = clientX;
        lastYRef.current = clientY;
        lastTimeRef.current = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled, activePresetIdx, volume]);

  // Clean Audio Context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative pointer-events-auto">
      {/* Visual Cursor Particle Layer rendered outside in raw overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0.9, x: p.x - p.size / 2, y: p.y - p.size / 2, scale: 0.5 }}
              animate={{ opacity: 0, y: p.y - 45, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="absolute rounded-full border pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                borderColor: `${p.color}44`,
                boxShadow: `0 0 10px ${p.color}`,
                background: `radial-gradient(circle, ${p.color}22 0%, transparent 70%)`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Controller Widget Pill */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={`h-11 px-4 rounded-full border flex items-center gap-2.5 shadow-lg backdrop-blur-md transition-all duration-300 group cursor-pointer ${
            enabled 
              ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-white shadow-[#d4af37]/5' 
              : 'bg-black/80 border-white/10 text-white/70 hover:text-white'
          }`}
        >
          {enabled ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="relative flex items-center justify-center"
            >
              <MousePointer className="w-4 h-4 text-[#d4af37]" />
              <span className="absolute inset-0 bg-[#d4af37]/35 blur rounded-full scale-110" />
            </motion.div>
          ) : (
            <MousePointer className="w-4 h-4 text-white/50 group-hover:scale-110 transition-transform" />
          )}
          
          <span className="text-xs font-mono font-medium tracking-wide">
            {enabled ? `${t.cursorActive}: ${lastTriggeredNote}` : t.cursorMuted}
          </span>

          <span className={`text-[9px] font-mono select-none px-1.5 py-0.5 rounded ${
            enabled ? 'bg-[#d4af37]/35 text-white' : 'bg-white/10 text-white/60'
          }`}>
            {enabled ? (language === 'vi' ? 'BẬT' : 'ACTIVE') : (language === 'vi' ? 'TẮT' : 'MUTED')}
          </span>
        </button>

        {/* Quick Power Toggle */}
        <button
          onClick={handleToggleEnable}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            enabled 
              ? 'bg-[#d4af37]/20 border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/30' 
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
          }`}
          title={enabled ? (language === 'vi' ? "Tắt âm trỏ chuột" : "Mute Cursor Sound") : (language === 'vi' ? "Bật âm trỏ chuột" : "Activate Musical Cursor")}
        >
          <Power className="w-4 h-4" />
        </button>
      </div>

      {/* Control Panel Dropdown Drawer */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-14 left-0 w-80 bg-[#070e14] border border-white/10 rounded-2xl shadow-2xl p-5 z-[100] text-left selection:bg-white/10 select-none overflow-hidden"
          >
            {/* Ambient Background Gold Mesh */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 blur-3xl rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#d4af37] uppercase">{t.cursorHelp}</span>
              </div>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="text-[10px] font-mono text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>

            {/* Information box */}
            <p className="text-[10.5px] text-muted-foreground leading-relaxed mb-4">
              {t.description}
            </p>

            {/* Master Activation State */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 mb-4 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase">{t.audioGen}</h4>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{t.audioGenSub}</p>
                </div>
                <button
                  onClick={handleToggleEnable}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    enabled 
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20 hover:bg-rose-500/30' 
                      : 'bg-[#d4af37]/20 text-white border border-[#d4af37]/30 hover:bg-[#d4af37]/35'
                  }`}
                >
                  {enabled ? t.muteBtn : t.activateBtn}
                </button>
              </div>

              {/* Frequency wave indicators */}
              {enabled && (
                <div className="h-6 flex items-center justify-center gap-1.5 bg-black/40 rounded-lg px-2 border border-white/[0.04] mt-3.5">
                  <AudioLines className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#d4af37]/90 uppercase tracking-widest">
                    {language === 'vi' ? 'Đã khởi tạo Synth — Di chuyển Chuột' : 'Synthesizer Loaded — Move Mouse'}
                  </span>
                </div>
              )}
            </div>

            {/* Control Slider */}
            <div className="space-y-3 mb-5 relative z-10">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <Volume2 className="w-3 h-3" /> {language === 'vi' ? 'Âm lượng phát' : 'Synthesis Volume'}
                  </span>
                  <span className="text-white/80 font-bold">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#d4af37] cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Sound Presets List */}
            <div className="space-y-2 relative z-10 pb-1">
              <div className="flex items-center gap-1 mb-2 text-[10px] font-mono text-white/40">
                <Music className="w-3 h-3" />
                <span>{t.presetsTitle} ({SCALE_PRESETS.length})</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {SCALE_PRESETS.map((pct, idx) => {
                  const isSelected = activePresetIdx === idx;
                  const localizedPreset = t.presets[idx] || {};
                  return (
                    <button
                      key={pct.name}
                      onClick={() => {
                        setActivePresetIdx(idx);
                        setLastTriggeredNote('---');
                      }}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col ${
                        isSelected 
                          ? 'bg-white/[0.04] border-[#d4af37]/35 text-white' 
                          : 'bg-transparent border-transparent hover:border-white/[0.06] hover:bg-[#white]/[0.02] text-white/60 hover:text-white/90'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono">{localizedPreset.name || pct.name}</span>
                        {isSelected && (
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: pct.color }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug mt-1 select-none font-sans">
                        {localizedPreset.desc || pct.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[9px] font-mono text-white/30 flex justify-between tracking-wide select-none">
              <span>MUTUAL COORDINATES</span>
              <span>100% SECURE SYNTH</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
