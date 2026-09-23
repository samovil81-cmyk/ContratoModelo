import React, { useState } from 'react';
import { ClauseTerms, ContractType } from '../../types/contract';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Dog, 
  Ban, 
  Zap, 
  Scale, 
  FileEdit,
  ShieldCheck
} from 'lucide-react';

interface StepClausesProps {
  contractType: ContractType;
  clauses: ClauseTerms;
  onChangeClauses: (data: Partial<ClauseTerms>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepClauses: React.FC<StepClausesProps> = ({
  contractType,
  clauses,
  onChangeClauses,
  onNext,
  onPrev
}) => {
  const isHousing = contractType === 'alquiler_vivienda';
  const isSeasonal = contractType === 'alquiler_temporada';
  const isServitude = contractType.startsWith('servidumbre_');
  const [showErrors, setShowErrors] = useState(false);
  const servitudeTerms = clauses.servitudeTerms;
  const handleNext = () => {
    if (isServitude && (!servitudeTerms?.legalNoticeAccepted || !servitudeTerms.duration.trim() || !servitudeTerms.liabilityAndInsurance.trim())) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Duración, actualización de renta y estipulaciones legales
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Configura los pactos contractuales conforme a la Ley de Arrendamientos Urbanos (arts. 9, 10, 11 y 18 LAU) garantizando la máxima validez jurídica ante cualquier tribunal.
        </p>
      </div>

      {isServitude && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-cyan-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div><h3 className="font-bold text-slate-900">Condiciones propias de la servidumbre</h3><p className="text-xs text-slate-600">Pactos económicos, conservación, responsabilidad y publicidad registral.</p></div>
            <Scale className="w-5 h-5 text-cyan-700" />
          </div>
          {showErrors && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">Indica duración, responsabilidad/seguros y acepta el aviso legal antes de continuar.</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Duración y causa *</label><input value={servitudeTerms?.duration || ''} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, duration: e.target.value } })} placeholder="Indefinida / temporal hasta el día..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" /></div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Indemnización o canon (€)</label><input type="number" min={0} value={servitudeTerms?.compensationEUR || ''} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, compensationEUR: parseFloat(e.target.value) || 0 } })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" /></div>
            <textarea rows={3} value={servitudeTerms?.worksCostAllocation || ''} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, worksCostAllocation: e.target.value } })} placeholder="Reparto de obras, materiales, permisos y restauración..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            <textarea rows={3} value={servitudeTerms?.maintenanceAllocation || ''} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, maintenanceAllocation: e.target.value } })} placeholder="Mantenimiento ordinario, acceso de inspección y reparaciones..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            <textarea rows={3} value={servitudeTerms?.liabilityAndInsurance || ''} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, liabilityAndInsurance: e.target.value } })} placeholder="Responsabilidad por daños, seguro de responsabilidad civil y cobertura de obra *" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            <textarea rows={3} value={servitudeTerms?.prohibitions || ''} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, prohibitions: e.target.value } })} placeholder="Prohibiciones: ampliar trazado, cambiar uso, obstaculizar, ceder..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          </div>
          <div className="space-y-3">
            <label className="flex items-start gap-2 text-xs text-slate-700"><input type="checkbox" checked={servitudeTerms?.registrationAgreement || false} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, registrationAgreement: e.target.checked } })} className="mt-0.5 rounded text-cyan-600" /><span>Las partes se comprometen a elevar el acuerdo a público y solicitar su inscripción, aportando plano y título suficiente cuando proceda.</span></label>
            <label className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${showErrors && !servitudeTerms?.legalNoticeAccepted ? 'border-rose-300 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}><input type="checkbox" checked={servitudeTerms?.legalNoticeAccepted || false} onChange={(e) => onChangeClauses({ servitudeTerms: { ...servitudeTerms!, legalNoticeAccepted: e.target.checked } })} className="mt-0.5 rounded text-amber-600" /><span><strong>Aviso legal:</strong> este es un modelo orientativo. Requiere revisión notarial, registral y técnica antes de firmar; en servidumbres sectoriales también deben verificarse permisos, proyecto y normativa autonómica o municipal.</span></label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SECTION 1: DURACIÓN Y PRÓRROGAS LEGALES */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              <Calendar className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Plazo y Prórrogas (Art. 9 LAU)</h3>
              <p className="text-xs text-slate-600">Fecha de entrada y duración pactada</p>
            </div>
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de entrada en vigor y entrega de llaves *
            </label>
            <input
              type="date"
              value={clauses.startDate}
              onChange={(e) => onChangeClauses({ startDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
            />
          </div>

          {/* Duración en meses / años */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duración inicial pactada
            </label>
            <select
              value={clauses.durationMonths}
              onChange={(e) => onChangeClauses({ durationMonths: parseInt(e.target.value, 10) })}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
            >
              {isSeasonal ? (
                <>
                  <option value={3}>3 meses (Corta estancia justificada)</option>
                  <option value={6}>6 meses (Semestre universitario / laboral)</option>
                  <option value={9}>9 meses (Curso lectivo)</option>
                  <option value={11}>11 meses (Temporada laboral estándar)</option>
                </>
              ) : (
                <>
                  <option value={12}>1 año (con prórrogas anuales obligatorias hasta 5 años - Estándar)</option>
                  <option value={24}>2 años</option>
                  <option value={36}>3 años</option>
                  <option value={60}>5 años (Duración legal completa para persona física)</option>
                  <option value={84}>7 años (Para personas jurídicas / sociedades)</option>
                </>
              )}
            </select>
          </div>

          {/* Cláusula de prórroga legal obligatoria */}
          {isHousing && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clauses.mandatoryRenewal}
                  onChange={(e) => onChangeClauses({ mandatoryRenewal: e.target.checked })}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Garantía de prórroga obligatoria (Art. 9.1 LAU)
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Si el plazo pactado fuere inferior a cinco años (persona física), el contrato se prorrogará obligatoriamente por plazos anuales hasta que alcance una duración mínima de cinco años, salvo preaviso del inquilino con 30 días de antelación.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Desistimiento anticipado */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Desistimiento del Arrendatario (Art. 11 LAU)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              El inquilino podrá desistir del contrato una vez hayan transcurrido al menos <strong>seis meses</strong>, siempre que lo comunique al arrendador con una antelación mínima de <strong>treinta días</strong>.
            </p>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={clauses.maxEarlyTerminationIndemnity}
                onChange={(e) => onChangeClauses({ maxEarlyTerminationIndemnity: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Pactar indemnización legal máxima (1 mensualidad por año que reste)
              </span>
            </label>
          </div>

        </div>

        {/* SECTION 2: ACTUALIZACIÓN DE RENTA Y GASTOS */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Régimen de Renta y Suministros</h3>
              <p className="text-xs text-slate-600">Actualización anual e imputación de gastos</p>
            </div>
          </div>

          {/* Índice de actualización */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Mecanismo de actualización anual de renta (Art. 18 LAU)</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Ley 12/2023</span>
            </label>
            <select
              value={clauses.rentUpdateIndex}
              onChange={(e) => onChangeClauses({ rentUpdateIndex: e.target.value as any })}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
            >
              <option value="IRAV">Índice de Referencia de Arrendamientos de Vivienda (IRAV / Límite legal actual)</option>
              <option value="IPC">Variación anual del IPC (con tope máximo regulatorio fijado por el INE)</option>
              <option value="Sin actualización">Sin actualización (renta invariable durante el periodo inicial)</option>
            </select>
            <p className="text-[11px] text-slate-700 mt-1">
              * Nota: Conforme al art. 18.1 LAU, si no hay pacto expreso no se actualizará la renta. La actualización nunca superará el límite fijado por la legislación estatal.
            </p>
          </div>

          {/* Suministros y gastos incluidos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Gastos y suministros incluidos en el precio pactado</span>
            </label>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clauses.utilitiesIncluded.communityFees}
                  onChange={(e) => onChangeClauses({
                    utilitiesIncluded: { ...clauses.utilitiesIncluded, communityFees: e.target.checked }
                  })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-slate-700">Comunidad e IBI (Arrendador)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clauses.utilitiesIncluded.water}
                  onChange={(e) => onChangeClauses({
                    utilitiesIncluded: { ...clauses.utilitiesIncluded, water: e.target.checked }
                  })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-slate-700">Agua corriente</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clauses.utilitiesIncluded.electricity}
                  onChange={(e) => onChangeClauses({
                    utilitiesIncluded: { ...clauses.utilitiesIncluded, electricity: e.target.checked }
                  })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-slate-700">Electricidad / Luz</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clauses.utilitiesIncluded.internet}
                  onChange={(e) => onChangeClauses({
                    utilitiesIncluded: { ...clauses.utilitiesIncluded, internet: e.target.checked }
                  })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-slate-700">Internet Wi-Fi</span>
              </label>
            </div>
            <p className="text-[10px] text-slate-700 mt-1">
              Los suministros no marcados serán de cuenta y cargo exclusivo de la parte arrendataria mediante domiciliación o repercusión de factura.
            </p>
          </div>

          {/* Mascotas & Subarriendo */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Dog className="w-3.5 h-3.5 text-amber-600" />
                <span>Tenencia de mascotas</span>
              </label>
              <select
                value={clauses.allowPets}
                onChange={(e) => onChangeClauses({ allowPets: e.target.value as any })}
                className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
              >
                <option value="no">Prohibidas expresamente</option>
                <option value="previa_autorizacion">Solo con permiso previo</option>
                <option value="si">Permitidas libremente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Ban className="w-3.5 h-3.5 text-rose-600" />
                <span>Cesión y subarriendo</span>
              </label>
              <div className="flex items-center h-9 px-2 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clauses.prohibitSublease}
                    onChange={(e) => onChangeClauses({ prohibitSublease: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Prohibido (Art. 8 LAU)</span>
                </label>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3: CLÁUSULAS ESPECIALES Y FUERO */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Pactos especiales y Fuero Jurisdiccional</h3>
          </div>
          <span className="text-xs text-slate-700 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-slate-600" /> Art. 52.1.7º LEC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estipulaciones o cláusulas personalizadas adicionales (opcional)
            </label>
            <textarea
              rows={3}
              value={clauses.specialClauses}
              onChange={(e) => onChangeClauses({ specialClauses: e.target.value })}
              placeholder="Ej. Queda expresamente prohibido fumar en el interior de la vivienda. Se pacta la contratación de seguro de hogar con cobertura de responsabilidad civil..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-mono placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Juzgados y Tribunales competentes *
            </label>
            <input
              type="text"
              value={clauses.jurisdictionCity}
              onChange={(e) => onChangeClauses({ jurisdictionCity: e.target.value })}
              placeholder="Ej. Madrid"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
            />
            <p className="text-[11px] text-slate-700 mt-2 leading-tight">
              En arrendamientos urbanos de vivienda habitual, la competencia judicial territorial es improrrogable a favor del partido judicial del inmueble.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
        >
          ← Volver a Inmueble y Renta
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>Avanzar a Firma Digital y Documento Final</span>
          <span className="text-xs">→</span>
        </button>
      </div>

    </div>
  );
};
