/**
 * Today's plan — the state the home screen shows for the current day.
 *
 * Three things on home are progress rather than content: the XP earned towards
 * today's goal, the streak, and which of today's steps are already ticked. The
 * lesson feature that awards XP is not built yet, so `TODAY` below stands in
 * for it — the same "hardcoded until the real thing exists" approach
 * `data/lessons.ts` takes with its placeholder artwork.
 *
 * Everything else is derived from the real course: the unit and lesson come
 * from `data/units.ts` and `data/lessons.ts`, and the vocabulary count comes
 * from the lesson itself. When progress becomes real, swap `TODAY` for a
 * Zustand store and the rest of this module keeps its shape.
 */

import { getLessonsForUnit } from "@/data/lessons";
import { COMPLETED_LESSON_COUNT } from "@/data/progress";
import { getUnitsForLanguage } from "@/data/units";
import type { LanguageId, Lesson, Unit } from "@/types/learning";

/** XP the learner is aiming for today. */
export const DAILY_GOAL_XP = 20;

/**
 * The parts of a day. Ids are stable so a tick can be stored against them.
 */
export type PlanStepId = "lesson" | "conversation" | "vocabulary";

/** One row of today's plan. */
export interface PlanStep {
  id: PlanStepId;
  /** What kind of step this is — the row's bold first line. */
  title: string;
  /** Today's specifics for it — the row's second line. */
  subtitle: string;
  done: boolean;
}

/** Everything the home screen needs about today, for one language. */
export interface TodayPlan {
  /** The unit the learner is working through. */
  unit: Unit;
  /** The lesson to carry on with. */
  lesson: Lesson;
  /** XP earned today, and the target it counts towards. */
  earnedXp: number;
  goalXp: number;
  /** Consecutive days practised. */
  streakDays: number;
  steps: PlanStep[];
  /** Share of today's goal already earned, 0–1. Drives the progress bar. */
  progress: number;
}

/**
 * Stand-in for real progress, written to look like the home design: the lesson
 * step of today already ticked, 15 of 20 XP banked, and a 12-day streak. How
 * many lessons are finished is not here — that belongs to `data/progress.ts`,
 * which the lesson screen reads too.
 */
const TODAY: {
  earnedXp: number;
  streakDays: number;
  /** Plan steps ticked off so far today. */
  completedStepIds: readonly PlanStepId[];
} = {
  earnedXp: 15,
  streakDays: 12,
  completedStepIds: ["lesson"],
};

/**
 * Today's plan for one language.
 *
 * Returns `null` when the course has no content to work from — German ships as
 * a selectable language with no units yet, so the home screen has to have
 * something to show for it.
 */
export function getTodayPlan(languageId: LanguageId): TodayPlan | null {
  // The learner works through units in order, so the first unit is the current
  // one until progress says otherwise.
  const unit = getUnitsForLanguage(languageId)[0];
  if (!unit) {
    return null;
  }

  const lessons = getLessonsForUnit(unit.id);
  if (lessons.length === 0) {
    return null;
  }

  // Clamped: progress stored against an older course could point past the end
  // of the current one, and landing on a real lesson beats landing on nothing.
  const lesson =
    lessons[Math.min(COMPLETED_LESSON_COUNT, lessons.length - 1)] ?? lessons[0];

  const isDone = (id: PlanStepId) => TODAY.completedStepIds.includes(id);

  const steps: PlanStep[] = [
    {
      id: "lesson",
      title: "Lesson",
      subtitle: lesson.title,
      done: isDone("lesson"),
    },
    {
      id: "conversation",
      title: "AI Conversation",
      subtitle: lesson.description,
      done: isDone("conversation"),
    },
    {
      id: "vocabulary",
      title: "New words",
      subtitle: `${lesson.vocabulary.length} words`,
      done: isDone("vocabulary"),
    },
  ];

  return {
    unit,
    lesson,
    earnedXp: TODAY.earnedXp,
    goalXp: DAILY_GOAL_XP,
    streakDays: TODAY.streakDays,
    steps,
    // Capped at 1 so an XP award that overshoots the goal cannot overflow the
    // progress bar's track.
    progress: Math.min(TODAY.earnedXp / DAILY_GOAL_XP, 1),
  };
}
