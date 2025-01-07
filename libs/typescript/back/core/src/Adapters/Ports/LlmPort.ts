interface LlmPort {
  /**
   * Sends a prompt to the Ollama API and retrieves the response.
   * @param params Object containing the prompt and optional parameters.
   * @returns The response from Ollama.
   */
  askToGetJson(params: {
    prompt: string;
    format?: unknown;
    model?: string;
  }): Promise<{ data: unknown }>;

  /**
   * Checks the health/status of the Ollama service.
   * @returns The health status of Ollama.
   */
  checkHealth(): Promise<boolean>;
}
