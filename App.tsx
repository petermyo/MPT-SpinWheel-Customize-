
import React, { useState, useEffect, useRef } from 'react';
import SpinWheel from './components/SpinWheel';
import HistoryTable from './components/HistoryTable';
import AdminPanel from './components/AdminPanel';
import { dbService } from './services/dbService';
import { SpinSlice, SpinRecord } from './types';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_SLICES, COLORS } from './constants';
import { Settings, X, TrendingUp, Trophy, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

const WIN_FANFARE_URL = 'https://www.soundjay.com/misc/sounds/bell-ring-01.mp3';
const CONGRATS_MUSIC_URL = 'https://www.soundjay.com/human/sounds/applause-01.mp3'; 
const WOW_SOUND_URL = 'https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3'; // Professional "WOW" sound
const LOGO_URL = 'https://mpt-aws-wp-bucket.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2022/09/23235935/logo-1.webp';

const App: React.FC = () => {
  const [slices, setSlices] = useState<SpinSlice[]>([]);
  const [history, setHistory] = useState<SpinRecord[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState<string>("");
  const [lastWin, setLastWin] = useState<SpinSlice | null>(null);
  
  const fanfareAudioRef = useRef<HTMLAudioElement | null>(null);
  const congratsMusicRef = useRef<HTMLAudioElement | null>(null);
  const wowAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSlices(dbService.getSlices());
    setHistory(dbService.getHistory());
    
    fanfareAudioRef.current = new Audio(WIN_FANFARE_URL);
    wowAudioRef.current = new Audio(WOW_SOUND_URL);
    congratsMusicRef.current = new Audio(CONGRATS_MUSIC_URL);
    
    if (congratsMusicRef.current) {
      congratsMusicRef.current.loop = true;
      congratsMusicRef.current.volume = 0.4;
    }
    if (wowAudioRef.current) {
      wowAudioRef.current.volume = 0.8;
    }
  }, []);

  useEffect(() => {
    if (showWinnerPopup) {
      congratsMusicRef.current?.play().catch(() => {});
    } else {
      congratsMusicRef.current?.pause();
      if (congratsMusicRef.current) congratsMusicRef.current.currentTime = 0;
    }
  }, [showWinnerPopup]);

  const triggerConfetti = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 120 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleWheelResult = async (winningSlice: SpinSlice) => {
    setLastWin(winningSlice);
    
    // Play initial fanfare and WOW! sound
    if (fanfareAudioRef.current) {
        fanfareAudioRef.current.currentTime = 0;
        fanfareAudioRef.current.play().catch(() => {});
    }
    
    if (wowAudioRef.current && parseInt(winningSlice.amount) > 0) {
        setTimeout(() => {
          wowAudioRef.current?.play().catch(() => {});
        }, 100);
    }

    // Trigger Confetti for rewards
    if (parseInt(winningSlice.amount) >= 250) {
        triggerConfetti();
    }
    
    const newRecord: SpinRecord = {
      id: Math.random().toString(36).substr(2, 9),
      sliceId: winningSlice.id,
      title: winningSlice.title,
      amount: winningSlice.amount,
      timestamp: Date.now()
    };
    
    const updatedHistory = dbService.addSpinRecord(newRecord);
    setHistory(updatedHistory);
    setShowWinnerPopup(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = winningSlice.amount === '0' 
        ? `A person just spun a wheel and landed on "${winningSlice.title}". Write a very short, friendly, encouraging 1-sentence message for an MPT user.`
        : `An MPT user just won "${winningSlice.title}". Write a short, exciting congratulatory 1-sentence message under 15 words.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setWinnerMessage(response.text || `Congratulations! You got ${winningSlice.title}!`);
    } catch (e) {
      setWinnerMessage(`Fantastic! You've just unlocked ${winningSlice.title}! 🥳`);
    }
  };

  const updateSlices = (newSlices: SpinSlice[]) => {
    setSlices(newSlices);
    dbService.saveSlices(newSlices);
    setShowAdmin(false);
  };

  const resetSlices = () => {
    if (confirm('Reset all rewards to MPT defaults?')) {
        setSlices(INITIAL_SLICES);
        dbService.saveSlices(INITIAL_SLICES);
    }
  };

  const clearHistory = () => {
    if (confirm('Clear winner history and reset stats?')) {
        dbService.clearHistory();
        setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-mpt-blue selection:bg-mpt-yellow selection:text-blue-900 text-white pb-10 overflow-x-hidden">
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-2xl py-3 px-6 mb-12 flex items-center justify-between border-b-4 border-mpt-yellow">
        <div className="flex items-center gap-6">
          <img src={LOGO_URL} alt="MPT Logo" className="h-10 w-auto object-contain" />
          <div className="h-8 w-[2px] bg-gray-200 hidden md:block"></div>
          <h1 className="text-blue-900 font-black text-2xl uppercase tracking-tighter hidden sm:block italic">Fortune Spin Hub</h1>
        </div>
        <button 
          onClick={() => setShowAdmin(!showAdmin)}
          className="p-3 rounded-2xl bg-gray-50 hover:bg-mpt-yellow/20 text-blue-900 transition-all active:scale-90 border border-gray-100"
        >
          {showAdmin ? <X size={28} /> : <Settings size={28} />}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-3 h-[600px] sticky top-32">
          <HistoryTable history={history} onClear={clearHistory} />
        </div>

        <div className="lg:col-span-6 flex flex-col items-center">
            <SpinWheel 
                slices={slices} 
                onResult={handleWheelResult} 
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
            />
        </div>

        <div className="lg:col-span-3 space-y-8 sticky top-32">
            <div className="w-full bg-white/10 rounded-[2.5rem] p-10 border-2 border-white/10 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 mb-8 text-mpt-yellow font-black uppercase tracking-[0.2em] text-xs">
                    <TrendingUp size={24} strokeWidth={3} />
                    <span>Real-time Activity</span>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gradient-to-br from-white/10 to-transparent p-6 rounded-3xl border border-white/10">
                        <div className="text-[10px] text-mpt-yellow/60 uppercase font-black mb-1 tracking-widest">Global Spins</div>
                        <div className="text-4xl font-black tabular-nums tracking-tighter">{history.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-white/10 to-transparent p-6 rounded-3xl border border-white/10">
                        <div className="text-[10px] text-mpt-yellow/60 uppercase font-black mb-1 tracking-widest">Big Rewards Today</div>
                        <div className="text-4xl font-black text-mpt-yellow tabular-nums tracking-tighter">
                            {history.filter(h => parseInt(h.amount) >= 3000).length}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-10 text-gray-800 shadow-2xl border-4 border-white/50">
                <h4 className="font-black text-mpt-blue mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                   <PartyPopper size={18} /> How to win
                </h4>
                <ul className="space-y-6">
                    <li className="flex gap-4 items-start">
                        <div className="bg-mpt-blue text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-lg">1</div>
                        <p className="text-sm font-bold text-gray-600 leading-snug">Tap <span className="text-blue-900">TAP TO PLAY</span> to start your fortune spin.</p>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="bg-mpt-blue text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-lg">2</div>
                        <p className="text-sm font-bold text-gray-600 leading-snug">Wait for pointer to select your lucky reward.</p>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="bg-mpt-blue text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-lg">3</div>
                        <p className="text-sm font-bold text-gray-600 leading-snug">Winning items are saved in the left panel!</p>
                    </li>
                </ul>
            </div>
        </div>
      </main>

      {/* Winner Modal Popup - Enhanced Visibility & Sound */}
      {showWinnerPopup && lastWin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-mpt-blue/85 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setShowWinnerPopup(false)} />
            <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-[0_0_150px_rgba(255,209,0,0.7)] border-[10px] border-mpt-yellow animate-in zoom-in slide-in-from-bottom-20 duration-500">
                
                {/* Trophy Header */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-mpt-yellow w-32 h-32 rounded-full border-[6px] border-white flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.3)] animate-bounce-slow">
                    <Trophy size={64} className="text-blue-900" />
                </div>

                <div className="mt-16 mb-6">
                    <h2 className="text-blue-900 font-black text-6xl tracking-tighter uppercase mb-4 drop-shadow-sm">WOW!</h2>
                    
                    {/* Icon Display */}
                    <div className="flex justify-center mb-6">
                      <div className="text-[110px] filter drop-shadow-2xl leading-none transform hover:rotate-12 transition-transform cursor-pointer">
                        {lastWin.icon}
                      </div>
                    </div>

                    <p className="text-gray-500 font-black text-[11px] uppercase tracking-[0.4em] mb-4">You just won</p>
                    
                    {/* Reward Box - Guaranteed Visibility */}
                    <div className="bg-gray-100 py-6 px-4 rounded-[2rem] border-4 border-gray-200 shadow-inner w-full flex items-center justify-center">
                        <span className="text-blue-900 font-black text-5xl italic tracking-tighter block leading-tight uppercase text-center">
                          {lastWin.title}
                        </span>
                    </div>
                </div>

                <div className="px-2 mb-8">
                  <p className="text-gray-800 font-bold text-xl leading-snug">
                    {winnerMessage}
                  </p>
                </div>

                <button 
                    onClick={() => setShowWinnerPopup(false)}
                    className="w-full py-5 bg-mpt-yellow hover:bg-blue-900 hover:text-white text-blue-900 rounded-[1.5rem] font-black text-3xl uppercase tracking-tighter transition-all shadow-[0_8px_0_#B49400] hover:shadow-none hover:translate-y-2 active:scale-95"
                >
                    AWESOME!
                </button>
            </div>
        </div>
      )}

      {showAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mpt-blue/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
             <div className="relative">
                <button 
                  onClick={() => setShowAdmin(false)}
                  className="absolute -top-20 right-0 text-white hover:text-mpt-yellow transition-all hover:rotate-90 p-4"
                >
                  <X size={48} />
                </button>
                <AdminPanel slices={slices} onSave={updateSlices} onReset={resetSlices} />
             </div>
          </div>
        </div>
      )}
      
      <footer className="mt-24 text-center pb-12">
          <img src={LOGO_URL} alt="MPT Logo" className="h-8 mx-auto opacity-30 grayscale mb-4" />
          <p className="font-black text-[10px] tracking-[0.5em] text-white/20 uppercase">Myanmar's Number One Network</p>
      </footer>
    </div>
  );
};

export default App;
