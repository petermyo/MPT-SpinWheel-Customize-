
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SpinSlice } from '../types';
import { COLORS } from '../constants';

interface SpinWheelProps {
  slices: SpinSlice[];
  onResult: (slice: SpinSlice) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

const TICK_SOUND_URL = 'https://www.soundjay.com/buttons_c2026/button-29.mp3';

const SpinWheel: React.FC<SpinWheelProps> = ({ slices, onResult, isSpinning, setIsSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const [displayRotation, setDisplayRotation] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Track slice crossing for tick sound
  const lastSliceIdxRef = useRef(-1);

  useEffect(() => {
    audioRef.current = new Audio(TICK_SOUND_URL);
    audioRef.current.volume = 0.5; // Increased volume for better clarity
  }, []);

  const playTick = () => {
    if (audioRef.current) {
      const clone = audioRef.current.cloneNode() as HTMLAudioElement;
      clone.volume = audioRef.current.volume;
      clone.play().catch(() => {});
    }
  };

  const drawWheel = useCallback((currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 10;
    const sliceAngle = (2 * Math.PI) / slices.length;

    ctx.clearRect(0, 0, size, size);

    slices.forEach((slice, i) => {
      const startAngle = i * sliceAngle + currentRotation;
      const endAngle = (i + 1) * sliceAngle + currentRotation;
      
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      ctx.strokeStyle = COLORS.DARK_BLUE;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      
      const textColor = slice.color === COLORS.MPT_BLUE ? '#FFFFFF' : COLORS.MPT_BLUE;
      ctx.fillStyle = textColor;
      ctx.font = 'bold 25px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(`${slice.icon} ${slice.title}`, radius - 20, 10);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = COLORS.MPT_YELLOW;
    ctx.lineWidth = 10;
    ctx.stroke();

    const dots = 24;
    for (let i = 0; i < dots; i++) {
        const dotAngle = (i / dots) * 2 * Math.PI;
        ctx.beginPath();
        ctx.arc(
            center + (radius - 5) * Math.cos(dotAngle),
            center + (radius - 5) * Math.sin(dotAngle),
            3, 0, 2 * Math.PI
        );
        ctx.fillStyle = i % 2 === 0 ? 'white' : COLORS.MPT_YELLOW;
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(center, center, 30, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS.DARK_BLUE;
    ctx.fill();
    ctx.strokeStyle = COLORS.MPT_YELLOW;
    ctx.lineWidth = 5;
    ctx.stroke();
    
    ctx.fillStyle = COLORS.MPT_YELLOW;
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('MPT', center, center + 6);

  }, [slices]);

  useEffect(() => {
    drawWheel(displayRotation);
  }, [drawWheel, displayRotation]);

  const handleSpin = () => {
    if (isSpinning || slices.length === 0) return;

    setIsSpinning(true);

    const totalWeight = slices.reduce((acc, s) => acc + s.chance, 0);
    const randomWeight = Math.random() * totalWeight;
    let accumulatedWeight = 0;
    let winnerIdx = 0;

    for (let i = 0; i < slices.length; i++) {
      accumulatedWeight += slices[i].chance;
      if (randomWeight <= accumulatedWeight) {
        winnerIdx = i;
        break;
      }
    }

    const pointerAngle = 1.5 * Math.PI;
    const sliceAngle = (2 * Math.PI) / slices.length;
    const slicePadding = sliceAngle * 0.1;
    const randomOffsetInSlice = slicePadding + Math.random() * (sliceAngle - 2 * slicePadding);
    
    let targetRotationMod = pointerAngle - (winnerIdx * sliceAngle + randomOffsetInSlice);
    while (targetRotationMod < 0) targetRotationMod += 2 * Math.PI;
    
    const startRotation = rotationRef.current;
    const startRotationMod = startRotation % (2 * Math.PI);
    
    let rotationDiff = targetRotationMod - startRotationMod;
    if (rotationDiff <= 0) rotationDiff += 2 * Math.PI;
    
    const extraFullSpins = 10 + Math.floor(Math.random() * 5); // Faster and more spins for excitement
    const totalRotationToApply = rotationDiff + (extraFullSpins * 2 * Math.PI);
    const finalRotation = startRotation + totalRotationToApply;

    const duration = 7000;
    let startTime: number | null = null;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = 1 - Math.pow(1 - progress, 5);
      const currentRotation = startRotation + totalRotationToApply * ease;
      
      let effectivePointerAngle = (pointerAngle - currentRotation) % (2 * Math.PI);
      if (effectivePointerAngle < 0) effectivePointerAngle += 2 * Math.PI;
      const currentSliceIdx = Math.floor(effectivePointerAngle / sliceAngle);
      
      if (currentSliceIdx !== lastSliceIdxRef.current) {
        playTick();
        lastSliceIdxRef.current = currentSliceIdx;
      }

      rotationRef.current = currentRotation;
      setDisplayRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setTimeout(() => {
            onResult(slices[winnerIdx]);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-30 pointer-events-none">
        <svg width="46" height="56" viewBox="0 0 46 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)] animate-pulse">
          <path d="M23 56L46 0H0L23 56Z" fill="#EF4444" />
          <path d="M23 44L38 6H8L23 44Z" fill="#B91C1C" />
          <circle cx="23" cy="12" r="5" fill="white" />
        </svg>
      </div>
      
      <div className="bg-white/5 p-8 rounded-full border-[14px] border-mpt-yellow shadow-[0_0_100px_rgba(255,209,0,0.4)] backdrop-blur-md relative group">
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/30 animate-[spin_60s_linear_infinite]"></div>
        
        <canvas 
          ref={canvasRef} 
          width={460} 
          height={460} 
          className="max-w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`mt-12 px-20 py-6 rounded-full font-black text-4xl uppercase tracking-tighter shadow-2xl transition-all active:scale-95 border-b-[10px] relative overflow-hidden ${
          isSpinning 
            ? 'bg-gray-500 border-gray-700 cursor-not-allowed text-gray-300 translate-y-2 border-b-0' 
            : 'bg-mpt-yellow border-yellow-600 text-blue-900 hover:bg-white hover:text-mpt-blue hover:-translate-y-2 hover:shadow-yellow-400/80 shadow-[0_15px_30px_rgba(255,209,0,0.3)]'
        }`}
      >
        <span className="relative z-10">{isSpinning ? 'SPINNING...' : 'TAP TO PLAY'}</span>
        {!isSpinning && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>}
      </button>
      
      <p className="mt-4 text-white/40 text-[10px] font-black tracking-[0.4em] uppercase">
        {isSpinning ? 'STAY LUCKY!' : 'BIG REWARDS AWAIT YOU'}
      </p>
    </div>
  );
};

export default SpinWheel;
