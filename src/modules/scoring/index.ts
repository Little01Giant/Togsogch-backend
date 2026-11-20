import { NotImplementedException } from '@nestjs/common';
import { ARCHETYPE_TEST_KEYS } from './archetype-tests';
import { ArchetypeStrategy } from './archetype.strategy';
import { CareerStrategy } from './career.strategy';
import { CityStrategy } from './city.strategy';
import { LanguageStrategy } from './language.strategy';
import { MastersStrategy } from './masters.strategy';
import { PersonaStrategy } from './persona.strategy';
import { ThinkingStrategy } from './thinking.strategy';
import { ScoringStrategy } from './types';

const registry: Record<string, ScoringStrategy> = { career: new CareerStrategy(), masters: new MastersStrategy(), language: new LanguageStrategy(), city: new CityStrategy(), persona: new PersonaStrategy(), thinking: new ThinkingStrategy(), ...Object.fromEntries(ARCHETYPE_TEST_KEYS.map((k) => [k, new ArchetypeStrategy(k)])) };

export function getStrategy(key: string): ScoringStrategy {
  const s = registry[key];
  if (!s) throw new NotImplementedException({ code: 'NOT_IMPLEMENTED', message: 'Тестийн оноолтын стратеги олдсонгүй.' });
  return s;
}
export * from './types';
