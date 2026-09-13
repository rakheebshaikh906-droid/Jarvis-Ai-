import os
import sys
import time
import numpy as np
import sounddevice as sd
import openwakeword
from openwakeword.model import Model
 
SAMPLE_RATE = 16000
CHUNK_SIZE = 1280
THRESHOLD = 0.4
COOLDOWN_SECONDS = 2.0
SOUND_FLOOR = 800
DEVICE_INDEX = 1  # locked to "Microphone Array (Intel Smart..." which worked for you
 
print("Ensuring wake word models are downloaded...", flush=True)
openwakeword.utils.download_models()
 
print("Loading wake word model...", flush=True)
model = Model(
    wakeword_models=["hey_jarvis_v0.1"],
    inference_framework="onnx",
)
 
WAKE_KEY = list(model.models.keys())[0]
print("WAKE_WORD_READY", flush=True)
 
_last_detect_time = [0.0]
 
 
def audio_callback(indata, frames, time_info, status):
    audio = (indata[:, 0] * 32767).astype(np.int16)
    max_amp = int(np.abs(audio).max())
 
    prediction = model.predict(audio)
    score = prediction.get(WAKE_KEY, 0)
 
    if max_amp > SOUND_FLOOR:
        print(f"[sound] max_amp={max_amp} score={score:.4f}", flush=True)
 
    now = time.time()
    if score > THRESHOLD and (now - _last_detect_time[0]) > COOLDOWN_SECONDS:
        _last_detect_time[0] = now
        print(f"WAKE_DETECTED SCORE={score:.3f}", flush=True)
 
 
stream = sd.InputStream(
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="float32",
    blocksize=CHUNK_SIZE,
    device=DEVICE_INDEX,
    callback=audio_callback,
)
 
with stream:
    while True:
        sd.sleep(1000)