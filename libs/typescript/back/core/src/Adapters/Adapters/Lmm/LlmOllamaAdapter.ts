interface OllamaResponse {
  // Define the structure based on Ollama API response
  data: any;
}

class LlmOllamaAdapter implements LlmPort {
  private baseURL: string;
  private defaultModel: string;

  constructor(
    baseURL: string = 'http://localhost:11434',
    defaultModel: string
  ) {
    this.baseURL = baseURL;
    this.defaultModel = defaultModel;
  }

  /**
   * Sends a prompt to the Ollama API and retrieves the response.
   * @param prompt The text prompt to send to the API.
   * @returns The response from Ollama.
   */
  public async askToGetJson(params: {
    prompt: string;
    format?: unknown;
    model?: string;
  }): Promise<{ data: unknown }> {
    // https://ollama.com/blog/structured-outputs

    try {
      const model = params.model || this.defaultModel;
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model,
          format: {
            type: 'object',
            properties: {
              age: {
                type: 'integer',
              },
              available: {
                type: 'boolean',
              },
            },
            required: ['age', 'available'],
          },
          stream: false, // Set to true for response streaming
          options: {
            temperature: 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      throw new Error(`Ollama API error: ${error}`);
    }
  }

  /**
   * Checks the health/status of the Ollama service.
   * @returns The health status of Ollama.
   */
  public async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default LlmOllamaAdapter;
