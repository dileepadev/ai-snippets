---
title: Transcribe an audio file
provider: OpenAI
product: Audio API
description: Posting an audio file to the transcriptions endpoint and reading the text back.
model_types: [speech]
source: https://developers.openai.com/api/docs/guides/speech-to-text
verified: 2026-09-21
packages:
  python: openai==3.16.2
  typescript: openai@7.20.0
resources:
  - label: Speech-to-text guide
    url: https://developers.openai.com/api/docs/guides/speech-to-text
  - label: API reference
    url: https://developers.openai.com/api/reference
  - label: Python SDK
    url: https://github.com/openai/openai-python
  - label: Whisper
    url: https://github.com/openai/whisper
tags: [transcription]
prerequisites: ["Install the OpenAI SDK or use cURL and configure OPENAI_API_KEY.", "Replace the sample audio path with a file on your machine."]
expected_output: "A text transcript of the audio file."
caveat: "The referenced audio file is not included with this snippet."
---

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("audio.wav", "rb")

transcription = client.audio.transcriptions.create(
    model="gpt-transcribe", file=audio_file
)

print(transcription.text)
```

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("fixtures/audio.wav"),
  model: "gpt-transcribe",
});

console.log(transcription.text);
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	file, err := os.Open("fixtures/audio.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	transcription, err := client.Audio.Transcriptions.New(context.Background(), openai.AudioTranscriptionNewParams{
		File:  file,
		Model: "gpt-transcribe",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(transcription.Text)
}
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/audio.mp3 \
  --form model=gpt-transcribe
```
