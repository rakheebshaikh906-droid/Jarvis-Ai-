# import sounddevice as sd

# print("AVAILABLE DEVICES:")
# print(sd.query_devices())

# print("\nDEFAULT INPUT:")
# print(sd.query_devices(kind="input"))

# print("\nStarting microphone test...")

# def callback(indata, frames, time, status):
#     print("MIC AUDIO RECEIVED", flush=True)

# with sd.InputStream(
#     samplerate=16000,
#     channels=1,
#     dtype="float32",
#     blocksize=1280,
#     callback=callback
# ):
#     print("MIC TEST RUNNING... Speak now.")
#     input()