import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export type StatusType = "success" | "warning" | "error";

interface AlertModalProps {
  visible: boolean;
  status?: StatusType;
  heading: string;
  content: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const STATUS_COLORS: Record<StatusType, string> = {
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
};

const STATUS_ICONS: Record<StatusType, keyof typeof MaterialIcons.glyphMap> = {
  success: "check-circle",
  warning: "warning",
  error: "error",
};

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  status = "success",
  heading,
  content,
  onOk,
  onCancel,
}) => {
  const color = STATUS_COLORS[status];
  const iconName = STATUS_ICONS[status];

  // Animation
  const scale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 80,
      }).start();
    } else {
      scale.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.modalContainer, { transform: [{ scale }] }]}
        >
          {/* Close Button */}
          {onCancel && (
            <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
              <MaterialIcons name="close" size={24} color="#888" />
            </TouchableOpacity>
          )}

          {/* Icon */}
          <MaterialIcons
            name={iconName}
            size={60}
            color={color}
            style={{ marginBottom: 10 }}
          />

          {/* Heading */}
          <Text style={[styles.heading, { color }]}>{heading}</Text>

          {/* Content */}
          <Text style={styles.content}>{content}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { borderColor: color },
                ]}
                onPress={onCancel}
              >
                <Text style={[styles.buttonText, { color }]}>Cancel</Text>
              </TouchableOpacity>
            )}
            {onOk && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.okButton,
                  { backgroundColor: color },
                ]}
                onPress={onOk}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
  },
  okButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AlertModal;
