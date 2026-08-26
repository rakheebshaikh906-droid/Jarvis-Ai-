"""
Jarvis Wake Word Detector - "Hey Jarvis"
------------------------------------------
Run with:
    python wake_word.py

- Prints WAKE_DETECTED when it hears "Hey Jarvis"
- Prints live score only while there is actual sound (so you can SEE
  what happens the moment you speak, instead of guessing)
- Has a cooldown after detection so it doesn't fire repeatedly
"""

import os
import sys
import time
import numpy as np
import sounddevice as sd
from openwakeword.model import Model

SAMPLE_RATE = 16000
CHUNK_SIZE = 1280          # 80ms frames - required by openWakeWord
THRESHOLD = 0.5
COOLDOWN_SECONDS = 2.0     # ignore new detections for this long after one fires
SOUND_FLOOR = 800          # only print live score when mic picks up actual sound
DEVICE_INDEX = None        # set an integer here to force a specific mic if needed

print("RUNNING FILE:", os.path.abspath(__file__), flush=True)
print("PYTHON:", sys.executable, flush=True)
print("Loading wake word model...", flush=True)

model = Model(
    wakeword_models=["hey_jarvis_v0.1"],
    inference_framework="onnx",
)

WAKE_KEY = list(model.models.keys())[0]
print("Using prediction key:", WAKE_KEY, flush=True)
print("WAKE_WORD_READY", flush=True)
print("Listening for: Hey Jarvis...", flush=True)

_last_detect_time = [0.0]


def audio_callback(indata, frames, time_info, status):
    if status:
        print("AUDIO STATUS:", status, flush=True)

    audio = (indata[:, 0] * 32767).astype(np.int16)
    max_amp = int(np.abs(audio).max())

    prediction = model.predict(audio)
    score = prediction.get(WAKE_KEY, 0)

    # Show live score only when there's real sound - keeps terminal readable
    if max_amp > SOUND_FLOOR:
        print(f"[sound] max_amp={max_amp} score={score:.4f}", flush=True)

    now = time.time()
    if score > THRESHOLD and (now - _last_detect_time[0]) > COOLDOWN_SECONDS:
        _last_detect_time[0] = now
        print(f"WAKE_DETECTED SCORE={score:.3f}", flush=True)
        # ---- Hook point ----
        # Once this prints reliably, this is where Electron should be
        # notified (via stdout, which the Electron main process reads)
        # to trigger startElectronRecording().


stream = sd.InputStream(
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="float32",
    blocksize=CHUNK_SIZE,
    device=DEVICE_INDEX,
    callback=audio_callback,
)

with stream:
    print("DEVICE IN USE:", stream.device, flush=True)
    while True:
        sd.sleep(1000)