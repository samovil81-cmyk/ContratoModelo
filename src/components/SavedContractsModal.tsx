import React from 'react';
import { ContractState } from '../types/contract';
import { CONTRACT_CATALOG } from '../utils/legalTemplates';
import { formatCurrencyEUR } from '../utils/cryptoUtils';
import { X, FolderOpen, Trash2, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface SavedContractsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedContracts: ContractState[];
  onLoadContract: (contract: ContractState) => void;
  onDeleteContract: (id: string) => void;
}

export const SavedContractsModal: React.FC<SavedContractsModalProps> = ({
  isOpen,
  onClose,
  savedContracts,
  onLoadContract,
  onDeleteContract
}) => {
  if (!isOpen) return null;

  const getContractTitle = (type: string) => {
    const found = CONTRACT_CATALOG.find(c => c.id === type);
    return found ? found.title : type;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Mis Contratos Guardados
              </h3>
              <p className="text-xs text-slate-600">
                Historial persistente local en tu navegador con firma y sellos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
          {savedContracts.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Aún no tienes contratos guardados</p>
              <p className="text-xs text-slate-600 mt-1">
                Cuando edites o firmes un contrato, se guardará automáticamente para que no pierdas tus datos.
              </p>
            </div>
          ) : (
            savedContracts.map((c) => {
              const hasSignatures = !!c.evidence.signatureParty1 && !!c.evidence.signatureParty2;

              return (
                <div key={c.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {getContractTitle(c.contractType)}
                      </h4>
                      {c.isUnlocked ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Desbloqueado
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          Borrador
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Partes:</strong> {c.party1.name} ↔ {c.party2.name}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-700">
                      <span>Renta: {formatCurrencyEUR(c.asset.monthlyRent)}/mes</span>
                      <span>•</span>
                      <span>Fecha: {c.createdAt}</span>
                      <span>•</span>
                      {hasSignatures ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Firmado (2/2)
                        </span>
                      ) : (
                        <span className="text-amber-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Firma pendiente
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onLoadContract(c);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Abrir</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteContract(c.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Eliminar de mi historial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
