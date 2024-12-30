import { WordLangEnum } from './LangEnum';

export class StringUtils {
  static getTokens(langId: WordLangEnum, text: string): Array<string> {
    const natural = require('natural');
    text = text.toLowerCase();
    let tokenizer;

    // See https://naturalnode.github.io/natural/Tokenizers.html
    if (langId === WordLangEnum.es) {
      tokenizer = new natural.AggressiveTokenizerEs();
    } else if (langId === WordLangEnum.fr) {
      tokenizer = new natural.AggressiveTokenizerFr();
    } else if (langId === WordLangEnum.it) {
      tokenizer = new natural.AggressiveTokenizerIt();
    } else if (langId === WordLangEnum.pt) {
      tokenizer = new natural.AggressiveTokenizerPt();
    } else {
      tokenizer = new natural.WordTokenizer();
    }

    return tokenizer.tokenize(text.toLowerCase()) as Array<string>;
  }

  static getUpperFirstLetter(string: string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return string;
    }
  }

  static getLowerFirstLetter(string: string) {
    if (string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    } else {
      return string;
    }
  }
}
