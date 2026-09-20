/**
 * Validaciones específicas para el mercado legal español
 */

const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

export function validateDNI(dni: string): { isValid: boolean; message?: string } {
  if (!dni) return { isValid: false, message: "El documento es obligatorio" };
  const cleaned = dni.trim().toUpperCase().replace(/\s|-/g, '');

  // Standard DNI: 8 digits + 1 letter
  const dniRegex = /^(\d{8})([A-Z])$/;
  const match = cleaned.match(dniRegex);

  if (!match) {
    return { isValid: false, message: "Formato de DNI inválido (debe tener 8 números y 1 letra)" };
  }

  const number = parseInt(match[1], 10);
  const letter = match[2];
  const expectedLetter = DNI_LETTERS[number % 23];

  if (letter !== expectedLetter) {
    return { 
      isValid: false, 
      message: `Letra de control errónea. Para ${match[1]} corresponde la letra ${expectedLetter}` 
    };
  }

  return { isValid: true };
}

export function validateNIE(nie: string): { isValid: boolean; message?: string } {
  if (!nie) return { isValid: false, message: "El NIE es obligatorio" };
  const cleaned = nie.trim().toUpperCase().replace(/\s|-/g, '');

  // NIE: Starts with X, Y, Z + 7 digits + 1 letter
  const nieRegex = /^([XYZ])(\d{7})([A-Z])$/;
  const match = cleaned.match(nieRegex);

  if (!match) {
    return { isValid: false, message: "Formato de NIE inválido (ej: X1234567A)" };
  }

  let prefix = match[1];
  let prefixNum = "0";
  if (prefix === "Y") prefixNum = "1";
  if (prefix === "Z") prefixNum = "2";

  const fullNumberStr = prefixNum + match[2];
  const number = parseInt(fullNumberStr, 10);
  const letter = match[3];
  const expectedLetter = DNI_LETTERS[number % 23];

  if (letter !== expectedLetter) {
    return { 
      isValid: false, 
      message: `Letra errónea para el NIE. Corresponde la letra ${expectedLetter}` 
    };
  }

  return { isValid: true };
}

export function validateDoc(doc: string, type: 'DNI' | 'NIE' | 'CIF'): { isValid: boolean; message?: string } {
  if (!doc) return { isValid: false, message: "Documento requerido" };
  if (type === 'DNI') return validateDNI(doc);
  if (type === 'NIE') return validateNIE(doc);
  // Basic CIF validation (letter + 7 digits + control char)
  const cifRegex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/i;
  if (!cifRegex.test(doc.trim().replace(/\s|-/g, ''))) {
    return { isValid: false, message: "Formato de CIF no válido (ej: B12345678)" };
  }
  return { isValid: true };
}

export function validateSpanishPhone(phone: string): { isValid: boolean; message?: string } {
  if (!phone) return { isValid: false, message: "Teléfono requerido" };
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Matches: 6XXXXXXXX, 7XXXXXXXX, 8XXXXXXXX, 9XXXXXXXX or with +34 / 0034
  const phoneRegex = /^(?:(?:\+|00)34)?[6789]\d{8}$/;
  if (!phoneRegex.test(cleaned)) {
    return { isValid: false, message: "Introduce un teléfono válido en España (9 dígitos, comenzando por 6, 7, 8 o 9)" };
  }
  return { isValid: true };
}

export function validatePostalCode(cp: string): { isValid: boolean; message?: string } {
  if (!cp) return { isValid: false, message: "Código postal requerido" };
  const cleaned = cp.trim();
  const cpRegex = /^(0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/;
  if (!cpRegex.test(cleaned)) {
    return { isValid: false, message: "Código postal de España no válido (5 dígitos de 01000 a 52999)" };
  }
  return { isValid: true };
}

export function validateCatastralRef(ref: string): { isValid: boolean; message?: string } {
  if (!ref) return { isValid: true }; // Reference is optional
  const cleaned = ref.trim().replace(/\s/g, '');
  if (cleaned.length !== 20) {
    return { isValid: false, message: "La referencia catastral en España debe contener exactamente 20 caracteres" };
  }
  return { isValid: true };
}

export function validateSpanishIBAN(iban: string): { isValid: boolean; message?: string } {
  if (!iban) return { isValid: true }; // IBAN is optional or can be provided later
  const cleaned = iban.trim().replace(/\s/g, '').toUpperCase();
  if (!cleaned.startsWith("ES")) {
    return { isValid: false, message: "El IBAN español debe comenzar por ES" };
  }
  if (cleaned.length !== 24) {
    return { isValid: false, message: "El IBAN español consta de 24 caracteres (ES + 22 dígitos)" };
  }
  return { isValid: true };
}
