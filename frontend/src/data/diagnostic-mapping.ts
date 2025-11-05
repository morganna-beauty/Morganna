import { Concern, HairType } from '@/types';

export type HairConditionKey = 'brittle_hair' | 'split_ends' | 'fall_breakage' | 'only_fall' | 'dry_dull';
export type HairCauseKey = 'chemical' | 'stress' | 'hormonal' | 'thermal';
export type HairProcessKey = 'dye' | 'straightening' | 'bleaching' | 'multiple';

export interface DiagnosticInputs {
  condition?: HairConditionKey | null;
  conditions?: HairConditionKey[];
  cause?: HairCauseKey | null;
  causes?: HairCauseKey[];
  process: HairProcessKey | null;
}

export interface DiagnosticMappingResult {
  concerns: Concern[];
  hairType?: HairType;
}

export function mapDiagnosticToConcerns({ 
  condition, 
  conditions, 
  cause, 
  causes, 
  process 
}: DiagnosticInputs): DiagnosticMappingResult {
  const concerns: Concern[] = [];

  const conditionsList = conditions || (condition ? [condition] : []);

  const causesList = causes || (cause ? [cause] : []);

  conditionsList.forEach((cond) => {
    if (cond === 'dry_dull') {
      concerns.push(Concern.CABELLO_SECO);
    }
    
    if (cond === 'brittle_hair' || cond === 'split_ends' || cond === 'fall_breakage' || cond === 'only_fall') {
      concerns.push(Concern.DANO_REPARACION);
    }
  });

  causesList.forEach((c) => {
    if (c === 'thermal') {
      concerns.push(Concern.CONTROL_FRIZ);
    }

    if (c === 'chemical') {
      concerns.push(Concern.DANO_REPARACION);
    }
  });

  return { concerns: Array.from(new Set(concerns)) };
}

export type RecommendationKey = 'hydration' | 'repair' | 'frizz' | 'volume' | 'generic';

export function getRecommendationKeyFromConcerns(concerns: Concern[]): RecommendationKey {
  const set = new Set(concerns);

  if (set.has(Concern.CABELLO_SECO)) return 'hydration';
  
  if (set.has(Concern.DANO_REPARACION)) return 'repair';
  
  if (set.has(Concern.CONTROL_FRIZ)) return 'frizz';
  
  if (set.has(Concern.VOLUMEN)) return 'volume';
  
  return 'generic';
}


