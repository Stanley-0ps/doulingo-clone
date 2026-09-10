Read AGENTS.md first and follow it strictly.

Use the installed skills for stream and vision agents and implement realtime live captions in the Audio Lesson screen for both the AI teacher's speech and the user's speech, as they happen.

Define a live-caption event contract for the Audio Lesson screen: each caption event must carry the speaker identity (`teacher` or `user`), distinguish interim updates from final caption events, and preserve ordering guarantees so captions arrive in the correct sequence. Update interim captions in place rather than duplicating them, commit each final caption exactly once, and ignore late events after the call/session is cleaned up on end-call or screen-unmount.