# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this Expo/React Native learning app. Session Replay, Error Tracking, and Support were confirmed enabled; the health, error, and support signal sources were already active; and the existing six-scout troop and two Replay Vision monitors were verified.

Findings will start appearing in the [Self-driving inbox](https://us.posthog.com/project/624145/inbox) within about 30 minutes of eligible data arriving.

## AI data processing

Approved by the wizard's organization-level gate.

## GitHub

The PostHog GitHub App was already connected before this run. An existing GitHub Issues responder remains enabled; the external-tools selection was dismissed in this run, so no warehouse connection was created or changed.

## Products enabled

| Product | Result | Notes |
| --- | --- | --- |
| Session Replay | Already enabled; mobile capture remains to be verified | This is an Expo/React Native app, not a `posthog-js` web app. No recordings were returned by the availability probe. |
| Error Tracking | Already enabled; mobile capture remains to be verified | The app explicitly captures authentication exceptions, but the probe returned no current issues. |
| Support (Conversations) | Already enabled | Tickets require an inbound email, inbox, or Slack channel in PostHog. |

## Signal sources

| Signal source | Action | Result |
| --- | --- | --- |
| `health_checks` / `health_issue` | Checked | Already enabled. |
| `error_tracking` / `issue_created` | Checked | Already enabled. |
| `error_tracking` / `issue_reopened` | Checked | Already enabled. |
| `error_tracking` / `issue_spiking` | Checked | Already enabled. |
| `conversations` / `ticket` | Checked | Already enabled. |
| `signals_scout` / `cross_source_issue` | Skipped | Enabled by default; no opt-out row exists. |
| `github` / `issue` | Retained | Existing responder remains enabled; no connected-tool change was authorized in this run. |
| `session_replay` / `session_analysis_cluster` | Skipped | Retired route; Replay Vision scanners cover recordings. |
| `replay_vision` | Skipped | Scanner-level `emits_signals: true` is the source configuration. |

## Connected tools

The external-tools picker was dismissed, so no tool was selected or connected in this run. The existing GitHub Issues responder was left untouched; its warehouse-source state was not revalidated.

## Scout troop

### Active scouts (6)

| Scout | Why it is active |
| --- | --- |
| General | Watches cross-product correlations and otherwise-unowned surfaces. |
| Product analytics | Watches core product-event and learning-flow behavior. |
| Observability gaps | Finds important event coverage missing an insight, dashboard, or alert. |
| Logs | Watches mobile log volume, severity, and service-silence changes. |
| New-learner activation | Watches the completed-authentication → language-choice → learning-plan handoff. |
| Sign-in completion | Watches email-code and social-auth completion. |

### Disabled scouts (23)

AI observability, anomaly detection, APM, conversations, CSP violations, customer analytics, data pipelines, data warehouse, error tracking, experiments, feature flags, inbox validation, insight alerts, MCP tool calls, Replay Vision, revenue analytics, session replay, skills store, surveys, tasks, web analytics, web vitals, and PR follow-up remain disabled. They have no confirmed active surface in this mobile project, are covered by another route (error tracking and replay), or would duplicate the focused troop.

The enforced budget is **100 runs/day**; **9** have run today and **91** remain. Current banner: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

No new custom scout was created. The proposal to watch the home-plan-to-learning handoff was declined because “None — keep the built-in troop” was selected; the product-analytics scout already partly covers that surface.

The existing custom scouts, **new-learner activation** and **sign-in completion**, remain active. Lesson completion and AI-tutor quality were considered but are not yet watchable because the current event contract does not capture them. Error bursts and replay defects were ruled out because native error tracking and Replay Vision respectively own those routes.

To quiet an existing custom scout without deleting it, set `emit: false` on its scout configuration to switch it to dry-run.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes clear defects to the Self-driving inbox. It is the only part of this setup that spends Replay Vision quota. Findings arrive at half weight and need independent corroboration before promotion into a report.

| Scanner | Status | What it watches | Query scope | Sampling | Estimated monthly spend |
| --- | --- | --- | --- | --- | --- |
| Domingo activation breakage | Verified from an earlier setup | Visible breakage during onboarding, authentication, language choice, and entry into learning — this is the app’s identifiable activation journey. | Recordings whose `$current_url` matches onboarding, sign-up, sign-in, or language selection. | 50% | 0 observations / 0 credits currently estimated. |
| Domingo learner frustration | Verified from an earlier setup | Clear visible struggle, including repeated attempts, unresponsive controls, and flow abandonment. | Sessions containing a `$rageclick`; intentionally not URL-scoped to limit overlap with the breakage monitor. | 100% | 0 observations / 0 credits currently estimated. |

No session recordings were returned by the probe. Both scanners are armed and will start working when recordings arrive.

## Follow-ups

- [ ] Verify Session Replay and automatic exception capture end-to-end for the React Native runtime; server-side product settings are enabled, but no recordings or current issues were available to confirm capture.
- [ ] Connect a Support/Conversations inbound channel (email, inbox, or Slack) so support tickets can reach Self-driving.
- [ ] If GitHub Issues should feed Self-driving, verify or add its warehouse source at [new data warehouse source](https://us.posthog.com/project/624145/pipeline/new/source). Its existing responder is enabled.
- [ ] Verify that React Native recording metadata supports the activation scanner's `$current_url` scope once sessions arrive.

## What happens next

The scout coordinator picks up active configurations within about 30 minutes. Scout runs draw from the daily budget; findings cluster into actionable reports in the [Self-driving inbox](https://us.posthog.com/project/624145/inbox), where immediately actionable reports can start coding tasks.

## Files modified or created

- Updated `posthog-self-driving-report.md`.
- No application source files were modified.
