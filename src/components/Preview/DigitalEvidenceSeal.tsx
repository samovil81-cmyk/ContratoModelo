import React from 'react';
import { DigitalEvidence, PartyData } from '../../types/contract';
import { 
  ShieldCheck, 
  Lock, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  FileBadge, 
  Globe, 
  Clock, 
  Send 
} from 'lucide-react';

interface DigitalEvidenceSealProps {
  evidence: DigitalEvidence;
  party1: PartyData;
  party2: PartyData;
  contractTitle: string;
}

export const DigitalEvidenceSeal: React.FC<DigitalEvidenceSealProps> = ({
  evidence,
  party1,
  party2,
  contractTitle
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 my-8 border border-slate-800 shadow-xl print:bg-white print:text-black print:border-2 print:border-black print:shadow-none">
      
      {/* Header of the Evidence Sheet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-black">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center print:border-black print:text-black">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold font-title-legal tracking-wide">
                DOCUMENTO DE SELLADO Y EVIDENCIA DIGITAL
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 print:border-black print:text-black">
                eIDAS Compliant (UE 910/2014)
              </span>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-700 mt-0.5">
              Certificación telemática de integridad según Reglamento (UE) Nº 910/2014 y Ley 6/2020 de Servicios Electrónicos de Confianza
            </p>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="flex items-center gap-3 bg-slate-800/80 print:bg-slate-100 p-2.5 rounded-xl border border-slate-700 print:border-black">
          <QrCode className="w-9 h-9 text-amber-400 print:text-black shrink-0" />
          <div className="text-right sm:text-left">
            <p className="text-[10px] text-slate-400 print:text-slate-700 uppercase font-semibold">
              Código Seguro de Verificación (CSV)
            </p>
            <p className="text-xs font-mono font-bold text-amber-300 print:text-black tracking-wider">
              {evidence.verificationCode}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Evidence Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs">
        
        {/* Left column: Cryptographic proof */}
        <div className="space-y-3 bg-slate-800/50 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
          <div className="flex items-center gap-2 text-amber-400 print:text-black font-bold">
            <Lock className="w-4 h-4" />
            <span>Huella Criptográfica del Contrato (Digest)</span>
          </div>
          
          <div>
            <span className="text-[11px] text-slate-400 print:text-slate-600 block mb-1">
              Algoritmo de resumen seguro: <strong>SHA-256 (FIPS 180-4)</strong>
            </span>
            <div className="p-2.5 bg-slate-950 print:bg-white print:border print:border-black rounded-lg font-mono text-[11px] text-slate-300 print:text-black break-all select-all">
              {evidence.documentHash}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-slate-400 print:text-slate-600">Sellado de tiempo (TSA):</span>
              <p className="font-semibold text-white print:text-black">
                {evidence.timestampFormatted} (CET / UTC+1)
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {evidence.tsaAuthority || 'FNMT-RCM RFC 3161'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600">Dirección IP de conexión:</span>
              <p className="font-semibold text-white print:text-black">
                {evidence.ipMock}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Geolocalización: España (ES)
              </p>
            </div>
          </div>

          {/* Remote Sign Audit Log if used */}
          {evidence.remoteInviteToken && (
            <div className="mt-3 p-3 bg-slate-900/90 rounded-lg border border-slate-700/80 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                <Send className="w-3.5 h-3.5" />
                <span>Auditoría de Invitación Remota:</span>
              </div>
              <p className="text-slate-300">
                Token de un solo uso: <span className="font-mono text-amber-200">{evidence.remoteInviteToken}</span>
              </p>
              <p className="text-slate-400 mt-0.5">
                Estado: <span className="text-emerald-400 font-semibold">{evidence.remoteInviteStatus === 'completed' || evidence.remoteInviteCompletedAt ? 'Firmado remotamente por la contraparte' : 'Invitación activa'}</span>
              </p>
            </div>
          )}
        </div>

        {/* Right column: Signers audit trail */}
        <div className="space-y-3 bg-slate-800/50 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
          <div className="flex items-center gap-2 text-amber-400 print:text-black font-bold">
            <FileText className="w-4 h-4" />
            <span>Trazabilidad y Certificados de las Partes</span>
          </div>

          <div className="space-y-3 text-[11px]">
            {/* Party 1 Signer */}
            <div className="p-3 bg-slate-900/80 print:bg-white rounded-lg border border-slate-800 print:border-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 print:text-black font-bold uppercase">
                    {party1.roleTitle}
                  </span>
                  <p className="font-bold text-white print:text-black">{party1.name}</p>
                  <p className="text-slate-400 print:text-slate-600">{party1.docType}: {party1.docNumber}</p>
                </div>
                <div className="text-right">
                  {evidence.certificateParty1 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 print:text-emerald-700 font-semibold text-[11px]">
                      <FileBadge className="w-3.5 h-3.5" /> Certificado Cualificado
                    </span>
                  ) : evidence.signatureParty1 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 print:text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Firma en pantalla
                    </span>
                  ) : (
                    <span className="text-amber-400 print:text-amber-700">Firma pendiente</span>
                  )}
                </div>
              </div>

              {/* Certificate details if available */}
              {evidence.certificateParty1 && (
                <div className="mt-2 pt-2 border-t border-slate-800 print:border-slate-200 text-[10px] text-slate-300 print:text-slate-700 space-y-0.5">
                  <p><span className="text-slate-400">Emisor:</span> {evidence.certificateParty1.issuer}</p>
                  <p className="font-mono"><span className="text-slate-400">Nº Serie:</span> {evidence.certificateParty1.serialNumber}</p>
                  <p className="font-mono"><span className="text-slate-400">Huella SHA-256:</span> {evidence.certificateParty1.certFingerprint.slice(0, 32)}...</p>
                </div>
              )}
            </div>

            {/* Party 2 Signer */}
            <div className="p-3 bg-slate-900/80 print:bg-white rounded-lg border border-slate-800 print:border-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 print:text-black font-bold uppercase">
                    {party2.roleTitle}
                  </span>
                  <p className="font-bold text-white print:text-black">{party2.name}</p>
                  <p className="text-slate-400 print:text-slate-600">{party2.docType}: {party2.docNumber}</p>
                </div>
                <div className="text-right">
                  {evidence.certificateParty2 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 print:text-emerald-700 font-semibold text-[11px]">
                      <FileBadge className="w-3.5 h-3.5" /> Certificado Cualificado
                    </span>
                  ) : evidence.signatureParty2 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 print:text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {(evidence.remoteInviteStatus === 'completed' || evidence.remoteInviteCompletedAt) ? 'Firmado remotamente' : 'Firma en pantalla'}
                    </span>
                  ) : (
                    <span className="text-amber-400 print:text-amber-700">Firma pendiente</span>
                  )}
                </div>
              </div>

              {/* Certificate details if available */}
              {evidence.certificateParty2 && (
                <div className="mt-2 pt-2 border-t border-slate-800 print:border-slate-200 text-[10px] text-slate-300 print:text-slate-700 space-y-0.5">
                  <p><span className="text-slate-400">Emisor:</span> {evidence.certificateParty2.issuer}</p>
                  <p className="font-mono"><span className="text-slate-400">Nº Serie:</span> {evidence.certificateParty2.serialNumber}</p>
                  <p className="font-mono"><span className="text-slate-400">Huella SHA-256:</span> {evidence.certificateParty2.certFingerprint.slice(0, 32)}...</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Footer Legal Declarations */}
      <div className="pt-4 border-t border-slate-800 print:border-black text-[10px] text-slate-400 print:text-slate-700 leading-relaxed space-y-1">
        <p>
          Este anexo confiere presunción legal de autenticidad e integridad del documento conforme al Reglamento eIDAS (UE) 910/2014 y los artículos 3 y siguientes de la Ley 6/2020, de 11 de noviembre, reguladora de determinados aspectos de los servicios electrónicos de confianza.
        </p>
        <p>
          Para cotejar fehacientemente la validez y contenido inalterado de este contrato, cualquier parte o tribunal puede verificar el CSV <strong className="font-mono text-slate-300 print:text-black">{evidence.verificationCode}</strong> en la sede electrónica de ContratoModelo.
        </p>
      </div>

    </div>
  );
};

