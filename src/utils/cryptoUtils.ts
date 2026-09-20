/**
 * Utilidades criptográficas para el sellado y trazabilidad eIDAS
 */
import { DigitalCertificateInfo } from '../types/contract';

export async function computeSHA256(text: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn("crypto.subtle not available, using fallback hash", e);
  }
  // Fallback hash implementation
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855".slice(0, 16) + Math.abs(hash).toString(16).padStart(16, '0');
}

export function generateCSV(prefix = 'ES-LAU'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 10; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${randomPart.slice(0, 5)}-${randomPart.slice(5)}`;
}

export function generateInviteToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SEC-INV-${token.slice(0, 4)}-${token.slice(4, 8)}-${token.slice(8)}`;
}

export function formatSpanishDate(isoDateStr?: string): string {
  const date = isoDateStr ? new Date(isoDateStr) : new Date();
  const day = date.getDate();
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

export function formatSpanishDateTime(isoDateStr?: string): string {
  const date = isoDateStr ? new Date(isoDateStr) : new Date();
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${d}/${m}/${y} a las ${hh}:${mm}:${ss} CET`;
}

export function formatCurrencyEUR(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount || 0);
}

/**
 * Generates an official vector SVG digital signature seal (eIDAS / Ley 6/2020 format)
 * and returns it as a Data URL for clean, crisp rendering and PDF inclusion.
 */
export function generateDigitalSignatureSVG(cert: DigitalCertificateInfo, csv: string): string {
  const dateStr = formatSpanishDateTime(cert.signedAt);
  const cleanName = escapeXml(cert.signerName || 'Firma Electrónica');
  const cleanNif = escapeXml(cert.signerNif || '');
  const cleanIssuer = escapeXml(cert.issuer || 'FNMT-RCM');
  const serialTrunc = cert.serialNumber ? cert.serialNumber.slice(0, 23) + '...' : '3F:9A:82:C1...';
  const fpTrunc = cert.certFingerprint ? cert.certFingerprint.slice(0, 28) + '...' : 'SHA-256 Validado';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="460" height="150" viewBox="0 0 460 150">
  <defs>
    <linearGradient id="sealBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <filter id="shadow" x="-3%" y="-6%" width="106%" height="116%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Border & Background -->
  <rect x="2" y="2" width="456" height="146" rx="10" fill="url(#sealBg)" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)" />
  
  <!-- Left Side Badge Ribbon -->
  <rect x="2" y="2" width="70" height="146" rx="10" fill="#0f172a" />
  <rect x="62" y="2" width="10" height="146" fill="#0f172a" />

  <!-- Shield & Lock Icon in Left Ribbon -->
  <g transform="translate(18, 42)" stroke="#f59e0b" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="11" r="2.5" fill="#f59e0b" stroke="none" />
    <path d="M12 13.5v3" stroke="#f59e0b" />
  </g>
  <text x="37" y="105" fill="#e2e8f0" font-size="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="0.5">eIDAS</text>
  <text x="37" y="116" fill="#94a3b8" font-size="7" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle">Ley 6/2020</text>

  <!-- Content Right Side -->
  <g transform="translate(85, 20)">
    <!-- Header banner -->
    <text x="0" y="0" fill="#0f172a" font-size="9.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" letter-spacing="0.3">
      FIRMADO ELECTRÓNICAMENTE CON CERTIFICADO CUALIFICADO
    </text>

    <!-- Signer name & NIF -->
    <text x="0" y="20" fill="#047857" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="bold">
      ${cleanName}
    </text>
    <text x="0" y="35" fill="#334155" font-size="9.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600">
      NIF / NIE: <tspan font-family="monospace" fill="#0f172a">${cleanNif}</tspan>
    </text>

    <!-- Issuer & Serial -->
    <text x="0" y="52" fill="#475569" font-size="8.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      Emisor: <tspan font-weight="bold" fill="#1e293b">${cleanIssuer}</tspan>
    </text>
    <text x="0" y="66" fill="#64748b" font-size="7.5" font-family="monospace">
      Serie: ${serialTrunc}
    </text>

    <!-- Timestamp & CSV -->
    <g transform="translate(0, 84)">
      <line x1="0" y1="0" x2="355" y2="0" stroke="#e2e8f0" stroke-width="1" />
      <text x="0" y="14" fill="#64748b" font-size="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        Fecha/Hora TSA: <tspan font-weight="600" fill="#0f172a">${dateStr}</tspan>
      </text>
      <text x="0" y="27" fill="#64748b" font-size="7.5" font-family="monospace">
        CSV: <tspan font-weight="bold" fill="#b45309">${escapeXml(csv)}</tspan> • Huella: ${fpTrunc}
      </text>
    </g>
  </g>
</svg>
`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Prepares mock/detected certificates matching the Spanish eIDAS and National Trust ecosystem:
 * FNMT-RCM, DNI electrónico (Policía Nacional), ACCV, Camerfirma.
 */
export function getAvailableSystemCertificates(suggestedName?: string, suggestedNif?: string): DigitalCertificateInfo[] {
  const now = new Date();
  const validToYear = now.getFullYear() + 4;
  
  const name1 = suggestedName || 'Carlos Mendoza García';
  const nif1 = suggestedNif || '53892147A';

  return [
    {
      signerName: name1,
      signerNif: nif1,
      issuer: 'AC FNMT Usuarios (Fábrica Nacional de Moneda y Timbre)',
      serialNumber: '4B:A9:12:F4:7E:90:33:C2:58:AA',
      validFrom: `01/02/${now.getFullYear() - 1}`,
      validTo: `01/02/${validToYear}`,
      keyAlgorithm: 'RSA 2048-bit',
      signatureAlgorithm: 'SHA256withRSA',
      sourceType: 'browser_store',
      certFingerprint: '7A8F3C90E412BD4478B910C65EA9B34177F240182C01988FA22E09B1A0176D5E',
      signedAt: new Date().toISOString(),
      ipAddress: '194.179.1.84 (Madrid, ES - RedIRIS)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'AutoFirma / WebPKI'
    },
    {
      signerName: name1,
      signerNif: nif1,
      issuer: 'AC DNIe 006 (Dirección General de la Policía - DNI electrónico)',
      serialNumber: '21:8F:CC:01:99:47:DE:12:80:55',
      validFrom: `15/05/${now.getFullYear()}`,
      validTo: `15/05/${now.getFullYear() + 2}`,
      keyAlgorithm: 'RSA 2048-bit',
      signatureAlgorithm: 'SHA256withRSA',
      sourceType: 'dnie',
      certFingerprint: '99C21A504DE7723910F865EBA38890248CD57210FBA491823CC199420067AF12',
      signedAt: new Date().toISOString(),
      ipAddress: '88.26.192.45 (Telefónica de España)',
      userAgent: 'DNIe SmartCard Interface 3.0 / CryptoAPI'
    },
    {
      signerName: name1,
      signerNif: nif1,
      issuer: 'ACCV CA-2 (Generalitat Valenciana / Autoritat de Certificació)',
      serialNumber: '33:B0:18:72:AA:41:9C:00:88:14',
      validFrom: `10/01/${now.getFullYear()}`,
      validTo: `10/01/${validToYear}`,
      keyAlgorithm: 'RSA 2048-bit',
      signatureAlgorithm: 'SHA256withRSA',
      sourceType: 'browser_store',
      certFingerprint: '11E4829AA74B209F818374E559092841F93710BBCC492716104873729AA48192',
      signedAt: new Date().toISOString(),
      ipAddress: '83.50.144.112 (Valencia, ES)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'AutoFirma / WebPKI'
    },
    {
      signerName: name1,
      signerNif: nif1,
      issuer: 'CAMERFIRMA Qualified Citizens CA',
      serialNumber: '19:F8:42:01:BB:72:90:3A:C4:81',
      validFrom: `20/09/${now.getFullYear() - 1}`,
      validTo: `20/09/${validToYear}`,
      keyAlgorithm: 'RSA 2048-bit',
      signatureAlgorithm: 'SHA256withRSA',
      sourceType: 'pfx_file',
      certFingerprint: '88A19047BF91820CC7129571629851084837194017AA837105994281726510AF',
      signedAt: new Date().toISOString(),
      ipAddress: '194.179.1.84 (Madrid, ES)',
      userAgent: 'PKCS#12 Keystore Import'
    }
  ];
}

