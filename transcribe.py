import sys
from faster_whisper import WhisperModel

# Audio file path Electron se milega
if len(sys.argv) < 2:
    print("ERROR: Audio file path missing")
    sys.exit(1)

audio_path = sys.argv[1]

# Lightweight English model for voice commands
model = WhisperModel(
    "base.en",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    audio_path,
    beam_size=5,
    language="en",
    initial_prompt=(
        "This is a Jarvis voice assistant. "
        "Commands include: Call Abbu, Call Ashu, Call Sahil, "
        "open YouTube on my phone, open WhatsApp on my phone, "
        "open Instagram on my phone, open Camera on my phone, "
        "open Gallery on my phone."
    )
)

text = " ".join(
    segment.text.strip()
    for segment in segments
).strip()

# Electron isi output ko transcript ke roop me read karega
print(text)