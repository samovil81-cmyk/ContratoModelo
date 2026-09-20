import React from 'react';
import { Users, Home, FileText, CheckCircle, FileSignature } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onSelectStep: (step: number) => void;
  maxAccessibleStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onSelectStep,
  maxAccessibleStep
}) => {
  const steps = [
    {
      num: 1,
      title: 'Partes contratantes',
      shortTitle: 'Partes',
      subtitle: 'DNI/NIE y domicilio',
      icon: Users
    },
    {
      num: 2,
      title: 'Inmueble y condiciones',
      shortTitle: 'Activo & Renta',
      subtitle: 'Dirección, fianza y muebles',
      icon: Home
    },
    {
      num: 3,
      title: 'Cláusulas y plazos',
      shortTitle: 'Cláusulas',
      subtitle: 'Duración, IPC y prórrogas',
      icon: FileText
    },
    {
      num: 4,
      title: 'Firma digital y sellado',
      shortTitle: 'Firma & Sellado',
      subtitle: 'Evidencia oficial eIDAS',
      icon: FileSignature
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-3 sm:py-4 px-4 sm:px-6 mb-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.num < currentStep;
            const isCurrent = step.num === currentStep;
            const isClickable = step.num <= maxAccessibleStep;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => isClickable && onSelectStep(step.num)}
                disabled={!isClickable}
                className={`relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all ${
                  isCurrent
                    ? 'bg-amber-50/90 border border-amber-300 ring-2 ring-amber-400/20'
                    : isCompleted
                    ? 'bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer'
                    : isClickable
                    ? 'bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer'
                    : 'bg-white border border-slate-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Paso {step.num}
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isCurrent ? 'text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.shortTitle}</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
