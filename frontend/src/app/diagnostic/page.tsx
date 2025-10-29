'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepHeader, OptionSelector, RecommendationBox, NavigationButtons } from '@/components';
import { useI18n } from '@/hooks';

type HairConditionKey = 'brittle_hair' | 'split_ends' | 'fall_breakage' | 'only_fall' | 'dry_dull';
type HairCauseKey = 'chemical' | 'stress' | 'hormonal' | 'thermal';
type HairProcessKey = 'dye' | 'straightening' | 'bleaching' | 'multiple';
interface jsonGenericType {
  [key: string]: string;
}

export default function DiagnosticPage() {
  const [step, setStep] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<HairConditionKey | null>(null);
  const [selectedCause, setSelectedCause] = useState<HairCauseKey | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<HairProcessKey | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const { t } = useI18n();

  const conditions: jsonGenericType[] = useMemo(
    () => [
      { key: 'brittle_hair', label: t('diagnostic.conditions.brittle_hair') },
      { key: 'split_ends', label: t('diagnostic.conditions.split_ends') },
      { key: 'fall_breakage', label: t('diagnostic.conditions.fall_breakage') },
      { key: 'only_fall', label: t('diagnostic.conditions.only_fall') },
      { key: 'dry_dull', label: t('diagnostic.conditions.dry_dull') },
    ],
    [t]
  );

  const causes: jsonGenericType[] = useMemo(
    () => [
      { key: 'chemical', label: t('diagnostic.causes.chemical') },
      { key: 'stress', label: t('diagnostic.causes.stress') },
      { key: 'hormonal', label: t('diagnostic.causes.hormonal') },
      { key: 'thermal', label: t('diagnostic.causes.thermal') },
    ],
    [t]
  );

  const processes: jsonGenericType[] = useMemo(
    () => [
      { key: 'dye', label: t('diagnostic.processes.dye') },
      { key: 'straightening', label: t('diagnostic.processes.straightening') },
      { key: 'bleaching', label: t('diagnostic.processes.bleaching') },
      { key: 'multiple', label: t('diagnostic.processes.multiple') },
    ],
    [t]
  );

  const handleNext = useCallback(() => {
    setStep((prev) => {
      if (prev === 1 && selectedCondition) return 2;
      if (prev === 2 && selectedCause) return selectedCause === 'chemical' ? 2.5 : 3;
      if (prev === 2.5 && selectedProcess) return 3;

      return prev;
    });
  }, [selectedCondition, selectedCause, selectedProcess]);

  const handleBack = useCallback(() => {
    setStep((prev) => {
      if (prev === 2) return 1;
      if (prev === 2.5) return 2;
      if (prev === 3 && selectedCause === 'chemical') return 2.5;

      return 2;
    });
  }, [selectedCause]);

  const handleRestart = useCallback(() => {
    setStep(1);
    setSelectedCondition(null);
    setSelectedCause(null);
    setSelectedProcess(null);
    setShowFullText(false);
  }, []);

  const recommendation = useMemo(() => {
    const key =
      selectedCause === 'chemical' && selectedProcess ? selectedProcess : selectedCause || '';

    if (!key) return t('diagnostic.recommendations.not_found');

    const fullKey = `recommendations.${key}.${showFullText ? 'full' : 'short'}`;
    const translated = t(fullKey);

    return translated === fullKey ? t('diagnostic.recommendations.not_found') : translated;
  }, [selectedCause, selectedProcess, showFullText, t]);

  const fadeMotion = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] },
  };

  return (
    <div className="flex flex-col justify-center items-center px-5 py-8 gap-6 h-[calc(100vh-100px)] bg-gray-50 overflow-hidden">
      <StepHeader step={step} selectedCause={selectedCause} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...fadeMotion}>
            <OptionSelector
              options={conditions.map((c) => c.label)}
              selectedOption={conditions.find((c) => c.key === selectedCondition)?.label || null}
              onSelect={(label) => {
                const found = conditions.find((c) => c.label === label);

                setSelectedCondition(found?.key as HairConditionKey);
              }}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" {...fadeMotion}>
            <OptionSelector
              options={causes.map((c) => c.label)}
              selectedOption={causes.find((c) => c.key === selectedCause)?.label || null}
              onSelect={(label) => {
                const found = causes.find((c) => c.label === label);

                setSelectedCause(found?.key as HairCauseKey);
              }}
            />
          </motion.div>
        )}

        {step === 2.5 && (
          <motion.div key="step25" {...fadeMotion}>
            <OptionSelector
              options={processes.map((p) => p.label)}
              selectedOption={processes.find((p) => p.key === selectedProcess)?.label || null}
              onSelect={(label) => {
                const found = processes.find((p) => p.label === label);

                setSelectedProcess(found?.key as HairProcessKey);
              }}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" {...fadeMotion}>
            <RecommendationBox
              text={recommendation}
              showFullText={showFullText}
              onToggleFullText={() => setShowFullText((v) => !v)}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationButtons step={step} onBack={handleBack} onNext={handleNext} />
    </div>
  );
}
