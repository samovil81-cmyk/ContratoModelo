import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialization of Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Health Check
  app.get("/api/health", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
    res.json({ status: "ok", aiConfigured: hasKey });
  });

  // Spanish Legal Assistant API endpoint
  app.post("/api/chat-legal", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({ error: "La consulta jurídica no puede estar vacía." });
      }

      const client = getAIClient();

      if (client) {
        // Prepare prompt with system instructions for Spanish Law
        const systemInstruction = `Eres "Asesor Jurídico ContratoModelo", un asistente legal experto en la legislación del Reino de España (con especialización en la Ley de Arrendamientos Urbanos - LAU 29/1994 reformada por la Ley 12/2023 por el Derecho a la Vivienda, Código Civil, Estatuto de los Trabajadores, Ley 6/2020 de Firma Electrónica, RGPD y Ley de Enjuiciamiento Civil).

Tus principios directores:
1. Proporciona respuestas claras, estructuradas y fundamentadas en el ordenamiento jurídico español vigente. Cita siempre los artículos clave aplicables (ej. Art. 9, 11, 17, 18, 20 o 36 de la LAU; Arts. 1454, 1484 o 1542 del Código Civil).
2. Explica con rigor práctico los derechos, obligaciones y plazos legales (ej. preaviso de 30 días para desistimiento del inquilino pasados 6 meses según art. 11 LAU; prórrogas obligatorias de 5 años si arrendador es persona física o 7 si es jurídica; topes de fianza legal de 1 mes en vivienda más máximo 2 mensualidades de garantía adicional).
3. Si la duda del usuario se resuelve o instrumenta mediante un documento legal, recomiéndale de forma explícita el modelo de contrato exacto disponible en ContratoModelo:
   - "alquiler_vivienda" (Alquiler de Vivienda Habitual)
   - "alquiler_habitacion" (Alquiler de Habitación en piso compartido)
   - "alquiler_local" (Alquiler de Local Comercial u Oficina)
   - "alquiler_garaje" (Alquiler de Plaza de Garaje o Trastero)
   - "entrega_llaves" (Acta de Entrega de Llaves y Liquidación de Fianza)
   - "compraventa_vehiculo" (Compraventa de Vehículo Usado con cláusula de vicios ocultos)
   - "prestamo_familiares" (Préstamo entre Familiares al 0% con Modelo 600)
   - "arras_compraventa" (Contrato de Arras Penitenciales art. 1454 CC)
   - "servicios_freelance" (Prestación de Servicios Profesionales / Autónomo)
   - "acuerdo_nda" (Acuerdo de Confidencialidad / NDA)
   - "reclamacion_impago" (Burofax fehaciente de reclamación de impago)
   - "resolucion_anticipada" (Comunicación fehaciente de resolución de contrato)
4. Emplea un tono cercano, pedagógico, profesional y riguroso. Incluye un descargo estándar de responsabilidad legal al final recordando que es asesoramiento informativo y técnico.`;

        // Format conversation history for context
        let promptText = "";
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-4);
          promptText += "Historial previo de la consulta:\n";
          for (const item of recentHistory) {
            promptText += `${item.role === 'user' ? 'Usuario' : 'Asesor'}: ${item.content}\n`;
          }
          promptText += "\nNueva pregunta del usuario:\n";
        }
        promptText += message;

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptText,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.3,
          }
        });

        const reply = response.text || "No se ha podido generar una respuesta en este momento.";
        
        // Detect recommended contract type from the reply or query
        const recommendedType = detectRecommendedContract(message + " " + reply);

        return res.json({
          reply,
          recommendedContractType: recommendedType,
          source: "gemini"
        });
      }

      // Fallback expert knowledge engine if API key is not configured
      const fallbackReply = generateFallbackLegalResponse(message);
      const recommendedType = detectRecommendedContract(message);

      return res.json({
        reply: fallbackReply,
        recommendedContractType: recommendedType,
        source: "expert_system"
      });

    } catch (error: any) {
      console.error("Error in /api/chat-legal:", error);
      // Even on error, provide reliable fallback response so UX is never broken
      const fallbackReply = generateFallbackLegalResponse(req.body.message || "");
      const recommendedType = detectRecommendedContract(req.body.message || "");
      return res.json({
        reply: fallbackReply,
        recommendedContractType: recommendedType,
        source: "fallback_recovery"
      });
    }
  });

  // Vite middleware in dev vs static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ContratoModelo Server running on http://localhost:${PORT}`);
  });
}

function detectRecommendedContract(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('habitacion') || lower.includes('habitación') || lower.includes('piso compartido')) {
    return 'alquiler_habitacion';
  }
  if (lower.includes('local') || lower.includes('oficina') || lower.includes('comercial')) {
    return 'alquiler_local';
  }
  if (lower.includes('garaje') || lower.includes('trastero') || lower.includes('plaza de parking') || lower.includes('aparcamiento')) {
    return 'alquiler_garaje';
  }
  if (lower.includes('entrega de llave') || lower.includes('devolucion fianza') || lower.includes('finiquito arrendamiento')) {
    return 'entrega_llaves';
  }
  if (lower.includes('coche') || lower.includes('vehiculo') || lower.includes('vehículo') || lower.includes('moto') || lower.includes('vicios ocultos')) {
    return 'compraventa_vehiculo';
  }
  if (lower.includes('prestamo') || lower.includes('préstamo') || lower.includes('familiar') || lower.includes('familiares') || lower.includes('modelo 600')) {
    return 'prestamo_familiares';
  }
  if (lower.includes('arras') || lower.includes('penitenciales') || lower.includes('señal compraventa') || lower.includes('1454')) {
    return 'arras_compraventa';
  }
  if (lower.includes('freelance') || lower.includes('autónomo') || lower.includes('autonomo') || lower.includes('servicios') || lower.includes('honorarios')) {
    return 'servicios_freelance';
  }
  if (lower.includes('nda') || lower.includes('confidencialidad') || lower.includes('secreto empresarial')) {
    return 'acuerdo_nda';
  }
  if (lower.includes('impago') || lower.includes('morosidad') || lower.includes('reclamar renta') || lower.includes('deuda alquiler')) {
    return 'reclamacion_impago';
  }
  if (lower.includes('resolución') || lower.includes('resolucion') || lower.includes('rescisión') || lower.includes('preaviso') || lower.includes('desistimiento')) {
    return 'resolucion_anticipada';
  }
  if (lower.includes('vivienda') || lower.includes('alquiler') || lower.includes('inquilino') || lower.includes('arrendador') || lower.includes('fianza') || lower.includes('lau')) {
    return 'alquiler_vivienda';
  }
  return null;
}

function generateFallbackLegalResponse(question: string): string {
  const lower = question.toLowerCase();

  if (lower.includes('subida') || lower.includes('ipc') || lower.includes('irav') || lower.includes('actualizar') || lower.includes('ley de vivienda')) {
    return `### Actualización de Renta según la Ley de Arrendamientos Urbanos y Ley 12/2023

1. **Régimen General (Art. 18 LAU):**
   - La renta solo se puede actualizar en la fecha en que se cumpla cada año de vigencia del contrato.
   - Es requisito indispensable que el contrato contenga una **cláusula expresa** de actualización. A falta de pacto expreso, la renta no se actualiza (Art. 18.1 LAU).

2. **Topes y Nuevo Índice de Referencia (Ley 12/2023 por el Derecho a la Vivienda):**
   - Para contratos vigentes y renovaciones, el INE define el **Índice de Referencia de Arrendamientos de Vivienda (IRAV)** para evitar que fluctuaciones desmedidas del IPC impacten directamente a los inquilinos.
   - Si el arrendador es un **gran tenedor** (más de 10 inmuebles urbanos o más de 5 en zona tensionada), el incremento está tasado por el límite oficial.
   - Si es **pequeño tenedor**, el pacto rige la subida, pero en defecto de pacto nunca puede rebasar el índice oficial de referencia.

3. **Notificación Obligatoria:**
   - La subida debe notificarse por escrito al arrendatario indicando el porcentaje de variación aplicado, siendo exigible a partir del mes siguiente a la notificación.

💡 **Recomendación ContratoModelo:** Si vas a firmar un nuevo contrato de alquiler, utiliza nuestro modelo oficial de **Alquiler de Vivienda Habitual**, que incorpora la cláusula blindada de indexación según la Ley 12/2023.`;
  }

  if (lower.includes('preaviso') || lower.includes('irse') || lower.includes('desistir') || lower.includes('cancelar') || lower.includes('plazo')) {
    return `### Plazos Legales de Preaviso y Desistimiento (Art. 11 y Art. 9 LAU)

1. **Desistimiento por el Inquilino (Art. 11 LAU):**
   - El arrendatario tiene derecho legal irrenunciable a desistir del contrato una vez transcurridos al menos **6 meses** desde el inicio.
   - Debe preavisar al arrendador con una antelación mínima de **30 días**.
   - **Indemnización:** Solo procederá indemnización si se pactó expresamente en el contrato. El límite legal máximo es de **una mensualidad de renta por cada año de contrato que reste por cumplir**, prorrateándose los períodos inferiores al año. Si no está escrita en el contrato, el inquilino no debe pagar indemnización alguna.

2. **Recuperación de Vivienda por el Propietario (Art. 9.3 LAU):**
   - El arrendador solo puede reclamar la vivienda para sí o sus familiares de primer grado (o cónyuge en caso de sentencia de separación/divorcio) tras el primer año de contrato, si se hizo constar expresamente esta necesidad en el documento y con al menos **2 meses de preaviso**.

3. **Prórrogas Obligatorias (Art. 9.1 LAU):**
   - El contrato tiene una duración obligatoria de **5 años** si el arrendador es persona física (7 si es jurídica) a voluntad del arrendatario.

💡 **Recomendación ContratoModelo:** Puedes redactar formalmente tu comunicación mediante nuestro modelo de **Comunicación de Resolución Anticipada** o formalizar la salida con el **Acta de Entrega de Llaves y Finiquito**.`;
  }

  if (lower.includes('fianza') || lower.includes('garantia') || lower.includes('garantía') || lower.includes('meses')) {
    return `### Régimen Legal de Fianzas y Garantías Adicionales (Art. 36 LAU)

1. **Fianza Legal Obligatoria (Art. 36.1 LAU):**
   - En arrendamiento de **vivienda habitual**, es obligatoria la exigencia y prestación de **una mensualidad de renta**.
   - En arrendamiento para **uso distinto del de vivienda** (locales comerciales, oficinas, etc.), es obligatoria la fianza de **dos mensualidades**.
   - El arrendador tiene la obligación de depositar esta fianza en el organismo autonómico correspondiente (ej. IVIMA en Madrid, INCASÒL en Cataluña, AVRA en Andalucía).

2. **Límite de Garantías Adicionales (Art. 36.5 LAU):**
   - En contratos de vivienda habitual de hasta 5 años (o 7 si persona jurídica), el valor de las garantías adicionales (depósitos en efectivo o avales bancarios) **no podrá exceder de dos mensualidades de renta**.
   - Por tanto, el propietario solo puede solicitar legalmente: **1 mes de fianza legal + máximo 2 meses de garantía adicional = 3 mensualidades en total**.

3. **Devolución de la Fianza (Art. 36.4 LAU):**
   - Debe restituirse al finalizar el arriendo y tras la entrega de llaves en un plazo máximo de **30 días**. Si transcurre un mes sin devolución injustificada, la fianza devengará el interés legal del dinero.

💡 **Recomendación ContratoModelo:** Al terminar el arriendo, firma siempre el **Acta de Entrega de Llaves y Finiquito** para auditar el estado del inmueble y los saldos pendientes de suministros.`;
  }

  if (lower.includes('impago') || lower.includes('no paga') || lower.includes('moroso') || lower.includes('desahucio')) {
    return `### Procedimiento Legal ante Impago de Rentas (Art. 27 LAU y Ley de Enjuiciamiento Civil)

1. **Incumplimiento Contractual:**
   - La falta de pago de una sola mensualidad de renta o de cantidades asimiladas (luz, agua, gas pactados) faculta al arrendador a resolver de pleno derecho el contrato (Art. 27.2.a LAU).

2. **Requerimiento Fehaciente Previo (Burofax con Certificación de Texto y Acuse de Recibo):**
   - Antes de interponer demanda judicial de desahucio, es fundamental remitir un **Burofax fehaciente**.
   - Conceder un plazo de gracia improrrogable (habitualmente de 5 a 10 días naturales) para regularizar la deuda.
   - **Efecto procesal determinante:** Notificar de forma fehaciente enerva la posibilidad de enervación del desahucio si transcurren más de 30 días sin pago antes de la demanda (Art. 22.4 LEC).

3. **Ficheros de Morosidad e Información de Solvencia:**
   - Para poder comunicar la deuda a ficheros de morosos conforme al RGPD y LOPD-GDD, es imprescindible haber requerido previamente el pago de forma formal con apercibimiento expreso.

💡 **Recomendación ContratoModelo:** Utiliza inmediatamente nuestro modelo oficial de **Burofax de Requerimiento Previo de Pago por Impago de Rentas**, redactado con apercibimiento expreso de acciones judiciales civiles y enervación.`;
  }

  if (lower.includes('coche') || lower.includes('vehiculo') || lower.includes('vehículo') || lower.includes('vicios')) {
    return `### Compraventa de Vehículo Usado entre Particulares y Vicios Ocultos

1. **Régimen Aplicable (Arts. 1484 a 1490 del Código Civil):**
   - La compraventa entre particulares no se rige por la garantía de consumo (Ley General para la Defensa de los Consumidores), sino por el régimen de **saneamiento por vicios ocultos** del Código Civil.
   - El plazo para ejercitar la acción por vicios ocultos es de **6 meses** desde la entrega del vehículo (Art. 1490 CC).

2. **Requisitos de un Vicio Oculto:**
   - Que sea previo o anterior al momento de la venta.
   - Que sea grave, haciendo que el vehículo sea impropio para el uso al que se destina o disminuya de tal modo su valor que, de haberlo conocido el comprador, no lo habría adquirido o habría pagado menor precio.
   - Que no estuviera a la vista ni fuera cognoscible por un comprador medio o perito.

3. **Obligaciones Fiscales y Tráfico (DGT):**
   - Liquidación del **Impuesto de Transmisiones Patrimoniales (ITP - Modelo 620 o 621)** en la comunidad autónoma correspondiente dentro de los 30 días hábiles.
   - Cambio de titularidad en la Jefatura Provincial de Tráfico (DGT).

💡 **Recomendación ContratoModelo:** Genera nuestro **Contrato de Compraventa de Vehículo Usado entre Particulares**, que incluye acta de entrega con hora exacta, kilometraje certificado y renuncia expresa a garantías comerciales.`;
  }

  return `### Asesoría Jurídica Especializada en Derecho Español

He analizado tu consulta en el marco del ordenamiento jurídico español (LAU 29/1994, Ley 12/2023, Código Civil y Ley 6/2020 de Firma Electrónica).

**Aspectos legales fundamentales a considerar:**
1. **Pacto y Validez:** Las relaciones contractuales se rigen en primer lugar por las normas imperativas de orden público (como los derechos mínimos del inquilino en vivienda habitual) y, en lo no dispuesto, por la libre autonomía de la voluntad de las partes (Art. 1255 del Código Civil).
2. **Forma y Eficacia Probatoria:** Aunque los contratos verbales son válidos en España, la forma escrita y la **firma electrónica con certificado digital oficial (eIDAS)** otorgan plena fuerza probatoria en juicio conforme al artículo 326 de la Ley de Enjuiciamiento Civil.
3. **Seguridad Documental:** Para garantizar que tus derechos estén blindados, es indispensable fijar con precisión las partes, el objeto, el precio, las condiciones resolutorias y la sumisión jurisdiccional.

¿Deseas profundizar sobre algún artículo concreto o necesitas que te oriente sobre las cláusulas específicas a incluir en tu documento?`;
}

startServer();
