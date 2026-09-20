import React, { useState, useEffect, useCallback } from 'react';
import { ContractState, ContractType } from './types/contract';
import { createInitialContractState, CONTRACT_CATALOG } from './utils/legalTemplates';
import { computeSHA256 } from './utils/cryptoUtils';
import { Header, EcosystemArea } from './components/Header';
import { ContractCatalog } from './components/ContractCatalog';
import { LegalAssistantView } from './components/LegislativeAssistant/LegalAssistantView';
import { StepIndicator } from './components/Wizard/StepIndicator';
import { StepParties } from './components/Wizard/StepParties';
import { StepAsset } from './components/Wizard/StepAsset';
import { StepClauses } from './components/Wizard/StepClauses';
import { SignatureStation } from './components/Signature/SignatureStation';
import { RemoteSignView } from './components/Signature/RemoteSignView';
import { ContractDocumentA4 } from './components/Preview/ContractDocumentA4';
import { PaymentModal } from './components/Paywall/PaymentModal';
import { SavedContractsModal } from './components/SavedContractsModal';
import { LegalInfoModal } from './components/LegalInfoModal';
import { exportContractToPDF } from './utils/pdfExport';
import { 
  Printer, 
  Download, 
  Loader2,
  Lock, 
  Unlock, 
  Edit3, 
  Share2, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const STORAGE_KEY_CURRENT = 'contratomodelo_current_contract';
const STORAGE_KEY_SAVED_LIST = 'contratomodelo_saved_contracts';

export default function App() {
  const [currentView, setCurrentView] = useState<'catalog' | 'wizard' | 'preview' | 'remote_sign' | 'legal_assistant'>('catalog');
  const [ecosystemArea, setEcosystemArea] = useState<EcosystemArea>('contracts');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);
  const [remoteSignToken, setRemoteSignToken] = useState<string>('eIDAS-TOKEN-DEMO-991');

  // Contract State
  const [contract, setContract] = useState<ContractState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT) || localStorage.getItem('tramitelisto_current_contract') || localStorage.getItem('contratolisto_current_contract');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.party1?.name === 'Carlos Mendoza García' && parsed?.party2?.name === 'Lucía Navarro Ibáñez') {
          return createInitialContractState(parsed.contractType || 'alquiler_vivienda');
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not load contract from storage', e);
    }
    return createInitialContractState('alquiler_vivienda');
  });

  // Saved Contracts List
  const [savedContracts, setSavedContracts] = useState<ContractState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_LIST) || localStorage.getItem('tramitelisto_saved_contracts') || localStorage.getItem('contratolisto_saved_contracts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load saved contracts', e);
    }
    return [];
  });

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSavedContractsOpen, setIsSavedContractsOpen] = useState(false);
  const [isLegalInfoOpen, setIsLegalInfoOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);

  // Auto-save current contract in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(contract));
    } catch (e) {
      console.error(e);
    }
  }, [contract]);

  // Recalculate SHA-256 hash when contract data or signatures change
  const refreshHash = useCallback(async (currentContract: ContractState) => {
    const rawContent = JSON.stringify({
      type: currentContract.contractType,
      p1: currentContract.party1,
      p2: currentContract.party2,
      asset: currentContract.asset,
      clauses: currentContract.clauses,
      sig1: currentContract.evidence.signatureParty1?.slice(0, 50),
      sig2: currentContract.evidence.signatureParty2?.slice(0, 50),
      date: currentContract.clauses.startDate
    });
    const hash = await computeSHA256(rawContent);
    setContract((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        documentHash: hash
      }
    }));
  }, []);

  // Update hash when switching to preview
  useEffect(() => {
    if (currentView === 'preview') {
      refreshHash(contract);
    }
  }, [currentView, refreshHash]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Handlers for switching and creating contracts
  const handleSelectContractType = (type: ContractType) => {
    const newDoc = createInitialContractState(type);
    setContract(newDoc);
    setWizardStep(1);
    setMaxAccessibleStep(1);
    setCurrentView('wizard');
    showToast(`Modelo cargado: ${CONTRACT_CATALOG.find(c => c.id === type)?.title}`);
  };

  const handleUpdateParty1 = (data: Partial<ContractState['party1']>) => {
    setContract((prev) => ({
      ...prev,
      party1: { ...prev.party1, ...data }
    }));
  };

  const handleUpdateParty2 = (data: Partial<ContractState['party2']>) => {
    setContract((prev) => ({
      ...prev,
      party2: { ...prev.party2, ...data }
    }));
  };

  const handleUpdateAsset = (data: Partial<ContractState['asset']>) => {
    setContract((prev) => ({
      ...prev,
      asset: { ...prev.asset, ...data }
    }));
  };

  const handleUpdateClauses = (data: Partial<ContractState['clauses']>) => {
    setContract((prev) => ({
      ...prev,
      clauses: { ...prev.clauses, ...data }
    }));
  };

  const handleUpdateEvidence = (data: Partial<ContractState['evidence']>) => {
    setContract((prev) => {
      const updated = {
        ...prev,
        evidence: { ...prev.evidence, ...data }
      };
      refreshHash(updated);
      return updated;
    });
  };

  const handleWizardNext = () => {
    const nextStep = wizardStep + 1;
    setWizardStep(nextStep);
    if (nextStep > maxAccessibleStep) {
      setMaxAccessibleStep(nextStep);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWizardPrev = () => {
    setWizardStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPreview = () => {
    // Save to savedContracts history if not already there
    setSavedContracts((prev) => {
      const exists = prev.some(item => item.id === contract.id);
      let updatedList;
      if (exists) {
        updatedList = prev.map(item => item.id === contract.id ? contract : item);
      } else {
        updatedList = [contract, ...prev];
      }
      localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(updatedList));
      return updatedList;
    });

    setCurrentView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Payment unlock handler
  const handleUnlockSuccess = (plan: 'single' | 'monthly_pass', promoUsed?: string) => {
    setContract((prev) => {
      const unlocked = {
        ...prev,
        isUnlocked: true,
        paymentPlan: plan,
        paymentDate: new Date().toISOString()
      };
      // update in saved list as well
      setSavedContracts((list) => {
        const updated = list.map(item => item.id === unlocked.id ? unlocked : item);
        localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(updated));
        return updated;
      });
      return unlocked;
    });

    if (promoUsed) {
      showToast(`¡Bono ${promoUsed} aplicado con éxito! Descarga oficial desbloqueada sin marca de agua.`);
    } else {
      showToast('¡Pago completado! Contrato oficial desbloqueado con sellado de tiempo eIDAS.');
    }
  };

  // Download PDF / Print
  const handleDownloadPDF = async (forceDraft: boolean = false) => {
    if (!contract.isUnlocked && !forceDraft) {
      setIsPaymentModalOpen(true);
      return;
    }

    try {
      setIsExportingPDF(true);
      showToast(
        contract.isUnlocked
          ? 'Generando PDF oficial con firmas digitales y sello eIDAS...'
          : 'Generando PDF borrador con firmas y sello eIDAS...'
      );
      await exportContractToPDF('contract-a4-document', contract);
      showToast('¡PDF generado y descargado con éxito con firmas y sello!');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      showToast('Hubo un problema con la exportación directa. Abriendo asistente de impresión...');
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Load an existing contract from history
  const handleLoadContract = (loadedContract: ContractState) => {
    setContract(loadedContract);
    setMaxAccessibleStep(4);
    setCurrentView('preview');
    showToast(`Contrato cargado: ${loadedContract.party1.name} ↔ ${loadedContract.party2.name}`);
  };

  const handleDeleteContract = (id: string) => {
    const updated = savedContracts.filter(c => c.id !== id);
    setSavedContracts(updated);
    localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(updated));
    showToast('Contrato eliminado del historial local.');
  };

  const activeContractMeta = CONTRACT_CATALOG.find(c => c.id === contract.contractType);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* SaaS Header */}
      <Header
        currentView={currentView}
        activeEcosystemArea={ecosystemArea}
        onChangeEcosystemArea={(area) => {
          setEcosystemArea(area);
          if (area === 'legal_assistant') {
            setCurrentView('legal_assistant');
          } else {
            if (currentView === 'legal_assistant') {
              setCurrentView('catalog');
            }
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'legal_assistant') {
            setEcosystemArea('legal_assistant');
          } else {
            setEcosystemArea('contracts');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSavedContracts={() => setIsSavedContractsOpen(true)}
        onOpenLegalInfo={() => setIsLegalInfoOpen(true)}
        savedCount={savedContracts.length}
        contractTypeTitle={activeContractMeta?.title}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm animate-bounce no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIEW 0: LEGISLATIVE INTELLIGENCE & LEGAL ASSISTANT */}
      {currentView === 'legal_assistant' && (
        <main className="flex-1">
          <LegalAssistantView
            onSelectContract={(type) => {
              handleSelectContractType(type);
              setEcosystemArea('contracts');
            }}
            onNavigateToCatalog={() => {
              setEcosystemArea('contracts');
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* VIEW 1: CATALOG OF CONTRACTS */}
      {currentView === 'catalog' && (
        <main className="flex-1">
          <ContractCatalog
            onSelectContract={handleSelectContractType}
            onOpenLegalInfo={() => setIsLegalInfoOpen(true)}
            onNavigateToLegalAssistant={() => {
              setEcosystemArea('legal_assistant');
              setCurrentView('legal_assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* VIEW 2: STEP-BY-STEP WIZARD */}
      {currentView === 'wizard' && (
        <main className="flex-1 pb-16">
          
          {/* Step indicator header */}
          <StepIndicator
            currentStep={wizardStep}
            totalSteps={4}
            onSelectStep={(s) => setWizardStep(s)}
            maxAccessibleStep={maxAccessibleStep}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            {/* Step 1: Parties */}
            {wizardStep === 1 && (
              <StepParties
                contractType={contract.contractType}
                party1={contract.party1}
                party2={contract.party2}
                onChangeParty1={handleUpdateParty1}
                onChangeParty2={handleUpdateParty2}
                onNext={handleWizardNext}
              />
            )}

            {/* Step 2: Asset & Economy */}
            {wizardStep === 2 && (
              <StepAsset
                contractType={contract.contractType}
                asset={contract.asset}
                onChangeAsset={handleUpdateAsset}
                onNext={handleWizardNext}
                onPrev={handleWizardPrev}
              />
            )}

            {/* Step 3: Clauses & Terms */}
            {wizardStep === 3 && (
              <StepClauses
                contractType={contract.contractType}
                clauses={contract.clauses}
                onChangeClauses={handleUpdateClauses}
                onNext={handleWizardNext}
                onPrev={handleWizardPrev}
              />
            )}

            {/* Step 4: Digital Signature Station */}
            {wizardStep === 4 && (
              <SignatureStation
                party1={contract.party1}
                party2={contract.party2}
                evidence={contract.evidence}
                contractTitle={activeContractMeta?.title || 'Contrato'}
                onUpdateEvidence={handleUpdateEvidence}
                onProceedToPreview={handleProceedToPreview}
                onPrev={handleWizardPrev}
                onOpenRemoteSignView={(token) => {
                  setRemoteSignToken(token);
                  setCurrentView('remote_sign');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

          </div>
        </main>
      )}

      {/* VIEW 4: REMOTE SIGNING PORTAL */}
      {currentView === 'remote_sign' && (
        <main className="flex-1">
          <RemoteSignView
            contractState={contract}
            token={remoteSignToken}
            onCompleteRemoteSign={(signatureDataUrl, certInfo) => {
              handleUpdateEvidence({
                signatureParty2: signatureDataUrl,
                signatureDateParty2: certInfo ? certInfo.signedAt : new Date().toISOString(),
                certificateParty2: certInfo,
                status: contract.evidence.signatureParty1 ? 'firmado_completo' : 'firmado_parcial'
              });
              showToast('¡Firma remota completada con éxito conforme a eIDAS y Ley 6/2020!');
            }}
            onExitRemoteView={() => {
              setCurrentView('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* VIEW 3: DYNAMIC PREVIEW & PAYWALL BAR */}
      {currentView === 'preview' && (
        <main className="flex-1 pb-20">
          
          {/* Sticky Toolbar for Document Actions */}
          <div className="sticky top-16 z-30 bg-slate-900 text-white border-b border-slate-800 py-3 px-4 sm:px-6 shadow-md no-print">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
              
              {/* Left: Document Info and Status */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCurrentView('wizard');
                    setWizardStep(4);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modificar cláusulas / firmas</span>
                </button>

                <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
                  <span>CSV: <strong className="font-mono text-amber-300">{contract.evidence.verificationCode}</strong></span>
                  <span>•</span>
                  {contract.isUnlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Unlock className="w-3.5 h-3.5" /> Oficial desbloqueado (Sin marca)
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <Lock className="w-3.5 h-3.5" /> Modo Borrador con marca
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Actions (Paywall / Download / Print) */}
              <div className="flex items-center gap-2">
                {!contract.isUnlocked ? (
                  <>
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Desbloquear PDF Oficial (4,90 €)</span>
                    </button>

                    <button
                      onClick={() => handleDownloadPDF(true)}
                      disabled={isExportingPDF}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      title="Descargar versión borrador con marca de agua"
                    >
                      {isExportingPDF ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Generando...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-slate-300" />
                          <span className="hidden sm:inline">Descargar</span> Borrador
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="hidden lg:inline-flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Documento Oficial Válido</span>
                    </div>

                    <button
                      onClick={() => handleDownloadPDF(false)}
                      disabled={isExportingPDF}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isExportingPDF ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generando PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Descargar PDF Oficial</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                  title="Imprimir documento"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden md:inline">Imprimir</span>
                </button>
              </div>

            </div>
          </div>

          {/* Prompt banner if locked */}
          {!contract.isUnlocked && (
            <div className="max-w-4xl mx-auto my-4 px-4 no-print">
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-900 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Estás visualizando una previsualización freemium completa</p>
                    <p className="text-amber-800 mt-0.5">
                      Puedes revisar y verificar todas las cláusulas, firmas y datos. Para retirar la marca de agua y formalizar la descarga legal oficial, desbloquea por 4,90 € o con un código de bono.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Desbloquear ahora
                </button>
              </div>
            </div>
          )}

          {/* The A4 Formal Contract Document Sheet */}
          <div className="max-w-5xl mx-auto px-2 sm:px-4 pt-4">
            <ContractDocumentA4 contract={contract} />
          </div>

          {/* Bottom Document Action Banner */}
          <div className="max-w-5xl mx-auto px-2 sm:px-4 mt-8 no-print">
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2 flex-wrap">
                    <span>Exportación Legal eIDAS Lista</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-amber-300 font-mono">
                      {contract.evidence.verificationCode}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    El PDF exportado incluye todas las cláusulas, los trazos de firma digital manuscritos de ambas partes y la certificación criptográfica de evidencia.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
                {!contract.isUnlocked ? (
                  <>
                    <button
                      onClick={() => handleDownloadPDF(true)}
                      disabled={isExportingPDF}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isExportingPDF ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Generando...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-slate-400" />
                          <span>Descargar Borrador</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Desbloquear Oficial (4,90 €)</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDownloadPDF(false)}
                    disabled={isExportingPDF}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isExportingPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generando PDF Oficial...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Descargar PDF Oficial con Firmas</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

        </main>
      )}

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onUnlockSuccess={handleUnlockSuccess}
        documentTitle={activeContractMeta?.title || 'Contrato Legal'}
      />

      <SavedContractsModal
        isOpen={isSavedContractsOpen}
        onClose={() => setIsSavedContractsOpen(false)}
        savedContracts={savedContracts}
        onLoadContract={handleLoadContract}
        onDeleteContract={handleDeleteContract}
      />

      <LegalInfoModal
        isOpen={isLegalInfoOpen}
        onClose={() => setIsLegalInfoOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-600 space-y-4 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-slate-900">ContratoModelo.es</span>
            <span>•</span>
            <span>Plataforma LegalTech española adaptada a la Ley 12/2023 y LAU</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setIsLegalInfoOpen(true)} className="hover:text-slate-900 underline">
              Garantía Jurídica
            </button>
            <button onClick={() => setIsPaymentModalOpen(true)} className="hover:text-slate-900 underline">
              Tarifas y Bonos
            </button>
            <span>Certificación eIDAS UE 910/2014</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
