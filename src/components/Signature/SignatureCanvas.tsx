import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface SignatureCanvasProps {
  signerName: string;
  signerDoc: string;
  roleTitle: string;
  initialSignature?: string;
  onSaveSignature: (dataUrl: string) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  signerName,
  signerDoc,
  roleTitle,
  initialSignature,
  onSaveSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!initialSignature);
  const [savedSignature, setSavedSignature] = useState<string | undefined>(initialSignature);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas size with retina / high DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#0f172a'; // slate-900 dark ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If there is an initial signature image, draw it
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-10), currentState]);
    } catch (e) {
      console.error(e);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveHistoryState();

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    handleConfirmSignature();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSavedSignature(undefined);
    setHistory([]);
    onSaveSignature('');
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = history[history.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory((prev) => prev.slice(0, -1));
    handleConfirmSignature();
  };

  const handleConfirmSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSavedSignature(dataUrl);
    onSaveSignature(dataUrl);
  }, [onSaveSignature]);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
      <div>
        {/* Signer Details Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 mb-1">
              {roleTitle}
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {signerName || 'Interviniente'}
            </h4>
            <p className="text-xs text-slate-600 font-mono">
              {signerDoc || 'DNI pendiente'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {savedSignature ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3" /> Firmado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                <PenTool className="w-3 h-3" /> Pendiente
              </span>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-white overflow-hidden touch-none h-44 cursor-crosshair shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {!hasSignature && !savedSignature && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-600">
              <PenTool className="w-6 h-6 mb-1 opacity-50" />
              <p className="text-xs font-medium">Firma aquí con el ratón o con el dedo</p>
              <p className="text-[10px] text-slate-600">Conforme a la Ley 6/2020 de firma electrónica</p>
            </div>
          )}

          {/* Guideline baseline */}
          <div className="absolute bottom-6 left-6 right-6 border-b border-slate-200 pointer-events-none flex justify-end">
            <span className="text-[10px] text-slate-600 pr-1">Firma digital</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasSignature}
            className="text-xs font-semibold text-slate-600 hover:text-rose-600 disabled:opacity-40 transition-colors px-2 py-1 rounded"
          >
            Borrar
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 transition-colors flex items-center gap-1 px-2 py-1 rounded"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Deshacer trazo</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleConfirmSignature}
          disabled={!hasSignature}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white transition-all shadow-xs flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Fijar firma</span>
        </button>
      </div>
    </div>
  );
};
