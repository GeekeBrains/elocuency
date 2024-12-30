import { LangsSpeechVoiceType, WordLangEnum } from '../Components';

// Si SpeechRecognition no está disponible en el contexto global, usa webkitSpeechRecognition
export interface SpeechRecognitionI extends EventTarget {
  // Event handlers
  onaudiostart: ((this: SpeechRecognitionI, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognitionI, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognitionI, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognitionI, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognitionI, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognitionI, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognitionI, ev: SpeechRecognitionEvent) => any)
    | null;
  onnomatch:
    | ((this: SpeechRecognitionI, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognitionI, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onstart: ((this: SpeechRecognitionI, ev: Event) => any) | null;
  onend: ((this: SpeechRecognitionI, ev: Event) => any) | null;

  // Methods
  abort(): void;
  start(): void;
  stop(): void;

  // Properties
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly confidence: number;
  readonly transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

// Declarar SpeechRecognition en el objeto global
export declare const SpeechRecognition: {
  prototype: SpeechRecognitionI;
  new (): SpeechRecognitionI;
};

// Para compatibilidad con webkitSpeechRecognition
export declare const webkitSpeechRecognition: {
  prototype: SpeechRecognitionI;
  new (): SpeechRecognitionI;
};

export function getSpeechVoice(
  langId: WordLangEnum,
  langsSpeechVoice: LangsSpeechVoiceType
) {
  const voiceName = langsSpeechVoice[langId].voiceName;
  const voices = global.speechSynthesis.getVoices();
  let voice = voices.find((v) => v.name === voiceName);
  if (!voice) {
    return null;
  }
  return voice;
}
