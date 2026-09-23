import React, { useState } from 'react';
import { AssetData, ContractType } from '../../types/contract';
import { validateCatastralRef, validateSpanishIBAN, validatePostalCode } from '../../utils/spanishValidation';
import { 
  Building, 
  Euro, 
  HelpCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Info,
  Car,
  FileText,
  Briefcase,
  Lock,
  Calendar,
  Layers,
  Scale
  ,Route
} from 'lucide-react';

interface StepAssetProps {
  contractType: ContractType;
  asset: AssetData;
  onChangeAsset: (data: Partial<AssetData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepAsset: React.FC<StepAssetProps> = ({
  contractType,
  asset,
  onChangeAsset,
  onNext,
  onPrev
}) => {
  const [showErrors, setShowErrors] = useState(false);
  const [newInventoryItem, setNewInventoryItem] = useState('');

  // Validations
  const catastralCheck = validateCatastralRef(asset.cadastralRef);
  const ibanCheck = validateSpanishIBAN(asset.bankIban);
  const cpCheck = validatePostalCode(asset.postalCode);
  const addressValid = asset.address.trim().length >= 5;
  const rentValid = asset.monthlyRent > 0;

  const isVehicle = contractType === 'compraventa_vehiculo';
  const isLoan = contractType === 'prestamo_familiares';
  const isFreelance = contractType === 'servicios_freelance';
  const isNDA = contractType === 'acuerdo_nda';
  const isClaim = contractType === 'reclamacion_impago' || contractType === 'resolucion_anticipada';
  const isLabor = contractType === 'finiquito_laboral';
  const isArras = contractType === 'arras_compraventa';
  const isKeyHandover = contractType === 'entrega_llaves';
  const isCommercial = contractType === 'alquiler_local';
  const isGarage = contractType === 'alquiler_garaje';
  const isRoom = contractType === 'alquiler_habitacion';
  const isSeasonal = contractType === 'alquiler_temporada';
  const isHousing = contractType === 'alquiler_vivienda';
  const isServitude = contractType.startsWith('servidumbre_');
  const isSectorialServitude = contractType === 'servidumbre_instalaciones_sectoriales';
  const isRealEstate = !isVehicle && !isLoan && !isFreelance && !isNDA && !isLabor;

  let isFormValid = true;
  if (isServitude) {
    const details = asset.servitudeDetails;
    isFormValid = Boolean(details?.dominantOwner.trim() && details?.servientOwner.trim() && details?.dominantRegistryRef.trim() && details?.servientRegistryRef.trim() && details?.routeDescription.trim() && details.widthMeters > 0 && details?.dominantCadastralRef.trim().length === 20 && details?.servientCadastralRef.trim().length === 20);
  } else if (isVehicle) {
    const brandOk = (asset.vehicleDetails?.brandModel?.trim().length ?? 0) >= 2;
    const plateOk = (asset.vehicleDetails?.plate?.trim().length ?? 0) >= 4;
    const priceOk = asset.monthlyRent > 0;
    isFormValid = brandOk && plateOk && priceOk;
  } else if (isLoan) {
    isFormValid = (asset.loanDetails?.principalAmount ?? 0) > 0;
  } else if (isFreelance) {
    isFormValid = (asset.freelanceDetails?.serviceDescription?.trim().length ?? 0) >= 3 && 
                  (asset.freelanceDetails?.totalFee ?? 0) > 0;
  } else if (isNDA) {
    isFormValid = (asset.ndaDetails?.confidentialProjectName?.trim().length ?? 0) >= 2;
  } else if (isClaim) {
    isFormValid = (asset.claimDetails?.debtTotalAmount ?? 0) > 0 || asset.address.trim().length >= 3;
  } else if (isLabor) {
    isFormValid = asset.monthlyRent > 0 || (asset.laborDetails?.pendingSalary ?? 0) > 0;
  } else {
    const cadastralValid = !asset.cadastralRef || asset.cadastralRef.trim().length === 20;
    isFormValid = addressValid && rentValid && cpCheck.isValid && cadastralValid;
  }

  const handleNext = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInventoryItem.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      item: newInventoryItem.trim(),
      status: 'Buen estado' as const
    };
    onChangeAsset({
      inventoryList: [...asset.inventoryList, newItem],
      hasInventory: true
    });
    setNewInventoryItem('');
  };

  const handleRemoveInventory = (id: string) => {
    const filtered = asset.inventoryList.filter(item => item.id !== id);
    onChangeAsset({
      inventoryList: filtered,
      hasInventory: filtered.length > 0
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {isVehicle
            ? '2. Datos del Vehículo y Condiciones de Compraventa'
            : isLoan
            ? '2. Condiciones del Préstamo Familiar'
            : isFreelance
            ? '2. Encargo de Servicios y Honorarios Profesionales'
            : isNDA
            ? '2. Definición del Proyecto y Ámbito de Confidencialidad'
            : isClaim
            ? '2. Importe y Concepto de la Reclamación'
            : isLabor
            ? '2. Liquidación y Conceptos del Finiquito'
            : isKeyHandover
            ? '2. Estado del Inmueble y Entrega de Llaves'
            : isArras
            ? '2. Finca Objeto y Arras Penitenciales'
            : '2. Identificación del Inmueble y Condiciones Económicas'}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {isVehicle
            ? 'Especificaciones técnicas del automóvil o motocicleta según permiso de circulación.'
            : isLoan
            ? 'Importe, calendario de amortización al 0% y exención tributaria (Modelo 600).'
            : isFreelance
            ? 'Alcance de las prestaciones, entregables, honorarios e IRPF aplicable.'
            : isNDA
            ? 'Protección de secretos empresariales conforme a la Ley 1/2019.'
            : isClaim
            ? 'Detalle de mensualidades devengadas y advertencia formal con efectos probatorios.'
            : isLabor
            ? 'Desglose de haberes pendientes con efecto extintivo y liberatorio.'
            : isKeyHandover
            ? 'Lecturas de contadores y saldo final de fianza.'
            : 'Cumplimiento estricto con la Ley de Arrendamientos Urbanos (LAU) y Catastro.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SECTION 1: OBJETO O ASSET */}
        {isServitude ? (
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center"><Route className="w-4 h-4" /></div>
              <div><h3 className="font-bold text-slate-900">Delimitación de las fincas y del derecho</h3><p className="text-xs text-slate-600">La descripción debe poder trasladarse a escritura, plano y Registro.</p></div>
            </div>
            {showErrors && !isFormValid && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">Completa titulares, referencias registrales y catastrales de ambas fincas, trazado y anchura.</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3 p-4 bg-cyan-50/60 border border-cyan-100 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wide text-cyan-950">Predio dominante</h4>
                <input value={asset.servitudeDetails?.dominantOwner || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, dominantOwner: e.target.value } })} placeholder="Titular/es del predio dominante *" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" />
                <input value={asset.servitudeDetails?.dominantAddress || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, dominantAddress: e.target.value } })} placeholder="Dirección y municipio" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" />
                <input value={asset.servitudeDetails?.dominantRegistryRef || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, dominantRegistryRef: e.target.value } })} placeholder="Finca registral / CRU *" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono" />
                <input maxLength={20} value={asset.servitudeDetails?.dominantCadastralRef || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, dominantCadastralRef: e.target.value.toUpperCase().replace(/\s/g, '') } })} placeholder="Referencia catastral (20) *" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono" />
              </div>
              <div className="space-y-3 p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wide text-amber-950">Predio sirviente</h4>
                <input value={asset.servitudeDetails?.servientOwner || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, servientOwner: e.target.value } })} placeholder="Titular/es del predio sirviente *" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" />
                <input value={asset.servitudeDetails?.servientAddress || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, servientAddress: e.target.value } })} placeholder="Dirección y municipio" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" />
                <input value={asset.servitudeDetails?.servientRegistryRef || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, servientRegistryRef: e.target.value } })} placeholder="Finca registral / CRU *" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono" />
                <input maxLength={20} value={asset.servitudeDetails?.servientCadastralRef || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, servientCadastralRef: e.target.value.toUpperCase().replace(/\s/g, '') } })} placeholder="Referencia catastral (20) *" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-700 mb-1">Trazado, puntos de inicio y final, hitos y plano de referencia *</label><textarea rows={4} value={asset.servitudeDetails?.routeDescription || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, routeDescription: e.target.value } })} placeholder="Ej. Desde el lindero norte de la finca sirviente hasta el camino municipal, conforme al plano anexo..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" /></div>
              <div className="space-y-3"><div><label className="block text-xs font-semibold text-slate-700 mb-1">Anchura (m) *</label><input type="number" min={0.1} step="0.1" value={asset.servitudeDetails?.widthMeters || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, widthMeters: parseFloat(e.target.value) || 0 } })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" /></div><div><label className="block text-xs font-semibold text-slate-700 mb-1">Superficie afectada (m2)</label><input type="number" min={0} step="0.1" value={asset.servitudeDetails?.surfaceM2 || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, surfaceM2: parseFloat(e.target.value) || 0 } })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" /></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><textarea rows={2} value={asset.servitudeDetails?.useAndSchedule || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, useAndSchedule: e.target.value } })} placeholder="Uso autorizado, vehículos, personas, horarios, frecuencia y duración..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" /><textarea rows={2} value={asset.servitudeDetails?.technicalProject || ''} onChange={(e) => onChangeAsset({ servitudeDetails: { ...asset.servitudeDetails!, technicalProject: e.target.value } })} placeholder="Proyecto técnico, memoria, plano o coordenadas (si aplica)..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" /></div>
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] leading-relaxed"><strong className="text-cyan-300">{isSectorialServitude ? 'Supuesto sectorial:' : 'Supuesto civil:'}</strong> {isSectorialServitude ? 'este modelo no sustituye declaración de utilidad pública, expediente de ocupación, autorizaciones energéticas o de telecomunicaciones, proyecto técnico ni normativa autonómica y municipal.' : 'la constitución voluntaria debe elevarse a público y presentarse al Registro si se quiere oponer con seguridad frente a terceros.'}</div>
          </div>
        ) : isVehicle ? (
          /* MOTOR: COMPRAVENTA DE VEHÍCULO */
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                <Car className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Datos del Vehículo</h3>
                <p className="text-xs text-slate-600">Marca, modelo, matrícula y número de bastidor</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marca, Modelo y Versión exacta *
              </label>
              <input
                type="text"
                value={asset.vehicleDetails?.brandModel || ''}
                onChange={(e) => onChangeAsset({
                  vehicleDetails: {
                    ...(asset.vehicleDetails || { plate: '', vinNumber: '', km: 0, year: new Date().getFullYear(), hasInspectionWaiver: false, hiddenDefectsClause: true, itvValid: true, ivtmPaid: true }),
                    brandModel: e.target.value
                  }
                })}
                placeholder="Ej. Seat León 1.5 TSI 130 CV Style"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                  showErrors && (!asset.vehicleDetails?.brandModel || asset.vehicleDetails.brandModel.trim().length < 2)
                    ? 'border-rose-400 bg-rose-50/50'
                    : 'border-slate-200'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matrícula española *
                </label>
                <input
                  type="text"
                  value={asset.vehicleDetails?.plate || ''}
                  onChange={(e) => onChangeAsset({
                    vehicleDetails: {
                      ...(asset.vehicleDetails || { brandModel: '', vinNumber: '', km: 0, year: new Date().getFullYear(), hasInspectionWaiver: false, hiddenDefectsClause: true, itvValid: true, ivtmPaid: true }),
                      plate: e.target.value.toUpperCase().replace(/\s/g, '')
                    }
                  })}
                  placeholder="Ej. 1234 ABC"
                  className={`w-full px-3 py-2 uppercase font-mono bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && (!asset.vehicleDetails?.plate || asset.vehicleDetails.plate.trim().length < 4)
                      ? 'border-rose-400 bg-rose-50/50'
                      : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Año de matriculación *
                </label>
                <input
                  type="number"
                  min={1980}
                  max={new Date().getFullYear()}
                  value={asset.vehicleDetails?.year ? asset.vehicleDetails.year : ''}
                  onChange={(e) => onChangeAsset({
                    vehicleDetails: {
                      ...(asset.vehicleDetails || { brandModel: '', plate: '', vinNumber: '', km: 0, hasInspectionWaiver: false, hiddenDefectsClause: true, itvValid: true, ivtmPaid: true, year: 2020 }),
                      year: parseInt(e.target.value, 10) || new Date().getFullYear()
                    }
                  })}
                  placeholder="Ej. 2019"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kilometraje real
                </label>
                <input
                  type="number"
                  min={0}
                  value={asset.vehicleDetails?.km ? asset.vehicleDetails.km : ''}
                  onChange={(e) => onChangeAsset({
                    vehicleDetails: {
                      ...(asset.vehicleDetails || { brandModel: '', plate: '', vinNumber: '', year: 2020, hasInspectionWaiver: false, hiddenDefectsClause: true, itvValid: true, ivtmPaid: true, km: 0 }),
                      km: parseInt(e.target.value, 10) || 0
                    }
                  })}
                  placeholder="Ej. 85000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nº Bastidor / VIN (17 caract.)
                </label>
                <input
                  type="text"
                  maxLength={17}
                  value={asset.vehicleDetails?.vinNumber || ''}
                  onChange={(e) => onChangeAsset({
                    vehicleDetails: {
                      ...(asset.vehicleDetails || { brandModel: '', plate: '', km: 0, year: 2020, hasInspectionWaiver: false, hiddenDefectsClause: true, itvValid: true, ivtmPaid: true, vinNumber: '' }),
                      vinNumber: e.target.value.toUpperCase().replace(/\s/g, '')
                    }
                  })}
                  placeholder="Ej. VSSZZZ5FZKR123456"
                  className="w-full px-3 py-2 uppercase font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-950">
                <input
                  type="checkbox"
                  checked={asset.vehicleDetails?.hiddenDefectsClause ?? true}
                  onChange={(e) => onChangeAsset({
                    vehicleDetails: {
                      ...(asset.vehicleDetails || { brandModel: '', plate: '', vinNumber: '', km: 0, year: 2020, hasInspectionWaiver: false, itvValid: true, ivtmPaid: true, hiddenDefectsClause: true }),
                      hiddenDefectsClause: e.target.checked
                    }
                  })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Cláusula de saneamiento por vicios ocultos (Art. 1484 Código Civil - 6 meses)</span>
              </label>
            </div>
          </div>
        ) : isLoan ? (
          /* PRÉSTAMO ENTRE FAMILIARES */
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <Euro className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Términos del Préstamo</h3>
                <p className="text-xs text-slate-600">Importe, plazo y justificación fiscal ante Hacienda</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Importe total del préstamo familiar (€) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  value={asset.loanDetails?.principalAmount ? asset.loanDetails.principalAmount : ''}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    const months = asset.loanDetails?.repaymentMonths || 36;
                    onChangeAsset({
                      monthlyRent: amount,
                      loanDetails: {
                        ...(asset.loanDetails || { interestRatePercent: 0, repaymentMonths: 36, purpose: '', isTaxExemptModel600: true, accountTransferIban: '' }),
                        principalAmount: amount,
                        monthlyInstallment: months > 0 ? Math.round((amount / months) * 100) / 100 : 0
                      }
                    });
                  }}
                  placeholder="Ej. 15000"
                  className={`w-full pl-3 pr-12 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && (!asset.loanDetails?.principalAmount || asset.loanDetails.principalAmount <= 0)
                      ? 'border-rose-400 bg-rose-50/50'
                      : 'border-slate-200'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">€</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plazo de amortización (meses)
                </label>
                <input
                  type="number"
                  min={1}
                  max={360}
                  value={asset.loanDetails?.repaymentMonths ? asset.loanDetails.repaymentMonths : ''}
                  onChange={(e) => {
                    const months = parseInt(e.target.value, 10) || 12;
                    const amount = asset.loanDetails?.principalAmount || 0;
                    onChangeAsset({
                      loanDetails: {
                        ...(asset.loanDetails || { principalAmount: 0, interestRatePercent: 0, purpose: '', isTaxExemptModel600: true, accountTransferIban: '' }),
                        repaymentMonths: months,
                        monthlyInstallment: months > 0 ? Math.round((amount / months) * 100) / 100 : 0
                      }
                    });
                  }}
                  placeholder="Ej. 36"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Interés pactado
                </label>
                <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                  <span>0,00 % (Sin intereses)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">Exento IRPF</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Finalidad o Destino de los fondos
              </label>
              <input
                type="text"
                value={asset.loanDetails?.purpose || ''}
                onChange={(e) => onChangeAsset({
                  loanDetails: {
                    ...(asset.loanDetails || { principalAmount: 0, interestRatePercent: 0, repaymentMonths: 36, monthlyInstallment: 0, isTaxExemptModel600: true, accountTransferIban: '' }),
                    purpose: e.target.value
                  }
                })}
                placeholder="Ej. Ayuda familiar para la adquisición de vivienda habitual o reforma"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>

            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5 text-[11px] text-blue-950 leading-relaxed">
              <Scale className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Exención fiscal formal:</strong> El préstamo entre particulares está sujeto a ITP y AJD pero <strong>exento de pago</strong>. Debe presentarse el Modelo 600 ante la Agencia Tributaria Autonómica en 30 días para evitar que Hacienda lo considere donación encubierta.
              </div>
            </div>
          </div>
        ) : isFreelance ? (
          /* SERVICIOS PROFESIONALES FREELANCE */
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                <Briefcase className="w-4 h-4 text-indigo-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Encargo y Prestación de Servicios</h3>
                <p className="text-xs text-slate-600">Descripción del proyecto, entregables y derechos de autor</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción detallada del servicio profesional *
              </label>
              <textarea
                rows={3}
                value={asset.freelanceDetails?.serviceDescription || ''}
                onChange={(e) => onChangeAsset({
                  freelanceDetails: {
                    ...(asset.freelanceDetails || { deliverables: '', totalFee: 0, billingType: 'por_proyecto', irpfWithholdingRate: 15, vatRate: 21, copyrightTransfer: true, paymentTermDays: 30 }),
                    serviceDescription: e.target.value
                  }
                })}
                placeholder="Ej. Desarrollo de software web full-stack, integración de pasarela de pago y despliegue en servidor cloud..."
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                  showErrors && (!asset.freelanceDetails?.serviceDescription || asset.freelanceDetails.serviceDescription.trim().length < 3)
                    ? 'border-rose-400 bg-rose-50/50'
                    : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Entregables concretos y fases
              </label>
              <input
                type="text"
                value={asset.freelanceDetails?.deliverables || ''}
                onChange={(e) => onChangeAsset({
                  freelanceDetails: {
                    ...(asset.freelanceDetails || { serviceDescription: '', totalFee: 0, billingType: 'por_proyecto', irpfWithholdingRate: 15, vatRate: 21, copyrightTransfer: true, paymentTermDays: 30 }),
                    deliverables: e.target.value
                  }
                })}
                placeholder="Ej. Código fuente documentado en GitHub, manual técnico y despliegue final"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Modalidad de facturación
                </label>
                <select
                  value={asset.freelanceDetails?.billingType || 'por_proyecto'}
                  onChange={(e) => onChangeAsset({
                    freelanceDetails: {
                      ...(asset.freelanceDetails || { serviceDescription: '', deliverables: '', totalFee: 0, irpfWithholdingRate: 15, vatRate: 21, copyrightTransfer: true, paymentTermDays: 30 }),
                      billingType: e.target.value as any
                    }
                  })}
                  className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                >
                  <option value="por_proyecto">Por proyecto cerrado</option>
                  <option value="mensual">Cuota mensual fija</option>
                  <option value="por_horas">Por horas de dedicación</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plazo de pago (días)
                </label>
                <select
                  value={asset.freelanceDetails?.paymentTermDays || 30}
                  onChange={(e) => onChangeAsset({
                    freelanceDetails: {
                      ...(asset.freelanceDetails || { serviceDescription: '', deliverables: '', totalFee: 0, billingType: 'por_proyecto', irpfWithholdingRate: 15, vatRate: 21, copyrightTransfer: true }),
                      paymentTermDays: parseInt(e.target.value, 10)
                    }
                  })}
                  className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                >
                  <option value={15}>15 días fecha factura</option>
                  <option value={30}>30 días (Ley Morosidad)</option>
                  <option value={60}>60 días máximo legal</option>
                </select>
              </div>
            </div>
          </div>
        ) : isNDA ? (
          /* ACUERDO NDA */
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                <Lock className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Definición de Confidencialidad</h3>
                <p className="text-xs text-slate-600">Protección conforme a la Ley 1/2019 de Secretos Empresariales</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre o denominación del Proyecto conjunto *
              </label>
              <input
                type="text"
                value={asset.ndaDetails?.confidentialProjectName || ''}
                onChange={(e) => onChangeAsset({
                  ndaDetails: {
                    ...(asset.ndaDetails || { durationYears: 3, disclosureScope: '', penalClauseAmount: 25000, lawTradeSecretsReference: true }),
                    confidentialProjectName: e.target.value
                  }
                })}
                placeholder="Ej. Proyecto Innovación Logística SaaS 'ContratoModelo'"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                  showErrors && (!asset.ndaDetails?.confidentialProjectName || asset.ndaDetails.confidentialProjectName.trim().length < 2)
                    ? 'border-rose-400 bg-rose-50/50'
                    : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ámbito de la información confidencial compartida
              </label>
              <textarea
                rows={2}
                value={asset.ndaDetails?.disclosureScope || ''}
                onChange={(e) => onChangeAsset({
                  ndaDetails: {
                    ...(asset.ndaDetails || { confidentialProjectName: '', durationYears: 3, penalClauseAmount: 25000, lawTradeSecretsReference: true }),
                    disclosureScope: e.target.value
                  }
                })}
                placeholder="Ej. Información técnica, modelos de algoritmos, bases de datos de clientes, finanzas y planes comerciales estratégicos"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vigencia de confidencialidad
                </label>
                <select
                  value={asset.ndaDetails?.durationYears || 3}
                  onChange={(e) => onChangeAsset({
                    ndaDetails: {
                      ...(asset.ndaDetails || { confidentialProjectName: '', disclosureScope: '', penalClauseAmount: 25000, lawTradeSecretsReference: true }),
                      durationYears: parseInt(e.target.value, 10)
                    }
                  })}
                  className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                >
                  <option value={2}>2 años desde la firma</option>
                  <option value={3}>3 años (Recomendado estándar)</option>
                  <option value={5}>5 años</option>
                  <option value={10}>10 años (Secretos industriales)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cláusula penal disuasoria (€)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={asset.ndaDetails?.penalClauseAmount ? asset.ndaDetails.penalClauseAmount : ''}
                  onChange={(e) => onChangeAsset({
                    ndaDetails: {
                      ...(asset.ndaDetails || { confidentialProjectName: '', durationYears: 3, disclosureScope: '', lawTradeSecretsReference: true }),
                      penalClauseAmount: parseFloat(e.target.value) || 0
                    }
                  })}
                  placeholder="Ej. 25000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        ) : (
          /* REAL ESTATE / INMOBILIARIA: VIVIENDA, HABITACIÓN, LOCAL, GARAJE, ARRAS, ENTREGA DE LLAVES */
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                <Building className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Identificación de la Finca</h3>
                <p className="text-xs text-slate-600">Localización exacta, Catastro y características</p>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dirección exacta del inmueble *
              </label>
              <input
                type="text"
                value={asset.address}
                onChange={(e) => onChangeAsset({ address: e.target.value })}
                placeholder="Ej. Calle Velázquez 88, 4º Derecha"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                  showErrors && !addressValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                }`}
              />
            </div>

            {/* CP, Municipio, Provincia */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código Postal *
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={asset.postalCode}
                  onChange={(e) => onChangeAsset({ postalCode: e.target.value.replace(/\D/g, '') })}
                  placeholder="Ej. 28001"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && !cpCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Municipio y Provincia *
                </label>
                <input
                  type="text"
                  value={asset.city}
                  onChange={(e) => onChangeAsset({ city: e.target.value, province: e.target.value })}
                  placeholder="Ej. Madrid"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
              </div>
            </div>

            {/* Referencia Catastral */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Referencia Catastral (20 caracteres alfanuméricos)
                </label>
                <a
                  href="https://www.sedecatastro.gob.es/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium underline"
                >
                  <span>Sede del Catastro</span>
                  <HelpCircle className="w-3 h-3" />
                </a>
              </div>
              <input
                type="text"
                maxLength={20}
                value={asset.cadastralRef}
                onChange={(e) => onChangeAsset({ cadastralRef: e.target.value.toUpperCase().replace(/\s/g, '') })}
                placeholder="Ej. 9872023VK4797S0001WX"
                className={`w-full px-3 py-2 font-mono uppercase bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                  showErrors && asset.cadastralRef && !catastralCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                }`}
              />
              {asset.cadastralRef && !catastralCheck.isValid && (
                <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {catastralCheck.message} ({asset.cadastralRef.length}/20)
                </p>
              )}
              {asset.cadastralRef && catastralCheck.isValid && (
                <p className="text-emerald-700 text-[11px] mt-1 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Longitud y formato exacto verificado
                </p>
              )}
            </div>

            {/* Specific for Commercial Local */}
            {isCommercial && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                  <span>Condiciones de Uso Comercial / Oficinas</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Actividad comercial o negocio a desarrollar
                  </label>
                  <input
                    type="text"
                    value={asset.commercialDetails?.activityDescription || ''}
                    onChange={(e) => onChangeAsset({
                      commercialDetails: {
                        ...(asset.commercialDetails || { squareMeters: 80, hasLicense: true, ivaRate: 21, irpfRetentionRate: 19, communityAndIbiPaidBy: 'arrendatario' as const }),
                        activityDescription: e.target.value
                      }
                    })}
                    placeholder="Ej. Clínica de fisioterapia, estudio de arquitectura, comercio minorista..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Specific for Garage */}
            {isGarage && (
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-slate-700" />
                  <span>Ubicación de la Plaza de Aparcamiento</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nº de Plaza
                    </label>
                    <input
                      type="text"
                      value={asset.garageDetails?.spotNumber || ''}
                      onChange={(e) => onChangeAsset({
                        garageDetails: {
                          ...(asset.garageDetails || { floorLevel: '-1', hasRemoteControl: true, storageIncluded: false, vatApplicable: true }),
                          spotNumber: e.target.value
                        }
                      })}
                      placeholder="Ej. Plaza 42"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Planta / Sótano
                    </label>
                    <input
                      type="text"
                      value={asset.garageDetails?.floorLevel || ''}
                      onChange={(e) => onChangeAsset({
                        garageDetails: {
                          ...(asset.garageDetails || { spotNumber: '1', hasRemoteControl: true, storageIncluded: false, vatApplicable: true }),
                          floorLevel: e.target.value
                        }
                      })}
                      placeholder="Ej. Sótano -2"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Room Specific Fields */}
            {isRoom && (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Key className="w-3.5 h-3.5 text-blue-700" />
                  <span>Condiciones de la Habitación</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Identificador de la habitación
                  </label>
                  <input
                    type="text"
                    value={asset.roomDetails?.roomNumber || ''}
                    onChange={(e) => onChangeAsset({
                      roomDetails: {
                        ...(asset.roomDetails || { hasKeyLock: true, hasPrivateBathroom: false, sharedAreas: ['Cocina', 'Salón', 'Baño'] }),
                        roomNumber: e.target.value
                      }
                    })}
                    placeholder="Ej. Habitación 2 (Exterior con balcón)"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asset.roomDetails?.hasKeyLock ?? true}
                      onChange={(e) => onChangeAsset({
                        roomDetails: {
                          ...(asset.roomDetails || { roomNumber: 'Habitación', hasPrivateBathroom: false, sharedAreas: ['Cocina', 'Baño'] }),
                          hasKeyLock: e.target.checked
                        }
                      })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-slate-700">Cerradura con llave propia</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asset.roomDetails?.hasPrivateBathroom ?? false}
                      onChange={(e) => onChangeAsset({
                        roomDetails: {
                          ...(asset.roomDetails || { roomNumber: 'Habitación', hasKeyLock: true, sharedAreas: ['Cocina', 'Baño'] }),
                          hasPrivateBathroom: e.target.checked
                        }
                      })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-slate-700">Baño privado en suite</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: CONDICIONES ECONÓMICAS / LIQUIDACIÓN / PRECIO */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <Euro className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isVehicle
                  ? 'Precio y Forma de Pago del Vehículo'
                  : isLoan
                  ? 'Devolución y Cuenta Bancaria'
                  : isFreelance
                  ? 'Honorarios y Facturación'
                  : isNDA
                  ? 'Penalizaciones y Jurisdicción'
                  : isClaim
                  ? 'Importe Reclamado y Plazo'
                  : isLabor
                  ? 'Liquidación y Saldo de Haberes'
                  : isArras
                  ? 'Condiciones Económicas de las Arras'
                  : 'Condiciones Económicas'}
              </h3>
              <p className="text-xs text-slate-600">
                {isVehicle
                  ? 'Importe total acordado de compraventa e IBAN del vendedor'
                  : isLoan
                  ? 'Calendario de abono y cuenta del prestamista'
                  : isFreelance
                  ? 'Precio del servicio, retenciones e impuestos'
                  : isClaim
                  ? 'Deuda exigible y plazo perentorio de abono'
                  : isLabor
                  ? 'Total a percibir y abono de liquidación'
                  : isArras
                  ? 'Precio acordado, señal e IBAN'
                  : 'Renta pactada, fianza LAU y cuenta bancaria'}
              </p>
            </div>
          </div>

          {/* Renta Mensual o Importe Principal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isVehicle
                ? 'Precio total de compraventa acordado (€) *'
                : isLoan
                ? 'Cuota mensual de amortización resultante (€)'
                : isFreelance
                ? 'Honorarios totales o tarifa del servicio (€) *'
                : isNDA
                ? 'Indemnización pactada por vulneración de secreto (€)'
                : isClaim
                ? 'Importe total líquido adeudado (€) *'
                : isLabor
                ? 'Total líquido a percibir por el trabajador (€) *'
                : isArras
                ? 'Importe de la señal / arras penitenciales (€) *'
                : 'Renta pactada mensual (€) *'}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={
                  isLoan
                    ? (asset.loanDetails?.monthlyInstallment || '')
                    : isFreelance
                    ? (asset.freelanceDetails?.totalFee ? asset.freelanceDetails.totalFee : '')
                    : isClaim
                    ? (asset.claimDetails?.debtTotalAmount ? asset.claimDetails.debtTotalAmount : '')
                    : (asset.monthlyRent ? asset.monthlyRent : '')
                }
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                  if (isFreelance) {
                    onChangeAsset({
                      monthlyRent: val,
                      freelanceDetails: {
                        ...(asset.freelanceDetails || { serviceDescription: '', deliverables: '', billingType: 'por_proyecto', irpfWithholdingRate: 15, vatRate: 21, copyrightTransfer: true, paymentTermDays: 30 }),
                        totalFee: val
                      }
                    });
                  } else if (isClaim) {
                    onChangeAsset({
                      monthlyRent: val,
                      claimDetails: {
                        ...(asset.claimDetails || { overdueMonthsCount: 2, paymentDeadlineDays: 10, originalContractDate: '', warningEvictionArt27: true, warningSolvencyFiles: true, terminationNoticeDays: 30, debtTotalAmount: 0 }),
                        debtTotalAmount: val
                      }
                    });
                  } else {
                    onChangeAsset({ monthlyRent: val });
                  }
                }}
                placeholder={
                  isVehicle
                    ? '8500'
                    : isLoan
                    ? '416'
                    : isFreelance
                    ? '2800'
                    : isClaim
                    ? '1900'
                    : isLabor
                    ? '2450'
                    : isArras
                    ? '15000'
                    : '950'
                }
                className={`w-full pl-3 pr-16 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                  showErrors && rentValid === false && !isLoan ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                {isVehicle || isArras || isLabor || isFreelance || isClaim ? '€ Total' : '€ / mes'}
              </span>
            </div>
          </div>

          {/* Real Estate Deposit Section */}
          {isRealEstate && !isArras && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Fianza legal *</span>
                    <span className="text-[10px] text-slate-600 font-normal">Art. 36.1 LAU</span>
                  </label>
                  <select
                    value={asset.legalDepositMonths}
                    onChange={(e) => onChangeAsset({ legalDepositMonths: parseInt(e.target.value, 10) })}
                    className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                  >
                    <option value={1}>1 mes ({asset.monthlyRent} € - Vivienda habitual)</option>
                    <option value={2}>2 meses ({asset.monthlyRent * 2} € - Uso distinto / Local / Temporada)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Garantía adicional</span>
                    <span className="text-[10px] text-amber-700 font-semibold">Máx 2 meses</span>
                  </label>
                  <select
                    value={asset.additionalGuaranteeMonths}
                    onChange={(e) => onChangeAsset({ additionalGuaranteeMonths: parseInt(e.target.value, 10) })}
                    className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                  >
                    <option value={0}>Sin garantía adicional (0 €)</option>
                    <option value={1}>1 mes adicional ({asset.monthlyRent} €)</option>
                    <option value={2}>2 meses adicionales ({asset.monthlyRent * 2} € - Tope legal LAU)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-900 leading-relaxed">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Límite legal del art. 36.5 LAU:</strong> En contratos de hasta 5 años (o 7 si el arrendador es persona jurídica), el valor de la garantía adicional no podrá exceder de dos mensualidades de renta.
                </div>
              </div>
            </>
          )}

          {/* Bank IBAN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>
                {isVehicle
                  ? 'Cuenta bancaria IBAN del Vendedor'
                  : isLoan
                  ? 'Cuenta bancaria IBAN del Prestamista'
                  : isFreelance
                  ? 'Cuenta bancaria IBAN del Profesional'
                  : isClaim
                  ? 'Cuenta para regularización de la deuda'
                  : 'Cuenta bancaria IBAN para ingresos'}
              </span>
              {ibanCheck.isValid && asset.bankIban && (
                <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> IBAN Español Válido
                </span>
              )}
            </label>
            <input
              type="text"
              value={asset.bankIban}
              onChange={(e) => onChangeAsset({ bankIban: e.target.value.toUpperCase() })}
              placeholder="Ej. ES91 2100 0418 4502 0005 1332"
              className={`w-full px-3 py-2 font-mono uppercase bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                showErrors && asset.bankIban && !ibanCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
              }`}
            />
            {showErrors && asset.bankIban && !ibanCheck.isValid && (
              <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {ibanCheck.message}
              </p>
            )}
          </div>

        </div>

      </div>

      {/* SECTION 3: INVENTARIO O DETALLES ADICIONALES PARA INMUEBLES */}
      {isRealEstate && !isArras && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Inventario y estado de conservación (Anexo obligatorio recomendado)
              </h3>
              <p className="text-xs text-slate-600">
                Protege la fianza detallando electrodomésticos, mobiliario y condiciones de entrega.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={asset.hasInventory}
                onChange={(e) => onChangeAsset({ hasInventory: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Adjuntar inventario como Anexo I</span>
            </label>
          </div>

          {asset.hasInventory && (
            <div className="space-y-3">
              <form onSubmit={handleAddInventory} className="flex gap-2">
                <input
                  type="text"
                  value={newInventoryItem}
                  onChange={(e) => setNewInventoryItem(e.target.value)}
                  placeholder="Añadir elemento (ej. Frigorífico Combi Bosch A++, Smart TV 55', Sofá Chaise Longue...)"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </form>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl max-h-56 overflow-y-auto">
                {asset.inventoryList.map((item) => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between gap-3 text-xs bg-white hover:bg-slate-50">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="font-medium text-slate-800 truncate">{item.item}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInventory(item.id)}
                        className="text-slate-600 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
        >
          ← Volver a Datos de las Partes
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>Siguiente: Cláusulas y plazos</span>
          <span className="text-xs">→</span>
        </button>
      </div>

    </div>
  );
};
