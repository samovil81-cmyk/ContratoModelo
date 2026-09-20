import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  ArrowLeft, 
  Download, 
  Eye, 
  Sparkles,
  Smartphone,
  Info
} from 'lucide-react';
import { ContractState, DigitalCertificateInfo, DigitalEvidence } from '../../types/contract';
import { DigitalCertificateSigner } from './DigitalCertificateSigner';
import { SignatureCanvas } from './SignatureCanvas';
import { generateDigitalSignatureSVG } from '../../utils/cryptoUtils';

interface RemoteSignViewProps {
  contractState: ContractState;
  token: string;
  onCompleteRemoteSign: (signatureDataUrl: string, certInfo?: DigitalCertificateInfo) => void;
  onExitRemoteView: () => void;
}

export const RemoteSignView: React.FC<RemoteSignViewProps> = ({
  contractState,
  token,
  onCompleteRemoteSign,
  onExitRemoteView
}) => {
  const { party1, party2, asset, clauses, evidence } = contractState;
  const [signatureMode, setSignatureMode] = useState<'cert' | 'canvas'>('cert');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showFullContract, setShowFullContract] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);

  const [tempCert, setTempCert] = useState<DigitalCertificateInfo | undefined>(evidence.certificateParty2);
  const [tempSignature, setTempSignature] = useState<string | undefined>(evidence.signatureParty2);

  const handleSaveCert = (certInfo: DigitalCertificateInfo, sigDataUrl: string) => {
    setTempCert(certInfo);
    setTempSignature(sigDataUrl);
    setSignedSuccess(true);
    onCompleteRemoteSign(sigDataUrl, certInfo);
  };

  const handleSaveCanvas = (dataUrl: string) => {
    setTempSignature(dataUrl);
    setTempCert(undefined);
    setSignedSuccess(true);
    onCompleteRemoteSign(dataUrl, undefined);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              CM
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>ContratoModelo</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  Portal de Firma Remota eIDAS
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Pase de firma seguro: <span className="font-mono text-slate-300">{token}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onExitRemoteView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la edición</span>
          </button>
        </div>

        {signedSuccess ? (
          <div className="bg-slate-800/90 rounded-3xl p-8 border border-emerald-500/30 text-center max-w-xl mx-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">¡Contrato firmado con éxito!</h2>
            <p className="text-sm text-slate-300 mt-2">
              Tu firma ha quedado incorporada legalmente en el documento oficial con sellado de tiempo cualificado y registro en la Hoja de Evidencias eIDAS.
            </p>

            <div className="my-6 p-4 bg-slate-900 rounded-2xl text-left border border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Firmante:</span>
                <span className="font-bold text-white">{party2.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NIF/NIE:</span>
                <span className="font-mono text-white">{party2.docNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de firma:</span>
                <span className="font-semibold text-emerald-400">
                  {tempCert ? `Certificado Digital (${tempCert.issuer})` : 'Firma Biométrica Táctil'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Código CSV:</span>
                <span className="font-mono text-amber-400">{evidence.verificationCode}</span>
              </div>
            </div>

            <button
              onClick={onExitRemoteView}
              className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              Ver documento final y descargar PDF
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Invitation Notice Box */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {party1.name || 'La contraparte'} te ha invitado a firmar este contrato
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Como <strong className="text-amber-400">{party2.roleTitle}</strong>, revisa los datos principales y estampa tu firma oficial con validez jurídica según la Ley 6/2020 y el Reglamento europeo eIDAS.
                  </p>
                </div>
              </div>

              {/* Summary key points */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Parte Emisora</span>
                  <p className="text-xs font-bold text-white mt-0.5 truncate">{party1.name || 'Parte 1'}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{party1.docNumber}</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Objeto del Contrato</span>
                  <p className="text-xs font-bold text-white mt-0.5 truncate">{asset.address || 'Inmueble / Activo'}</p>
                  <p className="text-[11px] text-slate-400">{asset.city} ({asset.province})</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Condición Económica</span>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">
                    {asset.monthlyRent > 0 ? `${asset.monthlyRent} €/mes` : 'Estipulada en contrato'}
                  </p>
                  <p className="text-[11px] text-slate-400">Fianza: {asset.legalDepositMonths} mes(es)</p>
                </div>
              </div>
            </div>

            {/* Contract terms legal consent check */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAcceptedTerms}
                  onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-md border-slate-600 text-amber-500 focus:ring-amber-400"
                />
                <div className="text-xs text-slate-300">
                  <p className="font-semibold text-white">
                    He leído y acepto íntegramente las cláusulas y condiciones del contrato
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    De conformidad con el artículo 23 de la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE) y la Ley 6/2020 de Firma Electrónica, presto mi consentimiento libre, expreso e informado para celebrar este contrato por medios telemáticos.
                  </p>
                </div>
              </label>
            </div>

            {/* Signature Area */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Estampa tu firma como {party2.name || party2.roleTitle}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Elige el método que prefieras: Certificado Digital cualificado o rúbrica táctil en pantalla.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('cert')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      signatureMode === 'cert'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Certificado Digital
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('canvas')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      signatureMode === 'canvas'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Firma Táctil
                  </button>
                </div>
              </div>

              {!hasAcceptedTerms && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Por favor, marca la casilla superior de aceptación legal de cláusulas para estampar tu firma.</span>
                </div>
              )}

              <div className={hasAcceptedTerms ? '' : 'opacity-40 pointer-events-none'}>
                {signatureMode === 'cert' ? (
                  <DigitalCertificateSigner
                    signerName={party2.name}
                    signerDocNumber={party2.docNumber}
                    roleTitle={party2.roleTitle}
                    csv={evidence.verificationCode}
                    existingCertificate={evidence.certificateParty2}
                    onSaveCertificateSignature={handleSaveCert}
                    onSwitchToCanvas={() => setSignatureMode('canvas')}
                  />
                ) : (
                  <SignatureCanvas
                    signerName={party2.name}
                    signerDoc={`${party2.docType}: ${party2.docNumber}`}
                    roleTitle={party2.roleTitle}
                    initialSignature={evidence.signatureParty2}
                    onSaveSignature={handleSaveCanvas}
                  />
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
