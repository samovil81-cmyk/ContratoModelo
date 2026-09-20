import React from 'react';
import { Scale, ShieldCheck, FileText, FolderCheck, BookOpen, Sparkles, FileCheck2 } from 'lucide-react';

export type EcosystemArea = 'contracts' | 'legal_assistant';

interface HeaderProps {
  currentView: 'catalog' | 'wizard' | 'preview' | 'remote_sign' | 'legal_assistant';
  activeEcosystemArea: EcosystemArea;
  onChangeEcosystemArea: (area: EcosystemArea) => void;
  onNavigate: (view: 'catalog' | 'wizard' | 'preview' | 'remote_sign' | 'legal_assistant') => void;
  onOpenSavedContracts: () => void;
  onOpenLegalInfo: () => void;
  savedCount: number;
  contractTypeTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeEcosystemArea,
  onChangeEcosystemArea,
  onNavigate,
  onOpenSavedContracts,
  onOpenLegalInfo,
  savedCount,
  contractTypeTitle
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo and Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => {
              onChangeEcosystemArea('contracts');
              onNavigate('catalog');
            }}
          >
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md border border-slate-700">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Contrato<span className="text-amber-600">Modelo</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Legal Tech ES
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">
                Ecosistema Jurídico Integral • Inteligencia & Firma Digital
              </p>
            </div>
          </div>

          {/* Center Dual Navigation (The Ecosystem) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                onChangeEcosystemArea('legal_assistant');
                onNavigate('legal_assistant');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeEcosystemArea === 'legal_assistant'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Inteligencia Legislativa</span>
            </button>

            <button
              onClick={() => {
                onChangeEcosystemArea('contracts');
                if (currentView === 'legal_assistant') {
                  onNavigate('catalog');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeEcosystemArea === 'contracts'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Fábrica de Contratos</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenLegalInfo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Marco legal español y garantías"
            >
              <BookOpen className="h-3.5 w-3.5 text-slate-700" />
              <span className="hidden md:inline">Garantías LAU</span>
            </button>

            <button
              onClick={onOpenSavedContracts}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80"
            >
              <FolderCheck className="h-3.5 w-3.5 text-slate-700" />
              <span>Mis Contratos</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                  {savedCount}
                </span>
              )}
            </button>

            {currentView !== 'catalog' && currentView !== 'legal_assistant' && (
              <button
                onClick={() => {
                  onChangeEcosystemArea('contracts');
                  onNavigate('catalog');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Catálogo
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
