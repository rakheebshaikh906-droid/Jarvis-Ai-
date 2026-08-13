import openwakeword
from openwakeword.model import Model
from openwakeword import utils
import sounddevice as sd
import numpy as np

print("Loading wake word model...", flush=True)

# Ensure the melspectrogram + embedding preprocessing models exist in ONNX form.
# (Safe to call every run — it's a no-op if already downloaded.)
utils.download_models(model_names=["melspectrogram", "embedding"])

model = Model(
    wakeword_models=["hey_jarvis_v0.1"],
    inference_framework="onnx"   # <-- forces the whole pipeline to ONNX, not just the wakeword model
)

print("WAKE WORD READY", flush=True)
print("Listening for: Hey Jarvis...", flush=True)

SAMPLE_RATE = 16000
CHUNK_SIZE = 1280  # 80ms @ 16kHz — correct, do not change

# Resolve the actual prediction key dynamically instead of hardcoding it,
# in case the loaded model's key differs from the filename string.
WAKE_KEY = list(model.models.keys())[0]
print(f"Using prediction key: {WAKE_KEY}", flush=True)

def audio_callback(indata, frames, time, status):
    if status:
        print("AUDIO:", status, flush=True)

    audio = (indata[:, 0] * 32767).astype(np.int16)

    max_amp = np.abs(audio).max()   # temporary debug
    

    prediction = model.predict(audio)
    score = prediction.get(WAKE_KEY, 0)

   
    if score > 0.5:
        print("WAKE_DETECTED", flush=True)

with sd.InputStream(
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="float32",
    blocksize=CHUNK_SIZE,
    callback=audio_callback
):
    while True:
        sd.sleep(1000)