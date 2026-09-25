/**
 * Lesson progress — where the learner is in their course.
 *
 * The lesson player does not exist yet, so "how far along" is the two numbers
 * below: the same stand-in `data/home.ts` uses for XP and the streak. Every
 * screen derives what it shows from them, so swapping them for values from a
 * Zustand store later changes this file and nothing else.
 */

import { getLessonsForUnit } from "@/data/lessons";
import { getUnitsForLanguage } from "@/data/units";
import type { LanguageId, Lesson, Unit } from "@/types/learning";

/** Lessons of the current unit the learner has already finished. */
export const COMPLETED_LESSON_COUNT = 2;

/**
 * Activities finished inside a lesson. Nothing can be ticked off until the
 * player that runs them exists, so a lesson the learner has not reached yet
 * always reads "0 / n activities".
 */
export const COMPLETED_ACTIVITY_COUNT = 0;

/** Where one lesson stands, worked out from what the learner has finished. */
export type LessonStatus = "completed" | "in-progress" | "locked";

/** Everything the lesson screen needs about the unit the learner is working through. */
export interface UnitProgress {
  unit: Unit;
  /** Every lesson of the unit, in teaching order. */
  lessons: Lesson[];
  /** The lesson to carry on with — the one shown as "in progress". */
  currentLesson: Lesson;
  /** Lessons finished so far. */
  completedCount: number;
  totalLessons: number;
  /** 1-based position of the current lesson — the "3" in "3 / 6 lessons". */
  reachedCount: number;
}

/**
 * Progress through the unit the learner is on.
 *
 * Units are worked through in order, so the first unit of the language is the
 * current one until progress says otherwise. Returns `null` when the course has
 * no content to work from — German is selectable but ships with no units, so
 * the lesson screen has to have something to show for it.
 */
export function getUnitProgress(languageId: LanguageId): UnitProgress | null {
  const unit = getUnitsForLanguage(languageId)[0];
  if (!unit) {
    return null;
  }

  const lessons = getLessonsForUnit(unit.id);
  if (lessons.length === 0) {
    return null;
  }

  // Clamped: progress saved against an older version of the course could point
  // past the end of the current one, and landing on a real lesson beats landing
  // on nothing.
  const completedCount = Math.min(COMPLETED_LESSON_COUNT, lessons.length);
  const currentLesson = lessons[Math.min(completedCount, lessons.length - 1)];

  return {
    unit,
    lessons,
    currentLesson,
    completedCount,
    totalLessons: lessons.length,
    // Never past the last lesson: a finished unit keeps reading "6 / 6".
    reachedCount: Math.min(completedCount + 1, lessons.length),
  };
}

/** How one lesson reads on the list. `completedCount` comes from `UnitProgress`. */
export function getLessonStatus(
  lesson: Lesson,
  completedCount: number,
): LessonStatus {
  if (lesson.order <= completedCount) {
    return "completed";
  }

  if (lesson.order === completedCount + 1) {
    return "in-progress";
  }

  return "locked";
}
