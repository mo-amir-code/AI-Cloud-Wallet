import { SECRETS } from "@/config/secrets";
import { colors } from "@/theme/colors";
import { ROUTES } from "@/utils/axios";
import { apiClient } from "@/utils/axios/apiClient";
import { useAppStore } from "@/zustand/appStore";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import EventSource, { EventSourceListener } from "react-native-sse";

const AIAssistant = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState("Initializing...");
  const { setToast } = useAppStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const isProcessingRef = useRef(false);

  const getAudioText = async (formData: FormData) => {
    const res = await fetch(SECRETS.API_BASE_URL + "/api/v1" + ROUTES.AI.ROOT, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    // console.log("DATA: ", data);
    return data.data.text.text;
  };

  const handleToProcessVoiceRequest = async (
    formData: FormData
  ): Promise<void> => {
    console.log("Handle to process request");
    if (eventSourceRef.current || isProcessingRef.current) {
      console.log("SSE already active, skipping new request...");
      return;
    }

    // console.log("FORM DATA: ", formData);

    isProcessingRef.current = true;
    setStatus("Processing...");
    const token = apiClient.getToken();
    const audioText = await getAudioText(formData);
    // console.log("AUDIO TEXT: ", audioText);

    setStatus(audioText);

    return new Promise((resolve, reject) => {
      token
        .then((authToken) => {
          // console.log("TOKEN: ", authToken);
          const source = new EventSource(
            SECRETS.API_BASE_URL + "/api/v1/ai?q=" + audioText,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + authToken,
                "x-mobile": "true",
              },
            }
          );

          eventSourceRef.current = source;

          // const openListener: EventSourceListener<any> = (event) => {
          //   console.log("SSE Event - open:", event);
          //   setStatus("Connected...");
          // };

          const closeListener: EventSourceListener<any> = (event) => {
            // console.log("SSE Event - close:", event);
            source.close();
            source.removeAllEventListeners();
            eventSourceRef.current = null;
            isProcessingRef.current = false;
            setStatus("Completed");
            // Resolve promise when connection closes
            resolve();
            // Optionally close modal after completion
            setTimeout(() => {
              onClose();
            }, 4000);
          };

          const messageListener: EventSourceListener<any> = (event) => {
            // console.log("SSE Event - message:", event);
            // console.log("SSE Message data:", event.data);
            setStatus(event.data);
          };

          source.addEventListener("message", messageListener);
          source.addEventListener("close", closeListener);
        })
        .catch((error) => {
          console.error("Token fetch error:", error);
          isProcessingRef.current = false;
          eventSourceRef.current = null;
          setStatus("Authentication error");
          setToast({
            title: "Authentication Error",
            content: "Failed to authenticate.",
            status: "error",
          });
          reject(error);
        });
    });
  };

  const startRecording = async () => {
    if (isProcessingRef.current) {
      console.log("Already processing, skipping recording start");
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setStatus("Permission denied");
        setToast({
          title: "Permission Denied",
          content: "Microphone permission is required.",
          status: "error",
        });
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setStatus("Listening...");
    } catch (err) {
      console.error("Recording error:", err);
      setStatus("Error starting recording");
      setToast({
        title: "Recording Error",
        content: "Failed to start recording.",
        status: "error",
      });
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        setStatus("Processing audio...");
        await recording
          .stopAndUnloadAsync()
          .catch((e) => console.log("Unload ERR"));
        const uri = recording.getURI();

        if (!uri) {
          setToast({
            title: "Voice Error",
            content: "Something error happened with your voice controller.",
            status: "error",
          });
          setStatus("Audio error");
          return;
        }

        // let audioBlob: Blob;

        // try {
        //   const response = await fetch(uri);
        //   audioBlob = await response.blob();
        //   console.log("Audio blob size:", audioBlob.size, "bytes");
        // } catch (error) {
        //   console.error("Error reading audio file:", error);
        //   setToast({
        //     title: "File Read Error",
        //     content: "Failed to read audio file.",
        //     status: "error",
        //   });
        //   setStatus("File read error");
        //   return;
        // }

        // const formData = new FormData();
        // formData.append("audio", audioBlob, "audio.wav");

        const formData = new FormData();
        formData.append("audio", {
          uri: uri,
          type: "audio/wav",
          name: "audio.wav",
        } as any);

        await handleToProcessVoiceRequest(formData);
      }
    } catch (err) {
      console.error("Stop error:", err);
      setStatus("Error stopping recording");
    } finally {
      setRecording(null);
    }
  };

  const cleanup = () => {
    if (eventSourceRef.current) {
      console.log("Closing active SSE connection...");
      eventSourceRef.current.close();
      eventSourceRef.current?.removeAllEventListeners();
      eventSourceRef.current = null;
    }
    isProcessingRef.current = false;
  };

  const handleStopAndClose = async () => {
    await stopRecording();
    cleanup();
    onClose();
  };

  const getStatusColor = () => {
    if (status.includes("Listening")) return colors.dark.accent;
    if (status.includes("Error") || status.includes("denied")) return "#FF5252";
    if (status.includes("Processing") || status.includes("Connected"))
      return "#FFA726";
    if (status.includes("Completed")) return "#66BB6A";
    return colors.dark.text;
  };

  useEffect(() => {
    if (visible) {
      startRecording();
    }

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }
      cleanup();
    };
  }, [visible]); // Only run when visibility changes

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      >
        <View
          className="rounded-3xl p-6 w-11/12 max-w-md items-center"
          style={{
            backgroundColor: colors.dark.secondary,
            borderColor: colors.dark.primary,
            borderWidth: 1,
          }}
        >
          <Text
            className="text-center text-2xl font-bold mb-3"
            style={{ color: colors.dark.text }}
          >
            🎙️ MekYu AI
          </Text>

          <Text
            className="text-center text-base mb-6"
            style={{ color: getStatusColor() }}
          >
            {status}
          </Text>

          {/* Modern mic glow circle */}
          {!isProcessingRef.current ? (
            <View
              className="h-24 w-24 rounded-full justify-center items-center mb-6"
              style={{
                backgroundColor: "rgba(0, 200, 83, 0.15)",
              }}
            >
              <View
                className={`h-16 w-16 rounded-full ${
                  status.includes("Listening") ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  shadowColor: status.includes("Listening")
                    ? "#00C853"
                    : "#FF5252",
                  shadowOpacity: status.includes("Listening") ? 0.8 : 0.4,
                  shadowRadius: 12,
                }}
              />
            </View>
          ) : (
            ""
          )}

          {!isProcessingRef.current ? (
            <TouchableOpacity
              onPress={handleStopAndClose}
              className="rounded-full px-6 py-3"
              style={{
                backgroundColor: colors.dark.accent,
              }}
              disabled={isProcessingRef.current && !recording}
            >
              <Text className="text-white text-lg font-semibold">
                {recording ? "Stop & Send" : "Close"}
              </Text>
            </TouchableOpacity>
          ) : (
            ""
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AIAssistant;
