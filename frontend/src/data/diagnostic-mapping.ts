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

/**
 * Mapea las respuestas del diagnóstico a Concerns que se envían en la URL.
 * 
 * Mapeo de respuestas del diagnóstico → Concerns:
 * 
 * Condiciones (Step 1):
 * - 'dry_dull' → Concern.CABELLO_SECO
 * - 'brittle_hair', 'split_ends', 'fall_breakage', 'only_fall' → Concern.DANO_REPARACION
 * 
 * Causas (Step 2):
 * - 'thermal' → Concern.CONTROL_FRIZ
 * - 'chemical' → Concern.DANO_REPARACION
 * 
 * Estos concerns se envían en la URL como: ?concerns=danoReparacion&concerns=cabelloSeco
 * y se usan para filtrar productos en el backend.
 */
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

/**
 * Mapea los Concerns a RecommendationKeys para mostrar el recommendationHeader correspondiente.
 * 
 * Mapeo de Concerns → RecommendationKeys → recommendationHeader:
 * 
 * - Concern.CABELLO_SECO → 'hydration' → diagnostic.recommendationHeader.hydration
 *   (Cabello seco y opaco: recomendamos líneas hidratantes)
 * 
 * - Concern.DANO_REPARACION → 'repair' → diagnostic.recommendationHeader.repair
 *   (Daño y rotura: busca productos con proteínas y reparación intensiva)
 * 
 * - Concern.CONTROL_FRIZ → 'frizz' → diagnostic.recommendationHeader.frizz
 *   (Control del frizz: activos suavizantes y protección térmica)
 * 
 * - Concern.VOLUMEN → 'volume' → diagnostic.recommendationHeader.volume
 *   (Más volumen: aporta cuerpo sin apelmazar)
 * 
 * - Si no hay match → 'generic' → diagnostic.recommendationHeader.generic
 *   (Recomendación personalizada genérica)
 * 
 * Estos keys se usan en la página de recomendaciones para mostrar el título y detalle
 * correspondiente en los cards de recomendación.
 */
export function getRecommendationKeyFromConcerns(concerns: Concern[]): RecommendationKey {
  const set = new Set(concerns);

  // Prioridad: si tiene CABELLO_SECO, muestra hidratación
  if (set.has(Concern.CABELLO_SECO)) return 'hydration';
  
  // Si tiene DANO_REPARACION, muestra reparación
  if (set.has(Concern.DANO_REPARACION)) return 'repair';
  
  // Si tiene CONTROL_FRIZ, muestra control de frizz
  if (set.has(Concern.CONTROL_FRIZ)) return 'frizz';
  
  // Si tiene VOLUMEN, muestra volumen
  if (set.has(Concern.VOLUMEN)) return 'volume';
  
  // Si no hay match, usa genérico
  return 'generic';
}


