import React from 'react';
import { ContractState } from '../../types/contract';
import { DigitalEvidenceSeal } from './DigitalEvidenceSeal';
import { formatSpanishDate, formatCurrencyEUR } from '../../utils/cryptoUtils';

interface ContractDocumentA4Props {
  contract: ContractState;
}

export const ContractDocumentA4: React.FC<ContractDocumentA4Props> = ({ contract }) => {
  const { party1, party2, asset, clauses, evidence, contractType, isUnlocked } = contract;

  // Dynamic titles depending on contract type
  const getDocTitle = () => {
    switch (contractType) {
      case 'alquiler_vivienda':
        return 'CONTRATO DE ARRENDAMIENTO DE VIVIENDA HABITUAL';
      case 'alquiler_habitacion':
        return 'CONTRATO DE ARRENDAMIENTO DE HABITACIÓN EN VIVIENDA COMPARTIDA';
      case 'alquiler_local':
        return 'CONTRATO DE ARRENDAMIENTO DE LOCAL COMERCIAL Y OFICINA';
      case 'alquiler_garaje':
        return 'CONTRATO DE ARRENDAMIENTO DE PLAZA DE GARAJE / TRASTERO';
      case 'entrega_llaves':
        return 'ACTA DE ENTREGA DE LLAVES Y FINIQUITO DE ARRENDAMIENTO';
      case 'compraventa_vehiculo':
        return 'CONTRATO DE COMPRAVENTA DE VEHÍCULO USADO ENTRE PARTICULARES';
      case 'prestamo_familiares':
        return 'CONTRATO DE PRÉSTAMO ENTRE PARTICULARES SIN INTERESES (MODELO 600)';
      case 'arras_compraventa':
        return 'CONTRATO DE ARRAS PENITENCIALES (ART. 1454 CÓDIGO CIVIL)';
      case 'servicios_freelance':
        return 'CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES (FREELANCE)';
      case 'acuerdo_nda':
        return 'ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN MUTUA (NDA)';
      case 'reclamacion_impago':
        return 'REQUERIMIENTO FEHACIENTE PREVIO DE PAGO POR IMPAGO DE RENTAS';
      case 'resolucion_anticipada':
        return 'COMUNICACIÓN FEHACIENTE DE RESOLUCIÓN ANTICIPADA DE CONTRATO';
      case 'alquiler_temporada':
        return 'CONTRATO DE ARRENDAMIENTO DE TEMPORADA POR MOTIVO ESPECÍFICO';
      case 'finiquito_laboral':
        return 'PROPUESTA DE LIQUIDACIÓN DE HABERES Y SALDO DE FINIQUITO';
      default:
        return 'CONTRATO LEGAL VINCULANTE';
    }
  };

  const getDocSubtitle = () => {
    switch (contractType) {
      case 'alquiler_vivienda':
        return 'Sujeto expresamente a la Ley 29/1994, de Arrendamientos Urbanos (LAU), reformada por la Ley 12/2023 por el Derecho a la Vivienda';
      case 'alquiler_habitacion':
        return 'Régimen de arrendamiento de cosas conforme a los artículos 1542, 1544 y concordantes del Código Civil';
      case 'alquiler_local':
        return 'Sujeto al Título III de la Ley 29/1994 (Arrendamiento para uso distinto del de vivienda habitual)';
      case 'alquiler_garaje':
        return 'Arrendamiento de espacio privativo regulado por el Código Civil español';
      case 'entrega_llaves':
        return 'Liquidación posesoria, comprobación de desperfectos y regularización de fianzas legales';
      case 'compraventa_vehiculo':
        return 'Regulado por los artículos 1445 y concordantes del Código Civil con cláusulas de vicios ocultos (art. 1484)';
      case 'prestamo_familiares':
        return 'Préstamo mutuo gratuito exento de ITP y AJD conforme al Real Decreto Legislativo 1/1993 y Código Civil';
      case 'arras_compraventa':
        return 'Conforme al régimen legal de arras penitenciales del artículo 1454 del Código Civil';
      case 'servicios_freelance':
        return 'Arrendamiento de servicios (art. 1544 Código Civil) en régimen de trabajador autónomo independiente';
      case 'acuerdo_nda':
        return 'Protección de secretos empresariales con sujeción a la Ley 1/2019 de Secretos Empresariales';
      case 'reclamacion_impago':
        return 'Notificación fehaciente previa a vía judicial con concesión de plazo improrrogable según la LEC';
      case 'resolucion_anticipada':
        return 'Notificación de desestimiento o resolución contractual conforme a los plazos previstos en la LAU';
      case 'alquiler_temporada':
        return 'Sujeto al artículo 3.2 de la Ley 29/1994 de Arrendamientos Urbanos (Uso distinto del de vivienda habitual)';
      case 'finiquito_laboral':
        return 'En cumplimiento del artículo 49.2 del Estatuto de los Trabajadores (Real Decreto Legislativo 2/2015)';
      default:
        return 'Documento redactado conforme al ordenamiento jurídico español vigente';
    }
  };

  const p1RoleLabel = party1.roleTitle ? party1.roleTitle.toUpperCase() : 'PARTE 1';
  const p2RoleLabel = party2.roleTitle ? party2.roleTitle.toUpperCase() : 'PARTE 2';

  // Helper to compile list of included utilities
  const getIncludedUtilities = () => {
    const list: string[] = [];
    if (clauses.utilitiesIncluded.communityFees) list.push('Comunidad de Propietarios e IBI');
    if (clauses.utilitiesIncluded.water) list.push('Agua corriente');
    if (clauses.utilitiesIncluded.electricity) list.push('Electricidad');
    if (clauses.utilitiesIncluded.gas) list.push('Gas');
    if (clauses.utilitiesIncluded.internet) list.push('Acceso a Internet Wi-Fi');
    return list;
  };

  const includedUtilities = getIncludedUtilities();

  return (
    <div
      id="contract-a4-document"
      className="relative mx-auto bg-white rounded-none sm:rounded-xl shadow-2xl border border-slate-300 print:border-none print:shadow-none max-w-4xl font-legal text-slate-900 leading-relaxed overflow-hidden"
    >
      {/* Watermark when NOT unlocked */}
      {!isUnlocked && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center select-none overflow-hidden watermark-overlay">
          <div className="rotate-[-32deg] text-center border-4 border-dashed border-rose-600/30 p-8 rounded-3xl bg-white/40 backdrop-blur-[1px] shadow-lg">
            <p className="text-3xl sm:text-5xl font-extrabold tracking-widest text-rose-600/50 uppercase font-sans">
              BORRADOR NO VINCULANTE
            </p>
            <p className="text-sm sm:text-base font-semibold text-rose-700/60 mt-2 font-sans tracking-wider">
              CONTRATOMODELO.ES • DESBLOQUEA LA VERSIÓN OFICIAL PARA QUITAR MARCA DE AGUA
            </p>
          </div>
        </div>
      )}

      {/* A4 Sheet Content */}
      <div className="p-8 sm:p-14 lg:p-16 text-justify text-sm sm:text-[15px] space-y-6">
        
        {/* Contract Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900 space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold font-title-legal tracking-wide uppercase text-slate-900">
            {getDocTitle()}
          </h1>
          <p className="text-xs sm:text-sm italic text-slate-700 max-w-2xl mx-auto">
            {getDocSubtitle()}
          </p>
          <div className="pt-2 flex justify-center items-center gap-6 text-xs text-slate-600">
            <span>En <strong>{asset.city || party1.city || 'Madrid'}</strong></span>
            <span>•</span>
            <span>A <strong>{formatSpanishDate(clauses.startDate)}</strong></span>
          </div>
        </div>

        {/* SECCIÓN: REUNIDOS */}
        <div className="space-y-3">
          <h2 className="text-base font-bold tracking-wider uppercase border-b border-slate-300 pb-1 text-slate-800">
            REUNIDOS
          </h2>
          
          <p>
            <strong>DE UNA PARTE:</strong> D./Dª. <strong>{party1.name || '__________________________'}</strong>, 
            mayor de edad, con {party1.docType} número <strong>{party1.docNumber || '__________'}</strong>, 
            con domicilio a efectos de notificaciones en {party1.address || '____________________'}, 
            C.P. {party1.postalCode || '_____'}, {party1.city || '__________'} ({party1.province || 'España'}), 
            con teléfono de contacto {party1.phone || '__________'} y dirección electrónica {party1.email || '__________'} 
            (en adelante denominada la <strong>"{p1RoleLabel}"</strong>).
          </p>

          <p>
            <strong>DE OTRA PARTE:</strong> D./Dª. <strong>{party2.name || '__________________________'}</strong>, 
            mayor de edad, con {party2.docType} número <strong>{party2.docNumber || '__________'}</strong>, 
            con domicilio a efectos de notificaciones en {party2.address || asset.address || '____________________'}, 
            C.P. {party2.postalCode || asset.postalCode || '_____'}, {party2.city || asset.city || '__________'} ({party2.province || asset.province || 'España'}), 
            con teléfono de contacto {party2.phone || '__________'} y dirección electrónica {party2.email || '__________'} 
            (en adelante denominada la <strong>"{p2RoleLabel}"</strong>).
          </p>
        </div>

        {/* SECCIÓN: INTERVIENEN */}
        <div className="space-y-2">
          <h2 className="text-base font-bold tracking-wider uppercase border-b border-slate-300 pb-1 text-slate-800">
            INTERVIENEN
          </h2>
          <p>
            Ambas partes intervienen en su propio nombre y derecho, reconociéndose mutua y recíprocamente la plena capacidad legal necesaria para el otorgamiento del presente documento vinculante y, al efecto:
          </p>
        </div>

        {/* SECCIÓN: EXPONEN */}
        <div className="space-y-3">
          <h2 className="text-base font-bold tracking-wider uppercase border-b border-slate-300 pb-1 text-slate-800">
            EXPONEN
          </h2>
          
          {contractType === 'arras_compraventa' ? (
            <>
              <p>
                <strong>I.-</strong> Que la <strong>{p1RoleLabel}</strong> es legítima propietaria y titular en pleno dominio del siguiente inmueble o activo:
              </p>
              <div className="pl-6 border-l-2 border-slate-400 py-1 space-y-1 text-xs sm:text-sm bg-slate-50 p-3 rounded">
                <p><strong>Ubicación:</strong> {asset.address || '______________________________'}, C.P. {asset.postalCode}, {asset.city} ({asset.province}).</p>
                <p><strong>Tipología:</strong> {asset.propertyType}.</p>
                {asset.cadastralRef && (
                  <p><strong>Referencia Catastral oficial:</strong> <span className="font-mono">{asset.cadastralRef}</span>.</p>
                )}
              </div>
              <p>
                <strong>II.-</strong> Que la finca reseñada se halla libre de arrendatarios, ocupantes, cargas, gravámenes o hipotecas pendientes, y al corriente de pago de cuotas ordinarias y extraordinarias de Comunidad de Propietarios y del Impuesto sobre Bienes Inmuebles (IBI).
              </p>
              <p>
                <strong>III.-</strong> Que estando la <strong>{p2RoleLabel}</strong> interesada en la adquisición de dicho inmueble, ambas partes han convenido formalizar un contrato preparatorio con entrega de arras penitenciales al amparo del artículo 1454 del Código Civil.
              </p>
            </>
          ) : contractType === 'finiquito_laboral' ? (
            <>
              <p>
                <strong>I.-</strong> Que D./Dª. {party2.name} ha prestado sus servicios retribuidos por cuenta ajena en la empresa {party1.name}, ostentando la categoría profesional correspondiente a sus funciones.
              </p>
              <p>
                <strong>II.-</strong> Que con fecha de efectos fijada en el <strong>{formatSpanishDate(clauses.startDate)}</strong>, queda extinguida la relación laboral que vinculaba a ambas partes.
              </p>
              <p>
                <strong>III.-</strong> Que al amparo del artículo 49.2 del Estatuto de los Trabajadores, la empresa procede a practicar la preceptiva propuesta de liquidación de haberes devengados, partes proporcionales y saldo de finiquito.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>I.-</strong> Que la <strong>{p1RoleLabel}</strong> es legítima propietaria y titular en pleno dominio del siguiente inmueble:
              </p>
              <div className="pl-6 border-l-2 border-slate-400 py-1 space-y-1 text-xs sm:text-sm bg-slate-50 p-3 rounded">
                <p><strong>Ubicación:</strong> {asset.address || '______________________________'}, C.P. {asset.postalCode}, {asset.city} ({asset.province}).</p>
                <p><strong>Tipología:</strong> {asset.propertyType}.</p>
                {asset.cadastralRef && (
                  <p><strong>Referencia Catastral oficial:</strong> <span className="font-mono">{asset.cadastralRef}</span>.</p>
                )}
                {contractType === 'alquiler_habitacion' && (
                  <p>
                    <strong>Habitación objeto de uso privativo:</strong> {asset.roomDetails?.roomNumber || 'Habitación Nº 1'}. 
                    Cuenta con cerradura {asset.roomDetails?.hasKeyLock ? 'con llave independiente' : 'sin llave propia'} y 
                    baño {asset.roomDetails?.hasPrivateBathroom ? 'privado en suite' : 'de uso compartido'}. Con derecho de acceso y uso compartido de cocina, salón y zonas comunes.
                  </p>
                )}
              </div>

              {contractType === 'alquiler_temporada' ? (
                <>
                  <p>
                    <strong>II.-</strong> Que el presente contrato responde a una <strong>causa expresa y justificada de temporalidad</strong> (por motivos laborales, académicos o formativos de duración determinada), manteniendo la {p2RoleLabel} su residencia permanente, centro vital de intereses y domicilio habitual en {party2.city || 'su localidad de origen'} ({party2.province || 'España'}), por lo que el presente arrendamiento se concierta para un uso distinto del de vivienda al amparo del artículo 3.2 de la LAU.
                  </p>
                  <p>
                    <strong>III.-</strong> Que estando la <strong>{p2RoleLabel}</strong> interesada en ocupar transitoriamente el inmueble durante el periodo acotado, convienen ambas partes en otorgar el presente contrato conforme a las siguientes:
                  </p>
                </>
              ) : contractType === 'alquiler_habitacion' ? (
                <>
                  <p>
                    <strong>II.-</strong> Que la vivienda y el dormitorio asignado se hallan en óptimo estado de salubridad y conservación, provistos de los enseres y suministros precisos para su destino en régimen de cohabitación compartida regida por el Código Civil.
                  </p>
                  <p>
                    <strong>III.-</strong> Que ambas partes convienen en formalizar el arrendamiento de la habitación reseñada con arreglo a las siguientes:
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>II.-</strong> Que la vivienda se encuentra en perfecto estado de uso, habitabilidad y conservación, provista de cédula de habitabilidad o licencia administrativa legalmente exigible, así como de los servicios y suministros inherentes a su destino.
                  </p>
                  <p>
                    <strong>III.-</strong> Que estando la <strong>{p2RoleLabel}</strong> interesada en el arrendamiento de dicho inmueble para destinarlo única y exclusivamente a satisfacer su necesidad permanente de vivienda habitual, convienen ambas partes en otorgar el presente contrato con arreglo a las siguientes:
                  </p>
                </>
              )}
            </>
          )}
        </div>

        {/* SECCIÓN: CLÁUSULAS */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-bold tracking-wider uppercase border-b border-slate-300 pb-1 text-slate-800">
            CLÁUSULAS
          </h2>

          {/* CLÁUSULAS ADAPTADAS POR TIPO DE CONTRATO */}
          {contractType === 'arras_compraventa' ? (
            <>
              <div>
                <h3 className="font-bold text-slate-900">
                  PRIMERA.- COMPROMISO DE COMPRAVENTA.
                </h3>
                <p className="mt-1">
                  La {p1RoleLabel} se compromete formalmente a transmitir en pleno dominio a la {p2RoleLabel}, que se compromete correlativamente a adquirir por compraventa, el inmueble reseñado en el Expositivo I, libre de cargas, gravámenes, arrendatarios y al corriente en el pago de tributos y gastos comunitarios.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SEGUNDA.- PRECIO CONVENIDO DE COMPRAVENTA.
                </h3>
                <p className="mt-1">
                  El precio total convenido y cerrado para la transmisión asciende a la cantidad de <strong>{formatCurrencyEUR(asset.monthlyRent * 10 > 20000 ? asset.monthlyRent * 10 : 185000)}</strong>.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  TERCERA.- ENTREGA DE ARRAS PENITENCIALES.
                </h3>
                <p className="mt-1">
                  En este acto, la parte compradora entrega a la parte vendedora, que la recibe a su entera conformidad y sirve el presente como la más eficaz carta de pago, la cantidad de <strong>{formatCurrencyEUR(asset.monthlyRent * (asset.legalDepositMonths || 1))}</strong> en concepto de <strong>arras penitenciales</strong> mediante {asset.paymentMethod.toLowerCase()} en la cuenta de la parte vendedora IBAN: <strong className="font-mono">{asset.bankIban || 'A designar'}</strong>.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  CUARTA.- EFICACIA RESCISORIA DEL ARTÍCULO 1454 DEL CÓDIGO CIVIL.
                </h3>
                <p className="mt-1">
                  Las cantidades entregadas tienen expresamente la calificación jurídica de <strong>arras penitenciales</strong> reguladas en el artículo 1454 del Código Civil español. En consecuencia, si la parte compradora desistiere de la compraventa o incumpliere la formalización notarial en el plazo estipulado, <strong>perderá la cantidad íntegra entregada</strong>. Si fuere la parte vendedora quien desistiere o incumpliere, vendrá obligada a <strong>devolver las arras duplicadas</strong> (el doble de su importe).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  QUINTA.- ESCRITURA PÚBLICA NOTARIAL Y PAGO DEL RESTO DEL PRECIO.
                </h3>
                <p className="mt-1">
                  El otorgamiento de la escritura pública de compraventa se formalizará ante el Notario que libremente designe la parte compradora, fijándose como fecha límite improrrogable el plazo de <strong>{clauses.durationMonths || 3} meses</strong> contados a partir de la fecha del presente documento. En dicho acto se abonará el resto del precio mediante cheque bancario conformado o transferencia OMF del Banco de España.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SEXTA.- GASTOS E IMPUESTOS.
                </h3>
                <p className="mt-1">
                  Los gastos e impuestos derivados del otorgamiento de la escritura pública de compraventa se satisfarán con arreglo a la ley: el Impuesto sobre el Incremento de Valor de los Terrenos de Naturaleza Urbana (Plusvalía Municipal) será de cuenta y cargo de la parte vendedora; los aranceles de Notaría, Registro de la Propiedad y el Impuesto de Transmisiones Patrimoniales (ITP) corresponderán a la parte compradora.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SÉPTIMA.- FUERO Y ESTIPULACIONES ESPECIALES.
                </h3>
                {clauses.specialClauses && (
                  <p className="mt-1 p-2.5 bg-slate-50 border-l-2 border-amber-500 text-xs sm:text-sm">
                    <strong>Pactos complementarios:</strong> {clauses.specialClauses}
                  </p>
                )}
                <p className="mt-1">
                  Para dirimir cualquier controversia derivada del presente contrato, las partes se someten a los <strong>Juzgados y Tribunales de {clauses.jurisdictionCity || asset.city || 'la ciudad donde radica la finca'}</strong>.
                </p>
              </div>
            </>
          ) : contractType === 'finiquito_laboral' ? (
            <>
              <div>
                <h3 className="font-bold text-slate-900">
                  PRIMERA.- EXTINCIÓN Y CAUSA DE CESE.
                </h3>
                <p className="mt-1">
                  Queda definitivamente extinguido el contrato de trabajo con fecha de efectos del día <strong>{formatSpanishDate(clauses.startDate)}</strong>, cesando recíprocamente las obligaciones emanadas del vínculo laboral.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SEGUNDA.- LIQUIDACIÓN PORMENORIZADA DE HABERES.
                </h3>
                <p className="mt-1">
                  La empresa practica a favor del trabajador la siguiente liquidación y saldo de cuentas:
                </p>
                <div className="my-2 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>1. Salario devengado por días trabajados en el mes en curso:</span>
                    <strong>{formatCurrencyEUR(asset.monthlyRent * 0.5)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Parte proporcional de pagas extraordinarias devengadas:</span>
                    <strong>{formatCurrencyEUR(asset.monthlyRent * 0.3)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Compensación de días de vacaciones devengadas y no disfrutadas:</span>
                    <strong>{formatCurrencyEUR(asset.monthlyRent * 0.2)}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-300 text-sm font-bold text-slate-900">
                    <span>TOTAL LÍQUIDO A PERCIBIR POR EL TRABAJADOR:</span>
                    <span>{formatCurrencyEUR(asset.monthlyRent)}</span>
                  </div>
                </div>
                <p className="mt-1 text-xs">
                  Dicho importe será abonado mediante <strong>{asset.paymentMethod}</strong> en la cuenta del trabajador/a IBAN: <strong className="font-mono">{asset.bankIban || 'Aportado por trabajador'}</strong>.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  TERCERA.- DECLARACIÓN DE SALDO, FINIQUITO Y PAZ LABORAL.
                </h3>
                <p className="mt-1">
                  Con el cobro de la cantidad indicada, el trabajador se da por totalmente saldado y finiquitado en todos los conceptos derivados de su relación laboral con la empresa, sin que quede cantidad alguna pendiente de pago por salarios, complementos, horas extraordinarias ni indemnizaciones, no teniendo nada más que reclamarse por ningún concepto.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  CUARTA.- INFORMACIÓN SOBRE ASISTENCIA SINDICAL (ART. 49.2 ET).
                </h3>
                <p className="mt-1">
                  En estricto cumplimiento de lo prevenido en el artículo 49.2 del Estatuto de los Trabajadores, se hace constar que el trabajador ha sido expresamente informado de su derecho a solicitar la presencia de un representante legal de los trabajadores en el acto de la firma del presente documento de liquidación y finiquito.
                </p>
              </div>
            </>
          ) : contractType === 'alquiler_habitacion' ? (
            <>
              <div>
                <h3 className="font-bold text-slate-900">
                  PRIMERA.- OBJETO Y USO EXCLUSIVO DEL DORMITORIO.
                </h3>
                <p className="mt-1">
                  Por el presente documento, la PARTE ARRENDADORA cede en régimen de arrendamiento a la PARTE ARRENDATARIA, que lo acepta, el uso exclusivo y privativo de la <strong>{asset.roomDetails?.roomNumber || 'Habitación Nº 1'}</strong> situada en la vivienda descrita en el Expositivo I, dotada de cerradura {asset.roomDetails?.hasKeyLock ? 'con llave privativa' : 'ordinaria'} y cuarto de baño {asset.roomDetails?.hasPrivateBathroom ? 'de uso exclusivo en suite' : 'de uso compartido'}.
                </p>
                <p className="mt-1">
                  Asimismo, la arrendataria tendrá derecho al uso compartido y pacífico de las zonas comunes de la vivienda (cocina, vestíbulo, salón y tendedero) respetando en todo momento el descanso de los restantes ocupantes. Queda prohibida la pernoctación de terceras personas ajenas al contrato sin consentimiento expreso previo de la propiedad.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SEGUNDA.- DURACIÓN Y EXCLUSIÓN DE LA PRÓRROGA FORZOSA DE LA LAU.
                </h3>
                <p className="mt-1">
                  El contrato se concierta por un plazo de <strong>{clauses.durationMonths} meses</strong>, con fecha de inicio el <strong>{formatSpanishDate(clauses.startDate)}</strong>. Las partes convienen expresamente que el presente contrato se rige por los artículos 1542, 1554 y siguientes del Código Civil y por la voluntad de las partes, quedando <strong>expresamente excluida la prórroga obligatoria de cinco años del artículo 9 de la LAU</strong> al tratarse del arrendamiento de una habitación y no de una finca urbana habitable completa e independiente.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  TERCERA.- RENTA Y FORMA DE PAGO.
                </h3>
                <p className="mt-1">
                  El precio del arrendamiento de la habitación se fija en la cantidad de <strong>{formatCurrencyEUR(asset.monthlyRent)} mensuales</strong>, que se satisfará dentro de los primeros <strong>{asset.paymentDayLimit} días</strong> de cada mes mediante <strong>{asset.paymentMethod}</strong>
                  {asset.bankIban && (
                    <span> en la cuenta bancaria: <strong className="font-mono">{asset.bankIban}</strong></span>
                  )}.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  CUARTA.- FIANZA EN GARANTÍA.
                </h3>
                <p className="mt-1">
                  La parte arrendataria deposita en este acto en metálico la cantidad de <strong>{formatCurrencyEUR(asset.monthlyRent * asset.legalDepositMonths)}</strong> en concepto de fianza para responder del buen uso de la habitación y de los enseres compartidos, que le será devuelta a la finalización del arriendo tras la comprobación de su correcto estado.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  QUINTA.- SUMINISTROS Y SERVICIOS COMPARTIDOS.
                </h3>
                <p className="mt-1">
                  {includedUtilities.length > 0 ? (
                    <span>
                      Se pacta expresamente que los siguientes servicios están <strong>incluidos en la renta pactada</strong>: <strong>{includedUtilities.join(', ')}</strong>.
                    </span>
                  ) : (
                    <span>
                      Los suministros (electricidad, agua, gas y telecomunicaciones) se distribuirán a partes iguales entre los ocupantes de las habitaciones de la vivienda.
                    </span>
                  )}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SEXTA.- PROHIBICIÓN DE CESIÓN, SUBARRIENDO Y MASCOTAS.
                </h3>
                <p className="mt-1">
                  Queda terminantemente prohibido ceder, traspasar o subarrendar total o parcialmente la habitación o permitir el alojamiento no autorizado de terceras personas.
                  {clauses.allowPets === 'no' ? (
                    <span> Queda terminantemente prohibida la tenencia de animales domésticos en la vivienda.</span>
                  ) : (
                    <span> La tenencia de animales en la vivienda compartida queda sujeta a las normas acordadas entre convivientes.</span>
                  )}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SÉPTIMA.- FUERO Y PACTOS ESPECIALES.
                </h3>
                {clauses.specialClauses && (
                  <p className="mt-1 p-2.5 bg-slate-50 border-l-2 border-amber-500 text-xs sm:text-sm">
                    <strong>Pactos particulares:</strong> {clauses.specialClauses}
                  </p>
                )}
                <p className="mt-1">
                  Para cuantas discrepancias pudieran suscitarse, las partes se someten a los <strong>Juzgados y Tribunales de {clauses.jurisdictionCity || asset.city || 'la ciudad donde radica la vivienda'}</strong>.
                </p>
              </div>
            </>
          ) : contractType === 'alquiler_temporada' ? (
            <>
              <div>
                <h3 className="font-bold text-slate-900">
                  PRIMERA.- OBJETO Y JUSTIFICACIÓN DE TEMPORALIDAD (ART. 3.2 LAU).
                </h3>
                <p className="mt-1">
                  La PARTE ARRENDADORA cede en arrendamiento a la PARTE ARRENDATARIA la finca reseñada en el Expositivo I para su ocupación transitoria por motivo justificado laboral o académico, reconociendo el inquilino que mantiene su domicilio permanente en {party2.city || 'su residencia de origen'} y que este contrato se rige con arreglo al artículo 3.2 de la LAU (arrendamiento para uso distinto del de vivienda habitual).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SEGUNDA.- DURACIÓN IMPRORROGABLE.
                </h3>
                <p className="mt-1">
                  El presente contrato se concierta por un periodo fijo e <strong>improrrogable de {clauses.durationMonths} meses</strong>, dando inicio el <strong>{formatSpanishDate(clauses.startDate)}</strong> y finalizando de forma automática e inexcusable en la fecha pactada sin necesidad de preaviso ni derecho a prórroga legal alguna.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  TERCERA.- RENTA Y LIQUIDACIÓN.
                </h3>
                <p className="mt-1">
                  La renta mensual se establece en <strong>{formatCurrencyEUR(asset.monthlyRent)}</strong>, abonándose dentro de los primeros <strong>{asset.paymentDayLimit} días</strong> del mes mediante <strong>{asset.paymentMethod}</strong>
                  {asset.bankIban && (
                    <span> en la cuenta bancaria designada: <strong className="font-mono">{asset.bankIban}</strong></span>
                  )}.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  CUARTA.- FIANZA LEGAL DE DOS MENSUALIDADES (ART. 36.1 LAU).
                </h3>
                <p className="mt-1">
                  En cumplimiento del imperativo artículo 36.1 de la LAU para los arrendamientos de uso distinto del de vivienda habitual, la arrendataria entrega en este acto el importe correspondiente a <strong>dos mensualidades de renta</strong>, ascendente a <strong>{formatCurrencyEUR(asset.monthlyRent * 2)}</strong>, en concepto de fianza legal obligatoria que será ingresada en el depósito autonómico oficial correspondiente.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  QUINTA.- GASTOS Y SUMINISTROS.
                </h3>
                <p className="mt-1">
                  {includedUtilities.length > 0 ? (
                    <span>
                      Están expresamente incluidos en la renta pactada los siguientes conceptos: <strong>{includedUtilities.join(', ')}</strong>. El resto de consumos medidos por contador individual serán abonados por el inquilino.
                    </span>
                  ) : (
                    <span>
                      Todos los consumos de agua, electricidad, gas e internet serán abonados íntegramente por la parte arrendataria previa presentación de las facturas por la propiedad.
                    </span>
                  )}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SEXTA.- PROHIBICIÓN DE SUBARRIENDO Y CESIÓN.
                </h3>
                <p className="mt-1">
                  Queda terminantemente prohibida la cesión o subarriendo, total o parcial, así como la comercialización turística de la vivienda o cualquier uso que desvirtúe la causalidad pactada.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  SÉPTIMA.- DESALOJO Y PENALIZACIÓN POR DEMORA.
                </h3>
                <p className="mt-1">
                  A la expiración del plazo estipulado, la arrendataria deberá dejar la finca libre, vacua y a disposición de la propiedad. En caso de mora en la restitución posesoria, se establece una penalización convencional de <strong>el triple de la renta diaria</strong> por cada día natural de retraso, sin perjuicio de las acciones de desahucio e indemnización procedentes.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  OCTAVA.- ESTIPULACIONES PARTICULARES Y FUERO.
                </h3>
                {clauses.specialClauses && (
                  <p className="mt-1 p-2.5 bg-slate-50 border-l-2 border-amber-500 text-xs sm:text-sm">
                    <strong>Pactos convenidos:</strong> {clauses.specialClauses}
                  </p>
                )}
                <p className="mt-1">
                  Las partes se someten a los <strong>Juzgados y Tribunales de {clauses.jurisdictionCity || asset.city || 'la ciudad del inmueble'}</strong>.
                </p>
              </div>
            </>
          ) : (
            /* CONTRATO DE ARRENDAMIENTO DE VIVIENDA HABITUAL (LAU + LEY 12/2023) */
            <>
              {/* PRIMERA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  PRIMERA.- OBJETO Y DESTINO.
                </h3>
                <p className="mt-1">
                  Por el presente documento, la PARTE ARRENDADORA cede en arrendamiento a la PARTE ARRENDATARIA, que lo acepta, el inmueble reseñado en el Expositivo I. 
                  El inmueble se destinará única y exclusivamente a la vivienda habitual y permanente de la parte arrendataria y de su unidad familiar conviviente. Queda terminantemente prohibido alterar el destino pactado o destinar el inmueble a cualquier actividad profesional abierta al público, comercial, industrial o turística.
                </p>
              </div>

              {/* SEGUNDA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  SEGUNDA.- DURACIÓN Y PRÓRROGAS LEGALES (ART. 9 Y 10 LAU).
                </h3>
                <p className="mt-1">
                  El presente contrato se estipula por un plazo inicial de <strong>{clauses.durationMonths} meses</strong>, 
                  comenzando a surtir plenos efectos el día <strong>{formatSpanishDate(clauses.startDate)}</strong>.
                </p>
                {clauses.mandatoryRenewal && (
                  <p className="mt-1">
                    Conforme al artículo 9.1 de la Ley 29/1994, de Arrendamientos Urbanos, si el plazo pactado fuere inferior a <strong>cinco años</strong> (siendo la arrendadora persona física) o siete años (siendo persona jurídica), llegado el día del vencimiento del contrato, éste se prorrogará obligatoriamente por plazos anuales hasta que el arrendamiento alcance dicha duración mínima, salvo que la parte arrendataria manifieste a la arrendadora, con treinta días de antelación como mínimo a la fecha de terminación del contrato o de cualquiera de las prórrogas, su voluntad de no renovarlo.
                  </p>
                )}
              </div>

              {/* TERCERA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  TERCERA.- RENTA Y ACTUALIZACIÓN (ART. 17 Y 18 LAU).
                </h3>
                <p className="mt-1">
                  La renta pactada de común acuerdo asciende a la cantidad de <strong>{formatCurrencyEUR(asset.monthlyRent)}</strong> mensuales. 
                  Dicha renta será satisfecha por la parte arrendataria dentro de los primeros <strong>{asset.paymentDayLimit} días</strong> de cada mes natural, mediante <strong>{asset.paymentMethod}</strong>
                  {asset.bankIban && (
                    <span> en la cuenta bancaria de titularidad de la parte arrendadora: <strong className="font-mono">{asset.bankIban}</strong></span>
                  )}.
                </p>
                <p className="mt-1">
                  {clauses.rentUpdateIndex === 'IRAV' ? (
                    <span>
                      <strong>Actualización de la renta:</strong> Conforme al artículo 18 de la LAU y la Ley 12/2023 por el Derecho a la Vivienda, la renta solo podrá ser actualizada al cumplimiento de cada año de vigencia del contrato conforme al <strong>Índice de Referencia de Arrendamientos de Vivienda (IRAV)</strong> publicado por el Instituto Nacional de Estadística, sin que en ningún caso el incremento resultante pueda sobrepasar dicho límite legal imperativo.
                    </span>
                  ) : clauses.rentUpdateIndex === 'IPC' ? (
                    <span>
                      <strong>Actualización de la renta:</strong> La renta podrá ser revisada al vencimiento de cada año natural conforme a la variación porcentual experimentada por el <strong>Índice de Precios al Consumo (IPC)</strong> a nivel nacional, con estricta sujeción a los topes máximos legales en vigor establecidos por la legislación estatal.
                    </span>
                  ) : (
                    <span>
                      <strong>Actualización de la renta:</strong> Ambas partes convienen expresamente que la renta pactada permanecerá fija e invariable durante el periodo de vigencia acordado.
                    </span>
                  )}
                </p>
              </div>

              {/* CUARTA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  CUARTA.- FIANZA LEGAL Y GARANTÍAS ADICIONALES (ART. 36 LAU).
                </h3>
                <p className="mt-1">
                  En este acto, la parte arrendataria hace entrega a la parte arrendadora de la cantidad de <strong>{formatCurrencyEUR(asset.monthlyRent * asset.legalDepositMonths)}</strong>, 
                  equivalente a <strong>{asset.legalDepositMonths} {asset.legalDepositMonths === 1 ? 'mensualidad' : 'mensualidades'}</strong> de renta, en concepto de <strong>fianza legal en metálico</strong> obligatoria según el artículo 36.1 de la LAU. 
                  Dicha fianza será depositada obligatoriamente por la arrendadora en el organismo autonómico oficial correspondiente para la gestión de fianzas de arrendamientos urbanos.
                </p>
                {asset.additionalGuaranteeMonths > 0 && (
                  <p className="mt-1">
                    Asimismo, en estricto cumplimiento del límite fijado por el artículo 36.5 de la LAU (que prohíbe exigir garantías adicionales superiores a dos mensualidades de renta), la arrendataria entrega en concepto de <strong>garantía complementaria adicional</strong> el importe de <strong>{formatCurrencyEUR(asset.monthlyRent * asset.additionalGuaranteeMonths)}</strong> ({asset.additionalGuaranteeMonths} {asset.additionalGuaranteeMonths === 1 ? 'mensualidad' : 'mensualidades'}).
                  </p>
                )}
                <p className="mt-1 text-xs sm:text-sm text-slate-700 italic">
                  La fianza y garantías responderán de los desperfectos, daños imputables, suministros pendientes y del cumplimiento íntegro de las obligaciones contractuales asumidas, devolviéndose el saldo procedente dentro del mes siguiente a la entrega fehaciente de llaves.
                </p>
              </div>

              {/* QUINTA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  QUINTA.- GASTOS GENERALES, TRIBUTOS Y SUMINISTROS (ART. 20 LAU).
                </h3>
                <p className="mt-1">
                  {includedUtilities.length > 0 ? (
                    <span>
                      Se hace constar expresamente que los siguientes gastos y suministros se encuentran <strong>incluidos en la renta pactada</strong> y serán asumidos por la PARTE ARRENDADORA: <strong>{includedUtilities.join(', ')}</strong>.
                      {' '}Aquellos suministros individualizados por contador (electricidad, agua, gas o telecomunicaciones) que no figuren en la relación anterior serán de cuenta y cargo exclusivo de la <strong>PARTE ARRENDATARIA</strong>.
                    </span>
                  ) : (
                    <span>
                      Los suministros de la vivienda de consumo individualizado mediante contador (electricidad, agua, gas y telecomunicaciones) serán abonados íntegramente por la <strong>PARTE ARRENDATARIA</strong>. Los gastos generales de Comunidad e IBI serán asumidos según lo dispuesto por la legislación aplicable.
                    </span>
                  )}
                </p>
              </div>

              {/* SEXTA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  SEXTA.- DESISTIMIENTO DEL ARRENDATARIO (ART. 11 LAU).
                </h3>
                <p className="mt-1">
                  La parte arrendataria podrá desistir del contrato de arrendamiento una vez que hayan transcurrido al menos <strong>seis meses</strong>, siempre que se lo comunique a la arrendadora con una antelación mínima de <strong>treinta días</strong>. 
                  {clauses.maxEarlyTerminationIndemnity ? (
                    <span>
                      {' '}Se pacta expresamente que, en caso de desistimiento anticipado, la arrendataria deberá indemnizar a la arrendadora con una cantidad equivalente a <strong>una mensualidad de la renta en vigor por cada año del contrato que reste por cumplir</strong>, prorrateándose proporcionalmente los periodos inferiores a un año (art. 11 LAU).
                    </span>
                  ) : (
                    <span>
                      {' '}Las partes renuncian expresamente a la exigencia de indemnización dineraria por desistimiento transcurridos los seis meses legales de obligado cumplimiento.
                    </span>
                  )}
                </p>
              </div>

              {/* SÉPTIMA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  SÉPTIMA.- CESIÓN, SUBARRIENDO Y MASCOTAS.
                </h3>
                <p className="mt-1">
                  {clauses.prohibitSublease ? (
                    <span>
                      Queda <strong>terminantemente prohibida la cesión del contrato y el subarriendo</strong> total o parcial de la vivienda sin el consentimiento previo y por escrito de la parte arrendadora (artículo 8 LAU). El incumplimiento facultará a la arrendadora a resolver de pleno derecho el contrato.
                    </span>
                  ) : (
                    <span>
                      Cualquier subarriendo requerirá el consentimiento expreso y por escrito de la propiedad.
                    </span>
                  )}
                </p>
                <p className="mt-1">
                  {clauses.allowPets === 'no' ? (
                    <span>
                      Queda <strong>expresamente prohibida la tenencia o estancia de animales de compañía o mascotas</strong> en la vivienda arrendada.
                    </span>
                  ) : clauses.allowPets === 'previa_autorizacion' ? (
                    <span>
                      La tenencia de animales domésticos requerirá la <strong>previa autorización escrita de la propiedad</strong>, respondiendo el inquilino de cualquier daño o molestia vecinal.
                    </span>
                  ) : (
                    <span>
                      Se autoriza la <strong>tenencia responsable de mascotas domésticas</strong>, comprometiéndose la parte arrendataria a responder de cualquier desperfecto en enseres o instalaciones.
                    </span>
                  )}
                </p>
              </div>

              {/* OCTAVA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  OCTAVA.- CONSERVACIÓN, REPARACIONES Y OBRAS (ART. 21 Y 23 LAU).
                </h3>
                <p className="mt-1">
                  La arrendadora está obligada a realizar, sin derecho a elevar por ello la renta, todas las reparaciones necesarias para conservar la vivienda en condiciones de habitabilidad para servir al uso convenido. Las pequeñas reparaciones que exija el desgaste por el uso ordinario de la vivienda serán de cargo exclusivo de la parte arrendataria. Queda prohibida la realización de obras que modifiquen la configuración de la vivienda sin consentimiento expreso por escrito.
                </p>
              </div>

              {/* NOVENA */}
              <div>
                <h3 className="font-bold text-slate-900">
                  NOVENA.- PACTOS PARTICULARES Y SUMISIÓN JURISDICCIONAL.
                </h3>
                {clauses.specialClauses && (
                  <p className="mt-1 p-2.5 bg-slate-50 border-l-2 border-amber-500 text-xs sm:text-sm">
                    <strong>Estipulaciones especiales convenidas:</strong> {clauses.specialClauses}
                  </p>
                )}
                <p className="mt-1">
                  Para cuantas divergencias o litigios pudieran suscitarse en la interpretación o cumplimiento de este contrato, las partes se someten expresamente a la jurisdicción y competencia de los <strong>Juzgados y Tribunales de {clauses.jurisdictionCity || asset.city || 'la ciudad del inmueble'}</strong>, por ser el lugar donde radica la finca arrendada (artículo 52.1.7º de la Ley de Enjuiciamiento Civil).
                </p>
              </div>
            </>
          )}

        </div>

        {/* INVENTARIO ANEXO I */}
        {asset.hasInventory && asset.inventoryList.length > 0 && (
          <div className="pt-6 border-t border-slate-300 space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs sm:text-sm">
              ANEXO I: INVENTARIO DE MOBILIARIO Y ENSERES EXISTENTES
            </h3>
            <p className="text-xs text-slate-600">
              Las partes hacen constar que el inmueble se entrega dotado de los siguientes bienes muebles en estado operativo:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {asset.inventoryList.map((item, idx) => (
                <div key={item.id} className="p-1.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
                  <span>{idx + 1}. {item.item}</span>
                  <span className="text-slate-500 font-semibold text-[10px]">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FIRMAS DE LAS PARTES */}
        <div className="pt-8 border-t-2 border-slate-900 space-y-4">
          <p className="text-xs sm:text-sm">
            Y en prueba de plena conformidad con cuanto antecede, las partes firman el presente contrato en todas sus páginas y al pie del mismo, en la fecha y lugar indicados en el encabezamiento.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-4">
            
            {/* Firma Parte 1 */}
            <div className="text-center p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {p1RoleLabel}
              </p>
              
              <div className="h-28 flex items-center justify-center border-b border-dashed border-slate-400 bg-white rounded-lg p-2 mb-2">
                {evidence.signatureParty1 ? (
                  <img
                    src={evidence.signatureParty1}
                    alt={`Firma ${p1RoleLabel}`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">Firma digital no estampada</span>
                )}
              </div>

              <p className="font-bold text-xs text-slate-900">{party1.name || 'Sin nombre consignado'}</p>
              <p className="text-[11px] text-slate-600">{party1.docType}: {party1.docNumber || 'Pendiente'}</p>
              {evidence.signatureDateParty1 && (
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Firmado el {formatSpanishDate(evidence.signatureDateParty1)}
                </p>
              )}
            </div>

            {/* Firma Parte 2 */}
            <div className="text-center p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {p2RoleLabel}
              </p>
              
              <div className="h-28 flex items-center justify-center border-b border-dashed border-slate-400 bg-white rounded-lg p-2 mb-2">
                {evidence.signatureParty2 ? (
                  <img
                    src={evidence.signatureParty2}
                    alt={`Firma ${p2RoleLabel}`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">Firma digital no estampada</span>
                )}
              </div>

              <p className="font-bold text-xs text-slate-900">{party2.name || 'Sin nombre consignado'}</p>
              <p className="text-[11px] text-slate-600">{party2.docType}: {party2.docNumber || 'Pendiente'}</p>
              {evidence.signatureDateParty2 && (
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Firmado el {formatSpanishDate(evidence.signatureDateParty2)}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* HOJA DE EVIDENCIA DIGITAL (ANEXO II) */}
        <div className="page-break pt-8">
          <DigitalEvidenceSeal
            evidence={evidence}
            party1={party1}
            party2={party2}
            contractTitle={getDocTitle()}
          />
        </div>

      </div>
    </div>
  );
};
