Read AGENTS.md first and follow it strictly.

Integrate language selection state. Store the selected language using Zustand with the modern `@react-native-async-storage/async-storage` package. If an authenticated user has no selected language, route them to the language selection screen. Only after selecting a language should they access the home route (/). Preserve the existing UI exactly.

Add a development-only button on the home screen route for testing language-selection state. The button should remove only the language-selection AsyncStorage key and leave all other persisted state intact, including XP and lesson progress; do not call `AsyncStorage.clear()`.