// WakeWordListener.tsx
import { useEffect, useRef, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";
import { useToastStore } from "../stores/useToastStore";
import { useAppStore } from "../stores/appStore";

const useListenWakeupCmd = ({ onWake, enabled = true }: { onWake: () => void; enabled?: boolean }) => {
  const { addToast } = useToastStore();
  const recognizerRef = useRef<speechCommands.SpeechCommandRecognizer | null>(null);
  const isListeningRef = useRef(false);
  const shouldProcessRef = useRef(true);
  const awaitingModalCloseRef = useRef(false);
  const { isAIModalOpen } = useAppStore();

  // Stop listening safely
  const stopListening = useCallback(async () => {
    if (recognizerRef.current && isListeningRef.current) {
      try {
        console.log("Stopping wake word listener...");
        shouldProcessRef.current = false;
        if (recognizerRef.current.isListening()) {
          await recognizerRef.current.stopListening();
        }
      } catch (error) {
        console.error("Error stopping listener:", error);
      } finally {
        isListeningRef.current = false;
        console.log("Stopped listening for wake word");
      }
    }
  }, []);

  // Tear down everything: stop, release mic/audio, null recognizer
  const teardownRecognizer = useCallback(async () => {
    try {
      await stopListening();
    } finally {
      const anyRec = recognizerRef.current as any;
      try {
        // Best-effort: close underlying AudioContext if exposed
        if (anyRec?.audioContext && typeof anyRec.audioContext.close === "function") {
          await anyRec.audioContext.close();
        }
        // Best-effort: stop feature extractor if present
        if (typeof anyRec?.featureExtractor?.stop === "function") {
          await anyRec.featureExtractor.stop();
        }
      } catch (e) {
        // ignore
      }
      recognizerRef.current = null;
    }
  }, [stopListening]);

  // Initialize recognizer and load model
  const initRecognizer = useCallback(async () => {
    if (recognizerRef.current) return;
    await tf.ready();

    // Ask for mic permission once and immediately stop the stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());

    recognizerRef.current = speechCommands.create(
      "BROWSER_FFT",
      undefined,
      `${window.location.origin}/model/model.json`,
      `${window.location.origin}/model/metadata.json`
    );
    await recognizerRef.current.ensureModelLoaded();
  }, []);

  // Start listening (only when allowed)
  const startListening = useCallback(async () => {
    if (!enabled || isAIModalOpen) return;
    if (isListeningRef.current) return;

    try {
      shouldProcessRef.current = true;

      // Ensure recognizer is ready
      if (!recognizerRef.current) {
        await initRecognizer();
      }
      if (!recognizerRef.current) return;

      recognizerRef.current.listen(
        async (result) => {
          if (!shouldProcessRef.current) return;

          const scores = result.scores;
          const words = recognizerRef.current!.wordLabels();
          const wordIndex = words.indexOf("mek");

          if (wordIndex !== -1 && (scores[wordIndex] as number) > 0.9) {
            console.log("Wake word detected!");
            // Strictly stop from scratch BEFORE opening modal
            awaitingModalCloseRef.current = true;
            await teardownRecognizer(); // fully releases mic and recognizer
            onWake(); // parent will open the AI modal
          }
        },
        {
          overlapFactor: 0.5,
          probabilityThreshold: 0.75,
          includeSpectrogram: false,
        }
      );

      isListeningRef.current = true;
      console.log("Started listening for wake word");
    } catch (error) {
      console.error("Error starting listener:", error);
    }
  }, [enabled, isAIModalOpen, initRecognizer, teardownRecognizer, onWake]);

  // Initial mount: only listen if enabled and modal is closed
  useEffect(() => {
    if (!enabled) {
      teardownRecognizer();
      return;
    }
    if (!isAIModalOpen) {
      startListening();
    }
    return () => {
      teardownRecognizer();
    };
  }, [enabled, isAIModalOpen, startListening, teardownRecognizer, addToast]);

  // Modal open/close handling:
  // - When AI modal opens: tear everything down (no background mic)
  // - When AI modal closes: re-init and start listening (if enabled)
  useEffect(() => {
    if (isAIModalOpen) {
      awaitingModalCloseRef.current = true;
      teardownRecognizer();
    } else {
      if (enabled && awaitingModalCloseRef.current) {
        awaitingModalCloseRef.current = false;
        startListening();
      }
    }
  }, [isAIModalOpen, enabled, startListening, teardownRecognizer]);

  return { startListening, stopListening: teardownRecognizer };
};

export default useListenWakeupCmd;
