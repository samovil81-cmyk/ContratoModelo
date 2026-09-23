export type ContractType = 
  // Inmobiliaria
  | 'alquiler_vivienda'
  | 'alquiler_habitacion'
  | 'alquiler_local'
  | 'alquiler_garaje'
  | 'entrega_llaves'
  | 'alquiler_temporada'
  // Particulares y Motor
  | 'compraventa_vehiculo'
  | 'prestamo_familiares'
  | 'arras_compraventa'
  // Autónomos y Empresas
  | 'servicios_freelance'
  | 'acuerdo_nda'
  // Reclamaciones
  | 'reclamacion_impago'
  | 'resolucion_anticipada'
  | 'finiquito_laboral'
  // Servidumbres
  | 'servidumbre_paso_voluntaria'
  | 'servidumbre_paso_forzosa_enclavada'
  | 'servidumbre_paso_temporal_obras'
  | 'servidumbre_luces_vistas'
  | 'servidumbre_desague_vertiente'
  | 'servidumbre_acueducto_riego'
  | 'servidumbre_ganado_vias_pecuarias'
  | 'servidumbre_medianeria'
  | 'servidumbre_energia_telecom'
  | 'servidumbre_modificacion_extincion';

export type ContractCategory = 'inmobiliaria' | 'motor_particulares' | 'empresas_freelance' | 'reclamaciones' | 'servidumbres';

export interface ContractMeta {
  id: ContractType;
  title: string;
  badge: string;
  popular?: boolean;
  category: ContractCategory;
  legalBasis: string;
  shortDesc: string;
  detailedDesc: string;
  estimatedTime: string;
  iconName: string;
  tags: string[];
}

export interface PartyData {
  name: string;
  docType: 'DNI' | 'NIE' | 'CIF';
  docNumber: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  phone: string;
  email: string;
  roleTitle: string; // e.g., 'Arrendador', 'Vendedor', 'Prestamista', 'Cliente', 'Empresa'
}

export interface FurnitureItem {
  id: string;
  item: string;
  status: 'Nuevo' | 'Buen estado' | 'Usado';
}

export interface DigitalCertificateInfo {
  signerName: string;
  signerNif: string;
  issuer: string; // e.g., 'AC FNMT Usuarios', 'AC DNIe 006 (Dirección General de la Policía)', 'ACCV CA-2'
  serialNumber: string; // Hex e.g., '4B:29:A1:7C:93:EE:48:F1'
  validFrom: string;
  validTo: string;
  keyAlgorithm: string; // 'RSA 2048-bit'
  signatureAlgorithm: string; // 'SHA256withRSA'
  sourceType: 'browser_store' | 'dnie' | 'pfx_file';
  certFingerprint: string; // SHA-256 fingerprint
  signedAt: string; // ISO string
  ipAddress: string;
  userAgent: string;
}

export interface AssetData {
  address: string;
  city: string;
  postalCode: string;
  province: string;
  cadastralRef: string; // 20 chars
  propertyType: 'Piso' | 'Casa / Chalet' | 'Ático' | 'Habitación' | 'Local / Oficina' | 'Garaje / Trastero' | 'Vehículo' | 'Servicio / Mercantil';
  
  // Specific to room / seasonal
  roomDetails?: {
    roomNumber: string;
    hasPrivateBathroom: boolean;
    hasKeyLock: boolean;
    sharedAreas: string[];
  };

  // Specific to vehicle
  vehicleDetails?: {
    brandModel: string;
    plate: string;
    vinNumber: string;
    km: number;
    year: number;
    hasInspectionWaiver: boolean; // Renuncia o conocimiento del estado
    hiddenDefectsClause: boolean; // Art. 1484 CC
    itvValid: boolean;
    ivtmPaid: boolean;
  };

  // Specific to commercial local / office
  commercialDetails?: {
    activityDescription: string;
    squareMeters: number;
    hasLicense: boolean;
    ivaRate: number; // 21%
    irpfRetentionRate: number; // 19%
    communityAndIbiPaidBy: 'arrendador' | 'arrendatario';
  };

  // Specific to garage / storage
  garageDetails?: {
    spotNumber: string;
    floorLevel: string;
    hasRemoteControl: boolean;
    storageIncluded: boolean;
    vatApplicable: boolean; // 21% si no va ligado a vivienda
  };

  // Specific to key handover / deposit settlement
  keyHandoverDetails?: {
    keysReturnedCount: number;
    remoteControlsReturned: number;
    waterReading: string;
    electricityReading: string;
    gasReading: string;
    propertyStatusDescription: string;
    depositReturnStatus: 'total' | 'parcial_retenciones' | 'en_evaluacion';
    depositDeductionsEUR: number;
    depositDeductionsReason: string;
  };

  // Specific to family / peer loan
  loanDetails?: {
    principalAmount: number;
    interestRatePercent: number; // 0% usual
    repaymentMonths: number;
    monthlyInstallment: number;
    purpose: string;
    isTaxExemptModel600: boolean; // Sujeto a ITP pero exento según art. 45.I.B.15 TRITPAJD
    accountTransferIban: string;
  };

  // Specific to professional freelance services
  freelanceDetails?: {
    serviceDescription: string;
    deliverables: string;
    totalFee: number;
    billingType: 'mensual' | 'por_proyecto' | 'por_horas';
    irpfWithholdingRate: number; // 15% or 7%
    vatRate: number; // 21%
    copyrightTransfer: boolean;
    paymentTermDays: number; // 30 días Ley Morosidad
  };

  // Specific to NDA confidentiality agreement
  ndaDetails?: {
    confidentialProjectName: string;
    durationYears: number; // e.g., 3 o 5 años
    disclosureScope: string;
    penalClauseAmount: number;
    lawTradeSecretsReference: boolean; // Ley 1/2019 de Secretos Empresariales
  };

  // Specific to legal notice / Burofax claims
  claimDetails?: {
    debtTotalAmount: number;
    overdueMonthsCount: number;
    paymentDeadlineDays: number; // e.g. 10 días hábiles
    originalContractDate: string;
    warningEvictionArt27: boolean; // Apercibimiento desahucio LAU
    warningSolvencyFiles: boolean; // Advertencia inclusión ficheros morosos
    terminationNoticeDays: number; // Preaviso en días para resolución anticipada
  };

  // Specific to labor finiquito
  laborDetails?: {
    jobTitle: string;
    seniorityDate: string;
    terminationDate: string;
    pendingSalary: number;
    vacationDaysPending: number;
    severancePay: number;
  };

  // Specific to servitudes
  servitudeDetails?: {
    modelSubtype: string;
    dominantPropertyDescription: string;
    servientPropertyDescription: string;
    dominantRegistryTitle: string;
    servientRegistryTitle: string;
    dominantCadastralRef: string;
    servientCadastralRef: string;
    locationAndTechnicalDescription: string;
    annexPlanReference: string;
    routeDescription: string;
    widthMeters: number;
    surfaceSquareMeters: number;
    allowedUses: string;
    useSchedule: string;
    durationDescription: string;
    compensationAmount: number;
    compensationType: 'precio' | 'indemnizacion' | 'sin_compensacion';
    expensesAndMaintenance: string;
    worksAndRestoration: string;
    liabilityAndInsurance: string;
    prohibitions: string;
    dataProtectionClause: string;
    notaryAndRegistry: string;
    administrativePermits: string;
    sectorRegulationWarning: string;
    forcedConstitutionGrounds: string;
    existingServitudeBackground: string;
  };

  // Financial terms
  monthlyRent: number;
  legalDepositMonths: number; // 1 for housing, 2 for other uses (LAU art. 36)
  additionalGuaranteeMonths: number; // Max 2 months (LAU art. 36.5)
  paymentDayLimit: number; // Typically 1 to 7 of each month
  paymentMethod: 'Transferencia bancaria' | 'Domiciliación' | 'Bizum';
  bankIban: string;
  
  // Inventory
  hasInventory: boolean;
  inventoryList: FurnitureItem[];
}

export interface ClauseTerms {
  startDate: string;
  durationMonths: number; // default 12 (1 year) or 60 (5 years)
  mandatoryRenewal: boolean; // Up to 5 years (art. 9 LAU for natural persons)
  rentUpdateIndex: 'IRAV' | 'IPC' | 'Sin actualización'; // IRAV (Ley Vivienda) or IPC
  maxEarlyTerminationIndemnity: boolean; // Art. 11 LAU (1 month per unfulfilled year)
  allowPets: 'no' | 'si' | 'previa_autorizacion';
  prohibitSublease: boolean; // Art. 8 LAU
  utilitiesIncluded: {
    water: boolean;
    electricity: boolean;
    gas: boolean;
    internet: boolean;
    communityFees: boolean;
  };
  servitudeClauses?: {
    registrationCommitment: boolean;
    georeferencedPlanAttached: boolean;
    acknowledgesNoAutomaticValidity: boolean;
    extinctionAndModificationRules: string;
    sectorialRegulationNotice: string;
  };
  specialClauses: string;
  jurisdictionCity: string;
}

export interface DigitalEvidence {
  id: string;
  // Digital Certificate for Party 1 (e.g. Propietario / Vendedor / Empleador)
  certificateParty1?: DigitalCertificateInfo;
  signatureParty1?: string; // Official vector SVG / Data URL seal
  signatureDateParty1?: string;

  // Digital Certificate for Party 2 (e.g. Inquilino / Comprador / Trabajador)
  certificateParty2?: DigitalCertificateInfo;
  signatureParty2?: string;
  signatureDateParty2?: string;

  // Remote invitation metadata (Asynchronous distributed flow)
  remoteInviteToken?: string;
  remoteInviteStatus?: 'pending' | 'sent' | 'opened' | 'completed';
  remoteInviteRecipientEmail?: string;
  remoteInviteSentAt?: string;
  remoteInviteCompletedAt?: string;

  documentHash: string; // SHA-256
  verificationCode: string; // CSV e.g., CL-2026-XXXXX
  timestampFormatted: string;
  ipMock: string;
  status: 'borrador' | 'firmado_parcial' | 'firmado_completo';
  eidasCompliant: boolean;
  tsaAuthority: string;
}

export interface ContractState {
  id: string;
  contractType: ContractType;
  createdAt: string;
  updatedAt: string;
  party1: PartyData;
  party2: PartyData;
  asset: AssetData;
  clauses: ClauseTerms;
  evidence: DigitalEvidence;
  isUnlocked: boolean; // Freemium wall
  paymentPlan?: 'single' | 'monthly_pass';
  paymentDate?: string;
}
