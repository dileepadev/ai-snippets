---
title: Turn text into spoken audio
provider: OpenAI
product: Audio API
description: The speech endpoint writing an audio file from a line of text.
model_types: [speech]
source: https://developers.openai.com/api/docs/api-reference/audio/createSpeech
verified: 2026-09-21
packages:
  python: openai==3.16.2
resources:
  - label: Text-to-speech guide
    url: https://developers.openai.com/api/docs/guides/text-to-speech
  - label: API reference
    url: https://developers.openai.com/api/reference
tags: [tts]
prerequisites: ["Install cURL and configure OPENAI_API_KEY.", "Choose an output directory you can write to."]
expected_output: "The first command saves speech.mp3; the second saves sample.wav."
caveat: "The custom voice example contains the placeholder voice_123abc. It requires a real voice ID available to your account."
---

```bash
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "The quick brown fox jumped over the lazy dog.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

Picking a custom voice and an output format, from
[the text-to-speech guide](https://developers.openai.com/api/docs/guides/text-to-speech):

```bash
curl https://api.openai.com/v1/audio/speech \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "voice": {
      "id": "voice_123abc"
    },
    "input": "Maple est le meilleur golden retriever du monde entier.",
    "language": "fr",
    "format": "wav"
  }' \
  --output sample.wav
```
