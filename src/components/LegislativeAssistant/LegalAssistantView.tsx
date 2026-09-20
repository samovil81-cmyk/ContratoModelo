import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Calculator, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Building2, 
  Home, 
  Car, 
  Briefcase, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { ContractType } from '../../types/contract';
import { CONTRACT_CATALOG } from '../../utils/legalTemplates';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendedContractType?: ContractType | null;
}

interface LegalAssistantViewProps {
  onSelectContract: (type: ContractType) => void;
  onNavigateToCatalog: () => void;
}

const COMMON_QUERIES = [
  {
    title: 'Actualización de Renta (IRAV / IPC)',
    query: '¿Cómo puedo subir legalmente el alquiler de mi piso este año según la Ley de Vivienda e IRAV?',
    category: 'Vivienda'
  },
  {
    title: 'Desistimiento y Plazos de Preaviso',
    query: '¿Con cuántos días de preaviso puede el inquilino marcharse del piso tras 6 meses y qué indemnización corresponde?',
    category: 'Plazos'
  },
  {
    title: 'Tope Legal de Fianzas (Art. 36 LAU)',
    query: '¿Cuántos meses de fianza y garantías adicionales puede exigir como máximo un propietario en vivienda habitual?',
    category: 'Fianzas'
  },
  {
    title: 'Impago de Alquiler y Burofax Previo',
    query: '¿Cómo debo reclamar fehacientemente una renta impagada antes de iniciar una demanda de desahucio?',
    category: 'Reclamaciones'
  },
  {
    title: 'Vicios Ocultos en Coche de Segunda Mano',
    query: '¿Qué garantía legal tiene la compra de un vehículo usado entre particulares y qué plazo hay para reclamar?',
    category: 'Motor'
  },
  {
    title: 'Préstamo entre Familiares (Modelo 600)',
    query: '¿Cómo prestar dinero a un hijo sin que Hacienda lo considere donación y cómo declararlo en el Modelo 600?',
    category: 'Fiscal'
  }
];

export const LegalAssistantView: React.FC<LegalAssistantViewProps> = ({
  onSelectContract,
  onNavigateToCatalog
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'calculator' | 'deposit_checker'>('chat');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Bienvenido al Asistente de Inteligencia Legislativa

Soy tu consultor jurídico virtual especializado en el **ordenamiento legal español** (Ley de Arrendamientos Urbanos, Ley 12/2023 por el Derecho a la Vivienda, Código Civil y Ley 6/2020 de firma electrónica).

Puedo resolver tus dudas jurídicas sobre:
- **Arrendamientos:** Prórrogas de 5 o 7 años, subidas de renta (IRAV/IPC), límites de fianza y entrega de llaves.
- **Particulares y Motor:** Reclamación de vicios ocultos (art. 1484 CC), préstamos familiares al 0% exentos de ITP y arras.
- **Autónomos y Pymes:** Facturación y retenciones de IRPF, cláusulas de propiedad intelectual y acuerdos de confidencialidad (NDA).
- **Reclamaciones Fechacientes:** Burofaxes para evitar enervación en desahucios o comunicaciones formales de resolución.

Escribe tu consulta en el recuadro inferior o pulsa en cualquiera de las consultas frecuentes para obtener una respuesta fundamentada en los artículos del BOE.`,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculator states
  const [currentRent, setCurrentRent] = useState<number>(850);
  const [iravRate, setIravRate] = useState<number>(2.5);
  const [isBigLandlord, setIsBigLandlord] = useState<boolean>(false);

  // Deposit Checker states
  const [depositRent, setDepositRent] = useState<number>(900);
  const [requestedDeposit, setRequestedDeposit] = useState<number>(900);
  const [requestedExtraGuarantee, setRequestedExtraGuarantee] = useState<number>(900);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor legal');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Respuesta jurídica procesada.',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        recommendedContractType: data.recommendedContractType as ContractType | null
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const fallbackMessage: Message = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `### Consulta Registrada (Modo Preventivo)

En relación con tu consulta sobre la normativa legal española, recuerda que:
- Las disposiciones de la **LAU (Ley 29/1994)** protegen con carácter imperativo a los arrendatarios de vivienda habitual (plazo mínimo de 5 años si el casero es particular, fianza legal obligatoria de 1 mes).
- El desistimiento del arrendatario es legalmente viable pasados **6 meses** con preaviso de 30 días (Art. 11 LAU).
- En operaciones mercantiles y compraventa entre particulares rigen los artículos 1484 y concordantes del Código Civil.

Puedes acceder a la **Fábrica de Contratos** para generar el documento legal blindado correspondiente con firma digital oficial.`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContractMeta = (type: ContractType) => {
    return CONTRACT_CATALOG.find(c => c.id === type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner: Ecosystem Context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/80 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Inteligencia Jurídica España • BOE, LAU, Ley 12/2023 & eIDAS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Asistente de Inteligencia Legislativa
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Resuelve al instante dudas sobre la legislación española vigente, calcula subidas de renta e indemnizaciones legales y traslada directamente los acuerdos a la <strong>Fábrica de Contratos</strong> con plena validez probatoria.
          </p>

          {/* Quick Ecosystem Switcher */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Consultor Jurídico IA</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'calculator'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Calculadora Subida Renta (IRAV/IPC)</span>
            </button>

            <button
              onClick={() => setActiveTab('deposit_checker')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'deposit_checker'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Auditor de Fianza (Art. 36 LAU)</span>
            </button>

            <button
              onClick={onNavigateToCatalog}
              className="ml-auto px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              <span>Ir a Fábrica de Contratos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ASISTENTE JURÍDICO INTERACTIVO */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Chat Interface (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[680px] overflow-hidden">
            
            {/* Chat header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Asesor Jurídico Especializado</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </h3>
                  <p className="text-[11px] text-slate-700">
                    Grounded en LAU 29/1994, Ley 12/2023, Código Civil y Ley 6/2020
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMessages([messages[0]])}
                className="text-slate-700 hover:text-slate-700 text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-white transition-colors"
                title="Limpiar conversación"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reiniciar chat</span>
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-700">
                      {msg.role === 'user' ? 'Tú (Consulta)' : 'Asesor Legal ContratoModelo'}
                    </span>
                    <span className="text-[10px] text-slate-700">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs whitespace-pre-line'
                    }`}
                  >
                    {msg.content}

                    {/* If message recommends a contract, render direct CTA card */}
                    {msg.recommendedContractType && (
                      <div className="mt-4 p-3.5 bg-white rounded-xl border border-amber-300 shadow-xs space-y-2 text-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Modelo Oficial Recomendado
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                            Listo para redactar
                          </span>
                        </div>
                        <p className="font-bold text-xs text-slate-900">
                          {getContractMeta(msg.recommendedContractType)?.title || 'Contrato Legal'}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {getContractMeta(msg.recommendedContractType)?.shortDesc}
                        </p>
                        <button
                          onClick={() => onSelectContract(msg.recommendedContractType!)}
                          className="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>Generar este contrato ahora</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-600 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Consultando jurisprudencia y normativa española vigente...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Formula tu consulta legal (ej. ¿Qué indemnización exige el art. 11 de la LAU si me mudo?)..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Consultar</span>
                </button>
              </form>
              <p className="text-[10px] text-slate-700 mt-2 text-center">
                Asesoramiento orientativo basado en legislación del Reino de España. No sustituye la dirección letrada colegiada.
              </p>
            </div>

          </div>

          {/* Sidebar: Frequent Queries & Shortcuts (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Consultas Legales Frecuentes</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Haz clic en cualquier pregunta para obtener la respuesta jurídica inmediata:
              </p>

              <div className="space-y-2">
                {COMMON_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.query)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-amber-300 bg-slate-50/70 hover:bg-amber-50/50 transition-all text-xs group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 mb-1">
                      <span>{item.category}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px] leading-snug group-hover:text-amber-900">
                      {item.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Contract Link Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 border border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <FileCheck className="w-4 h-4" />
                <span>Fábrica de Contratos</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ¿Ya sabes qué contrato necesitas? Genera al instante tu documento con previsualización gratuita y firma electrónica avanzada.
              </p>
              <button
                onClick={onNavigateToCatalog}
                className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Explorar los 12 Contratos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CALCULADORA DE ACTUALIZACIÓN DE RENTA (IRAV / IPC) */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold mb-2">
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span>Ley 12/2023 & Art. 18 LAU</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Calculadora Legal de Actualización de Renta
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Calcula el incremento de renta permitido por la ley en la fecha de aniversario anual de tu contrato de arrendamiento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Renta Mensual Actual (€)
              </label>
              <input
                type="number"
                min={100}
                value={currentRent}
                onChange={(e) => setCurrentRent(parseFloat(e.target.value) || 0)}
                placeholder="Ej. 850"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Índice Oficial de Variación (%)
              </label>
              <input
                type="number"
                step={0.1}
                value={iravRate}
                onChange={(e) => setIravRate(parseFloat(e.target.value) || 0)}
                placeholder="Ej. 2.5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={isBigLandlord}
                onChange={(e) => setIsBigLandlord(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>El arrendador es Gran Tenedor (más de 10 inmuebles o más de 5 en zona tensionada)</span>
            </label>
            <p className="text-[11px] text-slate-500 pl-5">
              Si es gran tenedor, el incremento nunca podrá superar el tope legal del índice oficial elaborado por el INE.
            </p>
          </div>

          {/* Results Summary */}
          {(() => {
            const increment = (currentRent * (iravRate / 100));
            const newRent = currentRent + increment;
            return (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Liquidación de la Nueva Renta
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block">Renta previa</span>
                    <span className="text-lg font-bold text-slate-800">{currentRent.toFixed(2)} €</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block">Subida mensual</span>
                    <span className="text-lg font-bold text-amber-700">+{increment.toFixed(2)} €</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block">Nueva Renta Final</span>
                    <span className="text-lg font-extrabold text-emerald-800">{newRent.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 bg-white/70 p-3 rounded-xl border border-amber-100">
                  <p><strong>Requisitos de validez jurídica (Art. 18.2 LAU):</strong></p>
                  <p>1. Notificar al arrendatario por escrito expresando el porcentaje de alteración aplicado.</p>
                  <p>2. La nueva renta será exigible a partir del mes siguiente a la notificación fehaciente.</p>
                </div>

                <button
                  onClick={() => onSelectContract('alquiler_vivienda')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Redactar Contrato con Cláusula de Actualización IRAV</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: AUDITOR DE FIANZAS Y GARANTÍAS LEGALES (ART. 36 LAU) */}
      {activeTab === 'deposit_checker' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Artículo 36 de la LAU</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Auditor de Legalidad de Fianzas y Garantías
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Verifica si las cantidades solicitadas en concepto de fianza y aval o depósito adicional cumplen estrictamente con los topes de la LAU.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Renta Pactada (€/mes)
              </label>
              <input
                type="number"
                min={100}
                value={depositRent}
                onChange={(e) => setDepositRent(parseFloat(e.target.value) || 0)}
                placeholder="Ej. 900"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fianza Solicitada (€)
              </label>
              <input
                type="number"
                min={0}
                value={requestedDeposit}
                onChange={(e) => setRequestedDeposit(parseFloat(e.target.value) || 0)}
                placeholder="Ej. 900"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Garantía Extra Solicitada (€)
              </label>
              <input
                type="number"
                min={0}
                value={requestedExtraGuarantee}
                onChange={(e) => setRequestedExtraGuarantee(parseFloat(e.target.value) || 0)}
                placeholder="Ej. 900"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>
          </div>

          {/* Audit Verification Result */}
          {(() => {
            const maxLegalExtra = depositRent * 2;
            const isLegalDeposit = requestedDeposit === depositRent;
            const isLegalExtra = requestedExtraGuarantee <= maxLegalExtra;
            const totalRequested = requestedDeposit + requestedExtraGuarantee;
            const totalMaxLegal = depositRent * 3;
            const isCompletelyLegal = isLegalDeposit && isLegalExtra;

            return (
              <div className={`rounded-2xl p-5 border space-y-4 ${
                isCompletelyLegal ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {isCompletelyLegal ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-sm text-emerald-900">
                        Condiciones Conformes con la Ley de Arrendamientos Urbanos
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <span className="font-bold text-sm text-rose-900">
                        Alerta de Infracción Legal del Art. 36.5 de la LAU
                      </span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Fianza Legal Obligatoria</span>
                    <span className="font-bold text-slate-800">{depositRent} € (1 mes)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Máximo Garantía Extra</span>
                    <span className="font-bold text-slate-800">{maxLegalExtra} € (2 meses)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Total Solicitado</span>
                    <span className={`font-bold ${totalRequested > totalMaxLegal ? 'text-rose-600' : 'text-slate-800'}`}>
                      {totalRequested} €
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Tope Total Permitido</span>
                    <span className="font-bold text-emerald-700">{totalMaxLegal} €</span>
                  </div>
                </div>

                {!isCompletelyLegal && (
                  <p className="text-xs text-rose-800 font-medium">
                    ⚠️ En los contratos de arrendamiento de vivienda de hasta 5 años (o 7 si persona jurídica), el artículo 36.5 de la LAU prohíbe expresamente exigir más de dos mensualidades de renta en concepto de garantía adicional. El pacto de cantidades superiores es nulo de pleno derecho.
                  </p>
                )}

                <button
                  onClick={() => onSelectContract('alquiler_vivienda')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Generar Contrato de Alquiler con Fianzas Blindadas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
};
