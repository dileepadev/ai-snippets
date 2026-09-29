export const categoryIcons: Record<string, string> = {
  'model-apis': 'chip', 'local-models': 'terminal', 'agent-sdks': 'agent', frameworks: 'layers',
  embeddings: 'nodes', vision: 'eye', speech: 'audio', 'image-video': 'image', protocols: 'plug',
};
export const categoryNames: Record<string, string> = {
  'local-models': 'Local models', 'image-video': 'Image & video',
};
export const providerColors: Record<string, string> = {
  OpenAI: 'green', Anthropic: 'orange', Google: 'blue', Ollama: 'neutral',
  LangChain: 'green', Vercel: 'neutral', 'Hugging Face': 'yellow', Groq: 'orange',
  'Mistral AI': 'orange', Cohere: 'green', ElevenLabs: 'neutral', LlamaIndex: 'purple',
};
export const collections = [
  { id: 'first-call', title: 'Make your first API call', icon: 'chip', description: 'Start with a prompt. Compare the request and response shapes across three providers.',
    steps: [
      { id: 'model-apis/openai-generate-text', why: 'Send a prompt with the Responses API and read the generated text.' },
      { id: 'model-apis/anthropic-create-message', why: 'See how Claude uses a messages array and typed content blocks.' },
      { id: 'model-apis/google-gemini-generate-text', why: 'Try the same task with the Google Gen AI SDK.' },
    ] },
  { id: 'local', title: 'Run a model locally', icon: 'terminal', description: 'Explore a local server, a direct model pipeline, and batched inference on your own hardware.',
    steps: [
      { id: 'local-models/ollama-chat', why: 'Start with a local model server and a familiar chat interface.' },
      { id: 'local-models/huggingface-transformers-pipeline', why: 'Load model weights directly into a Python pipeline.' },
      { id: 'local-models/vllm-offline-inference', why: 'Move to batched generation with a dedicated inference engine.' },
    ] },
  { id: 'agents', title: 'Give an agent a tool', icon: 'agent', description: 'Learn the pieces of tool use: a function, instructions, and an agent loop.',
    steps: [
      { id: 'agent-sdks/openai-agents-run-an-agent', why: 'Define a function tool and let the runner manage the interaction.' },
      { id: 'frameworks/langchain-create-agent', why: 'Explore the same pattern with a framework-level agent.' },
      { id: 'agent-sdks/google-adk-agent-with-tools', why: 'See how ADK registers tools and separates agent configuration from execution.' },
    ] },
  { id: 'search', title: 'Search your own documents', icon: 'search', description: 'Understand embeddings, then explore a small retrieval-augmented generation example.',
    steps: [
      { id: 'embeddings/openai-create-embeddings', why: 'Turn text into a numeric vector using a hosted API.' },
      { id: 'embeddings/sentence-transformers-encode', why: 'Compare with embedding generation using a local model.' },
      { id: 'frameworks/llamaindex-query-documents', why: 'Read documents, create an index, and ask a question about them.' },
    ] },
  { id: 'streaming', title: 'Stream a response', icon: 'audio', description: 'Make a chat interface feel responsive by consuming output as it arrives.',
    steps: [
      { id: 'model-apis/openai-streaming', why: 'Read typed streaming events from the Responses API.' },
      { id: 'model-apis/anthropic-streaming', why: 'Compare Claude’s streaming helpers and event handling.' },
      { id: 'local-models/ollama-streaming-chat', why: 'Apply the same interaction pattern to a local model.' },
    ] },
  { id: 'multimodal', title: 'Go beyond text', icon: 'image', description: 'Explore image understanding, audio input, and image generation as separate capabilities.',
    steps: [
      { id: 'vision/anthropic-image-input', why: 'Ask a model a question about an image.' },
      { id: 'speech/openai-transcribe-audio', why: 'Turn an audio file into a text transcript.' },
      { id: 'image-video/openai-generate-image', why: 'Create an image from a text prompt.' },
    ] },
];
