import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  Ticket, 
  ArrowRight,
  Receipt,
  FileCheck2,
  Lock
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (plan: 'single' | 'monthly_pass', promoUsed?: string) => void;
  documentTitle: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  documentTitle
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'subscription'>('single');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bizum' | 'applepay'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('4548 •••• •••• 9214');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('834');
  const [bizumPhone, setBizumPhone] = useState('612 345 678');

  if (!isOpen) return null;

  const validPromos = ['PROPIETARIO2026', 'CONTRATOMODELO', 'TRAMITELISTO', 'CONTRATOLISTO', 'INMOVIP', 'GRATIS', 'PRUEBA'];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoError('Introduce un código de bono o descuento');
      return;
    }

    if (validPromos.includes(code)) {
      triggerConfetti();
      onUnlockSuccess('single', code);
      onClose();
    } else {
      setPromoError('Código no válido o expirado. Prueba con el cupón: PROPIETARIO2026');
    }
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      triggerConfetti();
      onUnlockSuccess(selectedPlan === 'subscription' ? 'monthly_pass' : 'single');
      onClose();
    }, 1200);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Desbloqueo de Documento Oficial Definitivo</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            Descarga tu contrato con plena validez legal
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Elimina la marca de agua, activa el sellado de tiempo eIDAS y descarga el PDF oficial listo para imprimir o enviar.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Plan Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Plan 1: Pago Único 4,90 € */}
            <div
              onClick={() => setSelectedPlan('single')}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'single'
                  ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Descarga individual
                </span>
                {selectedPlan === 'single' && (
                  <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">4,90 €</span>
                <span className="text-xs text-slate-700">IVA incl.</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                1 contrato oficial en PDF de alta fidelidad con sellado y firma digital válida.
              </p>
            </div>

            {/* Plan 2: Bono Propietario 12,90 €/mes */}
            <div
              onClick={() => setSelectedPlan('subscription')}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'subscription'
                  ? 'border-slate-900 bg-slate-50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                PROPIETARIOS & AGENCIAS
              </span>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pase Mensual Ilimitado
                </span>
                {selectedPlan === 'subscription' && (
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">12,90 €</span>
                <span className="text-xs text-slate-700">/ mes</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                Genera, firma y descarga contratos ilimitados de cualquier tipo sin límites.
              </p>
            </div>

          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Selecciona método de pago seguro
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bizum')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'bizum'
                    ? 'border-teal-700 bg-teal-700 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Bizum</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'applepay'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Pay</span>
              </button>
            </div>
          </div>

          {/* Dynamic Payment Method Fields */}
          {paymentMethod === 'card' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Ej. 4532 •••• •••• 8892"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Caducidad
                  </label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:placeholder-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:placeholder-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bizum' && (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-teal-700" />
                <span>Pago instantáneo con Bizum España</span>
              </div>
              <label className="block text-[11px] font-semibold text-teal-950 mb-1">
                Introduce tu número de teléfono vinculado a Bizum:
              </label>
              <input
                type="text"
                value={bizumPhone}
                onChange={(e) => setBizumPhone(e.target.value)}
                placeholder="Ej. 612 345 678"
                className="w-full px-3 py-1.5 bg-white border border-teal-300 rounded-lg text-xs font-mono font-bold placeholder:text-teal-400 focus:placeholder-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
              <p className="text-[10px] text-teal-800">
                Recibirás una notificación instantánea en la app de tu banco (BBVA, CaixaBank, Santander, ING, etc.) para validar el cobro.
              </p>
            </div>
          )}

          {paymentMethod === 'applepay' && (
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-700">
              <p className="font-semibold">Listo para pagar con Apple Pay / Google Wallet</p>
              <p className="text-[11px] text-slate-500 mt-1">Autenticación biométrica con FaceID o TouchID</p>
            </div>
          )}

          {/* Main Action Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSimulatePayment}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Procesando pago seguro 3DSecure...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {selectedPlan === 'single'
                    ? 'Pagar 4,90 € para descargar PDF oficial firmado'
                    : 'Activar suscripción mensual (12,90 €/mes)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-3 text-[11px] font-bold text-slate-600 uppercase">
              O usa un código promocional
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  placeholder="Código de Bono Propietario (ej. PROPIETARIO2026)"
                  className="w-full pl-9 pr-3 py-2 uppercase text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Canjear
              </button>
            </div>
            {promoError && (
              <p className="text-[11px] text-rose-600 pt-1 font-medium">{promoError}</p>
            )}
            <p className="text-[10px] text-slate-600 pt-1">
              Tip para pruebas: utiliza el cupón <strong>PROPIETARIO2026</strong> o <strong>GRATIS</strong> para desbloquear al instante.
            </p>
          </form>

        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garantía de reembolso de 14 días</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-slate-600" />
            <span>Factura con 21% IVA español</span>
          </div>
        </div>

      </div>
    </div>
  );
};
