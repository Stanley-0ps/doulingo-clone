# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured with its required products enabled, native error/support/health signal sources active, a focused six-scout troop, and two approved custom scouts for the mobile learning journey. Existing Replay Vision monitors are armed for activation breakage and learner frustration; no recordings are available yet, so they will begin observing once recordings arrive.

Findings will begin appearing in the [Self-driving inbox](https://us.posthog.com/project/624145/inbox) within about 30 minutes of eligible data arriving.

## AI data processing

Approved by the wizard's organization-level gate.

## GitHub

The PostHog GitHub App was already connected. GitHub Issues was selected, but the repository connection was skipped, so its responder is enabled and dormant until a GitHub warehouse source is added.

## Products enabled

| Product | Result | Notes |
| --- | --- | --- |
| Session Replay | Already enabled; inert until mobile capture is verified | This is an Expo/React Native app, not a `posthog-js` web app. No browser-init override applies. No recordings were found. |
| Error Tracking | Already enabled; mobile capture should be verified | The app captures authentication exceptions explicitly, but no error issues were found in the probe. |
| Support (Conversations) | Already enabled | Tickets reach Self-driving only after an inbound email, inbox, or Slack channel is connected in PostHog. |

## Signal sources

| Signal source | Action | Result |
| --- | --- | --- |
| `health_checks` / `health_issue` | Checked | Already enabled |
| `error_tracking` / `issue_created` | Checked | Already enabled |
| `error_tracking` / `issue_reopened` | Checked | Already enabled |
| `error_tracking` / `issue_spiking` | Checked | Already enabled |
| `conversations` / `ticket` | Checked | Already enabled |
| `signals_scout` / `cross_source_issue` | Deliberately skipped | On by default; no opt-out row exists |
| `github` / `issue` | Enabled | Dormant until a GitHub Issues warehouse source is connected (source config `01a0d2bc-f38a-718d-992a-e45a262953df`) |
| `session_replay` / `session_analysis_cluster` | Deliberately skipped | Retired route; Replay Vision scanners provide replay coverage |
| `replay_vision` | Deliberately skipped | Scanner-level `emits_signals: true` is the source configuration |

## Connected tools

| Tool | Selection and connection state |
| --- | --- |
| GitHub Issues | Selected, but no warehouse source was connected. Its responder is enabled and dormant. |
| Linear, Jira, Sentry, Zendesk | Not used in this run. |

## Scout troop

### Enabled scouts (6)

| Scout | Why it is enabled |
| --- | --- |
| General | Cross-product correlations and surfaces without a dedicated specialist. |
| Product analytics | Core product-event and learning-flow behavior. |
| Observability gaps | Important events that lack an insight, dashboard, or alert. |
| Logs | The mobile app sends PostHog logs and the project has logs configured. |
| New-learner activation | Custom coverage for the completed-authentication → language choice → learning-plan handoff. |
| Sign-in completion | Custom coverage for email-code and social sign-in completion. |

### Disabled scouts (23)

| Scout | Why it is disabled |
| --- | --- |
| AI observability | No LLM telemetry events were confirmed. |
| Anomaly detection | No established dashboard/insight surface was confirmed; focused scouts take priority. |
| APM | No tracing/APM instrumentation was found. |
| Conversations | No inbound support channel is connected yet. |
| CSP violations | No CSP reporting configuration was found. |
| Customer analytics | No account/group analytics surface was found. |
| Data pipelines | No active CDP or export surface was found. |
| Data warehouse | No warehouse source is currently connected. |
| Error tracking | Covered by the native error-tracking signal sources. |
| Experiments | No active experiment evidence was found. |
| Feature flags | No active flag usage evidence was found. |
| Inbox validation | Fresh setup; there are no Self-driving fixes to validate yet. |
| Insight alerts | No existing insight-alert evidence was found. |
| MCP tool calls | No product MCP telemetry surface was found. |
| Replay Vision | No accumulated scanner observations yet; the scanner route provides replay coverage. |
| Revenue analytics | No payment or revenue surface was confirmed. |
| Session replay | Covered by the Replay Vision scanners. |
| Skills store | Not a product monitoring priority. |
| Surveys | No surveys exist. |
| Tasks | No task-product usage was found. |
| Web analytics | This is a mobile app, not a web-traffic surface. |
| Web vitals | This is a mobile app, not a web-vitals surface. |
| PR follow-up | No Self-driving GitHub warehouse source is connected. |

The enforced budget is **100 runs/day**; **5** were used when checked, with **95** remaining. The current early-access banner says: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Scout | What it watches | Discriminator | Why it is custom |
| --- | --- | --- | --- |
| `signals-scout-new-learner-activation` | The journey from completed authentication through language selection to opening or continuing a learning plan. | A sustained step-conversion drop while entrants stay stable or grow. | The generic product-analytics scout does not own this app-specific activation chain. |
| `signals-scout-sign-in-completion` | Email-code and social sign-in completion. | Completion rate by authentication method with enough attempts to be representative. | The generic scout does not separately assess this app’s authentication handoff. |

The approved custom scouts are active, emit to the inbox, and run daily by default. To quiet either scout without deleting it, set `emit: false` on its scout configuration to switch it to dry-run.

Considered but not proposed: AI teacher/tutor behavior and lesson completion. The repository currently has no corresponding PostHog event contract, so they are not yet watchable. Replay defects were ruled out because Replay Vision owns that route; error bursts were ruled out because the native error-tracking source owns them.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes clear defects into the Self-driving inbox. It is the only part of this setup that spends Replay Vision quota. Findings arrive at half weight and need independent corroboration before promotion into a report.

| Scanner | Status | What it watches | Query scope | Sampling | Estimated monthly spend |
| --- | --- | --- | --- | --- | --- |
| Domingo activation breakage | Configured; URL scope unverified | Visible breakage on the activation flow: Get Started, sign-up/sign-in, email-code verification, language selection, and opening learning. This is the app’s identifiable completion journey. | Recordings with a matching recorded screen or route property for onboarding, sign-up, sign-in, or language selection; React Native current URL values have not been confirmed. | 50% | 0 observations / 0 credits currently estimated |
| Domingo learner frustration | Already configured and verified | Clear visible struggle such as repeated attempts, unresponsive controls, or flow abandonment. | Sessions containing a rage click; intentionally not URL-scoped to keep it independent from the breakage monitor. | 100% | 0 observations / 0 credits currently estimated |

No session recordings were found. Both scanners are armed and will begin working as soon as recordings start arriving.

## Follow-ups

- [ ] Verify Session Replay and automatic exception capture are configured for the React Native runtime; the server-side product settings are enabled, but no recordings or error issues were available to confirm end-to-end capture.
- [ ] Connect a Support/Conversations inbound channel (email, inbox, or Slack) so support tickets can reach Self-driving.
- [ ] Connect a GitHub Issues warehouse source for the selected repository at [new data warehouse source](https://us.posthog.com/project/624145/pipeline/new/source). The GitHub responder is already enabled and will remain dormant until it syncs.

## What happens next

Fresh scout configurations are picked up by the coordinator within about 30 minutes and draw from the project’s daily run budget. Findings cluster into actionable reports in the [Self-driving inbox](https://us.posthog.com/project/624145/inbox); immediately actionable reports can begin coding tasks.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- No application source files were modified.
