import React from 'react';
import { X, ShieldCheck, BookOpen, AlertCircle, Building2, CheckCircle2, Scale } from 'lucide-react';

interface LegalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalInfoModal: React.FC<LegalInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Marco Jurídico Español Vigente</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            Garantías Legales y Cumplimiento Normativo
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Guía orientativa actualizable. Requiere revisión profesional para cada caso concreto.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
          
          {/* Section 1: LAU y Ley 12/2023 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>1. Duración mínima y prórrogas legales obligatorias (Art. 9 LAU)</span>
            </h4>
            <p className="leading-relaxed">
              En arrendamientos de vivienda habitual donde el arrendador es persona física, el plazo de duración se prorroga obligatoriamente hasta alcanzar los <strong>5 años</strong> (o <strong>7 años</strong> si el arrendador es persona jurídica o sociedad). El inquilino puede desistir transcurridos 6 meses con 30 días de preaviso (art. 11 LAU).
            </p>
          </div>

          {/* Section 2: Fianza y límites */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>2. Fianza legal y tope a garantías adicionales (Art. 36 LAU)</span>
            </h4>
            <p className="leading-relaxed">
              La fianza legal en metálico para vivienda habitual es estrictamente de <strong>una mensualidad de renta</strong> (y dos para uso distinto, locales o temporada). Además, conforme al <strong>artículo 36.5 LAU</strong>, las garantías adicionales complementarias pactadas no pueden exceder de <strong>dos mensualidades</strong> de renta.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <strong>Obligación autonómica de depósito:</strong> El arrendador está legalmente obligado a ingresar la fianza en el organismo autonómico de su comunidad (IVIMA en Madrid, INCASÒL en Cataluña, AVRA en Andalucía, etc.) en el plazo de 30 días desde la firma.
            </div>
          </div>

          {/* Section 3: Actualización de renta */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>3. Topes de actualización de renta (IRAV / IPC)</span>
            </h4>
            <p className="leading-relaxed">
              La Ley 12/2023 por el Derecho a la Vivienda introdujo la creación del nuevo Índice de Referencia de Arrendamientos de Vivienda (IRAV) elaborado por el INE para evitar incrementos desproporcionados en las renovaciones de contratos.
            </p>
          </div>

          {/* Section 4: Firma digital y eIDAS */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700" />
              <span>4. Servidumbres: referencias clave (orientativas)</span>
            </h4>
            <p className="leading-relaxed">
              Para modelos de servidumbre, el marco general parte del <strong>Código Civil, Título VII (arts. 530-604)</strong>, con atención a
              paso y ganado (564-570), medianería (571-579), luces y vistas (580-585), aguas (586-588) y servidumbres voluntarias (594-604).
            </p>
            <p className="leading-relaxed">
              La oponibilidad frente a terceros suele requerir escritura e inscripción conforme a la <strong>Ley Hipotecaria (arts. 2 y 13)</strong>.
              Además, pueden resultar aplicables normas sectoriales (aguas, vías pecuarias, costas, carreteras, urbanismo, energía, telecomunicaciones y normativa autonómica/local).
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>Enlaces oficiales BOE (consulta consolidada):</strong></p>
              <p>• Código Civil: https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763</p>
              <p>• Ley Hipotecaria: https://www.boe.es/buscar/act.php?id=BOE-A-1946-2453</p>
            </div>
          </div>

          {/* Section 5: Firma digital y eIDAS */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>5. Validez de la firma electrónica (Reglamento eIDAS y Ley 6/2020)</span>
            </h4>
            <p className="leading-relaxed">
              El artículo 23 de la LSSI y el Reglamento (UE) Nº 910/2014 otorgan plena eficacia jurídica a los contratos celebrados por vía electrónica. El código seguro de verificación (CSV), el sellado de tiempo UTC/CET y la huella criptográfica SHA-256 aseguran que el documento no ha sido alterado tras la firma.
            </p>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs">
            <strong>Aviso legal:</strong> Esta aplicación ofrece modelos orientativos y no presta asesoramiento jurídico. No se garantiza cobertura íntegra de derechos forales, autonómicos o supuestos sectoriales sin revisión profesional.
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
