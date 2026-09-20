import React, { useState } from 'react';
import { PartyData, DigitalEvidence, DigitalCertificateInfo } from '../../types/contract';
import { SignatureCanvas } from './SignatureCanvas';
import { DigitalCertificateSigner } from './DigitalCertificateSigner';
import { RemoteSignModal } from './RemoteSignModal';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2, 
  Send, 
  KeyRound, 
  PenTool, 
  Smartphone,
  Info
} from 'lucide-react';

interface SignatureStationProps {
  party1: PartyData;
  party2: PartyData;
  evidence: DigitalEvidence;
  contractTitle: string;
  onUpdateEvidence: (evidence: Partial<DigitalEvidence>) => void;
  onProceedToPreview: () => void;
  onPrev: () => void;
  onOpenRemoteSignView: (token: string) => void;
}

export const SignatureStation: React.FC<SignatureStationProps> = ({
  party1,
  party2,
  evidence,
  contractTitle,
  onUpdateEvidence,
  onProceedToPreview,
  onPrev,
  onOpenRemoteSignView
}) => {
  const [modeParty1, setModeParty1] = useState<'cert' | 'canvas'>(
    evidence.certificateParty1 ? 'cert' : 'cert'
  );
  const [modeParty2, setModeParty2] = useState<'cert' | 'canvas'>(
    evidence.certificateParty2 ? 'cert' : 'cert'
  );
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);

  const hasSig1 = !!evidence.signatureParty1;
  const hasSig2 = !!evidence.signatureParty2;
  const allSigned = hasSig1 && hasSig2;

  // Save Party 1 Canvas
  const handleSaveSig1Canvas = (dataUrl: string) => {
    onUpdateEvidence({
      signatureParty1: dataUrl,
      signatureDateParty1: dataUrl ? new Date().toISOString() : undefined,
      certificateParty1: undefined,
      status: dataUrl && hasSig2 ? 'firmado_completo' : dataUrl || hasSig2 ? 'firmado_parcial' : 'borrador'
    });
  };

  // Save Party 1 Certificate
  const handleSaveSig1Cert = (certInfo: DigitalCertificateInfo, dataUrl: string) => {
    onUpdateEvidence({
      signatureParty1: dataUrl,
      signatureDateParty1: certInfo.signedAt,
      certificateParty1: certInfo,
      status: hasSig2 ? 'firmado_completo' : 'firmado_parcial'
    });
  };

  // Save Party 2 Canvas
  const handleSaveSig2Canvas = (dataUrl: string) => {
    onUpdateEvidence({
      signatureParty2: dataUrl,
      signatureDateParty2: dataUrl ? new Date().toISOString() : undefined,
      certificateParty2: undefined,
      status: dataUrl && hasSig1 ? 'firmado_completo' : dataUrl || hasSig1 ? 'firmado_parcial' : 'borrador'
    });
  };

  // Save Party 2 Certificate
  const handleSaveSig2Cert = (certInfo: DigitalCertificateInfo, dataUrl: string) => {
    onUpdateEvidence({
      signatureParty2: dataUrl,
      signatureDateParty2: certInfo.signedAt,
      certificateParty2: certInfo,
      status: hasSig1 ? 'firmado_completo' : 'firmado_parcial'
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Station Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Firma electrónica cualificada y sellado eIDAS
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Ley 6/2020 eIDAS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Firma con <strong>Certificado Digital (FNMT, DNIe, .pfx)</strong> para máxima presunción legal en juicio, o utiliza rúbrica biométrica táctil en pantalla.
            </p>
          </div>

          {/* Status & Remote Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRemoteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-700" />
              <span>Invitar a firmar a distancia</span>
            </button>

            <div className="shrink-0">
              {allSigned ? (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Firmado completo</span>
                </div>
              ) : hasSig1 || hasSig2 ? (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>1 de 2 firmas</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  <span>Pendiente</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dual Signature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Party 1 Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{party1.roleTitle}</span>
              {evidence.certificateParty1 && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Certificado {evidence.certificateParty1.issuer.split(' ')[1] || 'Cualificado'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModeParty1('cert')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  modeParty1 === 'cert'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Certificado
              </button>
              <button
                type="button"
                onClick={() => setModeParty1('canvas')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  modeParty1 === 'canvas'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rúbrica
              </button>
            </div>
          </div>

          {modeParty1 === 'cert' ? (
            <DigitalCertificateSigner
              signerName={party1.name}
              signerDocNumber={party1.docNumber}
              roleTitle={party1.roleTitle}
              csv={evidence.verificationCode}
              existingCertificate={evidence.certificateParty1}
              onSaveCertificateSignature={handleSaveSig1Cert}
              onSwitchToCanvas={() => setModeParty1('canvas')}
            />
          ) : (
            <SignatureCanvas
              signerName={party1.name}
              signerDoc={`${party1.docType}: ${party1.docNumber}`}
              roleTitle={party1.roleTitle}
              initialSignature={evidence.signatureParty1}
              onSaveSignature={handleSaveSig1Canvas}
            />
          )}
        </div>

        {/* Party 2 Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{party2.roleTitle}</span>
              {evidence.certificateParty2 && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Certificado {evidence.certificateParty2.issuer.split(' ')[1] || 'Cualificado'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModeParty2('cert')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  modeParty2 === 'cert'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Certificado
              </button>
              <button
                type="button"
                onClick={() => setModeParty2('canvas')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  modeParty2 === 'canvas'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rúbrica
              </button>
            </div>
          </div>

          {modeParty2 === 'cert' ? (
            <DigitalCertificateSigner
              signerName={party2.name}
              signerDocNumber={party2.docNumber}
              roleTitle={party2.roleTitle}
              csv={evidence.verificationCode}
              existingCertificate={evidence.certificateParty2}
              onSaveCertificateSignature={handleSaveSig2Cert}
              onSwitchToCanvas={() => setModeParty2('canvas')}
            />
          ) : (
            <SignatureCanvas
              signerName={party2.name}
              signerDoc={`${party2.docType}: ${party2.docNumber}`}
              roleTitle={party2.roleTitle}
              initialSignature={evidence.signatureParty2}
              onSaveSignature={handleSaveSig2Canvas}
            />
          )}
        </div>

      </div>

      {/* Legal and Security Note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed flex items-start gap-3">
        <FileCheck2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-800">
            Marco legal: Ley 6/2020 de Firma Electrónica y Reglamento Europeo (UE) Nº 910/2014 (eIDAS):
          </p>
          <p className="mt-1">
            Tanto la firma electrónica cualificada (con certificado expedido por FNMT, DNIe o prestador de servicios de confianza) como la firma electrónica avanzada basada en rúbrica biométrica, hash SHA-256 e IP certificada poseen plena validez y eficacia jurídica en España según el artículo 23 de la LSSI-CE y el artículo 326 de la Ley de Enjuiciamiento Civil.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          ← Volver a Cláusulas
        </button>

        <button
          type="button"
          onClick={onProceedToPreview}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Ver Contrato A4 y Descarga Oficial</span>
          <span className="text-xs">→</span>
        </button>
      </div>

      {/* Remote Sign Invitation Modal */}
      <RemoteSignModal
        isOpen={isRemoteModalOpen}
        onClose={() => setIsRemoteModalOpen(false)}
        party1={party1}
        party2={party2}
        evidence={evidence}
        contractTitle={contractTitle}
        onOpenRemoteSignView={onOpenRemoteSignView}
        onUpdateEvidence={onUpdateEvidence}
      />

    </div>
  );
};

