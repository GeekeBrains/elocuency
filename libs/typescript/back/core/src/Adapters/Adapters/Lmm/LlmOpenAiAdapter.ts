import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* import OpenAi from 'openai';

@Injectable()
export class AiApi {
  private openAi: OpenAi;

  constructor(private config: ConfigService) {
    this.openAi = new OpenAi(this.config.get('OPENAI_API_KEY'));
  }

  async getAnswer(question: string) {
    const result = await this.openAi.chat.completions.create({
      messages: [
        // { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: question },
        // {
        //   role: 'assistant',
        //   content: 'The Los Angeles Dodgers won the World Series in 2020.',
        // },
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 150,
      temperature: 0.9,
    });
    console.log(
      'ºº ~ file: open-ai.api.ts:30 ~ AiApi ~ getAnswer ~ result.choices[0].message.content:',
      result.choices[0].message.content
    );

    return result.choices[0].message.content;
  }
}
*/
