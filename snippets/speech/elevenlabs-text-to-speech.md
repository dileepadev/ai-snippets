---
title: Generate speech from text
provider: ElevenLabs
product: Text to Speech API
description: Converting a line of text with a named voice, then playing it.
model_types: [speech]
source: https://elevenlabs.io/docs/eleven-api
verified: 2026-09-21
packages:
  python: elevenlabs==2.68.0
  typescript: "@elevenlabs/elevenlabs-js@2.68.0"
resources:
  - label: API reference
    url: https://elevenlabs.io/docs/api-reference
  - label: Quickstart
    url: https://elevenlabs.io/docs/eleven-api/quickstart
  - label: Python SDK
    url: https://github.com/elevenlabs/elevenlabs-python
  - label: JavaScript SDK
    url: https://github.com/elevenlabs/elevenlabs-js
tags: [tts]
prerequisites: ["Install the ElevenLabs SDK and the dotenv package used by your example.", "Configure ELEVENLABS_API_KEY and access to the chosen voice.", "Follow the SDK playback setup for your operating system."]
expected_output: "Generated speech is played locally, or exposed as audio byte chunks."
caveat: "The standalone conversion and streaming examples use different model IDs. Check model and voice access for your account."
---

```python
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

audio = elevenlabs.text_to_speech.convert(
    text="The first move is what sets everything in motion.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",  # "George" - browse voices at elevenlabs.io/app/voice-library
    model_id="eleven_v3",
    output_format="mp3_44100_128",
)

play(audio)
```

```typescript
import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

const elevenlabs = new ElevenLabsClient();
const audio = await elevenlabs.textToSpeech.convert(
	"JBFqnCBsd6RMkjVDRZzb", // "George" - browse voices at elevenlabs.io/app/voice-library
	{
		text: "The first move is what sets everything in motion.",
		modelId: "eleven_v3",
		outputFormat: "mp3_44100_128",
	},
);

await play(audio);
```

Streaming the audio instead, from
[the streaming reference](https://elevenlabs.io/docs/api-reference/streaming):

```python
from elevenlabs import stream
from elevenlabs.client import ElevenLabs

elevenlabs = ElevenLabs()

audio_stream = elevenlabs.text_to_speech.stream(
    text="This is a test",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2"
)

# option 1: play the streamed audio locally
stream(audio_stream)

# option 2: process the audio bytes manually
for chunk in audio_stream:
    if isinstance(chunk, bytes):
        print(chunk)
```
