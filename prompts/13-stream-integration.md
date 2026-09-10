Read AGENTS.md first and follow it strictly.

Use the installed GetStream agent skills and the Stream docs to implement Stream audio call setup for the selected lesson flow. When a user taps a lesson, keep the existing Audio Lesson screen UI and add the ability to start, join, mute/unmute, and end an audio-only Stream call.

Use an Expo API route for Stream token generation and call/session creation. Require and validate the Clerk session before issuing any credentials or creating the Stream call/session. Derive the Stream user ID only from the verified Clerk session and ignore or reject any client-provided user ID; preserve the selected lesson and selected language inputs without exposing them to the client. Do not expose Stream secrets in the Expo app.

Preserve the existing UI and lesson data. Add clear loading, joined, error, muted, connecting, ended states and user info on audio ui.