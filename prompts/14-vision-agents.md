Read AGENTS.md first and follow it strictly.

Use the installed Vision Agents skill to create a Python service at vision-agent/ inside this repo. It is the AI language teacher, voice only, using OpenAI Realtime as the LLM and Stream Edge for transport.

Load OPENAI_API_KEY, STREAM_API_KEY, and STREAM_API_SECRET only in the Python service or server-side API routes as server-only secrets. Do not read or expose these values from the Expo client, app configuration, Stream call custom data, or any API response. The teacher uses English as the explanation language and teaches the selected language through English; target-language words or phrases may appear in lesson output, but explanations and translations stay in English.

Before writing any lifecycle code, verify the join and lifecycle method shapes against the installed SDK in this repo and confirm it starts cleanly.