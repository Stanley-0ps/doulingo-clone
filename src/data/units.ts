/**
 * Units — themed groups of lessons.
 *
 * A unit belongs to exactly one language and holds no lesson list of its own:
 * lessons point back at the unit with `unitId`, so a lesson can never be
 * listed under two units. Use `getLessonsForUnit()` in `data/lessons.ts` to
 * read the other direction.
 *
 * Sample content ships for Spanish, French, and Japanese. Korean, German, and
 * Chinese are selectable on the language screen but have no units yet, which
 * is why `getUnitsForLanguage()` may return an empty array.
 */

import type { LanguageId, Unit, UnitId } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageId: "spanish",
    order: 1,
    title: "Getting Started",
    description: "Greet people, introduce yourself, and handle everyday basics.",
    emoji: "👋",
    level: "A1",
    color: "primary",
  },
  {
    id: "es-unit-2",
    languageId: "spanish",
    order: 2,
    title: "Everyday Life",
    description: "Numbers, food, and the weather — the small talk of daily life.",
    emoji: "🌤️",
    level: "A1",
    color: "primary-blue",
  },
  {
    id: "fr-unit-1",
    languageId: "french",
    order: 1,
    title: "First Steps",
    description: "Your first French words: greetings, cafés, and routines.",
    emoji: "🥐",
    level: "A1",
    color: "primary-deep",
  },
  {
    id: "ja-unit-1",
    languageId: "japanese",
    order: 1,
    title: "First Steps",
    description: "Say hello, count, and order at a café in Japanese.",
    emoji: "🌸",
    level: "A1",
    color: "streak",
  },
];

/** Units of one language, in teaching order. Empty when a language has no content yet. */
export function getUnitsForLanguage(languageId: LanguageId): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

/** Look up one unit, or `undefined` if the id is unknown. */
export function getUnitById(id: UnitId): Unit | undefined {
  return units.find((unit) => unit.id === id);
}
