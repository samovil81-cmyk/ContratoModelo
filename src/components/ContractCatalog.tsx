import React, { useState } from 'react';
import { 
  Home, 
  BedDouble, 
  CalendarDays, 
  Scale, 
  FileCheck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Search,
  BookCheck,
  FileSignature,
  Building2,
  Car,
  CarFront,
  KeyRound,
  Coins,
  Briefcase,
  ShieldAlert,
  Send,
  MailCheck,
  LandPlot,
  Route,
  HardHat,
  Eye,
  Waves,
  Droplets,
  Fence,
  Cable,
  FilePenLine
} from 'lucide-react';
import { CONTRACT_CATALOG } from '../utils/legalTemplates';
import { ContractType, ContractCategory } from '../types/contract';

interface ContractCatalogProps {
  onSelectContract: (type: ContractType) => void;
  onOpenLegalInfo: () => void;
  onNavigateToLegalAssistant?: () => void;
}

export const ContractCatalog: React.FC<ContractCatalogProps> = ({
  onSelectContract,
  onOpenLegalInfo,
  onNavigateToLegalAssistant
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'todos' | ContractCategory>('todos');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="h-6 w-6 text-amber-600" />;
      case 'BedDouble': return <BedDouble className="h-6 w-6 text-blue-600" />;
      case 'Building2': return <Building2 className="h-6 w-6 text-indigo-600" />;
      case 'CarFront': return <CarFront className="h-6 w-6 text-slate-700" />;
      case 'KeyRound': return <KeyRound className="h-6 w-6 text-emerald-600" />;
      case 'CalendarDays': return <CalendarDays className="h-6 w-6 text-teal-600" />;
      case 'Car': return <Car className="h-6 w-6 text-blue-700" />;
      case 'Coins': return <Coins className="h-6 w-6 text-amber-600" />;
      case 'Scale': return <Scale className="h-6 w-6 text-amber-700" />;
      case 'Briefcase': return <Briefcase className="h-6 w-6 text-purple-600" />;
      case 'ShieldAlert': return <ShieldAlert className="h-6 w-6 text-rose-600" />;
      case 'Send': return <Send className="h-6 w-6 text-red-600" />;
      case 'MailCheck': return <MailCheck className="h-6 w-6 text-orange-600" />;
      case 'LandPlot': return <LandPlot className="h-6 w-6 text-emerald-700" />;
      case 'Route': return <Route className="h-6 w-6 text-amber-700" />;
      case 'HardHat': return <HardHat className="h-6 w-6 text-orange-600" />;
      case 'Eye': return <Eye className="h-6 w-6 text-cyan-700" />;
      case 'Waves': return <Waves className="h-6 w-6 text-blue-700" />;
      case 'Droplets': return <Droplets className="h-6 w-6 text-sky-700" />;
      case 'Fence': return <Fence className="h-6 w-6 text-lime-700" />;
      case 'Cable': return <Cable className="h-6 w-6 text-violet-700" />;
      case 'FilePenLine': return <FilePenLine className="h-6 w-6 text-fuchsia-700" />;
      case 'FileCheck': return <FileCheck className="h-6 w-6 text-emerald-600" />;
      default: return <FileCheck className="h-6 w-6 text-slate-600" />;
    }
  };

  const filteredContracts = CONTRACT_CATALOG.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.legalBasis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterCategory === 'todos') return matchesSearch;
    return matchesSearch && contract.category === filterCategory;
  });
  const totalContracts = CONTRACT_CATALOG.length;
  const byCategoryCount = (category: ContractCategory) => CONTRACT_CATALOG.filter(c => c.category === category).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Hero Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Firma Digital Oficial con Certificado (FNMT / DNIe / .p12) y Flujo Remoto eIDAS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Contratos legales en España, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800">
            con total rigor jurídico
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Genera al instante documentos oficiales blindados conformes a la 
          <strong> legislación civil española</strong>, incluyendo <strong>LAU</strong>, <strong>servidumbres del Código Civil</strong> y <strong>Ley 6/2020 de Firma Electrónica</strong>. Previsualización completa y firma remota con certificado.
        </p>

        {/* Feature Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Modelos de arrendamiento y servidumbres</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <FileSignature className="h-4 w-4 text-amber-600" />
            <span>Firma con Certificado Digital (FNMT / DNIe)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Invitación de firma remota & Sello eIDAS</span>
          </div>
        </div>
      </div>

      {/* Legislative Intelligence Banner */}
      {onNavigateToLegalAssistant && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-4 sm:p-5 mb-8 border border-slate-700/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  ¿Dudas sobre la LAU, plazos de preaviso o actualización con IPC/IRAV?
                </h3>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  IA Jurídica
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Consulta a nuestro Asistente Legislativo antes de redactar para conocer tus derechos y límites legales exactos.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToLegalAssistant}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultar Asistente de Leyes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCategory('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'todos'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Todos ({totalContracts})
            </button>
            <button
              onClick={() => setFilterCategory('inmobiliaria')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'inmobiliaria'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Inmobiliaria ({byCategoryCount('inmobiliaria')})
            </button>
            <button
              onClick={() => setFilterCategory('motor_particulares')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'motor_particulares'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Particulares y Motor ({byCategoryCount('motor_particulares')})
            </button>
            <button
              onClick={() => setFilterCategory('empresas_freelance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'empresas_freelance'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Autónomos y Empresas ({byCategoryCount('empresas_freelance')})
            </button>
            <button
              onClick={() => setFilterCategory('reclamaciones')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'reclamaciones'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Reclamaciones ({byCategoryCount('reclamaciones')})
            </button>
            <button
              onClick={() => setFilterCategory('servidumbres')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === 'servidumbres'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Servidumbres ({byCategoryCount('servidumbres')})
            </button>
          </div>

          {/* Search input */}
          <div className="relative min-w-[240px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Buscar por tipo de contrato o cláusula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

        </div>
      </div>

      {/* Contract Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContracts.map((contract) => (
          <div
            key={contract.id}
            id={`contract-card-${contract.id}`}
            className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:border-amber-400/80 transition-all duration-200"
          >
            <div>
              {/* Badge & Time */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  {contract.badge}
                </span>
                <span className="inline-flex items-center text-xs font-medium text-slate-700">
                  <Clock className="h-3.5 w-3.5 mr-1 text-slate-600" />
                  {contract.estimatedTime}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-4 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors shrink-0">
                  {getIcon(contract.iconName)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {contract.title}
                  </h3>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {contract.legalBasis}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {contract.shortDesc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {contract.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-600">Borrador: </span>
                <span className="font-semibold text-emerald-600">Gratis</span>
              </div>

              <button
                onClick={() => onSelectContract(contract.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-amber-600 text-white shadow-xs transition-all group-hover:translate-x-0.5"
              >
                <span>Redactar ahora</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <BookCheck className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No se encontraron contratos con esa búsqueda</p>
          <p className="text-xs text-slate-600 mt-1">Prueba con términos como "vivienda", "arras", "servidumbre", "paso" o "medianería".</p>
        </div>
      )}

      {/* Advisory Banner */}
      <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Garantía Jurídica España</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              ¿Dudas sobre el tope de actualización de renta o fianza legal?
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Nuestros modelos integran automáticamente las novedades de la Ley 12/2023: prohibición de repercutir honorarios de agencia inmobiliaria al inquilino, limitación legal a 2 mensualidades de garantía adicional y cláusulas de depósito autonómico obligatorio.
            </p>
          </div>

          <button
            onClick={onOpenLegalInfo}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            Consultar guía legal
          </button>
        </div>
      </div>

    </div>
  );
};
