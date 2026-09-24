/**
 * Selected language — Zustand store persisted to AsyncStorage.
 *
 * The learner's course has to survive a restart, so the choice lives in a store
 * rather than in screen state. `persist` writes the whole store to AsyncStorage
 * under `LANGUAGE_STORAGE_KEY` and reads it back on launch.
 *
 * The key is exported because the dev-only reset on the home screen has to drop
 * exactly this slice and nothing else — XP and lesson progress persist under
 * their own keys and must stay untouched.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageId } from "@/types/learning";

/** AsyncStorage key holding this store. Exported for the dev-only reset. */
export const LANGUAGE_STORAGE_KEY = "lingua.language";

interface LanguageState {
  /** The learner's course, or `null` before they have picked one. */
  selectedLanguageId: LanguageId | null;
  /**
   * True once AsyncStorage has been read. Serving a `.json`-style snapshot is
   * asynchronous, so route guards have to wait for this before deciding —
   * otherwise a returning learner flashes the language screen on every launch.
   */
  hasHydrated: boolean;
  /** Remember the learner's course. */
  selectLanguage: (id: LanguageId) => void;
  /**
   * Forget the selection, in memory *and* in AsyncStorage.
   *
   * Used by the dev-only reset on the home screen, so it removes this store's
   * key only — never `AsyncStorage.clear()`, which would wipe XP and lesson
   * progress too.
   */
  clearSelectedLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      hasHydrated: false,

      selectLanguage: (id) => set({ selectedLanguageId: id }),

      clearSelectedLanguage: async () => {
        // Clear memory first. `set` makes the persist middleware write a fresh
        // snapshot straight away, so dropping the key afterwards is what
        // actually leaves storage empty.
        set({ selectedLanguageId: null });
        await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),

      // `hasHydrated` describes this run, not the learner — never persist it,
      // or the next launch would read `true` before the real read has finished.
      partialize: (state) => ({ selectedLanguageId: state.selectedLanguageId }),

      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn(
            "[languageStore] Could not restore the selected language.",
            error,
          );
        }
        // Flip the gate whether the read worked or not — a guard waiting on a
        // flag that only a successful read sets would block the app forever.
        useLanguageStore.setState({ hasHydrated: true });
      },
    },
  ),
);
