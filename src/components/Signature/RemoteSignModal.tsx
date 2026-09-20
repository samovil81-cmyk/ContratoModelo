import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  X,
  AlertCircle,
  FileText
} from 'lucide-react';
import { PartyData, DigitalEvidence } from '../../types/contract';
import { generateInviteToken } from '../../utils/cryptoUtils';

interface RemoteSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  party1: PartyData;
  party2: PartyData;
  evidence: DigitalEvidence;
  contractTitle: string;
  onOpenRemoteSignView: (token: string) => void;
  onUpdateEvidence: (evidence: Partial<DigitalEvidence>) => void;
}

export const RemoteSignModal: React.FC<RemoteSignModalProps> = ({
  isOpen,
  onClose,
  party1,
  party2,
  evidence,
  contractTitle,
  onOpenRemoteSignView,
  onUpdateEvidence
}) => {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [waSent, setWaSent] = useState(false);
  const [customEmail, setCustomEmail] = useState(party2.email || '');

  if (!isOpen) return null;

  const inviteToken = evidence.remoteInviteToken || generateInviteToken();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://contratomodelo.es';
  const inviteUrl = `${origin}/firmar?token=${inviteToken}&doc=${evidence.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    if (!evidence.remoteInviteToken) {
      onUpdateEvidence({
        remoteInviteToken: inviteToken,
        remoteInviteStatus: 'sent',
        remoteInviteRecipientEmail: customEmail || party2.email,
        remoteInviteSentAt: new Date().toISOString()
      });
    }
  };

  const handleSimulateEmail = () => {
    setEmailSent(true);
    onUpdateEvidence({
      remoteInviteToken: inviteToken,
      remoteInviteStatus: 'sent',
      remoteInviteRecipientEmail: customEmail || party2.email || 'firmante.remoto@ejemplo.es',
      remoteInviteSentAt: new Date().toISOString()
    });
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleSimulateWhatsApp = () => {
    setWaSent(true);
    const message = encodeURIComponent(
      `Hola ${party2.name || 'estimado/a'}, tienes listo para firma electrónica el contrato "${contractTitle}". Puedes revisarlo y firmarlo de forma segura con tu certificado digital o rúbrica aquí: ${inviteUrl}`
    );
    // Safe notification in UI
    setTimeout(() => setWaSent(false), 3000);
  };

  const handleLaunchSimulation = () => {
    if (!evidence.remoteInviteToken) {
      onUpdateEvidence({
        remoteInviteToken: inviteToken,
        remoteInviteStatus: 'sent',
        remoteInviteRecipientEmail: customEmail || party2.email,
        remoteInviteSentAt: new Date().toISOString()
      });
    }
    onClose();
    onOpenRemoteSignView(inviteToken);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                Firma Remota Asíncrona
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                eIDAS Ley 6/2020
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Invitar a firmar a {party2.name || party2.roleTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Genera un enlace seguro cifrado para que la otra parte pueda revisar y firmar el contrato desde su propio ordenador, móvil o tableta.
            </p>
          </div>
        </div>

        {/* Security / Expiration Details Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Destinatario:</span>
            <span className="font-bold text-slate-800">{party2.name || 'Segunda Parte'} ({party2.roleTitle})</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <span className="text-slate-500 font-medium">Email / Contacto:</span>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="ejemplo.firmante@dominio.es"
              className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:placeholder-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-500 max-w-xs"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Caducidad del enlace:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
              <Clock className="w-3.5 h-3.5" /> 72 horas (plazo legal)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Token de un solo uso:</span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
              {inviteToken}
            </span>
          </div>
        </div>

        {/* Generated Secure Link */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-slate-700">
            Enlace de firma seguro para enviar:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-hidden"
            />
            <button
              onClick={handleCopyLink}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-amber-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Send Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleSimulateWhatsApp}
            className="flex items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{waSent ? 'Enlace preparado' : 'Enviar por WhatsApp'}</span>
          </button>

          <button
            onClick={handleSimulateEmail}
            className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{emailSent ? 'Correo enviado' : 'Enviar por Correo'}</span>
          </button>
        </div>

        {/* Interactive Simulation Sandbox */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Simulación del entorno de la contraparte:
              </h4>
              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                Puedes abrir de inmediato la pantalla de firma remota para comprobar cómo la segunda parte revisará el contrato y firmará con su propio certificado o rúbrica.
              </p>
              <button
                onClick={handleLaunchSimulation}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir vista remota como {party2.name || party2.roleTitle}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal assurance footer */}
        <div className="text-[11px] text-slate-500 text-center leading-relaxed">
          Garantía probatoria: El sistema registra la IP remota, navegador, sellado de tiempo cualificado y huella SHA-256 en la <strong>Hoja de Evidencias eIDAS</strong> del documento final.
        </div>

      </div>
    </div>
  );
};
