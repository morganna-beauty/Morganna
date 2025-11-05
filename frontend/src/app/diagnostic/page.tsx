'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Concern } from '@/types';
import { mapDiagnosticToConcerns } from '@/data/diagnostic-mapping';
import { motion, AnimatePresence } from 'framer-motion';
import { StepHeader, OptionSelector, NavigationButtons } from '@/components';
import { useI18n } from '@/hooks';

type HairConditionKey = 'brittle_hair' | 'split_ends' | 'fall_breakage' | 'only_fall' | 'dry_dull';
type HairCauseKey = 'chemical' | 'stress' | 'hormonal' | 'thermal';
type HairProcessKey = 'dye' | 'straightening' | 'bleaching' | 'multiple';
interface jsonGenericType {
  [key: string]: string;
}

export default function DiagnosticPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedConditions, setSelectedConditions] = useState<HairConditionKey[]>([]);
  const [selectedCauses, setSelectedCauses] = useState<HairCauseKey[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<HairProcessKey | null>(null);

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

  const mapToConcerns = useCallback((): Concern[] => {
    return mapDiagnosticToConcerns({ conditions: selectedConditions, causes: selectedCauses, process: selectedProcess }).concerns;
  }, [selectedConditions, selectedCauses, selectedProcess]);

  const handleNext = useCallback(() => {
    setStep((prev) => {
      if (prev === 1 && selectedConditions.length > 0) return 2;

      if (prev === 2 && selectedCauses.length > 0) {
        return selectedCauses.includes('chemical') ? 2.5 : 3;
      }

      if (prev === 2.5 && selectedProcess) return 3;

      return prev;
    });
  }, [selectedConditions, selectedCauses, selectedProcess]);
  
  useEffect(() => {
    if (step === 3) {
      const concerns = mapToConcerns();
      
      if (concerns.length) {
        const query = concerns.map((c) => `concerns=${encodeURIComponent(c)}`).join('&');

        router.push(`/products/recommendations?${query}`);
      }
    }
  }, [step, mapToConcerns, router]);

  const handleBack = useCallback(() => {
    setStep((prev) => {
      if (prev === 2) return 1;
      if (prev === 2.5) return 2;
      if (prev === 3 && selectedCauses.includes('chemical')) return 2.5;

      return 2;
    });
  }, [selectedCauses]);


  const fadeMotion = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] },
  };

  return (
    <div className="flex flex-col justify-center items-center px-5 py-8 gap-6 h-[calc(100vh-100px)] bg-gray-50 overflow-hidden">
      <StepHeader step={step} selectedCause={selectedCauses.includes('chemical') ? 'chemical' : null} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...fadeMotion}>
            <OptionSelector
              options={conditions.map((c) => c.label)}
              selectedOptions={conditions
                .filter((c) => selectedConditions.includes(c.key as HairConditionKey))
                .map((c) => c.label)}
              onSelect={(label) => {
                const found = conditions.find((c) => c.label === label);

                if (found) {
                  setSelectedConditions((prev) => {
                    const key = found.key as HairConditionKey;

                    return prev.includes(key)
                      ? prev.filter((k) => k !== key)
                      : [...prev, key];
                  });
                }
              } }
              multiple={true} 
              selectedOption={null}            
              />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" {...fadeMotion}>
            <OptionSelector
              options={causes.map((c) => c.label)}
              selectedOptions={causes
                .filter((c) => selectedCauses.includes(c.key as HairCauseKey))
                .map((c) => c.label)}
              onSelect={(label) => {
                const found = causes.find((c) => c.label === label);

                if (found) {
                  setSelectedCauses((prev) => {
                    const key = found.key as HairCauseKey;

                    return prev.includes(key)
                      ? prev.filter((k) => k !== key)
                      : [...prev, key];
                  });
                }
              } }
              multiple={true} 
              selectedOption={null}            
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
      </AnimatePresence>

      <NavigationButtons step={step} onBack={handleBack} onNext={handleNext} />
    </div>
  );
}
