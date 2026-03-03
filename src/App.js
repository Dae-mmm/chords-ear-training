import React, { useState, useRef } from 'react';
import { Play, Check, RefreshCw, Volume2, AlertCircle, Clock, Music, Flame, Trophy } from 'lucide-react';

// Frequenze delle note per l'AudioContext
const FREQUENCIES = {
  'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'Db5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'Gb5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77
};

// Layout della tastiera (2 ottave)
const PIANO_KEYS = [
  { id: 'C4', type: 'white', label: 'Do' }, { id: 'Db4', type: 'black', label: 'Do#' },
  { id: 'D4', type: 'white', label: 'Re' }, { id: 'Eb4', type: 'black', label: 'Re#' },
  { id: 'E4', type: 'white', label: 'Mi' },
  { id: 'F4', type: 'white', label: 'Fa' }, { id: 'Gb4', type: 'black', label: 'Fa#' },
  { id: 'G4', type: 'white', label: 'Sol' }, { id: 'Ab4', type: 'black', label: 'Sol#' },
  { id: 'A4', type: 'white', label: 'La' }, { id: 'Bb4', type: 'black', label: 'La#' },
  { id: 'B4', type: 'white', label: 'Si' },
  { id: 'C5', type: 'white', label: 'Do' }, { id: 'Db5', type: 'black', label: 'Do#' },
  { id: 'D5', type: 'white', label: 'Re' }, { id: 'Eb5', type: 'black', label: 'Re#' },
  { id: 'E5', type: 'white', label: 'Mi' },
  { id: 'F5', type: 'white', label: 'Fa' }, { id: 'Gb5', type: 'black', label: 'Fa#' },
  { id: 'G5', type: 'white', label: 'Sol' }, { id: 'Ab5', type: 'black', label: 'Sol#' },
  { id: 'A5', type: 'white', label: 'La' }, { id: 'Bb5', type: 'black', label: 'La#' },
  { id: 'B5', type: 'white', label: 'Si' }
];

// Catalogo degli accordi diviso per categorie
const CHORD_CATEGORIES = {
  'Principiante': [
    { name: 'Do Maggiore', notes: ['C4', 'E4', 'G4'] },
    { name: 'Sol Maggiore', notes: ['G4', 'B4', 'D5'] },
    { name: 'Re Maggiore', notes: ['D4', 'Gb4', 'A4'] },
    { name: 'La Maggiore', notes: ['A4', 'Db5', 'E5'] },
    { name: 'Mi Maggiore', notes: ['E4', 'Ab4', 'B4'] },
    { name: 'Fa Maggiore', notes: ['F4', 'A4', 'C5'] },
    { name: 'Sib Maggiore', notes: ['Bb4', 'D5', 'F5'] },
    { name: 'Mib Maggiore', notes: ['Eb4', 'G4', 'Bb4'] },
    { name: 'La Minore', notes: ['A4', 'C5', 'E5'] },
    { name: 'Mi Minore', notes: ['E4', 'G4', 'B4'] },
    { name: 'Si Minore', notes: ['B4', 'D5', 'Gb5'] },
    { name: 'Fa# Minore', notes: ['Gb4', 'A4', 'Db5'] },
    { name: 'Do# Minore', notes: ['Db4', 'E4', 'Ab4'] },
    { name: 'Re Minore', notes: ['D4', 'F4', 'A4'] },
    { name: 'Sol Minore', notes: ['G4', 'Bb4', 'D5'] },
    { name: 'Do Minore', notes: ['C4', 'Eb4', 'G4'] }
  ],
  'Intermedio': [
    { name: 'Do sus4', notes: ['C4', 'F4', 'G4'] },
    { name: 'Re sus4', notes: ['D4', 'G4', 'A4'] },
    { name: 'Mi sus4', notes: ['E4', 'A4', 'B4'] },
    { name: 'Sol sus4', notes: ['G4', 'C5', 'D5'] },
    { name: 'La sus4', notes: ['A4', 'D5', 'E5'] },
    { name: 'Do sus2', notes: ['C4', 'D4', 'G4'] },
    { name: 'Re sus2', notes: ['D4', 'E4', 'A4'] },
    { name: 'Fa sus2', notes: ['F4', 'G4', 'C5'] },
    { name: 'Do Aumentato', notes: ['C4', 'E4', 'Ab4'] },
    { name: 'Fa Aumentato', notes: ['F4', 'A4', 'Db5'] },
    { name: 'Sol Aumentato', notes: ['G4', 'B4', 'Eb5'] },
    { name: 'Si Diminuito', notes: ['B4', 'D5', 'F5'] },
    { name: 'Fa# Diminuito', notes: ['Gb4', 'A4', 'C5'] },
    { name: 'Sol# Diminuito', notes: ['Ab4', 'B4', 'D5'] }
  ],
  'Avanzato': [
    { name: 'Do Maj7', notes: ['C4', 'E4', 'G4', 'B4'] },
    { name: 'Fa Maj7', notes: ['F4', 'A4', 'C5', 'E5'] },
    { name: 'Sib Maj7', notes: ['Bb4', 'D5', 'F5', 'A5'] },
    { name: 'Sol Dom7', notes: ['G4', 'B4', 'D5', 'F5'] },
    { name: 'Re Dom7', notes: ['D4', 'Gb4', 'A4', 'C5'] },
    { name: 'La Dom7', notes: ['A4', 'Db5', 'E5', 'G5'] },
    { name: 'Mi Dom7', notes: ['E4', 'Ab4', 'B4', 'D5'] },
    { name: 'Re Min7', notes: ['D4', 'F4', 'A4', 'C5'] },
    { name: 'Mi Min7', notes: ['E4', 'G4', 'B4', 'D5'] },
    { name: 'La Min7', notes: ['A4', 'C5', 'E5', 'G5'] },
    { name: 'Si Min7', notes: ['B4', 'D5', 'Gb5', 'A5'] },
    { name: 'Si Semidiminuito', notes: ['B4', 'D5', 'F5', 'A5'] },
    { name: 'Mi Semidiminuito', notes: ['E4', 'G4', 'Bb4', 'D5'] },
    { name: 'Fa# Semidiminuito', notes: ['Gb4', 'A4', 'C5', 'E5'] }
  ],
  'Jazz': [
    { name: 'Do Maj9', notes: ['C4', 'E4', 'G4', 'B4', 'D5'] },
    { name: 'Fa Maj9', notes: ['F4', 'A4', 'C5', 'E5', 'G5'] },
    { name: 'Re Min9', notes: ['D4', 'F4', 'A4', 'C5', 'E5'] },
    { name: 'Sol Min9', notes: ['G4', 'Bb4', 'D5', 'F5', 'A5'] },
    { name: 'Do 9', notes: ['C4', 'E4', 'G4', 'Bb4', 'D5'] },
    { name: 'Fa 9', notes: ['F4', 'A4', 'C5', 'Eb5', 'G5'] },
    { name: 'Sol 7b9', notes: ['G4', 'B4', 'D5', 'F5', 'Ab5'] },
    { name: 'La 7b9', notes: ['A4', 'Db5', 'E5', 'G5', 'Bb5'] },
    { name: 'Do 6/9', notes: ['C4', 'E4', 'A4', 'D5'] },
    { name: 'Fa 6/9', notes: ['F4', 'A4', 'D5', 'G5'] },
    { name: 'La Min11', notes: ['A4', 'C5', 'D5', 'E5', 'G5'] },
    { name: 'Re Min11', notes: ['D4', 'F4', 'G4', 'A4', 'C5'] }
  ],
  'Virtuoso': [
    { name: 'Do Maj9#11', notes: ['C4', 'E4', 'G4', 'B4', 'D5', 'Gb5'] },
    { name: 'Fa Maj7#11', notes: ['F4', 'A4', 'C5', 'E5', 'B5'] },
    { name: 'Mi 7#9', notes: ['E4', 'Ab4', 'D5', 'G5'] },
    { name: 'La 7#9', notes: ['A4', 'Db5', 'G5', 'C5'] },
    { name: 'Sol 13', notes: ['G4', 'B4', 'D5', 'F5', 'E5'] },
    { name: 'Do 13', notes: ['C4', 'E4', 'Bb4', 'D5', 'A5'] },
    { name: 'Do 7alt', notes: ['C4', 'E4', 'Ab4', 'Bb4', 'Eb5'] },
    { name: 'Sol 7alt', notes: ['G4', 'B4', 'Eb5', 'F5', 'Bb5'] },
    { name: 'La# m7b5', notes: ['Bb4', 'Db5', 'E5', 'Ab5'] },
    { name: 'Do# m7b5', notes: ['Db4', 'E4', 'G4', 'B4'] },
    { name: 'Re 7b9b13', notes: ['D4', 'Gb4', 'C5', 'Eb5', 'Bb5'] }
  ]
};

export default function App() {
  const [gameState, setGameState] = useState('idle'); 
  const [difficulty, setDifficulty] = useState('Principiante');
  const [currentChord, setCurrentChord] = useState(null);
  
  // Sistema Record & Streaks
  const [streaks, setStreaks] = useState({
    'Principiante': { current: 0, best: 0 },
    'Intermedio': { current: 0, best: 0 },
    'Avanzato': { current: 0, best: 0 },
    'Jazz': { current: 0, best: 0 },
    'Virtuoso': { current: 0, best: 0 }
  });
  const [mistakeMade, setMistakeMade] = useState(false); // Traccia se ha sbagliato nel round corrente
  
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [activeBoxIndex, setActiveBoxIndex] = useState(0); 
  
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [errorStatus, setErrorStatus] = useState(false);
  
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      // Aggiungiamo un compressore globale per evitare la distorsione (clipping)
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, ctx.currentTime);
      compressor.knee.setValueAtTime(30, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);
      compressor.connect(ctx.destination);
      
      ctx.masterCompressor = compressor; // Salviamo il nodo sul contesto
      audioCtxRef.current = ctx;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = (frequency, duration = 2.5, volume = 0.5, startTimeOffset = 0) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const startTime = ctx.currentTime + startTimeOffset;
    
    // Master gain per controllare l'inviluppo generale (ADSR)
    const masterGain = ctx.createGain();
    // Invece di collegarlo alla destinazione, lo colleghiamo al compressore
    masterGain.connect(ctx.masterCompressor || ctx.destination);
    
    // Riduciamo preventivamente il volume di base per avere più margine (headroom)
    const safeVolume = volume * 0.4;
    
    // Inviluppo del volume: attacco rapido (colpo del martelletto), decadimento lungo
    masterGain.gain.setValueAtTime(0, startTime);
    masterGain.gain.linearRampToValueAtTime(safeVolume, startTime + 0.02); // Attacco percussivo
    masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Rilascio naturale
    
    // Filtro per simulare la risonanza del piano (inizia brillante, si smorza subito)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 1;
    filter.frequency.setValueAtTime(frequency * 3 + 1000, startTime);
    filter.frequency.exponentialRampToValueAtTime(frequency + 200, startTime + 0.2);
    filter.connect(masterGain);
    
    // Oscillatore 1: Fondamentale (Onda triangolare per armoniche dispari morbide)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, startTime);
    osc1.connect(filter);
    osc1.start(startTime);
    osc1.stop(startTime + duration);
    
    // Oscillatore 2: Prima armonica (Ottava sopra, onda sinusoidale)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, startTime);
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.3; // Volume inferiore per l'armonica
    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(startTime);
    osc2.stop(startTime + duration);
    
    // Oscillatore 3: Seconda armonica (Ottava + quinta giusta)
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 3, startTime);
    const gain3 = ctx.createGain();
    gain3.gain.value = 0.1; // Volume ancora inferiore
    osc3.connect(gain3);
    gain3.connect(filter);
    osc3.start(startTime);
    osc3.stop(startTime + duration);
  };

  const playTargetChord = () => {
    initAudio();
    if (currentChord) {
      currentChord.notes.forEach(noteId => {
        playTone(FREQUENCIES[noteId], 2.0, 0.4);
      });
    }
  };

  const playUserChord = () => {
    initAudio();
    selectedNotes.forEach(noteId => {
      if (noteId) {
        playTone(FREQUENCIES[noteId], 2.0, 0.4);
      }
    });
  };

  const playUserArpeggio = () => {
    initAudio();
    let delayIndex = 0;
    selectedNotes.forEach(noteId => {
      if (noteId) {
        // Suona ogni nota con un ritardo di 0.5 secondi dalla precedente
        playTone(FREQUENCIES[noteId], 2.0, 0.4, delayIndex * 0.5);
        delayIndex++;
      }
    });
  };

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    if (gameState === 'playing') {
      setGameState('idle'); // Ferma il round corrente se si cambia difficoltà
    }
  };

  const startGame = () => {
    initAudio();
    const chordsList = CHORD_CATEGORIES[difficulty];
    
    // Evita di ripetere lo stesso accordo di fila se possibile
    let randomChord;
    do {
      randomChord = chordsList[Math.floor(Math.random() * chordsList.length)];
    } while (currentChord && randomChord.name === currentChord.name && chordsList.length > 1);

    setCurrentChord(randomChord);
    setSelectedNotes(new Array(randomChord.notes.length).fill(null));
    setActiveBoxIndex(0); 
    setStartTime(Date.now());
    setTimeTaken(null);
    setGameState('playing');
    setErrorStatus(false);
    setMistakeMade(false); // Reset per il nuovo round
    
    setTimeout(() => {
      randomChord.notes.forEach(noteId => {
        playTone(FREQUENCIES[noteId], 2.0, 0.4);
      });
    }, 100);
  };

  const assignNoteToActiveBox = (noteId) => {
    if (gameState !== 'playing' || activeBoxIndex === null) return;
    
    initAudio();
    playTone(FREQUENCIES[noteId], 1.0, 0.6);
    setErrorStatus(false);
    
    setSelectedNotes(prev => {
      const newNotes = [...prev];
      newNotes[activeBoxIndex] = noteId; 
      
      return newNotes;
    });
  };

  const selectBox = (index) => {
    if (gameState === 'playing') {
      setActiveBoxIndex(index);
    }
  };

  const checkAnswer = () => {
    if (!currentChord) return;
    
    const validSelected = selectedNotes.filter(n => n !== null);
    const sortedTarget = [...currentChord.notes].sort();
    const sortedSelected = validSelected.sort();
    
    const isCorrect = 
      sortedTarget.length === sortedSelected.length &&
      sortedTarget.every((val, index) => val === sortedSelected[index]);
      
    if (isCorrect) {
      const endTime = Date.now();
      setTimeTaken(((endTime - startTime) / 1000).toFixed(1));
      setGameState('won');
      playTargetChord();

      // Gestione dello Streak
      if (!mistakeMade) {
        setStreaks(prev => {
          const currentDiffStats = prev[difficulty];
          const newCurrent = currentDiffStats.current + 1;
          return {
            ...prev,
            [difficulty]: {
              current: newCurrent,
              best: Math.max(currentDiffStats.best, newCurrent)
            }
          };
        });
      }
    } else {
      setErrorStatus(true);
      setMistakeMade(true); // Registra l'errore per invalidare lo streak corrente
      
      // Azzera lo streak corrente
      setStreaks(prev => ({
        ...prev,
        [difficulty]: {
          ...prev[difficulty],
          current: 0
        }
      }));

      setTimeout(() => setErrorStatus(false), 2000);
    }
  };

  const renderPiano = () => {
    let whiteKeyIndex = 0;
    const WHITE_KEY_WIDTH = 56;
    const BLACK_KEY_WIDTH = 32;
    
    return (
      <div className="relative h-64 mx-auto select-none" style={{ width: `${14 * WHITE_KEY_WIDTH}px` }}>
        {PIANO_KEYS.map((key) => {
          const isWhite = key.type === 'white';
          const isSelected = selectedNotes.includes(key.id); 
          
          let leftPosition;
          if (isWhite) {
            leftPosition = whiteKeyIndex * WHITE_KEY_WIDTH;
            whiteKeyIndex++;
          } else {
            leftPosition = (whiteKeyIndex * WHITE_KEY_WIDTH) - (BLACK_KEY_WIDTH / 2);
          }

          return (
            <div
              key={key.id}
              onMouseDown={() => assignNoteToActiveBox(key.id)}
              onTouchStart={(e) => { e.preventDefault(); assignNoteToActiveBox(key.id); }}
              className={`absolute cursor-pointer border flex flex-col justify-end pb-4 items-center transition-colors duration-150 touch-none select-none
                ${isWhite 
                  ? `h-64 w-[56px] rounded-b-lg border-slate-300 z-0 ${isSelected ? 'bg-indigo-200' : 'bg-white hover:bg-slate-100'}` 
                  : `h-40 w-[32px] rounded-b-md border-black z-10 ${isSelected ? 'bg-indigo-600' : 'bg-slate-900 hover:bg-slate-700'}`
                }`}
              style={{ left: `${leftPosition}px` }}
            >
              <span className={`text-xs font-semibold ${isWhite ? 'text-slate-500' : 'text-slate-400'} pointer-events-none`}>
                {isWhite && key.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const isReadyToSubmit = selectedNotes.length > 0 && selectedNotes.every(note => note !== null);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Header App */}
        <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Volume2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Ear Training Accordi</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(CHORD_CATEGORIES).map(diff => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors
                      ${difficulty === diff 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Display Streaks */}
          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 shrink-0 w-full md:w-auto justify-center">
            <div className="flex items-center gap-2 text-orange-400">
              <Flame size={20} className={streaks[difficulty].current > 0 && gameState === 'playing' ? "animate-pulse" : ""} />
              <span className="font-bold text-lg leading-none">{streaks[difficulty].current}</span>
            </div>
            <div className="w-px h-6 bg-slate-600"></div>
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy size={20} />
              <span className="font-bold text-lg leading-none">{streaks[difficulty].best}</span>
            </div>
          </div>
        </div>

        {/* Area di Gioco */}
        <div className="p-8">
          {gameState === 'idle' ? (
            <div className="text-center py-10">
              <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play size={48} className="text-indigo-400 ml-2" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Livello {difficulty}</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                {difficulty === 'Principiante' && "Accordi maggiori e minori (3 note). Perfetto per iniziare."}
                {difficulty === 'Intermedio' && "Accordi sospesi, diminuiti e aumentati (3 note). Inizia la vera sfida."}
                {difficulty === 'Avanzato' && "Accordi di settima (4 note). Richiede un orecchio ben allenato."}
                {difficulty === 'Jazz' && "Accordi complessi, none e alterazioni (4-5 note). Per veri esperti."}
                {difficulty === 'Virtuoso' && "Accordi ultra complessi: 11me, 13me, alt e semi-diminuiti. Sfida estrema!"}
              </p>
              <button 
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-3 mx-auto"
              >
                <Play size={24} />
                Inizia il Gioco
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              
              {/* Controlli Superiori */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-700/30 p-6 rounded-2xl border border-slate-700">
                
                {/* Riascolta Originale */}
                <button 
                  onClick={playTargetChord}
                  className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 px-6 py-4 rounded-xl font-bold transition-colors w-full md:w-auto justify-center group shadow-md"
                >
                  <Volume2 className="text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="leading-tight">Accordo da</div>
                    <div className="text-sm text-slate-400 font-normal">Indovinare</div>
                  </div>
                </button>

                {/* Box delle Note e Ascolto Utente */}
                <div className="flex flex-col items-center md:items-end w-full md:w-auto gap-4">
                  <div className="flex flex-col items-center md:items-end">
                    <p className="text-sm text-slate-400 mb-2 font-medium">Componi l'accordo</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                      {selectedNotes.map((noteId, i) => {
                        const keyInfo = PIANO_KEYS.find(k => k.id === noteId);
                        const isActive = activeBoxIndex === i && gameState === 'playing';
                        
                        return (
                          <div 
                            key={i}
                            onClick={() => selectBox(i)}
                            className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold transition-all cursor-pointer
                              ${isActive 
                                ? 'border-amber-400 ring-4 ring-amber-400/20 scale-105' 
                                : 'border-slate-600 hover:border-slate-400'
                              }
                              ${noteId 
                                ? 'bg-indigo-600/20 text-indigo-300 shadow-inner' 
                                : 'bg-slate-800/80 text-transparent'
                              }
                            `}
                          >
                            {keyInfo ? keyInfo.label : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Pulsanti per ascoltare le note correntemente selezionate */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button 
                      onClick={playUserChord}
                      disabled={!selectedNotes.some(n => n !== null)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto
                        ${selectedNotes.some(n => n !== null) 
                          ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                        }`}
                      title="Suona tutte le note insieme"
                    >
                      <Music size={16} className={selectedNotes.some(n => n !== null) ? 'text-amber-400' : ''} />
                      Accordo
                    </button>
                    <button 
                      onClick={playUserArpeggio}
                      disabled={!selectedNotes.some(n => n !== null)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto
                        ${selectedNotes.some(n => n !== null) 
                          ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                        }`}
                      title="Suona le note una per una"
                    >
                      <Play size={16} className={selectedNotes.some(n => n !== null) ? 'text-emerald-400' : ''} />
                      Arpeggio
                    </button>
                  </div>
                </div>
              </div>

              {/* Area Messaggi e Invia */}
              <div className="flex flex-col items-center justify-center h-24">
                {gameState === 'playing' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={checkAnswer}
                      disabled={!isReadyToSubmit}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all
                        ${isReadyToSubmit
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                      <Check size={24} />
                      Invia Risposta
                    </button>
                    {errorStatus && (
                      <span className="text-rose-400 flex items-center gap-2 font-medium animate-pulse">
                        <AlertCircle size={20} />
                        Sbagliato, riprova!
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-emerald-400 font-bold text-xl sm:text-2xl flex items-center gap-2 text-center">
                      <Check size={32} className="shrink-0" />
                      Esatto! Era un {currentChord.name}
                    </div>
                    <div className="flex items-center gap-4">
                      {timeTaken && (
                        <div className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-3 rounded-xl font-medium border border-slate-700">
                          <Clock size={18} className="text-indigo-400" />
                          {timeTaken} sec
                        </div>
                      )}
                      <button
                        onClick={startGame}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                      >
                        <RefreshCw size={20} />
                        Prossimo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pianoforte Interattivo con classi Tailwind Arbitrarie per la scrollbar */}
              <div className="w-full overflow-x-auto pb-6 pt-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-thumb]:bg-slate-600 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-thumb]:rounded-md">
                {renderPiano()}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
