import sys
import time
from faster_whisper import WhisperModel

print("WHISPER_LOADING", flush=True)

# Model sirf EK BAAR load hoga
model = WhisperModel(
    "base.en",
    device="cpu",
    compute_type="int8"
)

print("WHISPER_READY", flush=True)

initial_prompt = (
    "This is a Jarvis voice assistant. "
    "Commands include: Call Abbu, Call Ashu, Call mummy, "
    "open YouTube on my phone, open WhatsApp on my phone, "
    "open Instagram on my phone, open Camera on my phone, "
    "open Gallery on my phone."
)

# Electron se continuously audio paths receive karo
for line in sys.stdin:

    audio_path = line.strip()

    if not audio_path:
        continue

    try:

        print("--------------------------------", flush=True)
        print("START_TRANSCRIBE", flush=True)

        start = time.time()

        segments, info = model.transcribe(
            audio_path,
            beam_size=1,
            language="en",
            initial_prompt=initial_prompt,
            vad_filter=True
        )

        after_transcribe = time.time()

        print(
            f"TRANSCRIBE_TIME: {after_transcribe - start:.3f} sec",
            flush=True
        )

        text = " ".join(
            segment.text.strip()
            for segment in segments
        ).strip()

        after_join = time.time()

        print(
            f"JOIN_TIME: {after_join - after_transcribe:.3f} sec",
            flush=True
        )

        print(
            f"FINAL_TEXT: {text}",
            flush=True
        )

        print(
            "TRANSCRIPT:" + text,
            flush=True
        )

    except Exception as error:

        print(
            "ERROR:" + str(error),
            flush=True
        )