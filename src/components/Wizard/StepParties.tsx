import React, { useState } from 'react';
import { PartyData, ContractType } from '../../types/contract';
import { validateDoc, validateSpanishPhone, validatePostalCode } from '../../utils/spanishValidation';
import { User, Phone, Mail, MapPin, AlertCircle, CheckCircle2, Wand2, ShieldAlert } from 'lucide-react';

interface StepPartiesProps {
  contractType: ContractType;
  party1: PartyData;
  party2: PartyData;
  onChangeParty1: (data: Partial<PartyData>) => void;
  onChangeParty2: (data: Partial<PartyData>) => void;
  onNext: () => void;
}

export const StepParties: React.FC<StepPartiesProps> = ({
  contractType,
  party1,
  party2,
  onChangeParty1,
  onChangeParty2,
  onNext
}) => {
  const [showErrors, setShowErrors] = useState(false);
  const isServitude = contractType.startsWith('servidumbre_');

  // Validation checks
  const p1DocCheck = validateDoc(party1.docNumber, party1.docType);
  const p1PhoneCheck = validateSpanishPhone(party1.phone);
  const p1CpCheck = validatePostalCode(party1.postalCode);
  const p1NameValid = party1.name.trim().length >= 3;
  const p1AddressValid = party1.address.trim().length >= 5;

  const p2DocCheck = validateDoc(party2.docNumber, party2.docType);
  const p2PhoneCheck = validateSpanishPhone(party2.phone);
  const p2CpCheck = validatePostalCode(party2.postalCode);
  const p2NameValid = party2.name.trim().length >= 3;
  const p2AddressValid = party2.address.trim().length >= 5;

  const isFormValid = 
    p1DocCheck.isValid && p1PhoneCheck.isValid && p1CpCheck.isValid && p1NameValid && p1AddressValid &&
    p2DocCheck.isValid && p2PhoneCheck.isValid && p2CpCheck.isValid && p2NameValid && p2AddressValid;

  const handleNextClick = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const handleAutofillExample = () => {
    onChangeParty1({
      name: 'María del Carmen Sánchez Romero',
      docType: 'DNI',
      docNumber: '53892147A',
      address: 'Calle Serrano 72, 3º Dcha',
      city: 'Madrid',
      postalCode: '28006',
      province: 'Madrid',
      phone: '+34 612 998 877',
      email: 'm.carmen.sanchez@ejemplo.es'
    });
    onChangeParty2({
      name: 'David Ortiz Gómez',
      docType: 'DNI',
      docNumber: '71458923Z',
      address: 'Ronda de Sant Pere 19, 1º 2ª',
      city: 'Barcelona',
      postalCode: '08010',
      province: 'Barcelona',
      phone: '+34 670 123 456',
      email: 'david.ortiz@ejemplo.es'
    });
    setShowErrors(false);
  };

  // Dynamic titles depending on contract
  const party1Label = contractType === 'arras_compraventa' 
    ? 'Parte Vendedora / Transmitente' 
    : contractType === 'finiquito_laboral' 
    ? 'Empresa / Empleador'
    : contractType === 'compraventa_vehiculo'
    ? 'Parte Vendedora (Transmite vehículo)'
    : contractType === 'prestamo_familiares'
    ? 'Prestamista (Entrega fondos)'
    : contractType === 'servicios_freelance'
    ? 'Profesional Prestador (Freelance)'
    : contractType === 'acuerdo_nda'
    ? 'Parte Reveladora / Emisora'
    : contractType === 'reclamacion_impago'
    ? 'Arrendador / Acreedor Reclamante'
    : contractType === 'resolucion_anticipada'
    ? 'Parte Notificante'
    : contractType === 'entrega_llaves'
    ? 'Parte Arrendadora (Recibe llaves)'
    : isServitude
    ? 'Titular del Predio Dominante / Beneficiario'
    : 'Parte Arrendadora (Propietario)';

  const party2Label = contractType === 'arras_compraventa' 
    ? 'Parte Compradora / Adquirente' 
    : contractType === 'finiquito_laboral' 
    ? 'Trabajador/a'
    : contractType === 'compraventa_vehiculo'
    ? 'Parte Compradora (Adquiere vehículo)'
    : contractType === 'prestamo_familiares'
    ? 'Prestatario (Recibe y restituye)'
    : contractType === 'servicios_freelance'
    ? 'Cliente / Empresa Contratante'
    : contractType === 'acuerdo_nda'
    ? 'Parte Receptora / Confidencial'
    : contractType === 'reclamacion_impago'
    ? 'Inquilino / Deudor Requerido'
    : contractType === 'resolucion_anticipada'
    ? 'Parte Notificada'
    : contractType === 'entrega_llaves'
    ? 'Parte Arrendataria (Devuelve llaves)'
    : isServitude
    ? 'Titular del Predio Sirviente / Gravado'
    : 'Parte Arrendataria (Inquilino)';

  return (
    <div className="space-y-8">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Identificación fehaciente de las partes contratantes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isServitude
              ? 'En servidumbres deben quedar claramente identificados titulares y representación de predio dominante y sirviente, con domicilio hábil para notificaciones y acreditación documental.'
              : 'Conforme a la normativa española, los intervinientes deben consignar nombre completo, DNI/NIE válido con letra de control y domicilio a efectos de notificaciones fehacientes (art. 4 LAU y Código Civil).'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutofillExample}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shrink-0 shadow-2xs"
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-600" />
          <span>Rellenar con datos de ejemplo</span>
        </button>
      </div>

      {showErrors && !isFormValid && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Por favor, revisa los datos resaltados en rojo:</p>
            <p className="mt-1 text-rose-700">El DNI/NIE debe contener una letra de control matemática correcta y el teléfono debe coincidir con el formato nacional español (+34 6xx, 7xx, 8xx o 9xx).</p>
          </div>
        </div>
      )}

      {/* Two columns for Party 1 & Party 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PARTY 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{party1Label}</h3>
              <p className="text-xs text-slate-600">Representación legal o persona física</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre y Apellidos completos / Razón Social *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={party1.name}
                  onChange={(e) => onChangeParty1({ name: e.target.value })}
                  placeholder="Ej. Carlos Mendoza García"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && !p1NameValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* Doc Type & Number */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documento
                </label>
                <select
                  value={party1.docType}
                  onChange={(e) => onChangeParty1({ docType: e.target.value as any })}
                  className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                >
                  <option value="DNI">DNI (Español)</option>
                  <option value="NIE">NIE (Extranjero)</option>
                  <option value="CIF">CIF (Sociedad)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Número con letra de control *</span>
                  {p1DocCheck.isValid && (
                    <span className="text-emerald-700 text-[11px] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Válido
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={party1.docNumber}
                  onChange={(e) => onChangeParty1({ docNumber: e.target.value.toUpperCase() })}
                  placeholder={party1.docType === 'DNI' ? '12345678Z' : party1.docType === 'NIE' ? 'X1234567A' : 'B12345678'}
                  className={`w-full px-3 py-2 uppercase bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && !p1DocCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>
            {showErrors && !p1DocCheck.isValid && (
              <p className="text-rose-600 text-[11px] flex items-center gap-1 -mt-2">
                <AlertCircle className="w-3 h-3" /> {p1DocCheck.message}
              </p>
            )}

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domicilio habitual a efectos de notificaciones *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={party1.address}
                  onChange={(e) => onChangeParty1({ address: e.target.value })}
                  placeholder="Ej. Calle Mayor 45, 3º B"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && !p1AddressValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* CP, City, Province */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código Postal *
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={party1.postalCode}
                  onChange={(e) => onChangeParty1({ postalCode: e.target.value.replace(/\D/g, '') })}
                  placeholder="Ej. 28013"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs ${
                    showErrors && !p1CpCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Municipio y Provincia *
                </label>
                <input
                  type="text"
                  value={party1.city}
                  onChange={(e) => onChangeParty1({ city: e.target.value, province: e.target.value })}
                  placeholder="Ej. Madrid"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Teléfono en España *</span>
                  {p1PhoneCheck.isValid && (
                    <span className="text-emerald-700 text-[10px] font-bold">✓</span>
                  )}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={party1.phone}
                    onChange={(e) => onChangeParty1({ phone: e.target.value })}
                    placeholder="Ej. +34 612 345 678"
                    className={`w-full pl-8 pr-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs ${
                      showErrors && !p1PhoneCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={party1.email}
                    onChange={(e) => onChangeParty1({ email: e.target.value })}
                    placeholder="Ej. carlos.mendoza@email.es"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PARTY 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{party2Label}</h3>
              <p className="text-xs text-slate-600">Arrendatario, comprador o trabajador</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre y Apellidos completos *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={party2.name}
                  onChange={(e) => onChangeParty2({ name: e.target.value })}
                  placeholder="Ej. Lucía Navarro Ibáñez"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && !p2NameValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* Doc Type & Number */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documento
                </label>
                <select
                  value={party2.docType}
                  onChange={(e) => onChangeParty2({ docType: e.target.value as any })}
                  className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                >
                  <option value="DNI">DNI (Español)</option>
                  <option value="NIE">NIE (Extranjero)</option>
                  <option value="CIF">CIF (Sociedad)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Número con letra de control *</span>
                  {p2DocCheck.isValid && (
                    <span className="text-emerald-700 text-[11px] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Válido
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={party2.docNumber}
                  onChange={(e) => onChangeParty2({ docNumber: e.target.value.toUpperCase() })}
                  placeholder={party2.docType === 'DNI' ? '87654321X' : 'Y1234567B'}
                  className={`w-full px-3 py-2 uppercase bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && !p2DocCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>
            {showErrors && !p2DocCheck.isValid && (
              <p className="text-rose-600 text-[11px] flex items-center gap-1 -mt-2">
                <AlertCircle className="w-3 h-3" /> {p2DocCheck.message}
              </p>
            )}

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domicilio actual / de procedencia *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={party2.address}
                  onChange={(e) => onChangeParty2({ address: e.target.value })}
                  placeholder="Ej. Avenida de la Constitución 12, 1º A"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors ${
                    showErrors && !p2AddressValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* CP, City, Province */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código Postal *
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={party2.postalCode}
                  onChange={(e) => onChangeParty2({ postalCode: e.target.value.replace(/\D/g, '') })}
                  placeholder="Ej. 46001"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs ${
                    showErrors && !p2CpCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Municipio y Provincia *
                </label>
                <input
                  type="text"
                  value={party2.city}
                  onChange={(e) => onChangeParty2({ city: e.target.value, province: e.target.value })}
                  placeholder="Ej. Valencia"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Teléfono en España *</span>
                  {p2PhoneCheck.isValid && (
                    <span className="text-emerald-700 text-[10px] font-bold">✓</span>
                  )}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={party2.phone}
                    onChange={(e) => onChangeParty2({ phone: e.target.value })}
                    placeholder="Ej. +34 689 765 432"
                    className={`w-full pl-8 pr-3 py-2 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs ${
                      showErrors && !p2PhoneCheck.isValid ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={party2.email}
                    onChange={(e) => onChangeParty2({ email: e.target.value })}
                    placeholder="Ej. lucia.navarro@email.es"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors text-xs"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="text-xs text-slate-700">
          * Campos obligatorios según la Ley de Enjuiciamiento Civil y LAU.
        </span>

        <button
          type="button"
          onClick={handleNextClick}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>Siguiente: Inmueble y condiciones</span>
          <span className="text-xs">→</span>
        </button>
      </div>

    </div>
  );
};
