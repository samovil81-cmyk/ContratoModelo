import { ContractMeta, ContractState, ContractType } from '../types/contract';
import { generateCSV } from './cryptoUtils';

export const CONTRACT_CATALOG: ContractMeta[] = [
  // 1. INMOBILIARIA
  {
    id: 'alquiler_vivienda',
    title: 'Alquiler de Vivienda Habitual',
    badge: 'LAU 29/1994 & Ley 12/2023',
    popular: true,
    category: 'inmobiliaria',
    legalBasis: 'Ley 29/1994 de Arrendamientos Urbanos y Ley 12/2023 por el Derecho a la Vivienda',
    shortDesc: 'Contrato estándar obligatorio para residencias permanentes. Incluye prórroga legal de 5 años y límites de fianza.',
    detailedDesc: 'Redacción jurídica profesional con cláusulas actualizadas a la última reforma: duración de 5 a 7 años, actualización mediante IRAV/IPC, fianza legal obligatoria de 1 mes depositada en organismo autonómico y garantía adicional máxima de 2 meses.',
    estimatedTime: '3 min',
    iconName: 'Home',
    tags: ['Vivienda habitual', 'Prórroga 5 años', 'Tope fianza art. 36']
  },
  {
    id: 'alquiler_habitacion',
    title: 'Alquiler de Habitación (Piso Compartido)',
    badge: 'Código Civil (Arts. 1542 y ss.)',
    popular: true,
    category: 'inmobiliaria',
    legalBasis: 'Artículos 1542 y concordantes del Código Civil',
    shortDesc: 'Para arrendar dormitorios individuales con derecho a uso de zonas comunes (cocina, baño, salón).',
    detailedDesc: 'Excluido expresamente de la LAU general de vivienda completa. Permite pactar libremente duración flexible, normas de convivencia, régimen de visitas, gastos comunes incluidos y exclusividad de cerradura.',
    estimatedTime: '3 min',
    iconName: 'BedDouble',
    tags: ['Estudiantes', 'Piso compartido', 'Normas convivencia']
  },
  {
    id: 'alquiler_local',
    title: 'Alquiler de Local Comercial u Oficina',
    badge: 'LAU Art. 3 (Uso Distinto)',
    popular: false,
    category: 'inmobiliaria',
    legalBasis: 'Artículo 3 de la Ley 29/1994 de Arrendamientos Urbanos (Arrendamiento para uso distinto del de vivienda)',
    shortDesc: 'Arrendamiento de locales de negocio, despachos y oficinas con régimen fiscal de IVA (21%) y retención IRPF (19%).',
    detailedDesc: 'Cláusulas mercantiles e inmobiliarias para locales y oficinas: fianza obligatoria legal de dos mensualidades (art. 36.1 LAU), licencias de actividad, repercusión de IBI y comunidad, e indemnización por clientela (art. 34 LAU).',
    estimatedTime: '4 min',
    iconName: 'Building2',
    tags: ['Local comercial', 'Oficina', 'Fianza 2 meses', 'IVA 21%']
  },
  {
    id: 'alquiler_garaje',
    title: 'Alquiler de Garaje o Trastero',
    badge: 'Código Civil (Arrendamiento de Cosas)',
    popular: false,
    category: 'inmobiliaria',
    legalBasis: 'Artículos 1543 y concordantes del Código Civil',
    shortDesc: 'Para plazas de aparcamiento y trasteros independientes no anejos a contratos de vivienda.',
    detailedDesc: 'Establece entrega de mandos a distancia y llaves magnéticas, depósito de fianza por elementos de acceso, prohibición expresa de subarriendo o cesión, y aplicación de IVA al 21% si se arrienda sin vivienda asociada.',
    estimatedTime: '2 min',
    iconName: 'CarFront',
    tags: ['Plaza garaje', 'Trastero', 'Código Civil', 'Mando a distancia']
  },
  {
    id: 'entrega_llaves',
    title: 'Acta de Entrega de Llaves y Finiquito',
    badge: 'Resolución de Arrendamiento',
    popular: false,
    category: 'inmobiliaria',
    legalBasis: 'Artículos 1124 y 1156 del Código Civil y Art. 36 de la LAU',
    shortDesc: 'Documento formal de extinción de contrato, constancia de lectura de contadores y liquidación o retención de fianza.',
    detailedDesc: 'Protege a propietarios e inquilinos al término del arrendamiento: acredita la devolución física de la posesión, el recuento de juegos de llaves, lectura de consumos pendientes y el estado de conservación de la vivienda.',
    estimatedTime: '3 min',
    iconName: 'KeyRound',
    tags: ['Fin contrato', 'Devolución fianza', 'Lectura contadores', 'Entrega de posesión']
  },
  {
    id: 'alquiler_temporada',
    title: 'Alquiler de Temporada (Estudios / Trabajo)',
    badge: 'LAU Art. 3.2 (Uso Distinto)',
    popular: false,
    category: 'inmobiliaria',
    legalBasis: 'Artículo 3.2 de la Ley de Arrendamientos Urbanos (Arrendamiento para uso distinto del de vivienda)',
    shortDesc: 'Arrendamiento de corta estancia con causa temporal justificada (máster, proyecto laboral, obras).',
    detailedDesc: 'Requiere fijar taxativamente la causa de temporalidad y el domicilio habitual del arrendatario para evitar recalificación judicial. Fianza legal de dos mensualidades según el artículo 36.1 LAU.',
    estimatedTime: '3 min',
    iconName: 'CalendarDays',
    tags: ['Causa temporal', 'Fianza 2 meses', 'Uso distinto']
  },

  // 2. PARTICULARES Y MOTOR
  {
    id: 'compraventa_vehiculo',
    title: 'Compraventa de Vehículo entre Particulares',
    badge: 'Código Civil (Arts. 1484 y ss.)',
    popular: true,
    category: 'motor_particulares',
    legalBasis: 'Artículos 1445, 1484 a 1490 del Código Civil y Reglamento General de Vehículos (DGT)',
    shortDesc: 'Venta de coche, moto o furgoneta usada con cláusula explícita de vicios ocultos y estado mecánico.',
    detailedDesc: 'Redactado expresamente para transferencias ante la DGT: matrícula, número de bastidor (VIN), kilometraje certificado, declaración de libre de cargas o embargos, ITV en vigor, e imposición de 6 meses de garantía legal por vicios ocultos.',
    estimatedTime: '4 min',
    iconName: 'Car',
    tags: ['Vicios ocultos art. 1484', 'DGT', 'Bastidor VIN', 'ITV e IVTM']
  },
  {
    id: 'prestamo_familiares',
    title: 'Préstamo entre Familiares a Interés 0%',
    badge: 'Exento ITP (Modelo 600)',
    popular: false,
    category: 'motor_particulares',
    legalBasis: 'Artículos 1740 y 1753 del Código Civil y Art. 45.I.B.15 del TRITPAJD',
    shortDesc: 'Préstamo dinerario particular sin intereses para comprar vivienda o vehículo, exento fiscalmente de ITP.',
    detailedDesc: 'Documento fundamental exigido por la Agencia Tributaria (AEAT) para evitar que Hacienda lo califique como donación encubierta. Fija el calendario de devolución a tipo de interés cero pactado y sujeción al Modelo 600 exento.',
    estimatedTime: '3 min',
    iconName: 'Coins',
    tags: ['Interés cero', 'Modelo 600 exento', 'Evita donación', 'Hacienda / AEAT']
  },
  {
    id: 'arras_compraventa',
    title: 'Contrato de Arras Penitenciales (Inmuebles)',
    badge: 'Código Civil (Art. 1454)',
    popular: false,
    category: 'motor_particulares',
    legalBasis: 'Artículo 1454 del Código Civil (Arras Penitenciales)',
    shortDesc: 'Garantía formal de reserva con opción de desistimiento con pérdida de señal o duplicado.',
    detailedDesc: 'Protege tanto al comprador como al vendedor. Si el comprador desiste, pierde la señal entregada; si desiste el vendedor, la devolverá duplicada. Establece plazo improrrogable para otorgamiento de escritura pública notarial.',
    estimatedTime: '4 min',
    iconName: 'Scale',
    tags: ['Arras penitenciales', 'Señal económica', 'Plazo notaría']
  },

  // 3. AUTÓNOMOS Y EMPRESAS
  {
    id: 'servicios_freelance',
    title: 'Prestación de Servicios Profesionales (Freelance)',
    badge: 'Código de Comercio / Civil',
    popular: true,
    category: 'empresas_freelance',
    legalBasis: 'Artículos 1544 del Código Civil y Código de Comercio',
    shortDesc: 'Contrato mercantil para diseñadores, programadores, consultores y autónomos con honorarios e hitos.',
    detailedDesc: 'Establece el alcance del encargo técnico, calendario de entregables, remuneración con retención de IRPF (15% o 7%) e IVA (21%), cesión exclusiva de derechos de propiedad intelectual y cláusula anti-morosidad.',
    estimatedTime: '4 min',
    iconName: 'Briefcase',
    tags: ['Autónomos', 'Propiedad intelectual', 'Hitos de pago', 'IRPF e IVA']
  },
  {
    id: 'acuerdo_nda',
    title: 'Acuerdo de Confidencialidad y No Divulgación (NDA)',
    badge: 'Ley 1/2019 Secretos Empresariales',
    popular: false,
    category: 'empresas_freelance',
    legalBasis: 'Ley 1/2019, de 20 de febrero, de Secretos Empresariales y Código Civil',
    shortDesc: 'Pacto bilateral para salvaguardar información reservada, planes de negocio, código y propiedad industrial.',
    detailedDesc: 'Protege el intercambio de información técnica o comercial entre socios o proveedores. Fija una duración de confidencialidad de 3 a 5 años, excepciones legales de divulgación y penalización económica por infracción.',
    estimatedTime: '3 min',
    iconName: 'ShieldAlert',
    tags: ['NDA bilateral', 'Secretos comerciales', 'Cláusula penal', 'No divulgación']
  },

  // 4. RECLAMACIONES Y NOTIFICACIONES
  {
    id: 'reclamacion_impago',
    title: 'Burofax de Reclamación de Impago de Rentas',
    badge: 'Requerimiento Fehaciente (Art. 27 LAU)',
    popular: true,
    category: 'reclamaciones',
    legalBasis: 'Artículo 27 de la Ley de Arrendamientos Urbanos y Art. 440.3 de la Ley de Enjuiciamiento Civil',
    shortDesc: 'Requerimiento formal fehaciente previo a demanda judicial de desahucio con plazo perentorio de pago.',
    detailedDesc: 'Texto formal con apercibimiento legal expreso: concede un plazo de 10 días para regularizar rentas y suministros adeudados, e informa de que transcurrido dicho término se interpondrá demanda de desahucio con enervación impedida.',
    estimatedTime: '3 min',
    iconName: 'Send',
    tags: ['Burofax fehaciente', 'Impago de rentas', 'Apercibimiento desahucio', 'Plazo 10 días']
  },
  {
    id: 'resolucion_anticipada',
    title: 'Burofax de Resolución Anticipada de Contrato',
    badge: 'Preaviso Legal (Art. 11 LAU)',
    popular: false,
    category: 'reclamaciones',
    legalBasis: 'Artículo 11 de la Ley de Arrendamientos Urbanos y Art. 1124 del Código Civil',
    shortDesc: 'Notificación fehaciente de desistimiento con el preaviso legal preceptivo y cita para entrega de llaves.',
    detailedDesc: 'Comunica formalmente la rescisión contractual con 30 días o el plazo legal oportuno de antelación. Fija el día y hora exactos para la inspección del inmueble, firma del acta de recepción y devolución de la fianza.',
    estimatedTime: '3 min',
    iconName: 'MailCheck',
    tags: ['Preaviso LAU', 'Desistimiento', 'Cita entrega llaves', 'Notificación formal']
  },
  {
    id: 'finiquito_laboral',
    title: 'Propuesta de Finiquito y Liquidación Salarial',
    badge: 'Estatuto Trabajadores (Art. 49)',
    popular: false,
    category: 'empresas_freelance',
    legalBasis: 'Artículo 49.2 del Real Decreto Legislativo 2/2015 del Estatuto de los Trabajadores',
    shortDesc: 'Propuesta formal de liquidación y finiquito por extinción de relación laboral.',
    detailedDesc: 'Desglosa de forma fehaciente salarios devengados pendientes, parte proporcional de pagas extraordinarias, compensación de vacaciones no disfrutadas e indemnización legal aplicable.',
    estimatedTime: '3 min',
    iconName: 'FileCheck',
    tags: ['Estatuto Trabajadores', 'Finiquito', 'Liquidación']
  }
];

export function createInitialContractState(type: ContractType = 'alquiler_vivienda'): ContractState {
  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];

  const getP1RoleTitle = (t: ContractType) => {
    switch (t) {
      case 'compraventa_vehiculo': return 'Parte Vendedora (Transmite vehículo)';
      case 'prestamo_familiares': return 'Prestamista (Entrega capital)';
      case 'arras_compraventa': return 'Parte Vendedora (Recibe señal)';
      case 'servicios_freelance': return 'Profesional Prestador (Freelance)';
      case 'acuerdo_nda': return 'Parte Reveladora / Emisora';
      case 'reclamacion_impago': return 'Arrendador / Acreedor Reclamante';
      case 'resolucion_anticipada': return 'Parte Notificante (Resuelve)';
      case 'entrega_llaves': return 'Parte Arrendadora (Recibe llaves)';
      case 'alquiler_local': return 'Arrendador (Propietario Local)';
      case 'alquiler_garaje': return 'Arrendador (Propietario Garaje)';
      case 'finiquito_laboral': return 'Empresa / Empleador';
      default: return 'Arrendador (Propietario)';
    }
  };

  const getP2RoleTitle = (t: ContractType) => {
    switch (t) {
      case 'compraventa_vehiculo': return 'Parte Compradora (Adquiere vehículo)';
      case 'prestamo_familiares': return 'Prestatario (Recibe y devuelve)';
      case 'arras_compraventa': return 'Parte Compradora (Entrega señal)';
      case 'servicios_freelance': return 'Cliente / Empresa Contratante';
      case 'acuerdo_nda': return 'Parte Receptora / Confidencial';
      case 'reclamacion_impago': return 'Inquilino / Deudor Requerido';
      case 'resolucion_anticipada': return 'Parte Notificada';
      case 'entrega_llaves': return 'Parte Arrendataria (Devuelve llaves)';
      case 'alquiler_local': return 'Arrendatario (Negocio / Empresa)';
      case 'alquiler_garaje': return 'Arrendatario (Usuario Plaza)';
      case 'finiquito_laboral': return 'Trabajador/a';
      default: return 'Arrendatario (Inquilino)';
    }
  };

  const getInitialPropertyType = (t: ContractType) => {
    if (t === 'alquiler_habitacion') return 'Habitación' as const;
    if (t === 'alquiler_local') return 'Local / Oficina' as const;
    if (t === 'alquiler_garaje') return 'Garaje / Trastero' as const;
    if (t === 'compraventa_vehiculo') return 'Vehículo' as const;
    if (t === 'servicios_freelance' || t === 'acuerdo_nda' || t === 'prestamo_familiares') return 'Servicio / Mercantil' as const;
    return 'Piso' as const;
  };

  return {
    id: 'doc_' + Math.random().toString(36).substring(2, 9),
    contractType: type,
    createdAt: todayIso,
    updatedAt: todayIso,
    isUnlocked: false,
    party1: {
      name: '',
      docType: 'DNI',
      docNumber: '',
      address: '',
      city: '',
      postalCode: '',
      province: '',
      phone: '',
      email: '',
      roleTitle: getP1RoleTitle(type)
    },
    party2: {
      name: '',
      docType: 'DNI',
      docNumber: '',
      address: '',
      city: '',
      postalCode: '',
      province: '',
      phone: '',
      email: '',
      roleTitle: getP2RoleTitle(type)
    },
    asset: {
      address: '',
      city: '',
      postalCode: '',
      province: '',
      cadastralRef: '',
      propertyType: getInitialPropertyType(type),
      roomDetails: {
        roomNumber: '',
        hasPrivateBathroom: false,
        hasKeyLock: true,
        sharedAreas: ['Cocina', 'Salón-comedor', 'Baño compartido', 'Distribuidor']
      },
      vehicleDetails: {
        brandModel: '',
        plate: '',
        vinNumber: '',
        km: 0,
        year: 2020,
        hasInspectionWaiver: false,
        hiddenDefectsClause: true,
        itvValid: true,
        ivtmPaid: true
      },
      commercialDetails: {
        activityDescription: '',
        squareMeters: 80,
        hasLicense: true,
        ivaRate: 21,
        irpfRetentionRate: 19,
        communityAndIbiPaidBy: 'arrendatario'
      },
      garageDetails: {
        spotNumber: '',
        floorLevel: '-1',
        hasRemoteControl: true,
        storageIncluded: false,
        vatApplicable: true
      },
      keyHandoverDetails: {
        keysReturnedCount: 2,
        remoteControlsReturned: 1,
        waterReading: '',
        electricityReading: '',
        gasReading: '',
        propertyStatusDescription: '',
        depositReturnStatus: 'total',
        depositDeductionsEUR: 0,
        depositDeductionsReason: ''
      },
      loanDetails: {
        principalAmount: 0,
        interestRatePercent: 0,
        repaymentMonths: 36,
        monthlyInstallment: 0,
        purpose: '',
        isTaxExemptModel600: true,
        accountTransferIban: ''
      },
      freelanceDetails: {
        serviceDescription: '',
        deliverables: '',
        totalFee: 0,
        billingType: 'por_proyecto',
        irpfWithholdingRate: 15,
        vatRate: 21,
        copyrightTransfer: true,
        paymentTermDays: 30
      },
      ndaDetails: {
        confidentialProjectName: '',
        durationYears: 3,
        disclosureScope: '',
        penalClauseAmount: 25000,
        lawTradeSecretsReference: true
      },
      claimDetails: {
        debtTotalAmount: 0,
        overdueMonthsCount: 1,
        paymentDeadlineDays: 10,
        originalContractDate: todayIso,
        warningEvictionArt27: true,
        warningSolvencyFiles: true,
        terminationNoticeDays: 30
      },
      laborDetails: {
        jobTitle: '',
        seniorityDate: todayIso,
        terminationDate: todayIso,
        pendingSalary: 0,
        vacationDaysPending: 0,
        severancePay: 0
      },
      monthlyRent: 0,
      legalDepositMonths: type === 'alquiler_local' || type === 'alquiler_temporada' ? 2 : 1,
      additionalGuaranteeMonths: 0,
      paymentDayLimit: 5,
      paymentMethod: 'Transferencia bancaria',
      bankIban: '',
      hasInventory: false,
      inventoryList: []
    },
    clauses: {
      startDate: todayIso,
      durationMonths: type === 'alquiler_vivienda' ? 12 : type === 'alquiler_temporada' ? 6 : 12,
      mandatoryRenewal: type === 'alquiler_vivienda',
      rentUpdateIndex: 'IRAV',
      maxEarlyTerminationIndemnity: true,
      allowPets: 'no',
      prohibitSublease: true,
      utilitiesIncluded: {
        water: false,
        electricity: false,
        gas: false,
        internet: type === 'alquiler_habitacion',
        communityFees: true
      },
      specialClauses: '',
      jurisdictionCity: ''
    },
    evidence: {
      id: 'EVD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      verificationCode: generateCSV('ES-LAU'),
      documentHash: 'c798e4f1bc20a325d7e6c1a8904e5f32b109dcba891234efcba8761234901234',
      timestampFormatted: new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
      ipMock: '194.179.1.84 (Madrid, España)',
      status: 'borrador',
      eidasCompliant: true,
      tsaAuthority: 'FNMT-RCM Time Stamping Authority (RFC 3161)'
    }
  };
}

