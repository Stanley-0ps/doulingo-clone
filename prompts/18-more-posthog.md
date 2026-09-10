Read AGENTS.md first and follow it strictly.

Add PostHog event tracking to the existing app using the PostHog instance already initialized in lib/posthog.ts. Do not reinitialize PostHog and do not change the existing PostHogProvider setup.

User identification:

- After Clerk authentication completes (sign-in or sign-up), call posthog.identify() with the Clerk user's id as distinctId.
- On the first identify call after sign-up, set user properties: signup_date (current ISO date, via $set_once) and preferred_language (the language the user selected during onboarding, or null if not yet selected) with the language update expressed through `$set`, including the initial identify path where null may be present.
- On every subsequent identify, update preferred_language if it has changed via `$set`, and reserve `$set_once` exclusively for signup_date so the signup timestamp never becomes an update target.

Three custom events, captured at these moments:

1. language_selected — fires when the user confirms their language on the language selection screen.
   Properties: { language_code: string, language_name: string }

2. lesson_started — fires from the actual lesson-start action associated with lesson_started, not when the lesson screen mounts. The lesson screen should only emit an abandonment event after that start action has occurred.
   Properties: { lesson_id: string, language: string, lesson_number: number }

4. lesson_abandoned — fires when the user exits a lesson before lesson_completed fires (back navigation, screen unmount before completion), but only if the lesson has actually started. Compute time_into_lesson_seconds from the timestamp captured when the lesson-start action triggers lesson_started, and do not emit abandonment for users who leave before interacting. Use one idempotent cleanup path for lesson_abandoned and lesson_completed, ensuring the abandonment event is emitted at most once and that the guard after lesson_completed suppresses any further lesson_abandoned emission while preserving the existing abandonment properties.
   Properties: { lesson_id: string, time_into_lesson_seconds: number, last_question_index: number }


Implementation rules:
- Track lesson start time from the actual lesson-start action associated with lesson_started, not from the lesson screen mount. Initialize the timestamp only when the lesson has definitely started, then calculate time_into_lesson_seconds from that timestamp so time_into_lesson_seconds stays accurate.
- Only emit lesson_abandoned after the lesson has actually started; omit events for users who leave before interacting.
- Use one idempotent cleanup path for lesson_abandoned and lesson_completed, and make the completion guard suppress lesson_abandoned after lesson_completed so the event is emitted at most once while preserving the existing abandonment properties.
- Do not modify any UI.
- Do not expose any keys; PostHog is already configured via environment variables.
