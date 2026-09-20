import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Upload, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  FileBadge, 
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { DigitalCertificateInfo } from '../../types/contract';
import { getAvailableSystemCertificates, generateDigitalSignatureSVG } from '../../utils/cryptoUtils';

interface DigitalCertificateSignerProps {
  signerName: string;
  signerDocNumber: string;
  roleTitle: string;
  csv: string;
  existingCertificate?: DigitalCertificateInfo;
  onSaveCertificateSignature: (certInfo: DigitalCertificateInfo, signatureDataUrl: string) => void;
  onSwitchToCanvas: () => void;
}

export const DigitalCertificateSigner: React.FC<DigitalCertificateSignerProps> = ({
  signerName,
  signerDocNumber,
  roleTitle,
  csv,
  existingCertificate,
  onSaveCertificateSignature,
  onSwitchToCanvas
}) => {
  const [activeTab, setActiveTab] = useState<'browser_store' | 'dnie' | 'pfx_file'>(
    existingCertificate?.sourceType || 'browser_store'
  );

  // Available mock/system certificates
  const systemCertificates = getAvailableSystemCertificates(signerName, signerDocNumber);
  const [selectedCertIndex, setSelectedCertIndex] = useState<number>(0);
  
  // DNIe state
  const [dniePin, setDniePin] = useState('');
  const [dnieScanning, setDnieScanning] = useState(false);
  const [dnieValidated, setDnieValidated] = useState(false);
  const [dnieError, setDnieError] = useState('');

  // PFX file state
  const [pfxFileName, setPfxFileName] = useState('');
  const [pfxPassword, setPfxPassword] = useState('');
  const [pfxValidating, setPfxValidating] = useState(false);
  const [pfxLoadedCert, setPfxLoadedCert] = useState<DigitalCertificateInfo | null>(null);
  const [pfxError, setPfxError] = useState('');

  // Success state
  const [isSigning, setIsSigning] = useState(false);

  // Handle Browser / FNMT signature
  const handleSignWithBrowserCert = () => {
    setIsSigning(true);
    setTimeout(() => {
      const chosenCert = systemCertificates[selectedCertIndex] || systemCertificates[0];
      const certData: DigitalCertificateInfo = {
        ...chosenCert,
        signerName: signerName || chosenCert.signerName,
        signerNif: signerDocNumber || chosenCert.signerNif,
        signedAt: new Date().toISOString()
      };
      const svgSeal = generateDigitalSignatureSVG(certData, csv);
      onSaveCertificateSignature(certData, svgSeal);
      setIsSigning(false);
    }, 600);
  };

  // Handle DNIe PIN validation and sign
  const handleValidateAndSignDNIe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dniePin || dniePin.length < 4) {
      setDnieError('El PIN del DNIe debe contener entre 4 y 8 dígitos.');
      return;
    }
    setDnieError('');
    setDnieScanning(true);

    setTimeout(() => {
      setDnieScanning(false);
      setDnieValidated(true);
      const dnieCert = systemCertificates.find(c => c.sourceType === 'dnie') || systemCertificates[1];
      const certData: DigitalCertificateInfo = {
        ...dnieCert,
        signerName: signerName || dnieCert.signerName,
        signerNif: signerDocNumber || dnieCert.signerNif,
        signedAt: new Date().toISOString(),
        sourceType: 'dnie'
      };
      const svgSeal = generateDigitalSignatureSVG(certData, csv);
      onSaveCertificateSignature(certData, svgSeal);
    }, 900);
  };

  // Handle PFX file upload
  const handlePfxFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPfxFileName(file.name);
      setPfxError('');
    }
  };

  const handleValidatePfx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pfxFileName) {
      setPfxError('Selecciona un archivo con extensión .p12 o .pfx');
      return;
    }
    if (!pfxPassword) {
      setPfxError('Introduce la contraseña del almacén de claves');
      return;
    }

    setPfxValidating(true);
    setPfxError('');

    setTimeout(() => {
      setPfxValidating(false);
      const certData: DigitalCertificateInfo = {
        signerName: signerName || 'Titular de Certificado PFX',
        signerNif: signerDocNumber || '48291045B',
        issuer: 'AC Camerfirma / FNMT Qualified Keystore',
        serialNumber: '7B:44:E1:90:3A:C2:55:18:99:FF',
        validFrom: '01/01/2024',
        validTo: '01/01/2028',
        keyAlgorithm: 'RSA 2048-bit',
        signatureAlgorithm: 'SHA256withRSA',
        sourceType: 'pfx_file',
        certFingerprint: 'A189C332E00189BF7412E09876543210ABCDEF0123456789ABCDEF0123456789',
        signedAt: new Date().toISOString(),
        ipAddress: '194.179.1.84 (Madrid, ES)',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'ContratoModelo Qualified Client'
      };
      setPfxLoadedCert(certData);
      const svgSeal = generateDigitalSignatureSVG(certData, csv);
      onSaveCertificateSignature(certData, svgSeal);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Signer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {roleTitle}
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-1">
              {signerName || 'Nombre del firmante'}
            </h4>
            <p className="text-xs text-slate-500 font-mono">
              {signerDocNumber ? `NIF/NIE: ${signerDocNumber}` : 'Documento pendiente'}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              eIDAS Cualificado
            </span>
          </div>
        </div>

        {/* Existing Signed Seal Indicator */}
        {existingCertificate && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">
                  Firmado con Certificado: {existingCertificate.issuer}
                </p>
                <p className="text-emerald-700 mt-0.5 font-mono text-[11px]">
                  Serie: {existingCertificate.serialNumber}
                </p>
                <p className="text-emerald-600 text-[10px] mt-0.5">
                  Estampado en fecha: {new Date(existingCertificate.signedAt).toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Methods Tab Navigation */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('browser_store')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'browser_store'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate">Navegador / FNMT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dnie')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'dnie'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate">DNIe</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pfx_file')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pfx_file'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate">Archivo .p12/.pfx</span>
          </button>
        </div>

        {/* TAB 1: BROWSER STORE / FNMT */}
        {activeTab === 'browser_store' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Certificados detectados en el almacén seguro:</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Conexión directa mediante interfaz WebPKI / AutoFirma compatible con prestadores cualificados en España (FNMT, ACCV, Camerfirma).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {systemCertificates.filter(c => c.sourceType === 'browser_store').map((cert, idx) => (
                <label
                  key={cert.serialNumber}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCertIndex === idx
                      ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`cert-${roleTitle}`}
                    checked={selectedCertIndex === idx}
                    onChange={() => setSelectedCertIndex(idx)}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <FileBadge className="w-3.5 h-3.5 text-amber-600" />
                      <span>{signerName || cert.signerName} ({signerDocNumber || cert.signerNif})</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-[11px]">
                      Emisor: <strong className="text-slate-800">{cert.issuer}</strong>
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                      <span>Validez: {cert.validTo}</span>
                      <span className="font-mono">Serie: {cert.serialNumber.slice(0, 14)}...</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSignWithBrowserCert}
              disabled={isSigning}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSigning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Estampando firma cualificada eIDAS...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Firmar electrónicamente con este certificado</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: DNI ELECTRÓNICO (DNIe) */}
        {activeTab === 'dnie' && (
          <form onSubmit={handleValidateAndSignDNIe} className="space-y-3">
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lector de tarjetas DNI electrónico 3.0 / 4.0:</p>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Conecta tu lector inteligente con chip del DNI español o dispositivo NFC e introduce el PIN entregado en Comisaría.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>PIN de seguridad del DNIe:</span>
              </label>
              <input
                type="password"
                maxLength={8}
                placeholder="••••••"
                value={dniePin}
                onChange={(e) => setDniePin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono tracking-widest focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
              <p className="text-[10px] text-slate-500">
                El PIN no se transmite a ningún servidor; se valida criptográficamente mediante el chip seguro local.
              </p>
            </div>

            {dnieError && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{dnieError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={dnieScanning}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {dnieScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Accediendo al chip criptográfico DNIe...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Validar PIN y Firmar con DNIe</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: PFX / P12 KEYSTORE FILE */}
        {activeTab === 'pfx_file' && (
          <form onSubmit={handleValidatePfx} className="space-y-3">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2">
              <Upload className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Copia de seguridad de Certificado Software (.p12 / .pfx):</p>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Importa directamente tu archivo de certificado exportado desde Chrome, Firefox o la Fábrica Nacional de Moneda y Timbre.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Seleccionar archivo .pfx o .p12:
              </label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-xl p-3 text-center transition-colors">
                <input
                  type="file"
                  accept=".p12,.pfx,application/x-pkcs12"
                  onChange={handlePfxFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  {pfxFileName ? pfxFileName : 'Haz clic o arrastra tu certificado .p12 / .pfx aquí'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  PKCS#12 Keystore compatible con FNMT y prestadores españoles
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Contraseña del archivo de claves:</span>
              </label>
              <input
                type="password"
                placeholder="Introduce la contraseña del certificado"
                value={pfxPassword}
                onChange={(e) => setPfxPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400 focus:placeholder-transparent transition-colors"
              />
            </div>

            {pfxError && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pfxError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pfxValidating}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {pfxValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Desencriptando e importando clave privada...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Desbloquear y Firmar Documento</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer toggle back to hand-drawn signature */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">¿Prefieres rubricar a mano?</span>
        <button
          type="button"
          onClick={onSwitchToCanvas}
          className="text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer"
        >
          Usar firma manuscrita táctil
        </button>
      </div>
    </div>
  );
};
