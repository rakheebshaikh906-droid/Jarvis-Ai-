import sounddevice as sd
import numpy as np
from openwakeword.model import Model

from wake_word import audio_callback

model = Model(
    wakeword_models=["hey_jarvis_v0.1"],
    inference_framework="onnx"
)

WAKE_KEY = "hey_jarvis_v0.1"

print("MODEL READY", flush=True)
print("SPEAK: Hey Jarvis", flush=True)


def callback(indata, frames, time, status):

    if status:
        print("AUDIO:", status, flush=True)

    audio = (
        indata[:, 0] * 32767
    ).astype(np.int16)

    prediction = model.predict(audio)

    score = prediction.get(WAKE_KEY, 0)

    if score > 0.5:
        print(
            f"WAKE_DETECTED SCORE={score:.3f}",
            flush=True
        )


stream = sd.InputStream(
    samplerate=16000,
    channels=1,
    dtype="float32",
    blocksize=1280,
    callback=audio_callback
)

print("DEVICE:", stream.device, flush=True)

stream.start()

while True:
    sd.sleep(1000)