import { useEffect, useRef, useState, useCallback } from "react";
import { ROUTES } from "../../utils/axios";
import { SECRETS } from "../../config/secrets";
import { useToastStore } from "../../stores/useToastStore";

const AIAssistant = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  // Start/stop SpeechRecognition only while the modal is visible
  const recognitionRef = useRef<any>(null);
  const startedRef = useRef(false);
  const shouldRunRef = useRef(false);

  // New: transcript state and refs for latest values
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const finalRef = useRef("");
  const interimRef = useRef("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const phaseRef = useRef<"listen" | "process">("listen");

  // New: phase and status messages
  const [phase, setPhase] = useState<"listen" | "process">("listen");
  const [statusStep, setStatusStep] = useState(0);
  const DEFAULT_STATUS = "working on request...";
  const statusStepsRef = useRef<string[]>([DEFAULT_STATUS]);
  const statusTimerRef = useRef<any>(null);
  const clearStatusTimer = () => {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
  };
  const runStatusStepper = useCallback(() => {
    clearStatusTimer();
    setStatusStep(0);
    const tick = () => {
      setStatusStep((prev) => {
        const next = prev + 1;
        if (next < statusStepsRef.current.length) {
          statusTimerRef.current = setTimeout(tick, 900);
        }
        return next;
      });
    };
    statusTimerRef.current = setTimeout(tick, 900);
  }, []);
  const { addToast } = useToastStore();

  // New: track if the user has spoken in this session
  const hasSpokenRef = useRef(false);

  // New: inactivity timer for silence detection
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };
  const scheduleSilenceTimer = useCallback((fn: () => void, ms: number) => {
    clearSilenceTimer();
    silenceTimeoutRef.current = setTimeout(fn, ms);
  }, []);

  // New: no-speech timer (user said nothing since start)
  const noSpeechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearNoSpeechTimer = () => {
    if (noSpeechTimeoutRef.current) {
      clearTimeout(noSpeechTimeoutRef.current);
      noSpeechTimeoutRef.current = null;
    }
  };
  const scheduleNoSpeechTimer = useCallback(() => {
    // Do not schedule if already submitting or not in listen phase
    if (isSubmittingRef.current || phaseRef.current !== "listen") return;
    clearNoSpeechTimer();
    noSpeechTimeoutRef.current = setTimeout(() => {
      if (
        !hasSpokenRef.current &&
        recognitionRef.current &&
        startedRef.current &&
        !isSubmittingRef.current
      ) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    }, 3000);
  }, []);

  // New: dummy server request method
  const eventSourceRef = useRef<EventSource | null>(null);
  const sendCommandRequest = useCallback(async (text: string) => {
    // Prevent duplicate submissions
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      // client-simple.ts
      const url =
        SECRETS.API_BASE_URL +
        "/api/v1" +
        ROUTES.AI.ROOT +
        "?q=" +
        encodeURIComponent(text);

      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      const messageListener = (ev: MessageEvent) => {
        console.log("message event:", ev.data);
        try {
          const payload = JSON.parse(ev.data);
          const msg =
            payload?.message ??
            payload?.status ??
            (typeof payload === "string" ? payload : JSON.stringify(payload));
          if (msg) {
            statusStepsRef.current.push(msg);
            setStatusStep(statusStepsRef.current.length);
          }
        } catch {
          statusStepsRef.current.push(ev.data);
          setStatusStep(statusStepsRef.current.length);
        }
      };

      const closeListener = (ev: MessageEvent) => {
        try {
          const payload = JSON.parse(ev.data);
          const msg =
            payload?.message ??
            payload?.status ??
            (typeof payload === "string" ? payload : JSON.stringify(payload));
          if (msg) {
            statusStepsRef.current.push(msg);
            setStatusStep(statusStepsRef.current.length);
          }
        } catch {
          // ignore parse error
        }
        // Clean up EventSource
        if (eventSourceRef.current) {
          try {
            eventSourceRef.current.close();
          } catch {}
          eventSourceRef.current = null;
        }
        // Show success and close modal
        addToast("Transaction completed successfully.", "success");
        // Use setTimeout to prevent race condition
        setTimeout(() => {
          closeAndCleanup();
        }, 500);
      };

      const errorListener = () => {
        // Clean up EventSource
        if (eventSourceRef.current) {
          try {
            eventSourceRef.current.close();
          } catch {}
          eventSourceRef.current = null;
        }
        addToast("Transaction failed.", "error");
        // Use setTimeout to prevent race condition
        setTimeout(() => {
          closeAndCleanup();
        }, 500);
      };

      es.addEventListener("message", messageListener);
      es.addEventListener("close", closeListener);
      es.addEventListener("error", errorListener);

      es.onerror = () => {
        // Only cleanup EventSource, don't close modal automatically
        if (eventSourceRef.current) {
          try {
            eventSourceRef.current.close();
          } catch {}
          eventSourceRef.current = null;
        }
        addToast("Connection error occurred.", "error");
        // Reset submission state but don't close modal
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        setPhase("listen");
        phaseRef.current = "listen";
      };
    } catch (error) {
      // Handle any synchronous errors
      if (eventSourceRef.current) {
        try {
          eventSourceRef.current.close();
        } catch {}
        eventSourceRef.current = null;
      }
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setPhase("listen");
      phaseRef.current = "listen";
      addToast("Failed to send command.", "error");
    }
  }, [addToast]);

  // New: unified stop for recognition
  const stopRecognition = useCallback(() => {
    shouldRunRef.current = false;
    clearSilenceTimer();
    clearNoSpeechTimer();
    const rec = recognitionRef.current;
    if (startedRef.current && rec) {
      try {
        rec.stop();
      } catch {
        // ignore
      } finally {
        startedRef.current = false;
      }
    }
  }, []);

  // Updated: handle submit -> stop listening, switch UI, show status, then request
  const handleSubmit = useCallback(async () => {
    const text = `${finalRef.current} ${interimRef.current}`.trim();
    // Prevent submission if already submitting or no text
    if (!text || isSubmittingRef.current) return;

    // Immediately stop recognition BEFORE changing phase
    stopRecognition();

    // Switch to processing UI
    setPhase("process");
    phaseRef.current = "process";
    statusStepsRef.current = [DEFAULT_STATUS];
    setStatusStep(0);

    await sendCommandRequest(text);
  }, [sendCommandRequest, stopRecognition]);

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      console.warn("Web Speech API is not supported in this browser.");
      return;
    }

    // Initialize lazily
    if (!recognitionRef.current) {
      const rec = new SpeechRecognitionCtor();
      rec.lang = "en-US";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        // Stop processing if submitting or not in listen phase
        if (isSubmittingRef.current || phaseRef.current !== "listen") return;

        // User has spoken at least once in this session
        hasSpokenRef.current = true;
        clearNoSpeechTimer();

        let newFinal = "";
        let newInterim = "";

        // Build final and interim transcripts
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            newFinal += res[0]?.transcript ?? "";
          } else {
            newInterim += res[0]?.transcript ?? "";
          }
        }

        if (newFinal) {
          setFinalTranscript((prev) => {
            const updated = `${prev} ${newFinal}`.trim();
            finalRef.current = updated;
            return updated;
          });
        }
        // Always update interim for live preview
        setInterimTranscript(newInterim.trim());
        interimRef.current = newInterim.trim();

        // After any speech, schedule 3s silence to submit
        const hasAnyText =
          (newFinal + newInterim).trim().length > 0 ||
          finalRef.current.length > 0;
        if (
          hasAnyText &&
          !isSubmittingRef.current &&
          phaseRef.current === "listen"
        ) {
          scheduleSilenceTimer(() => {
            // Double-check before submitting
            if (!isSubmittingRef.current && phaseRef.current === "listen") {
              handleSubmit();
            }
          }, 3000);
        }
      };

      rec.onend = () => {
        // If we still want to run (modal visible), restart to keep continuous listening alive
        startedRef.current = false;
        // Only restart if not submitting and still in listen phase
        if (
          shouldRunRef.current &&
          !isSubmittingRef.current &&
          phaseRef.current === "listen"
        ) {
          try {
            rec.start();
            startedRef.current = true;
            // If restarted and user hasn't spoken yet, start the no-speech window again
            if (!hasSpokenRef.current) scheduleNoSpeechTimer();
          } catch {
            // ignore
          }
        }
      };

      recognitionRef.current = rec;
    }

    const rec = recognitionRef.current;

    if (visible) {
      // Reset phase when modal opens
      setPhase("listen");
      phaseRef.current = "listen";
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      
      // Turn on
      shouldRunRef.current = true;
      // Only start if not already submitting and in listen phase
      if (
        !startedRef.current &&
        !isSubmittingRef.current &&
        phaseRef.current === "listen"
      ) {
        try {
          // Reset session state
          setFinalTranscript("");
          setInterimTranscript("");
          finalRef.current = "";
          interimRef.current = "";
          hasSpokenRef.current = false;
          clearSilenceTimer();
          clearNoSpeechTimer();

          rec.start();
          startedRef.current = true;
          if (!isSubmittingRef.current) scheduleNoSpeechTimer();
        } catch {
          // ignore
        }
      }
    } else {
      // Turn off
      shouldRunRef.current = false;
      clearSilenceTimer();
      clearNoSpeechTimer();
      if (startedRef.current) {
        try {
          rec.stop();
        } catch {
          // ignore
        } finally {
          startedRef.current = false;
        }
      }
    }

    // Cleanup on unmount
    return () => {
      shouldRunRef.current = false;
      clearSilenceTimer();
      clearNoSpeechTimer();
      clearStatusTimer();
      if (eventSourceRef.current) {
        try {
          eventSourceRef.current.close();
        } catch {}
        eventSourceRef.current = null;
      }
      if (startedRef.current) {
        try {
          recognitionRef.current?.stop();
        } catch {
          // ignore
        } finally {
          startedRef.current = false;
        }
      }
    };
  }, [visible, handleSubmit, scheduleSilenceTimer, scheduleNoSpeechTimer]);

  const closeAndCleanup = useCallback(() => {
    // Close SSE if active
    if (eventSourceRef.current) {
      try {
        eventSourceRef.current.close();
      } catch {}
      eventSourceRef.current = null;
    }

    // Stop voice recognition and timers
    stopRecognition();
    clearSilenceTimer();
    clearNoSpeechTimer();
    clearStatusTimer();

    // Reset UI/session state
    setIsSubmitting(false);
    isSubmittingRef.current = false;
    setFinalTranscript("");
    setInterimTranscript("");
    finalRef.current = "";
    interimRef.current = "";
    hasSpokenRef.current = false;
    statusStepsRef.current = [DEFAULT_STATUS];
    setStatusStep(0);
    setPhase("listen");
    phaseRef.current = "listen";

    // Close modal
    onClose();
  }, [stopRecognition, onClose]);

  // Prevent user-initiated close during processing
  const handleUserClose = useCallback(() => {
    if (phase === "process" || isSubmitting) return; // disallow close
    closeAndCleanup();
  }, [phase, isSubmitting, closeAndCleanup]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card-dark/80 backdrop-blur-xl rounded-xl border border-border shadow-2xl">
        {/* Close button */}
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            onClick={handleUserClose}
            disabled={phase === "process" || isSubmitting}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        {phase === "listen" ? (
          <div className="flex flex-col items-stretch px-8 pb-8 gap-4">
            {/* Header */}
            <div className="flex items-center gap-3 self-center">
              <span className="material-symbols-outlined text-primary text-3xl">
                mic
              </span>
              <h1 className="text-text-primary tracking-tight text-[28px] font-bold leading-tight text-center font-display">
                MEK is listening...
              </h1>
            </div>
            <p className="text-text-secondary text-sm leading-normal px-4 text-center font-display self-center">
              Speak your command now. It will auto-send after 3 seconds of
              silence.
            </p>

            {/* Transcript Panel */}
            <div className="rounded-lg border border-border/60 bg-background/40 p-4 min-h-[96px]">
              <div className="text-text-primary whitespace-pre-wrap">
                {finalTranscript}
                {interimTranscript && (
                  <span className="opacity-70"> {interimTranscript}</span>
                )}
              </div>
              {!finalTranscript && !interimTranscript && (
                <div className="text-text-secondary text-sm">
                  Waiting for your voice...
                </div>
              )}
            </div>

            {/* Waveform Animation */}
            <div className="flex w-full grow items-center justify-center h-28">
              <div className="flex w-full max-w-xs h-16 items-end justify-center gap-1.5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar w-2 h-full bg-primary rounded-full"
                    style={{
                      animationDelay: `${-1.2 + i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full px-1 pt-2 pb-1 gap-3">
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || (!finalTranscript && !interimTranscript)
                }
                className="flex-1 h-12 rounded-lg bg-primary text-background-dark font-bold tracking-[0.015em] font-display transition-transform hover:scale-105 active:scale-100 disabled:opacity-60 disabled:hover:scale-100"
              >
                {isSubmitting ? "Sending..." : "Send Command"}
              </button>
              <button
                onClick={() => {
                  setFinalTranscript("");
                  setInterimTranscript("");
                  finalRef.current = "";
                  interimRef.current = "";
                  clearSilenceTimer();
                }}
                className="h-12 px-4 rounded-lg border border-border text-text-primary hover:bg-background/30 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          // Processing UI
          <div className="flex flex-col items-stretch px-8 pb-8 gap-4">
            <div className="flex items-center gap-3 self-center">
              <span className="material-symbols-outlined text-primary text-3xl animate-spin">
                progress_activity
              </span>
              <h1 className="text-text-primary tracking-tight text-[28px] font-bold leading-tight text-center font-display">
                Processing your request…
              </h1>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/40 p-4">
              <ul className="space-y-2">
                {statusStepsRef.current.map((label, idx) => {
                  const done = idx < statusStep;
                  const active = idx === statusStep;
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      {done ? (
                        <span className="material-symbols-outlined text-green-500">
                          check_circle
                        </span>
                      ) : active ? (
                        <span className="material-symbols-outlined text-primary animate-spin">
                          progress_activity
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-text-secondary">
                          radio_button_unchecked
                        </span>
                      )}
                      <span
                        className={
                          done
                            ? "text-text-primary"
                            : active
                            ? "text-text-primary"
                            : "text-text-secondary"
                        }
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex w-full px-1 pt-2 pb-1 gap-3">
              <button
                onClick={handleUserClose}
                disabled // disallow closing while processing
                className="flex-1 h-12 rounded-lg bg-primary text-background-dark font-bold tracking-[0.015em] font-display transition-transform disabled:opacity-50 disabled:pointer-events-none"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Waveform styles remain for listening UI */}
      <style>
        {`
          .waveform-bar { animation: pulse 1.5s infinite ease-in-out; transform-origin: bottom; }
          @keyframes pulse { 0%, 100% { transform: scaleY(0.2); } 50% { transform: scaleY(1); } }
        `}
      </style>
    </div>
  );
};

export default AIAssistant;
