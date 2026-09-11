/**
 * Lessons — the whole hardcoded course.
 *
 * Each lesson carries everything the lesson screen and the audio AI teacher
 * need: vocabulary, phrases, goals, interactive activities, and the seed prompt
 * for the Vision Agent session. Nothing here touches the network or secrets.
 *
 * Lessons are grouped by unit. A lesson references its unit with `unitId` and
 * its own vocabulary/phrases with `goals.vocabularyIds`, `goals.phraseIds`, and
 * the activity arrays — always ids from inside the same lesson.
 *
 * Sample content ships for Spanish, French, and Japanese. To add a language,
 * add its units in `data/units.ts` and a section of lessons at the bottom here;
 * no type or UI change is required.
 */

import { units } from "@/data/units";
import type {
  LanguageId,
  Lesson,
  LessonArtwork,
  LessonId,
  Phrase,
  PhraseId,
  UnitId,
  VocabularyId,
  VocabularyItem,
} from "@/types/learning";

/** Unit id → its teaching order, so lessons can be sorted unit by unit. */
const unitOrder = new Map(units.map((unit) => [unit.id, unit.order]));

/**
 * Real lesson illustrations are not in the repo yet, so most lessons point at a
 * deterministic placeholder (the same seed always returns the same image).
 * Swap a lesson's `artwork` for `{ kind: "asset", name: "..." }` once its
 * illustration lands in `assets/images`.
 */
function placeholder(seed: string): LessonArtwork {
  return { kind: "remote", uri: `https://picsum.photos/seed/${seed}/800/450` };
}

export const lessons: Lesson[] = [
  /* ==================================================================== */
  /* Spanish — Unit 1: Getting Started                                     */
  /* ==================================================================== */
  {
    id: "es-greetings",
    unitId: "es-unit-1",
    languageId: "spanish",
    order: 1,
    title: "Greetings & Introductions",
    description: "Say hello, tell people your name, and be polite.",
    estimatedMinutes: 5,
    xpReward: 10,
    artwork: { kind: "asset", name: "mascotWelcome" },
    vocabulary: [
      {
        id: "es-greetings-v1",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        partOfSpeech: "expression",
        example: {
          term: "¡Hola! ¿Cómo estás?",
          translation: "Hello! How are you?",
        },
        emoji: "👋",
      },
      {
        id: "es-greetings-v2",
        term: "buenos días",
        translation: "good morning",
        pronunciation: "BWEH-nos DEE-as",
        partOfSpeech: "expression",
        example: {
          term: "Buenos días, señora.",
          translation: "Good morning, ma'am.",
        },
        emoji: "🌅",
      },
      {
        id: "es-greetings-v3",
        term: "me llamo",
        translation: "my name is",
        pronunciation: "meh YAH-moh",
        partOfSpeech: "verb",
        example: {
          term: "Me llamo Ana.",
          translation: "My name is Ana.",
        },
        emoji: "🙋",
      },
      {
        id: "es-greetings-v4",
        term: "mucho gusto",
        translation: "nice to meet you",
        pronunciation: "MOO-choh GOOS-toh",
        partOfSpeech: "expression",
        example: {
          term: "Mucho gusto, Carlos.",
          translation: "Nice to meet you, Carlos.",
        },
        emoji: "🤝",
      },
    ],
    phrases: [
      {
        id: "es-greetings-p1",
        text: "¡Hola! ¿Cómo estás?",
        translation: "Hello! How are you?",
        pronunciation: "OH-lah KOH-moh es-TAS",
        usage: "Greeting a friend or classmate.",
      },
      {
        id: "es-greetings-p2",
        text: "Me llamo Ana. ¿Y tú?",
        translation: "My name is Ana. And you?",
        pronunciation: "meh YAH-moh AH-nah ee too",
        usage: "Introducing yourself and passing the question on.",
      },
      {
        id: "es-greetings-p3",
        text: "Buenos días, mucho gusto.",
        translation: "Good morning, nice to meet you.",
        pronunciation: "BWEH-nos DEE-as MOO-choh GOOS-toh",
        usage: "Meeting someone for the first time in the morning.",
      },
    ],
    goals: {
      summary: "Greet someone and introduce yourself in Spanish.",
      outcomes: [
        "Say hello at different times of day",
        "Tell someone your name",
        "Answer politely when you meet someone new",
      ],
      vocabularyIds: [
        "es-greetings-v1",
        "es-greetings-v2",
        "es-greetings-v3",
        "es-greetings-v4",
      ],
      phraseIds: ["es-greetings-p1", "es-greetings-p2", "es-greetings-p3"],
    },
    activities: [
      {
        id: "es-greetings-a1",
        type: "multiple-choice",
        instruction: "Choose the correct translation",
        question: "buenos días",
        options: ["Good night", "Good morning", "See you later", "Thank you"],
        correctIndex: 1,
        explanation:
          "'Buenos días' literally means 'good days' and is used until around noon.",
      },
      {
        id: "es-greetings-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the greeting out loud",
        phraseId: "es-greetings-p1",
        audioText: "¡Hola! ¿Cómo estás?",
        translation: "Hello! How are you?",
        accuracy: "relaxed",
      },
      {
        id: "es-greetings-a3",
        type: "speak-with-teacher",
        instruction: "Answer your teacher out loud",
        learnerTask: "Greet your teacher and tell them your name in Spanish.",
        exampleAnswers: [
          "¡Hola! Me llamo Ana.",
          "Buenos días, me llamo Luis.",
          "Hola, me llamo Sofía. ¿Y tú?",
        ],
        vocabularyIds: ["es-greetings-v1", "es-greetings-v3"],
        phraseIds: ["es-greetings-p1", "es-greetings-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a warm and patient Spanish teacher for absolute beginners. You explain everything in English and only use Spanish for the words being taught.",
      objective:
        "Get the learner to greet you, say their name, and respond with 'mucho gusto' — in Spanish, without reading from the screen.",
      conversationPlan: [
        "Introduce yourself in English as Luna and explain that you will practise greetings.",
        "Say 'hola' slowly, ask the learner to repeat it twice.",
        "Teach 'buenos días' and explain when Spanish speakers use it.",
        "Ask '¿Cómo te llamas?' and model the answer 'Me llamo …'.",
        "Respond to their name with 'mucho gusto' and have them repeat it back.",
        "Ask the learner to say the whole greeting on their own.",
      ],
      openingLine:
        "Hi, I'm Luna — your Spanish teacher. Let's start easy: repeat after me, ¡hola!",
      closingLine:
        "¡Excelente! You can now greet someone and introduce yourself in Spanish. ¡Adiós!",
      correctionStyle:
        "Praise first, then say the correct pronunciation slowly and ask the learner to repeat it once. Never correct more than one thing at a time.",
      vocabularyIds: [
        "es-greetings-v1",
        "es-greetings-v2",
        "es-greetings-v3",
        "es-greetings-v4",
      ],
      phraseIds: ["es-greetings-p1", "es-greetings-p2", "es-greetings-p3"],
    },
  },
  {
    id: "es-daily-life",
    unitId: "es-unit-1",
    languageId: "spanish",
    order: 2,
    title: "Daily Life",
    description: "Talk about your day and the things you do.",
    estimatedMinutes: 6,
    xpReward: 10,
    artwork: placeholder("es-daily-life"),
    vocabulary: [
      {
        id: "es-daily-life-v1",
        term: "todos los días",
        translation: "every day",
        pronunciation: "TOH-dos los DEE-as",
        partOfSpeech: "expression",
        example: {
          term: "Estudio español todos los días.",
          translation: "I study Spanish every day.",
        },
        emoji: "📅",
      },
      {
        id: "es-daily-life-v2",
        term: "el trabajo",
        translation: "work",
        pronunciation: "el trah-BAH-hoh",
        partOfSpeech: "noun",
        example: {
          term: "Voy al trabajo a las nueve.",
          translation: "I go to work at nine.",
        },
        emoji: "💼",
      },
      {
        id: "es-daily-life-v3",
        term: "el desayuno",
        translation: "breakfast",
        pronunciation: "el deh-sah-YOO-noh",
        partOfSpeech: "noun",
        example: {
          term: "El desayuno es a las ocho.",
          translation: "Breakfast is at eight.",
        },
        emoji: "🍳",
      },
      {
        id: "es-daily-life-v4",
        term: "cansado",
        translation: "tired",
        pronunciation: "kan-SAH-doh",
        partOfSpeech: "adjective",
        example: {
          term: "Hoy estoy cansado.",
          translation: "I'm tired today.",
        },
        emoji: "😴",
      },
    ],
    phrases: [
      {
        id: "es-daily-life-p1",
        text: "Mi día empieza a las siete.",
        translation: "My day starts at seven.",
        pronunciation: "mee DEE-ah em-PYEH-sah ah las SYEH-teh",
        usage: "Describing your daily routine.",
      },
      {
        id: "es-daily-life-p2",
        text: "Trabajo por la mañana y descanso por la tarde.",
        translation: "I work in the morning and rest in the afternoon.",
        pronunciation: "trah-BAH-hoh por lah mah-NYAH-nah ee des-KAN-soh por lah TAR-deh",
        usage: "Splitting your day into two halves.",
      },
      {
        id: "es-daily-life-p3",
        text: "Hoy tengo tiempo libre.",
        translation: "I have free time today.",
        pronunciation: "oy TEN-goh TYEM-poh LEE-breh",
        usage: "Telling someone you are free.",
      },
    ],
    goals: {
      summary: "Describe a normal day in Spanish.",
      outcomes: [
        "Name everyday activities",
        "Say when things happen during the day",
        "Describe how you feel",
      ],
      vocabularyIds: [
        "es-daily-life-v1",
        "es-daily-life-v2",
        "es-daily-life-v3",
        "es-daily-life-v4",
      ],
      phraseIds: [
        "es-daily-life-p1",
        "es-daily-life-p2",
        "es-daily-life-p3",
      ],
    },
    activities: [
      {
        id: "es-daily-life-a1",
        type: "multiple-choice",
        instruction: "What does 'el trabajo' mean?",
        question: "el trabajo",
        options: ["the breakfast", "the work", "the day", "the morning"],
        correctIndex: 1,
        explanation:
          "'El trabajo' means work — the verb 'trabajar' comes from the same word.",
      },
      {
        id: "es-daily-life-a2",
        type: "translate",
        instruction: "Build the sentence in Spanish",
        sourceText: "I have free time today.",
        answerText: "Hoy tengo tiempo libre.",
        wordBank: ["Hoy", "tengo", "tiempo", "libre", "trabajo", "días"],
        explanation:
          "'Hoy' goes at the front for emphasis, and 'tiempo libre' is the fixed phrase for free time.",
      },
      {
        id: "es-daily-life-a3",
        type: "speak-with-teacher",
        instruction: "Talk about your day out loud",
        learnerTask:
          "Tell your teacher three things you do every day, using 'todos los días'.",
        exampleAnswers: [
          "Todos los días trabajo y desayuno.",
          "Trabajo todos los días y descanso por la tarde.",
          "Todos los días estudio español.",
        ],
        vocabularyIds: ["es-daily-life-v1", "es-daily-life-v2", "es-daily-life-v3"],
        phraseIds: ["es-daily-life-p1", "es-daily-life-p3"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a patient Spanish teacher for beginners. English is your explanation language; Spanish is only used for the words and phrases being taught.",
      objective:
        "Have the learner describe their daily routine with at least three activities and the phrase 'todos los días'.",
      conversationPlan: [
        "Ask in English what the learner does every day, then model 'todos los días'.",
        "Introduce 'el desayuno' and 'el trabajo' with their English meanings.",
        "Ask what time their day starts and model 'a las siete' style answers.",
        "Introduce 'cansado' and ask how they feel at the end of the day.",
        "Ask the learner to put it together in two or three short sentences.",
      ],
      openingLine:
        "Hi again! Today we'll talk about your day. In Spanish, 'every day' is 'todos los días' — try saying it.",
      closingLine:
        "¡Muy bien! You can now describe your day in Spanish. Keep practising 'todos los días' this week.",
      correctionStyle:
        "Repeat the learner's sentence back correctly, then highlight just one fix. Keep sentences short and slow the pace if they hesitate.",
      vocabularyIds: [
        "es-daily-life-v1",
        "es-daily-life-v2",
        "es-daily-life-v3",
        "es-daily-life-v4",
      ],
      phraseIds: ["es-daily-life-p1", "es-daily-life-p2", "es-daily-life-p3"],
    },
  },
  {
    id: "es-cafe",
    unitId: "es-unit-1",
    languageId: "spanish",
    order: 3,
    title: "At the Café",
    description: "Order drinks and food politely.",
    estimatedMinutes: 6,
    xpReward: 15,
    artwork: placeholder("es-cafe"),
    vocabulary: [
      {
        id: "es-cafe-v1",
        term: "un café",
        translation: "a coffee",
        pronunciation: "oon kah-FEH",
        partOfSpeech: "noun",
        example: {
          term: "Un café, por favor.",
          translation: "A coffee, please.",
        },
        emoji: "☕",
      },
      {
        id: "es-cafe-v2",
        term: "el agua",
        translation: "water",
        pronunciation: "el AH-gwah",
        partOfSpeech: "noun",
        example: {
          term: "¿Me trae agua, por favor?",
          translation: "Could you bring me water, please?",
        },
        emoji: "💧",
      },
      {
        id: "es-cafe-v3",
        term: "la cuenta",
        translation: "the bill",
        pronunciation: "lah KWEN-tah",
        partOfSpeech: "noun",
        example: {
          term: "La cuenta, por favor.",
          translation: "The bill, please.",
        },
        emoji: "🧾",
      },
      {
        id: "es-cafe-v4",
        term: "delicioso",
        translation: "delicious",
        pronunciation: "deh-lee-SYOH-soh",
        partOfSpeech: "adjective",
        example: {
          term: "El pan está delicioso.",
          translation: "The bread is delicious.",
        },
        emoji: "😋",
      },
    ],
    phrases: [
      {
        id: "es-cafe-p1",
        text: "Un café con leche, por favor.",
        translation: "A coffee with milk, please.",
        pronunciation: "oon kah-FEH kon LEH-cheh por fah-VOR",
        usage: "Ordering the most common Spanish coffee.",
      },
      {
        id: "es-cafe-p2",
        text: "¿Tienen algo para comer?",
        translation: "Do you have something to eat?",
        pronunciation: "TYEH-nen AL-goh PAH-rah koh-MEHR",
        usage: "Asking a waiter about the food menu.",
      },
      {
        id: "es-cafe-p3",
        text: "La cuenta, por favor.",
        translation: "The bill, please.",
        pronunciation: "lah KWEN-tah por fah-VOR",
        usage: "Asking to pay at the end of a meal.",
      },
    ],
    goals: {
      summary: "Order at a café and ask for the bill in Spanish.",
      outcomes: [
        "Order a drink or a snack",
        "Ask politely for what you need",
        "Ask for the bill and say the food was good",
      ],
      vocabularyIds: [
        "es-cafe-v1",
        "es-cafe-v2",
        "es-cafe-v3",
        "es-cafe-v4",
      ],
      phraseIds: ["es-cafe-p1", "es-cafe-p2", "es-cafe-p3"],
    },
    activities: [
      {
        id: "es-cafe-a1",
        type: "multiple-choice",
        instruction: "Choose the correct translation",
        question: "la cuenta",
        options: ["the menu", "the bill", "the table", "the tip"],
        correctIndex: 1,
        explanation:
          "'La cuenta' is the bill. Use it with 'por favor' and you can pay anywhere.",
      },
      {
        id: "es-cafe-a2",
        type: "translate",
        instruction: "Build the sentence in Spanish",
        sourceText: "A coffee, please.",
        answerText: "Un café, por favor.",
        wordBank: ["Un", "café", "por", "favor", "agua", "cuenta"],
        explanation:
          "Spanish usually drops 'I would like' and adds 'por favor' at the end instead.",
      },
      {
        id: "es-cafe-a3",
        type: "speak-with-teacher",
        instruction: "Order out loud",
        learnerTask:
          "Your teacher is the waiter. Order a drink, then ask for the bill.",
        exampleAnswers: [
          "Un café con leche, por favor. La cuenta, por favor.",
          "Un café, por favor. ¿Tienen algo para comer?",
          "El agua, por favor. La cuenta, por favor.",
        ],
        vocabularyIds: ["es-cafe-v1", "es-cafe-v2", "es-cafe-v3"],
        phraseIds: ["es-cafe-p1", "es-cafe-p3"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a friendly Spanish teacher playing the role of a café waiter in Madrid. You explain in English and use Spanish only for the ordering phrases.",
      objective:
        "Run a short café role-play: the learner orders a drink, reacts to the price, and asks for the bill.",
      conversationPlan: [
        "Greet the learner as the waiter with '¡Buenos días! ¿Qué desea?' and translate it.",
        "Prompt them to order a coffee using 'un café con leche, por favor'.",
        "Introduce 'el agua' and ask if they want anything else.",
        "Teach 'la cuenta' and let them ask for the bill.",
        "Finish by asking if everything was good so they can answer 'delicioso'.",
      ],
      openingLine:
        "¡Buenos días! I'm your waiter today — in Spanish, tell me what you'd like: 'un café, por favor'.",
      closingLine:
        "¡Gracias! That was a perfect café visit. Practise 'la cuenta, por favor' before you travel.",
      correctionStyle:
        "Stay in the waiter role and simply respond naturally with the corrected phrase, then invite them to say it once more.",
      vocabularyIds: [
        "es-cafe-v1",
        "es-cafe-v2",
        "es-cafe-v3",
        "es-cafe-v4",
      ],
      phraseIds: ["es-cafe-p1", "es-cafe-p2", "es-cafe-p3"],
    },
  },
  {
    id: "es-travel",
    unitId: "es-unit-1",
    languageId: "spanish",
    order: 4,
    title: "Travel & Directions",
    description: "Ask where things are and find your way around.",
    estimatedMinutes: 6,
    xpReward: 15,
    artwork: placeholder("es-travel"),
    vocabulary: [
      {
        id: "es-travel-v1",
        term: "¿Dónde está…?",
        translation: "Where is…?",
        pronunciation: "DON-deh es-TAH",
        partOfSpeech: "expression",
        example: {
          term: "¿Dónde está el hotel?",
          translation: "Where is the hotel?",
        },
        emoji: "📍",
      },
      {
        id: "es-travel-v2",
        term: "la estación",
        translation: "the station",
        pronunciation: "lah es-tah-SYON",
        partOfSpeech: "noun",
        example: {
          term: "La estación está cerca.",
          translation: "The station is nearby.",
        },
        emoji: "🚉",
      },
      {
        id: "es-travel-v3",
        term: "a la derecha",
        translation: "to the right",
        pronunciation: "ah lah deh-REH-chah",
        partOfSpeech: "expression",
        example: {
          term: "Gire a la derecha.",
          translation: "Turn right.",
        },
        emoji: "➡️",
      },
      {
        id: "es-travel-v4",
        term: "el aeropuerto",
        translation: "the airport",
        pronunciation: "el ah-eh-roh-PWER-toh",
        partOfSpeech: "noun",
        example: {
          term: "Voy al aeropuerto mañana.",
          translation: "I'm going to the airport tomorrow.",
        },
        emoji: "✈️",
      },
    ],
    phrases: [
      {
        id: "es-travel-p1",
        text: "¿Dónde está el baño?",
        translation: "Where is the bathroom?",
        pronunciation: "DON-deh es-TAH el BAH-nyoh",
        usage: "The one question every traveller needs.",
      },
      {
        id: "es-travel-p2",
        text: "La estación está a la izquierda.",
        translation: "The station is on the left.",
        pronunciation: "lah es-tah-SYON es-TAH ah lah ees-KYER-dah",
        usage: "Understanding directions someone gives you.",
      },
      {
        id: "es-travel-p3",
        text: "¿Está lejos de aquí?",
        translation: "Is it far from here?",
        pronunciation: "es-TAH LEH-hos deh ah-KEE",
        usage: "Checking walking distance before you set off.",
      },
    ],
    goals: {
      summary: "Ask for directions and understand the answer in Spanish.",
      outcomes: [
        "Ask where a place is",
        "Understand left, right, and distance",
        "Talk about how you are travelling",
      ],
      vocabularyIds: [
        "es-travel-v1",
        "es-travel-v2",
        "es-travel-v3",
        "es-travel-v4",
      ],
      phraseIds: ["es-travel-p1", "es-travel-p2", "es-travel-p3"],
    },
    activities: [
      {
        id: "es-travel-a1",
        type: "multiple-choice",
        instruction: "Choose the correct translation",
        question: "a la derecha",
        options: [
          "to the left",
          "to the right",
          "straight ahead",
          "behind you",
        ],
        correctIndex: 1,
        explanation:
          "'Derecha' is right, 'izquierda' is left — remember them as a pair.",
      },
      {
        id: "es-travel-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the question out loud",
        phraseId: "es-travel-p1",
        audioText: "¿Dónde está el baño?",
        translation: "Where is the bathroom?",
        accuracy: "normal",
      },
      {
        id: "es-travel-a3",
        type: "speak-with-teacher",
        instruction: "Ask for directions out loud",
        learnerTask:
          "Ask your teacher where the station is, then repeat the directions back.",
        exampleAnswers: [
          "¿Dónde está la estación?",
          "¿Dónde está la estación? ¿Está lejos de aquí?",
          "¿Dónde está el aeropuerto?",
        ],
        vocabularyIds: ["es-travel-v1", "es-travel-v2", "es-travel-v3"],
        phraseIds: ["es-travel-p1", "es-travel-p3"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a Spanish teacher acting as a helpful local in a Spanish city. You explain in English and give directions in simple Spanish.",
      objective:
        "Practise asking for and understanding directions: the learner asks where the station is and repeats the answer.",
      conversationPlan: [
        "Ask the learner in English where they want to go today.",
        "Teach '¿Dónde está…?' and have them ask about the station.",
        "Answer with 'a la derecha' or 'a la izquierda' and check they understood.",
        "Teach '¿Está lejos de aquí?' and answer with 'no, está cerca'.",
        "Let them ask about the airport on their own.",
      ],
      openingLine:
        "Hello! Imagine we're in Madrid. To ask where something is, say '¿Dónde está…?' — try asking me about the station.",
      closingLine:
        "Perfect! You can now ask for directions in Spanish and understand the answer. ¡Buen viaje!",
      correctionStyle:
        "Answer their question naturally, then repeat it correctly so they hear the right form. Keep directions to one turn at a time.",
      vocabularyIds: [
        "es-travel-v1",
        "es-travel-v2",
        "es-travel-v3",
        "es-travel-v4",
      ],
      phraseIds: ["es-travel-p1", "es-travel-p2", "es-travel-p3"],
    },
  },
  {
    id: "es-shopping",
    unitId: "es-unit-1",
    languageId: "spanish",
    order: 5,
    title: "Shopping",
    description: "Ask for prices, sizes, and pay in a shop.",
    estimatedMinutes: 6,
    xpReward: 15,
    artwork: placeholder("es-shopping"),
    vocabulary: [
      {
        id: "es-shopping-v1",
        term: "¿Cuánto cuesta?",
        translation: "How much does it cost?",
        pronunciation: "KWAN-toh KWES-tah",
        partOfSpeech: "expression",
        example: {
          term: "¿Cuánto cuesta esta camiseta?",
          translation: "How much is this T-shirt?",
        },
        emoji: "🏷️",
      },
      {
        id: "es-shopping-v2",
        term: "la tienda",
        translation: "the shop",
        pronunciation: "lah TYEN-dah",
        partOfSpeech: "noun",
        example: {
          term: "La tienda abre a las diez.",
          translation: "The shop opens at ten.",
        },
        emoji: "🏬",
      },
      {
        id: "es-shopping-v3",
        term: "barato",
        translation: "cheap",
        pronunciation: "bah-RAH-toh",
        partOfSpeech: "adjective",
        example: {
          term: "Este libro es barato.",
          translation: "This book is cheap.",
        },
        emoji: "💰",
      },
      {
        id: "es-shopping-v4",
        term: "caro",
        translation: "expensive",
        pronunciation: "KAH-roh",
        partOfSpeech: "adjective",
        example: {
          term: "Es demasiado caro.",
          translation: "It's too expensive.",
        },
        emoji: "💸",
      },
    ],
    phrases: [
      {
        id: "es-shopping-p1",
        text: "¿Cuánto cuesta esta camiseta?",
        translation: "How much is this T-shirt?",
        pronunciation: "KWAN-toh KWES-tah ES-tah kah-mee-SEH-tah",
        usage: "Asking the price of one specific item.",
      },
      {
        id: "es-shopping-p2",
        text: "¿Tiene una talla más grande?",
        translation: "Do you have a bigger size?",
        pronunciation: "TYEH-neh OO-nah TAH-yah mas GRAN-deh",
        usage: "Asking for another size in a clothes shop.",
      },
      {
        id: "es-shopping-p3",
        text: "Solo estoy mirando, gracias.",
        translation: "I'm just looking, thanks.",
        pronunciation: "SOH-loh es-TOY mee-RAN-doh GRAH-syas",
        usage: "Polite reply when a shop assistant offers help.",
      },
    ],
    goals: {
      summary: "Shop in Spanish without switching to English.",
      outcomes: [
        "Ask how much something costs",
        "Say something is cheap or expensive",
        "Ask for a different size",
      ],
      vocabularyIds: [
        "es-shopping-v1",
        "es-shopping-v2",
        "es-shopping-v3",
        "es-shopping-v4",
      ],
      phraseIds: ["es-shopping-p1", "es-shopping-p2", "es-shopping-p3"],
    },
    activities: [
      {
        id: "es-shopping-a1",
        type: "multiple-choice",
        instruction: "What does 'barato' mean?",
        question: "barato",
        options: ["expensive", "cheap", "new", "small"],
        correctIndex: 1,
        explanation:
          "'Barato' means cheap; 'caro' means expensive. They are opposites.",
      },
      {
        id: "es-shopping-a2",
        type: "translate",
        instruction: "Build the sentence in Spanish",
        sourceText: "How much does it cost?",
        answerText: "¿Cuánto cuesta?",
        wordBank: ["¿Cuánto", "cuesta?", "tiene", "caro", "tienda"],
        explanation:
          "'Cuesta' is the verb 'costar' — use 'cuestan' when you ask about more than one item.",
      },
      {
        id: "es-shopping-a3",
        type: "speak-with-teacher",
        instruction: "Shop out loud",
        learnerTask:
          "Ask your teacher the price of an item, then say it is too expensive.",
        exampleAnswers: [
          "¿Cuánto cuesta esta camiseta? Es demasiado caro.",
          "¿Cuánto cuesta? ¿Tiene una talla más grande?",
          "¿Cuánto cuesta esta tienda? Es barato.",
        ],
        vocabularyIds: ["es-shopping-v1", "es-shopping-v3", "es-shopping-v4"],
        phraseIds: ["es-shopping-p1", "es-shopping-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a Spanish teacher playing a shop assistant in a small clothing shop. You explain in English and keep the Spanish to prices and sizes.",
      objective:
        "Practise a short shopping exchange: the learner asks a price, reacts to it, and asks for another size.",
      conversationPlan: [
        "Welcome the learner into the shop in English and offer help.",
        "Teach '¿Cuánto cuesta?' and have them ask about a T-shirt.",
        "Give a price and teach 'caro' and 'barato' so they can react.",
        "Teach 'una talla más grande' and let them ask for it.",
        "Close by having them say 'solo estoy mirando, gracias'.",
      ],
      openingLine:
        "Welcome to my shop! If you want to know a price, ask me '¿Cuánto cuesta?' — try it with the T-shirt.",
      closingLine:
        "¡Muy bien! You can shop in Spanish now. Practise '¿Cuánto cuesta?' on your next trip.",
      correctionStyle:
        "Reply in character, then repeat their question correctly. If pronunciation slips, model the word once and move on.",
      vocabularyIds: [
        "es-shopping-v1",
        "es-shopping-v2",
        "es-shopping-v3",
        "es-shopping-v4",
      ],
      phraseIds: ["es-shopping-p1", "es-shopping-p2", "es-shopping-p3"],
    },
  },
  {
    id: "es-family",
    unitId: "es-unit-1",
    languageId: "spanish",
    order: 6,
    title: "Family & Friends",
    description: "Talk about the people in your life.",
    estimatedMinutes: 6,
    xpReward: 15,
    artwork: placeholder("es-family"),
    vocabulary: [
      {
        id: "es-family-v1",
        term: "mi familia",
        translation: "my family",
        pronunciation: "mee fah-MEE-lyah",
        partOfSpeech: "noun",
        example: {
          term: "Mi familia vive en Madrid.",
          translation: "My family lives in Madrid.",
        },
        emoji: "👨👩👧",
      },
      {
        id: "es-family-v2",
        term: "mi madre",
        translation: "my mother",
        pronunciation: "mee MAH-dreh",
        partOfSpeech: "noun",
        example: {
          term: "Mi madre habla español.",
          translation: "My mother speaks Spanish.",
        },
        emoji: "👩",
      },
      {
        id: "es-family-v3",
        term: "mi hermano",
        translation: "my brother",
        pronunciation: "mee er-MAH-noh",
        partOfSpeech: "noun",
        example: {
          term: "Tengo dos hermanos.",
          translation: "I have two brothers.",
        },
        emoji: "👦",
      },
      {
        id: "es-family-v4",
        term: "mis amigos",
        translation: "my friends",
        pronunciation: "mees ah-MEE-gos",
        partOfSpeech: "noun",
        example: {
          term: "Salgo con mis amigos el sábado.",
          translation: "I go out with my friends on Saturday.",
        },
        emoji: "🧑🤝🧑",
      },
    ],
    phrases: [
      {
        id: "es-family-p1",
        text: "Tengo dos hermanos.",
        translation: "I have two brothers.",
        pronunciation: "TEN-goh dos er-MAH-nos",
        usage: "Talking about your siblings.",
      },
      {
        id: "es-family-p2",
        text: "¿Tienes hermanos?",
        translation: "Do you have siblings?",
        pronunciation: "TYEH-nes er-MAH-nos",
        usage: "Asking a friend about their family.",
      },
      {
        id: "es-family-p3",
        text: "Mi familia vive en Madrid.",
        translation: "My family lives in Madrid.",
        pronunciation: "mee fah-MEE-lyah VEE-veh en mah-DREED",
        usage: "Saying where your family is from.",
      },
    ],
    goals: {
      summary: "Describe your family and friends in Spanish.",
      outcomes: [
        "Name family members",
        "Say how many brothers or sisters you have",
        "Say where your family lives",
      ],
      vocabularyIds: [
        "es-family-v1",
        "es-family-v2",
        "es-family-v3",
        "es-family-v4",
      ],
      phraseIds: ["es-family-p1", "es-family-p2", "es-family-p3"],
    },
    activities: [
      {
        id: "es-family-a1",
        type: "multiple-choice",
        instruction: "Choose the correct translation",
        question: "mi hermano",
        options: ["my father", "my brother", "my friend", "my son"],
        correctIndex: 1,
        explanation:
          "'Hermano' is brother and 'hermana' is sister — the ending changes with gender.",
      },
      {
        id: "es-family-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the question out loud",
        phraseId: "es-family-p2",
        audioText: "¿Tienes hermanos?",
        translation: "Do you have siblings?",
        accuracy: "normal",
      },
      {
        id: "es-family-a3",
        type: "speak-with-teacher",
        instruction: "Talk about your family out loud",
        learnerTask:
          "Tell your teacher how many siblings you have and where your family lives.",
        exampleAnswers: [
          "Tengo dos hermanos. Mi familia vive en Madrid.",
          "No tengo hermanos. Mi familia vive en Londres.",
          "Tengo una hermana y mis amigos viven aquí.",
        ],
        vocabularyIds: ["es-family-v1", "es-family-v3", "es-family-v4"],
        phraseIds: ["es-family-p1", "es-family-p3"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a warm Spanish teacher who loves hearing about learners' families. English is your explanation language; Spanish is for the family words.",
      objective:
        "Get the learner to talk about their family and ask you a question back using '¿Tienes hermanos?'.",
      conversationPlan: [
        "Ask the learner about their family in English and teach 'mi familia'.",
        "Introduce 'mi madre' and 'mi hermano' with their English meanings.",
        "Teach 'tengo dos hermanos' and let them say their own number.",
        "Ask '¿Tienes hermanos?' and make sure they can ask it back to you.",
        "Have them say where their family lives using 'vive en'.",
      ],
      openingLine:
        "Hola! Today we're talking about family. In Spanish, 'my family' is 'mi familia' — repeat after me.",
      closingLine:
        "¡Qué bien! You can talk about your family in Spanish now. Say '¡Hola!' to them from me.",
      correctionStyle:
        "Show genuine interest first, then restate their sentence correctly. Correct 'hermano/hermana' only if it changes the meaning.",
      vocabularyIds: [
        "es-family-v1",
        "es-family-v2",
        "es-family-v3",
        "es-family-v4",
      ],
      phraseIds: ["es-family-p1", "es-family-p2", "es-family-p3"],
    },
  },

  /* ==================================================================== */
  /* Spanish — Unit 2: Everyday Life                                       */
  /* ==================================================================== */
  {
    id: "es-numbers-time",
    unitId: "es-unit-2",
    languageId: "spanish",
    order: 1,
    title: "Numbers & Time",
    description: "Count to twenty and tell the time.",
    estimatedMinutes: 5,
    xpReward: 10,
    artwork: placeholder("es-numbers-time"),
    vocabulary: [
      {
        id: "es-numbers-time-v1",
        term: "cinco",
        translation: "five",
        pronunciation: "SEEN-koh",
        partOfSpeech: "noun",
        example: {
          term: "Tengo cinco libros.",
          translation: "I have five books.",
        },
        emoji: "5️⃣",
      },
      {
        id: "es-numbers-time-v2",
        term: "diez",
        translation: "ten",
        pronunciation: "DYES",
        partOfSpeech: "noun",
        example: {
          term: "Cuesta diez euros.",
          translation: "It costs ten euros.",
        },
        emoji: "🔟",
      },
      {
        id: "es-numbers-time-v3",
        term: "¿Qué hora es?",
        translation: "What time is it?",
        pronunciation: "keh OH-rah es",
        partOfSpeech: "expression",
        example: {
          term: "¿Qué hora es, por favor?",
          translation: "What time is it, please?",
        },
        emoji: "🕐",
      },
      {
        id: "es-numbers-time-v4",
        term: "la tarde",
        translation: "the afternoon",
        pronunciation: "lah TAR-deh",
        partOfSpeech: "noun",
        example: {
          term: "Trabajo por la tarde.",
          translation: "I work in the afternoon.",
        },
        emoji: "🌇",
      },
    ],
    phrases: [
      {
        id: "es-numbers-time-p1",
        text: "Son las tres.",
        translation: "It's three o'clock.",
        pronunciation: "son las TRES",
        usage: "Telling the time for any hour except one.",
      },
      {
        id: "es-numbers-time-p2",
        text: "¿Qué hora es, por favor?",
        translation: "What time is it, please?",
        pronunciation: "keh OH-rah es por fah-VOR",
        usage: "Asking a stranger for the time.",
      },
      {
        id: "es-numbers-time-p3",
        text: "Nos vemos a las ocho.",
        translation: "See you at eight.",
        pronunciation: "nos VEH-mos ah las OH-choh",
        usage: "Making a plan with a friend.",
      },
    ],
    goals: {
      summary: "Count to twenty and tell the time in Spanish.",
      outcomes: [
        "Count from one to twenty",
        "Ask and answer what time it is",
        "Make a plan for a specific time",
      ],
      vocabularyIds: [
        "es-numbers-time-v1",
        "es-numbers-time-v2",
        "es-numbers-time-v3",
        "es-numbers-time-v4",
      ],
      phraseIds: [
        "es-numbers-time-p1",
        "es-numbers-time-p2",
        "es-numbers-time-p3",
      ],
    },
    activities: [
      {
        id: "es-numbers-time-a1",
        type: "multiple-choice",
        instruction: "What does 'diez' mean?",
        question: "diez",
        options: ["two", "five", "ten", "twenty"],
        correctIndex: 2,
        explanation:
          "'Diez' is ten. Notice that 'cinco' (five) and 'diez' (ten) look nothing alike.",
      },
      {
        id: "es-numbers-time-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the question out loud",
        phraseId: "es-numbers-time-p2",
        audioText: "¿Qué hora es, por favor?",
        translation: "What time is it, please?",
        accuracy: "normal",
      },
      {
        id: "es-numbers-time-a3",
        type: "speak-with-teacher",
        instruction: "Count and tell the time out loud",
        learnerTask:
          "Count from one to ten for your teacher, then tell them what time it is.",
        exampleAnswers: [
          "Uno, dos, tres… diez. Son las tres.",
          "Uno, dos, tres, cuatro, cinco. Son las cinco.",
          "Son las ocho. Nos vemos a las ocho.",
        ],
        vocabularyIds: ["es-numbers-time-v1", "es-numbers-time-v2"],
        phraseIds: ["es-numbers-time-p1", "es-numbers-time-p3"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a patient Spanish teacher. You explain in English and use Spanish only for numbers and time phrases.",
      objective:
        "Have the learner count to ten and tell the time, then make a simple plan with 'a las …'.",
      conversationPlan: [
        "Count from one to five in Spanish and ask the learner to join in.",
        "Extend the count to ten with 'diez'.",
        "Teach '¿Qué hora es?' and answer with 'son las tres'.",
        "Ask the learner to tell you the time for a few different hours.",
        "Teach 'nos vemos a las ocho' and make a plan with them.",
      ],
      openingLine:
        "¡Hola! Let's count together: uno, dos, tres… your turn! Now try counting to ten.",
      closingLine:
        "¡Perfecto! You can count and tell the time in Spanish. Nos vemos a las ocho!",
      correctionStyle:
        "Count along with them so they hear the rhythm, and gently restart the count if a number is wrong.",
      vocabularyIds: [
        "es-numbers-time-v1",
        "es-numbers-time-v2",
        "es-numbers-time-v3",
        "es-numbers-time-v4",
      ],
      phraseIds: [
        "es-numbers-time-p1",
        "es-numbers-time-p2",
        "es-numbers-time-p3",
      ],
    },
  },
  {
    id: "es-food",
    unitId: "es-unit-2",
    languageId: "spanish",
    order: 2,
    title: "Food & Drinks",
    description: "Name everyday foods and say what you like.",
    estimatedMinutes: 6,
    xpReward: 10,
    artwork: placeholder("es-food"),
    vocabulary: [
      {
        id: "es-food-v1",
        term: "el pan",
        translation: "bread",
        pronunciation: "el PAN",
        partOfSpeech: "noun",
        example: {
          term: "Como pan por la mañana.",
          translation: "I eat bread in the morning.",
        },
        emoji: "🍞",
      },
      {
        id: "es-food-v2",
        term: "el pollo",
        translation: "chicken",
        pronunciation: "el POH-yoh",
        partOfSpeech: "noun",
        example: {
          term: "El pollo está delicioso.",
          translation: "The chicken is delicious.",
        },
        emoji: "🍗",
      },
      {
        id: "es-food-v3",
        term: "me gusta",
        translation: "I like",
        pronunciation: "meh GOOS-tah",
        partOfSpeech: "verb",
        example: {
          term: "Me gusta el café.",
          translation: "I like coffee.",
        },
        emoji: "❤️",
      },
      {
        id: "es-food-v4",
        term: "la fruta",
        translation: "fruit",
        pronunciation: "lah FROO-tah",
        partOfSpeech: "noun",
        example: {
          term: "Compro fruta en el mercado.",
          translation: "I buy fruit at the market.",
        },
        emoji: "🍎",
      },
    ],
    phrases: [
      {
        id: "es-food-p1",
        text: "Me gusta el pan.",
        translation: "I like bread.",
        pronunciation: "meh GOOS-tah el PAN",
        usage: "Saying you like a food.",
      },
      {
        id: "es-food-p2",
        text: "No me gusta el pescado.",
        translation: "I don't like fish.",
        pronunciation: "noh meh GOOS-tah el pes-KAH-doh",
        usage: "Saying you don't like something — just add 'no'.",
      },
      {
        id: "es-food-p3",
        text: "¿Qué quieres comer?",
        translation: "What do you want to eat?",
        pronunciation: "keh KYEH-res koh-MEHR",
        usage: "Asking a friend to choose a dish.",
      },
    ],
    goals: {
      summary: "Say what food you like and don't like in Spanish.",
      outcomes: [
        "Name common foods",
        "Say what you like and dislike",
        "Ask someone what they want to eat",
      ],
      vocabularyIds: ["es-food-v1", "es-food-v2", "es-food-v3", "es-food-v4"],
      phraseIds: ["es-food-p1", "es-food-p2", "es-food-p3"],
    },
    activities: [
      {
        id: "es-food-a1",
        type: "multiple-choice",
        instruction: "What does 'me gusta' mean?",
        question: "me gusta",
        options: ["I like", "I want", "I have", "I eat"],
        correctIndex: 0,
        explanation:
          "'Me gusta' is literally 'it pleases me' — that is why it uses the food as the subject.",
      },
      {
        id: "es-food-a2",
        type: "translate",
        instruction: "Build the sentence in Spanish",
        sourceText: "I like bread.",
        answerText: "Me gusta el pan.",
        wordBank: ["Me", "gusta", "el", "pan", "pollo", "no"],
        explanation:
          "To say you don't like it, just put 'no' in front: 'no me gusta el pan'.",
      },
      {
        id: "es-food-a3",
        type: "speak-with-teacher",
        instruction: "Talk about food out loud",
        learnerTask:
          "Tell your teacher two foods you like and one you don't like.",
        exampleAnswers: [
          "Me gusta el pan y el pollo. No me gusta la fruta.",
          "Me gusta la fruta. No me gusta el pollo.",
          "¿Qué quieres comer? Me gusta el pan.",
        ],
        vocabularyIds: ["es-food-v1", "es-food-v3", "es-food-v4"],
        phraseIds: ["es-food-p1", "es-food-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a friendly Spanish teacher chatting about food. You explain in English and use Spanish for the food words.",
      objective:
        "Have the learner say two foods they like and one they don't, using 'me gusta' and 'no me gusta'.",
      conversationPlan: [
        "Ask the learner in English what they ate today.",
        "Teach 'el pan' and 'el pollo' and have them repeat both.",
        "Introduce 'me gusta' and model 'me gusta el pan'.",
        "Add 'no' so they can say what they don't like.",
        "Ask '¿Qué quieres comer?' and let them answer in a full sentence.",
      ],
      openingLine:
        "¡Hola! Let's talk about food. To say you like something, say 'me gusta' — try it with 'el pan'.",
      closingLine:
        "¡Buen trabajo! You can talk about food you like in Spanish now. ¡Que aproveche!",
      correctionStyle:
        "Keep it conversational: react to what they say, then repeat their sentence with the correct word order.",
      vocabularyIds: ["es-food-v1", "es-food-v2", "es-food-v3", "es-food-v4"],
      phraseIds: ["es-food-p1", "es-food-p2", "es-food-p3"],
    },
  },
  {
    id: "es-weather",
    unitId: "es-unit-2",
    languageId: "spanish",
    order: 3,
    title: "Weather & Seasons",
    description: "Describe the weather and the seasons.",
    estimatedMinutes: 5,
    xpReward: 10,
    artwork: placeholder("es-weather"),
    vocabulary: [
      {
        id: "es-weather-v1",
        term: "hace sol",
        translation: "it's sunny",
        pronunciation: "AH-seh SOL",
        partOfSpeech: "expression",
        example: {
          term: "Hoy hace sol.",
          translation: "It's sunny today.",
        },
        emoji: "☀️",
      },
      {
        id: "es-weather-v2",
        term: "llueve",
        translation: "it's raining",
        pronunciation: "YWEH-veh",
        partOfSpeech: "verb",
        example: {
          term: "Llueve mucho en abril.",
          translation: "It rains a lot in April.",
        },
        emoji: "🌧️",
      },
      {
        id: "es-weather-v3",
        term: "el verano",
        translation: "summer",
        pronunciation: "el veh-RAH-noh",
        partOfSpeech: "noun",
        example: {
          term: "En verano hace calor.",
          translation: "In summer it's hot.",
        },
        emoji: "🏖️",
      },
      {
        id: "es-weather-v4",
        term: "frío",
        translation: "cold",
        pronunciation: "FREE-oh",
        partOfSpeech: "adjective",
        example: {
          term: "El agua está fría.",
          translation: "The water is cold.",
        },
        emoji: "🥶",
      },
    ],
    phrases: [
      {
        id: "es-weather-p1",
        text: "¿Qué tiempo hace hoy?",
        translation: "What's the weather like today?",
        pronunciation: "keh TYEM-poh AH-seh oy",
        usage: "Classic small talk in Spanish.",
      },
      {
        id: "es-weather-p2",
        text: "Hace mucho calor.",
        translation: "It's very hot.",
        pronunciation: "AH-seh MOO-choh kah-LOR",
        usage: "Complaining about the heat in summer.",
      },
      {
        id: "es-weather-p3",
        text: "En invierno hace frío.",
        translation: "In winter it's cold.",
        pronunciation: "en een-VYER-noh AH-seh FREE-oh",
        usage: "Describing a season.",
      },
    ],
    goals: {
      summary: "Talk about the weather and the seasons in Spanish.",
      outcomes: [
        "Say what the weather is like",
        "Name the seasons",
        "Use 'hace' with weather expressions",
      ],
      vocabularyIds: [
        "es-weather-v1",
        "es-weather-v2",
        "es-weather-v3",
        "es-weather-v4",
      ],
      phraseIds: ["es-weather-p1", "es-weather-p2", "es-weather-p3"],
    },
    activities: [
      {
        id: "es-weather-a1",
        type: "multiple-choice",
        instruction: "Choose the correct translation",
        question: "hace sol",
        options: ["it's raining", "it's sunny", "it's cold", "it's windy"],
        correctIndex: 1,
        explanation:
          "'Sol' is sun. Weather that comes from the sky uses 'hace': 'hace sol', 'hace frío'.",
      },
      {
        id: "es-weather-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the phrase out loud",
        phraseId: "es-weather-p1",
        audioText: "¿Qué tiempo hace hoy?",
        translation: "What's the weather like today?",
        accuracy: "relaxed",
      },
      {
        id: "es-weather-a3",
        type: "speak-with-teacher",
        instruction: "Describe the weather out loud",
        learnerTask:
          "Tell your teacher what the weather is like where you are today and which season you prefer.",
        exampleAnswers: [
          "Hoy hace sol. Me gusta el verano.",
          "Hoy llueve. En invierno hace frío.",
          "Hace mucho calor. ¿Qué tiempo hace hoy?",
        ],
        vocabularyIds: ["es-weather-v1", "es-weather-v2", "es-weather-v3"],
        phraseIds: ["es-weather-p1", "es-weather-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Luna, a cheerful Spanish teacher talking about the weather. You explain in English and use Spanish for the weather phrases.",
      objective:
        "Have the learner describe today's weather and compare two seasons using weather expressions.",
      conversationPlan: [
        "Ask in English what the weather is like where they are.",
        "Teach 'hace sol' and 'llueve' and have them repeat both.",
        "Introduce '¿Qué tiempo hace hoy?' and let them ask you.",
        "Teach the seasons, starting with 'el verano' and 'el invierno'.",
        "Ask which season they prefer and why, in simple Spanish.",
      ],
      openingLine:
        "¡Hola! Let's talk about the weather. Here in Madrid, today 'hace sol' — what's it like where you are?",
      closingLine:
        "¡Muy bien! You can talk about the weather in Spanish now — a great way to start any conversation.",
      correctionStyle:
        "Echo their answer back correctly, and only fix 'hace' versus 'está' if they mix up the two patterns.",
      vocabularyIds: [
        "es-weather-v1",
        "es-weather-v2",
        "es-weather-v3",
        "es-weather-v4",
      ],
      phraseIds: ["es-weather-p1", "es-weather-p2", "es-weather-p3"],
    },
  },

  /* ==================================================================== */
  /* French — Unit 1: First Steps                                          */
  /* ==================================================================== */
  {
    id: "fr-greetings",
    unitId: "fr-unit-1",
    languageId: "french",
    order: 1,
    title: "Greetings & Introductions",
    description: "Say hello, tell people your name, and be polite.",
    estimatedMinutes: 5,
    xpReward: 10,
    artwork: { kind: "asset", name: "mascotWelcome" },
    vocabulary: [
      {
        id: "fr-greetings-v1",
        term: "bonjour",
        translation: "hello / good morning",
        pronunciation: "bon-ZHOOR",
        partOfSpeech: "expression",
        example: {
          term: "Bonjour, madame.",
          translation: "Hello, madam.",
        },
        emoji: "👋",
      },
      {
        id: "fr-greetings-v2",
        term: "je m'appelle",
        translation: "my name is",
        pronunciation: "zhuh mah-PEL",
        partOfSpeech: "expression",
        example: {
          term: "Je m'appelle Marie.",
          translation: "My name is Marie.",
        },
        emoji: "🙋",
      },
      {
        id: "fr-greetings-v3",
        term: "enchanté",
        translation: "nice to meet you",
        pronunciation: "ahn-shahn-TAY",
        partOfSpeech: "expression",
        example: {
          term: "Enchanté, Paul.",
          translation: "Nice to meet you, Paul.",
        },
        emoji: "🤝",
      },
      {
        id: "fr-greetings-v4",
        term: "au revoir",
        translation: "goodbye",
        pronunciation: "oh ruh-VWAR",
        partOfSpeech: "expression",
        example: {
          term: "Au revoir et à demain !",
          translation: "Goodbye and see you tomorrow!",
        },
        emoji: "👋",
      },
    ],
    phrases: [
      {
        id: "fr-greetings-p1",
        text: "Bonjour ! Comment ça va ?",
        translation: "Hello! How are you?",
        pronunciation: "bon-ZHOOR koh-MAHN sah VAH",
        usage: "Greeting a friend or a shopkeeper.",
      },
      {
        id: "fr-greetings-p2",
        text: "Je m'appelle Marie. Et toi ?",
        translation: "My name is Marie. And you?",
        pronunciation: "zhuh mah-PEL mah-REE eh TWAH",
        usage: "Introducing yourself and passing the question on.",
      },
      {
        id: "fr-greetings-p3",
        text: "Très bien, merci.",
        translation: "Very well, thank you.",
        pronunciation: "treh BYAN mehr-SEE",
        usage: "The standard answer to 'comment ça va ?'.",
      },
    ],
    goals: {
      summary: "Greet someone and introduce yourself in French.",
      outcomes: [
        "Say hello and goodbye",
        "Tell someone your name",
        "Answer when someone asks how you are",
      ],
      vocabularyIds: [
        "fr-greetings-v1",
        "fr-greetings-v2",
        "fr-greetings-v3",
        "fr-greetings-v4",
      ],
      phraseIds: ["fr-greetings-p1", "fr-greetings-p2", "fr-greetings-p3"],
    },
    activities: [
      {
        id: "fr-greetings-a1",
        type: "multiple-choice",
        instruction: "Choose the correct translation",
        question: "bonjour",
        options: ["goodbye", "hello", "please", "thank you"],
        correctIndex: 1,
        explanation:
          "'Bonjour' covers both hello and good morning — use it until the evening, when it becomes 'bonsoir'.",
      },
      {
        id: "fr-greetings-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the greeting out loud",
        phraseId: "fr-greetings-p1",
        audioText: "Bonjour ! Comment ça va ?",
        translation: "Hello! How are you?",
        accuracy: "relaxed",
      },
      {
        id: "fr-greetings-a3",
        type: "speak-with-teacher",
        instruction: "Answer your teacher out loud",
        learnerTask: "Greet your teacher, say your name, and ask how they are.",
        exampleAnswers: [
          "Bonjour ! Je m'appelle Ana. Comment ça va ?",
          "Bonjour, je m'appelle Louis. Ça va bien, merci.",
          "Bonjour ! Je m'appelle Sofia. Et toi ?",
        ],
        vocabularyIds: ["fr-greetings-v1", "fr-greetings-v2"],
        phraseIds: ["fr-greetings-p1", "fr-greetings-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Camille, a warm French teacher for absolute beginners. You explain everything in English and use French only for the words being taught.",
      objective:
        "Get the learner to greet you, say their name, and ask how you are — in French.",
      conversationPlan: [
        "Introduce yourself in English as Camille and explain the plan.",
        "Say 'bonjour' slowly and have the learner repeat it twice.",
        "Teach 'je m'appelle' and model the full introduction.",
        "Ask 'Comment ça va ?' and teach the answer 'très bien, merci'.",
        "Have them ask you the question back before saying 'au revoir'.",
      ],
      openingLine:
        "Bonjour! I'm Camille, your French teacher. Repeat after me: bonjour!",
      closingLine:
        "Bravo! You can greet someone and introduce yourself in French now. Au revoir!",
      correctionStyle:
        "Praise first, then model the correct pronunciation slowly. French vowels are tricky — correct one sound at a time.",
      vocabularyIds: [
        "fr-greetings-v1",
        "fr-greetings-v2",
        "fr-greetings-v3",
        "fr-greetings-v4",
      ],
      phraseIds: ["fr-greetings-p1", "fr-greetings-p2", "fr-greetings-p3"],
    },
  },
  {
    id: "fr-cafe",
    unitId: "fr-unit-1",
    languageId: "french",
    order: 2,
    title: "At the Café",
    description: "Order drinks and pastries like a local.",
    estimatedMinutes: 6,
    xpReward: 15,
    artwork: placeholder("fr-cafe"),
    vocabulary: [
      {
        id: "fr-cafe-v1",
        term: "un café",
        translation: "a coffee",
        pronunciation: "un kah-FEH",
        partOfSpeech: "noun",
        example: {
          term: "Un café, s'il vous plaît.",
          translation: "A coffee, please.",
        },
        emoji: "☕",
      },
      {
        id: "fr-cafe-v2",
        term: "l'eau",
        translation: "water",
        pronunciation: "loh",
        partOfSpeech: "noun",
        example: {
          term: "Une carafe d'eau, s'il vous plaît.",
          translation: "A jug of water, please.",
        },
        emoji: "💧",
      },
      {
        id: "fr-cafe-v3",
        term: "l'addition",
        translation: "the bill",
        pronunciation: "lah-dee-SYON",
        partOfSpeech: "noun",
        example: {
          term: "L'addition, s'il vous plaît.",
          translation: "The bill, please.",
        },
        emoji: "🧾",
      },
      {
        id: "fr-cafe-v4",
        term: "s'il vous plaît",
        translation: "please",
        pronunciation: "seel voo PLEH",
        partOfSpeech: "expression",
        example: {
          term: "Un croissant, s'il vous plaît.",
          translation: "A croissant, please.",
        },
        emoji: "🙏",
      },
    ],
    phrases: [
      {
        id: "fr-cafe-p1",
        text: "Un café, s'il vous plaît.",
        translation: "A coffee, please.",
        pronunciation: "un kah-FEH seel voo PLEH",
        usage: "The simplest order you can place in France.",
      },
      {
        id: "fr-cafe-p2",
        text: "Je voudrais un croissant.",
        translation: "I would like a croissant.",
        pronunciation: "zhuh voo-DREH un kwah-SAHN",
        usage: "The polite way to order anything.",
      },
      {
        id: "fr-cafe-p3",
        text: "L'addition, s'il vous plaît.",
        translation: "The bill, please.",
        pronunciation: "lah-dee-SYON seel voo PLEH",
        usage: "Asking to pay at the end of a meal.",
      },
    ],
    goals: {
      summary: "Order at a French café and ask for the bill.",
      outcomes: [
        "Order a drink politely",
        "Use 'je voudrais' to ask for something",
        "Ask for the bill",
      ],
      vocabularyIds: ["fr-cafe-v1", "fr-cafe-v2", "fr-cafe-v3", "fr-cafe-v4"],
      phraseIds: ["fr-cafe-p1", "fr-cafe-p2", "fr-cafe-p3"],
    },
    activities: [
      {
        id: "fr-cafe-a1",
        type: "multiple-choice",
        instruction: "Choose the correct translation",
        question: "l'addition",
        options: ["the menu", "the bill", "the water", "the coffee"],
        correctIndex: 1,
        explanation:
          "'L'addition' is the bill — the same word is used in English for a maths addition.",
      },
      {
        id: "fr-cafe-a2",
        type: "translate",
        instruction: "Build the sentence in French",
        sourceText: "A coffee, please.",
        answerText: "Un café, s'il vous plaît.",
        wordBank: ["Un", "café", "s'il", "vous", "plaît", "addition"],
        explanation:
          "'S'il vous plaît' is the polite form; with friends you can shorten it to 's'il te plaît'.",
      },
      {
        id: "fr-cafe-a3",
        type: "speak-with-teacher",
        instruction: "Order out loud",
        learnerTask:
          "Your teacher is the waiter. Order a coffee and a croissant, then ask for the bill.",
        exampleAnswers: [
          "Un café, s'il vous plaît. Je voudrais un croissant.",
          "Un café et un croissant, s'il vous plaît.",
          "Je voudrais un café. L'addition, s'il vous plaît.",
        ],
        vocabularyIds: ["fr-cafe-v1", "fr-cafe-v4", "fr-cafe-v3"],
        phraseIds: ["fr-cafe-p1", "fr-cafe-p2", "fr-cafe-p3"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Camille, a French teacher playing a café waiter in Paris. You explain in English and use French only for the ordering phrases.",
      objective:
        "Run a short café role-play where the learner orders, thanks you, and asks for the bill.",
      conversationPlan: [
        "Greet them as the waiter with 'Bonjour ! Vous désirez ?' and translate it.",
        "Prompt them to order with 'un café, s'il vous plaît'.",
        "Teach 'je voudrais' and let them order a croissant.",
        "Introduce 'l'eau' and ask if they want anything else.",
        "Let them ask for 'l'addition' and say goodbye.",
      ],
      openingLine:
        "Bonjour! I'm your waiter today. To order, just say 'un café, s'il vous plaît' — go ahead.",
      closingLine:
        "Merci, au revoir! That was a perfect café visit. Practise 'l'addition, s'il vous plaît' before your trip.",
      correctionStyle:
        "Stay in character and reply naturally with the corrected phrase, then invite them to repeat it once.",
      vocabularyIds: ["fr-cafe-v1", "fr-cafe-v2", "fr-cafe-v3", "fr-cafe-v4"],
      phraseIds: ["fr-cafe-p1", "fr-cafe-p2", "fr-cafe-p3"],
    },
  },
  {
    id: "fr-daily-life",
    unitId: "fr-unit-1",
    languageId: "french",
    order: 3,
    title: "Daily Life",
    description: "Talk about your routine, meals, and how you feel.",
    estimatedMinutes: 6,
    xpReward: 15,
    artwork: placeholder("fr-daily-life"),
    vocabulary: [
      {
        id: "fr-daily-life-v1",
        term: "je travaille",
        translation: "I work",
        pronunciation: "zhuh trah-VY",
        partOfSpeech: "verb",
        example: {
          term: "Je travaille à Paris.",
          translation: "I work in Paris.",
        },
        emoji: "💼",
      },
      {
        id: "fr-daily-life-v2",
        term: "le matin",
        translation: "the morning",
        pronunciation: "luh mah-TAN",
        partOfSpeech: "noun",
        example: {
          term: "Je cours le matin.",
          translation: "I run in the morning.",
        },
        emoji: "🌅",
      },
      {
        id: "fr-daily-life-v3",
        term: "je mange",
        translation: "I eat",
        pronunciation: "zhuh MAHNZH",
        partOfSpeech: "verb",
        example: {
          term: "Je mange à midi.",
          translation: "I eat at noon.",
        },
        emoji: "🍽️",
      },
      {
        id: "fr-daily-life-v4",
        term: "fatigué",
        translation: "tired",
        pronunciation: "fah-tee-GAY",
        partOfSpeech: "adjective",
        example: {
          term: "Je suis fatigué aujourd'hui.",
          translation: "I'm tired today.",
        },
        emoji: "😴",
      },
    ],
    phrases: [
      {
        id: "fr-daily-life-p1",
        text: "Je travaille le matin.",
        translation: "I work in the morning.",
        pronunciation: "zhuh trah-VY luh mah-TAN",
        usage: "Saying when you work.",
      },
      {
        id: "fr-daily-life-p2",
        text: "Je mange à midi.",
        translation: "I eat at noon.",
        pronunciation: "zhuh MAHNZH ah mee-DEE",
        usage: "Talking about lunch time.",
      },
      {
        id: "fr-daily-life-p3",
        text: "Je suis fatigué aujourd'hui.",
        translation: "I'm tired today.",
        pronunciation: "zhuh swee fah-tee-GAY oh-zhoor-DWEE",
        usage: "Saying how you feel.",
      },
    ],
    goals: {
      summary: "Describe your daily routine in French.",
      outcomes: [
        "Say when you work and eat",
        "Use the parts of the day",
        "Say how you feel",
      ],
      vocabularyIds: [
        "fr-daily-life-v1",
        "fr-daily-life-v2",
        "fr-daily-life-v3",
        "fr-daily-life-v4",
      ],
      phraseIds: ["fr-daily-life-p1", "fr-daily-life-p2", "fr-daily-life-p3"],
    },
    activities: [
      {
        id: "fr-daily-life-a1",
        type: "multiple-choice",
        instruction: "What does 'le matin' mean?",
        question: "le matin",
        options: ["the evening", "the morning", "the week", "the meal"],
        correctIndex: 1,
        explanation:
          "'Le matin' is the morning. The evening is 'le soir' — a different word entirely.",
      },
      {
        id: "fr-daily-life-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the sentence out loud",
        phraseId: "fr-daily-life-p1",
        audioText: "Je travaille le matin.",
        translation: "I work in the morning.",
        accuracy: "normal",
      },
      {
        id: "fr-daily-life-a3",
        type: "speak-with-teacher",
        instruction: "Talk about your day out loud",
        learnerTask:
          "Tell your teacher two things you do each day and how you feel right now.",
        exampleAnswers: [
          "Je travaille le matin. Je mange à midi.",
          "Je travaille le matin et je suis fatigué.",
          "Je mange à midi. Je suis fatigué aujourd'hui.",
        ],
        vocabularyIds: [
          "fr-daily-life-v1",
          "fr-daily-life-v3",
          "fr-daily-life-v4",
        ],
        phraseIds: ["fr-daily-life-p1", "fr-daily-life-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Camille, a patient French teacher for beginners. You explain in English and use French only for the routine phrases being taught.",
      objective:
        "Have the learner describe two daily activities and how they feel, using 'je travaille', 'je mange', and 'je suis fatigué'.",
      conversationPlan: [
        "Ask in English what the learner does on a normal day.",
        "Teach 'le matin' and model 'je travaille le matin'.",
        "Introduce 'je mange' and ask what time they eat.",
        "Teach 'je suis fatigué' and ask how they feel right now.",
        "Have them put it together in two sentences.",
      ],
      openingLine:
        "Bonjour! Today let's talk about your day. In French, 'I work' is 'je travaille' — repeat after me.",
      closingLine:
        "Très bien! You can describe your day in French now. Repose-toi — go and rest!",
      correctionStyle:
        "Repeat their sentence correctly, then praise one thing they got right. Keep the pace slow and the sentences short.",
      vocabularyIds: [
        "fr-daily-life-v1",
        "fr-daily-life-v2",
        "fr-daily-life-v3",
        "fr-daily-life-v4",
      ],
      phraseIds: ["fr-daily-life-p1", "fr-daily-life-p2", "fr-daily-life-p3"],
    },
  },

  /* ==================================================================== */
  /* Japanese — Unit 1: First Steps                                        */
  /* ==================================================================== */
  {
    id: "ja-greetings",
    unitId: "ja-unit-1",
    languageId: "japanese",
    order: 1,
    title: "Greetings & Introductions",
    description: "Say hello, say your name, and be polite.",
    estimatedMinutes: 5,
    xpReward: 10,
    artwork: { kind: "asset", name: "mascotWelcome" },
    vocabulary: [
      {
        id: "ja-greetings-v1",
        term: "こんにちは",
        translation: "hello / good afternoon",
        pronunciation: "kon-nee-chee-wah",
        partOfSpeech: "expression",
        example: {
          term: "こんにちは、たなかさん。",
          translation: "Hello, Mr. Tanaka.",
        },
        emoji: "👋",
      },
      {
        id: "ja-greetings-v2",
        term: "おはよう",
        translation: "good morning",
        pronunciation: "oh-hah-yoh",
        partOfSpeech: "expression",
        example: {
          term: "おはよう、おかあさん。",
          translation: "Good morning, mum.",
        },
        emoji: "🌅",
      },
      {
        id: "ja-greetings-v3",
        term: "わたしは〜です",
        translation: "I am ~",
        pronunciation: "wah-tah-shee wah ... dess",
        partOfSpeech: "expression",
        example: {
          term: "わたしはアナです。",
          translation: "I am Ana.",
        },
        emoji: "🙋",
      },
      {
        id: "ja-greetings-v4",
        term: "ありがとう",
        translation: "thank you",
        pronunciation: "ah-ree-gah-toh",
        partOfSpeech: "expression",
        example: {
          term: "ありがとう、アナさん。",
          translation: "Thank you, Ana.",
        },
        emoji: "🙏",
      },
    ],
    phrases: [
      {
        id: "ja-greetings-p1",
        text: "こんにちは、はじめまして。",
        translation: "Hello, nice to meet you.",
        pronunciation: "kon-nee-chee-wah hah-jee-meh-mah-shee-teh",
        usage: "The standard first meeting greeting.",
      },
      {
        id: "ja-greetings-p2",
        text: "わたしはアナです。",
        translation: "I am Ana.",
        pronunciation: "wah-tah-shee wah ah-nah dess",
        usage: "Introducing yourself — put your name before 'です'.",
      },
      {
        id: "ja-greetings-p3",
        text: "おげんきですか。",
        translation: "How are you?",
        pronunciation: "oh-gen-kee dess kah",
        usage: "Asking after someone you already know.",
      },
    ],
    goals: {
      summary: "Greet someone and introduce yourself in Japanese.",
      outcomes: [
        "Say hello at different times of day",
        "Introduce yourself with '〜です'",
        "Thank someone politely",
      ],
      vocabularyIds: [
        "ja-greetings-v1",
        "ja-greetings-v2",
        "ja-greetings-v3",
        "ja-greetings-v4",
      ],
      phraseIds: ["ja-greetings-p1", "ja-greetings-p2", "ja-greetings-p3"],
    },
    activities: [
      {
        id: "ja-greetings-a1",
        type: "multiple-choice",
        instruction: "What does ありがとう mean?",
        question: "ありがとう",
        options: ["hello", "thank you", "goodbye", "excuse me"],
        correctIndex: 1,
        explanation:
          "ありがとう (arigatou) is thank you. Add ございます (gozaimasu) to make it more formal.",
      },
      {
        id: "ja-greetings-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the greeting out loud",
        phraseId: "ja-greetings-p1",
        audioText: "こんにちは、はじめまして。",
        translation: "Hello, nice to meet you.",
        accuracy: "relaxed",
      },
      {
        id: "ja-greetings-a3",
        type: "speak-with-teacher",
        instruction: "Introduce yourself out loud",
        learnerTask:
          "Greet your teacher in Japanese and introduce yourself with わたしは〜です.",
        exampleAnswers: [
          "こんにちは。わたしはアナです。",
          "おはよう。わたしはルイスです。",
          "こんにちは、はじめまして。わたしはソフィアです。",
        ],
        vocabularyIds: ["ja-greetings-v1", "ja-greetings-v3"],
        phraseIds: ["ja-greetings-p1", "ja-greetings-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Hana, a kind Japanese teacher for absolute beginners. You explain everything in English and use Japanese only for the words being taught.",
      objective:
        "Get the learner to greet you and introduce themselves in Japanese using こんにちは and わたしは〜です.",
      conversationPlan: [
        "Introduce yourself in English as Hana and explain the plan.",
        "Say こんにちは slowly and have the learner repeat it twice.",
        "Teach おはよう and explain when it is used.",
        "Model わたしは〜です with your own name, then ask theirs.",
        "Have them say the whole introduction, then thank them with ありがとう.",
      ],
      openingLine:
        "Hi, I'm Hana — your Japanese teacher. Repeat after me: こんにちは (konnichiwa)!",
      closingLine:
        "よくできました! You can greet someone and introduce yourself in Japanese. またね — see you!",
      correctionStyle:
        "Japanese syllables are even in length — clap the rhythm slowly with them, then let them try again once.",
      vocabularyIds: [
        "ja-greetings-v1",
        "ja-greetings-v2",
        "ja-greetings-v3",
        "ja-greetings-v4",
      ],
      phraseIds: ["ja-greetings-p1", "ja-greetings-p2", "ja-greetings-p3"],
    },
  },
  {
    id: "ja-numbers-time",
    unitId: "ja-unit-1",
    languageId: "japanese",
    order: 2,
    title: "Numbers & Time",
    description: "Count to ten and ask what time it is.",
    estimatedMinutes: 5,
    xpReward: 10,
    artwork: placeholder("ja-numbers-time"),
    vocabulary: [
      {
        id: "ja-numbers-time-v1",
        term: "いち",
        translation: "one",
        pronunciation: "ee-chee",
        partOfSpeech: "noun",
        example: {
          term: "いち、に、さん。",
          translation: "One, two, three.",
        },
        emoji: "1️⃣",
      },
      {
        id: "ja-numbers-time-v2",
        term: "じゅう",
        translation: "ten",
        pronunciation: "joo",
        partOfSpeech: "noun",
        example: {
          term: "じゅうえん",
          translation: "ten yen",
        },
        emoji: "🔟",
      },
      {
        id: "ja-numbers-time-v3",
        term: "なんじですか",
        translation: "what time is it?",
        pronunciation: "nan-jee dess kah",
        partOfSpeech: "expression",
        example: {
          term: "すみません、なんじですか。",
          translation: "Excuse me, what time is it?",
        },
        emoji: "🕐",
      },
      {
        id: "ja-numbers-time-v4",
        term: "ごぜん",
        translation: "a.m. / morning",
        pronunciation: "go-zen",
        partOfSpeech: "noun",
        example: {
          term: "ごぜん くじ",
          translation: "nine in the morning",
        },
        emoji: "🌅",
      },
    ],
    phrases: [
      {
        id: "ja-numbers-time-p1",
        text: "いま、さんじです。",
        translation: "It's three o'clock now.",
        pronunciation: "ee-mah san-jee dess",
        usage: "Telling someone the time.",
      },
      {
        id: "ja-numbers-time-p2",
        text: "なんじですか。",
        translation: "What time is it?",
        pronunciation: "nan-jee dess kah",
        usage: "Asking for the time.",
      },
      {
        id: "ja-numbers-time-p3",
        text: "しちじにあいましょう。",
        translation: "Let's meet at seven.",
        pronunciation: "shee-chee-jee neh ah-ee-mah-shoh",
        usage: "Making a plan with someone.",
      },
    ],
    goals: {
      summary: "Count to ten and tell the time in Japanese.",
      outcomes: [
        "Count from one to ten",
        "Ask what time it is",
        "Say what time an event happens",
      ],
      vocabularyIds: [
        "ja-numbers-time-v1",
        "ja-numbers-time-v2",
        "ja-numbers-time-v3",
        "ja-numbers-time-v4",
      ],
      phraseIds: [
        "ja-numbers-time-p1",
        "ja-numbers-time-p2",
        "ja-numbers-time-p3",
      ],
    },
    activities: [
      {
        id: "ja-numbers-time-a1",
        type: "multiple-choice",
        instruction: "What does じゅう mean?",
        question: "じゅう",
        options: ["one", "five", "ten", "hundred"],
        correctIndex: 2,
        explanation:
          "じゅう (juu) is ten. Japanese numbers build predictably: じゅういち is eleven.",
      },
      {
        id: "ja-numbers-time-a2",
        type: "listen-and-repeat",
        instruction: "Listen and repeat the question out loud",
        phraseId: "ja-numbers-time-p2",
        audioText: "なんじですか。",
        translation: "What time is it?",
        accuracy: "normal",
      },
      {
        id: "ja-numbers-time-a3",
        type: "speak-with-teacher",
        instruction: "Count and tell the time out loud",
        learnerTask:
          "Count from one to ten for your teacher, then ask them what time it is.",
        exampleAnswers: [
          "いち、に、さん、し、ご、ろく、しち、はち、きゅう、じゅう。なんじですか。",
          "いち、に、さん。いま、さんじです。",
          "なんじですか。しちじにあいましょう。",
        ],
        vocabularyIds: ["ja-numbers-time-v1", "ja-numbers-time-v2"],
        phraseIds: ["ja-numbers-time-p1", "ja-numbers-time-p2"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Hana, a patient Japanese teacher. You explain in English and use Japanese only for numbers and time phrases.",
      objective:
        "Have the learner count to ten and ask and answer the time, then make a simple plan.",
      conversationPlan: [
        "Count いち、に、さん together and have the learner copy you.",
        "Continue to じゅう (ten).",
        "Teach なんじですか and answer with いま、さんじです.",
        "Ask the learner the time for a few different hours.",
        "Teach しちじにあいましょう and make a plan with them.",
      ],
      openingLine:
        "こんにちは! Let's count in Japanese: いち、に、さん — your turn, keep going to じゅう.",
      closingLine:
        "すばらしい! You can count and tell the time in Japanese. またね!",
      correctionStyle:
        "Keep the syllable rhythm even and steady, repeating the number they missed once before moving on.",
      vocabularyIds: [
        "ja-numbers-time-v1",
        "ja-numbers-time-v2",
        "ja-numbers-time-v3",
        "ja-numbers-time-v4",
      ],
      phraseIds: [
        "ja-numbers-time-p1",
        "ja-numbers-time-p2",
        "ja-numbers-time-p3",
      ],
    },
  },
  {
    id: "ja-cafe",
    unitId: "ja-unit-1",
    languageId: "japanese",
    order: 3,
    title: "At the Café",
    description: "Order a drink and ask for the bill.",
    estimatedMinutes: 6,
    xpReward: 15,
    artwork: placeholder("ja-cafe"),
    vocabulary: [
      {
        id: "ja-cafe-v1",
        term: "コーヒー",
        translation: "coffee",
        pronunciation: "koh-hee",
        partOfSpeech: "noun",
        example: {
          term: "コーヒーをください。",
          translation: "Coffee, please.",
        },
        emoji: "☕",
      },
      {
        id: "ja-cafe-v2",
        term: "みず",
        translation: "water",
        pronunciation: "mee-zoo",
        partOfSpeech: "noun",
        example: {
          term: "みずをください。",
          translation: "Water, please.",
        },
        emoji: "💧",
      },
      {
        id: "ja-cafe-v3",
        term: "おかんじょう",
        translation: "the bill",
        pronunciation: "oh-kan-joh",
        partOfSpeech: "noun",
        example: {
          term: "おかんじょうをください。",
          translation: "The bill, please.",
        },
        emoji: "🧾",
      },
      {
        id: "ja-cafe-v4",
        term: "おいしい",
        translation: "delicious",
        pronunciation: "oy-shee",
        partOfSpeech: "adjective",
        example: {
          term: "このコーヒーはおいしいです。",
          translation: "This coffee is delicious.",
        },
        emoji: "😋",
      },
    ],
    phrases: [
      {
        id: "ja-cafe-p1",
        text: "コーヒーをください。",
        translation: "Coffee, please.",
        pronunciation: "koh-hee oh koo-dah-sigh",
        usage: "Ordering anything in a café — swap in the item you want.",
      },
      {
        id: "ja-cafe-p2",
        text: "おかんじょうをください。",
        translation: "The bill, please.",
        pronunciation: "oh-kan-joh oh koo-dah-sigh",
        usage: "Asking to pay at the end of a meal.",
      },
      {
        id: "ja-cafe-p3",
        text: "これはおいしいです。",
        translation: "This is delicious.",
        pronunciation: "koh-reh wah oy-shee dess",
        usage: "Complimenting the food.",
      },
    ],
    goals: {
      summary: "Order at a café in Japanese and ask for the bill.",
      outcomes: [
        "Order a drink with をください",
        "Ask for the bill",
        "Say something tastes good",
      ],
      vocabularyIds: ["ja-cafe-v1", "ja-cafe-v2", "ja-cafe-v3", "ja-cafe-v4"],
      phraseIds: ["ja-cafe-p1", "ja-cafe-p2", "ja-cafe-p3"],
    },
    activities: [
      {
        id: "ja-cafe-a1",
        type: "multiple-choice",
        instruction: "What does みず mean?",
        question: "みず",
        options: ["coffee", "water", "tea", "the bill"],
        correctIndex: 1,
        explanation:
          "みず (mizu) is water — in Japan it is usually served free with a meal.",
      },
      {
        id: "ja-cafe-a2",
        type: "translate",
        instruction: "Build the sentence in Japanese",
        sourceText: "Coffee, please.",
        answerText: "コーヒーをください。",
        wordBank: [
          "コーヒー",
          "を",
          "ください。",
          "みず",
          "おかんじょう",
        ],
        explanation:
          "'をください' means 'please give me' — put the item you want right before it.",
      },
      {
        id: "ja-cafe-a3",
        type: "speak-with-teacher",
        instruction: "Order out loud",
        learnerTask:
          "Your teacher is the waiter. Order a coffee, say it's delicious, then ask for the bill.",
        exampleAnswers: [
          "コーヒーをください。これはおいしいです。おかんじょうをください。",
          "みずをください。おいしいです。",
          "コーヒーをください。おかんじょうをください。",
        ],
        vocabularyIds: ["ja-cafe-v1", "ja-cafe-v2", "ja-cafe-v3"],
        phraseIds: ["ja-cafe-p1", "ja-cafe-p2", "ja-cafe-p3"],
      },
    ],
    aiTeacher: {
      persona:
        "You are Hana, a Japanese teacher playing a café waiter in Tokyo. You explain in English and use Japanese only for the ordering phrases.",
      objective:
        "Run a short café role-play: the learner orders a drink, compliments it, and asks for the bill.",
      conversationPlan: [
        "Greet them as the waiter with いらっしゃいませ and translate it.",
        "Prompt them to order with コーヒーをください.",
        "Teach みず and ask if they want water too.",
        "Introduce おいしい and ask how the drink is.",
        "Teach おかんじょうをください so they can ask for the bill.",
      ],
      openingLine:
        "いらっしゃいませ! I'm your waiter — to order, say コーヒーをください (koohii o kudasai).",
      closingLine:
        "ありがとうございました! You ordered in Japanese — that's a real milestone. またどうぞ!",
      correctionStyle:
        "Reply in character with the corrected phrase, then let them repeat it once. Keep praises specific to what they said.",
      vocabularyIds: ["ja-cafe-v1", "ja-cafe-v2", "ja-cafe-v3", "ja-cafe-v4"],
      phraseIds: ["ja-cafe-p1", "ja-cafe-p2", "ja-cafe-p3"],
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Lessons of one unit, in teaching order. */
export function getLessonsForUnit(unitId: UnitId): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

/** Every lesson of one language, unit by unit. Empty when the language has no content yet. */
export function getLessonsForLanguage(languageId: LanguageId): Lesson[] {
  return lessons
    .filter((lesson) => lesson.languageId === languageId)
    .sort(
      (a, b) =>
        (unitOrder.get(a.unitId) ?? 0) - (unitOrder.get(b.unitId) ?? 0) ||
        a.order - b.order,
    );
}

/** Look up one lesson, or `undefined` if the id is unknown. */
export function getLessonById(id: LessonId): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

/**
 * Turn the vocabulary ids stored on goals and activities back into the items
 * themselves. Unknown ids are skipped, so a typo in the data degrades to a
 * shorter list instead of crashing a screen.
 */
export function resolveVocabulary(
  lesson: Lesson,
  ids: VocabularyId[],
): VocabularyItem[] {
  return ids
    .map((id) => lesson.vocabulary.find((item) => item.id === id))
    .filter((item): item is VocabularyItem => item !== undefined);
}

/** Phrase equivalent of `resolveVocabulary()`. */
export function resolvePhrases(lesson: Lesson, ids: PhraseId[]): Phrase[] {
  return ids
    .map((id) => lesson.phrases.find((phrase) => phrase.id === id))
    .filter((phrase): phrase is Phrase => phrase !== undefined);
}
