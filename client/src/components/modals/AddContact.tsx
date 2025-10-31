import React, { useState } from "react";

interface AddContactModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  contactId?: string;
  onSave?: (contactData: { name: string; address: string; id: string }) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  setVisible,
  contactId,
  onSave,
}) => {
  const [contactName, setContactName] = useState("");
  const [solanaAddress, setSolanaAddress] = useState("");
  const [errors, setErrors] = useState({ name: "", address: "" });

  const validateSolanaAddress = (address: string): boolean => {
    // Basic Solana address validation (base58, 32-44 characters)
    const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaRegex.test(address) || address.endsWith(".sol");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSolanaAddress(text.trim());
      setErrors((prev) => ({ ...prev, address: "" }));
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleSave = () => {
    let hasError = false;
    const newErrors = { name: "", address: "" };

    if (!contactName.trim()) {
      newErrors.name = "Contact name is required";
      hasError = true;
    }

    if (!solanaAddress.trim()) {
      newErrors.address = "Solana address is required";
      hasError = true;
    } else if (!validateSolanaAddress(solanaAddress.trim())) {
      newErrors.address = "Invalid Solana address format";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      const contactData = {
        name: contactName.trim(),
        address: solanaAddress.trim(),
        id: contactId || `contact_${Date.now()}`,
      };

      if (onSave) {
        onSave(contactData);
      }

      // Reset form and close modal
      setContactName("");
      setSolanaAddress("");
      setErrors({ name: "", address: "" });
      setVisible(false);
    }
  };

  const handleClose = () => {
    setContactName("");
    setSolanaAddress("");
    setErrors({ name: "", address: "" });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md flex flex-col bg-background-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-primary/10 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glossy Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-50"></div>

        <div className="relative z-10 flex flex-col p-6 sm:p-8">
          {/* Close Button */}
          <div className="flex justify-end absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="p-2 text-white/70 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-white tracking-light text-3xl font-bold leading-tight">
              Add New Contact
            </h1>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">
            {/* Contact Name TextField */}
            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium leading-normal pb-2">
                Contact Name
              </p>
              <input
                type="text"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/20 bg-white/5 focus:border-primary h-14 placeholder:text-white/40 p-[15px] text-base font-normal leading-normal transition-all duration-200"
                placeholder="Alice's Wallet"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    error
                  </span>
                  {errors.name}
                </p>
              )}
            </label>

            {/* Solana Address TextField */}
            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium leading-normal pb-2">
                Solana Address
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-lg">
                <input
                  type="text"
                  value={solanaAddress}
                  onChange={(e) => {
                    setSolanaAddress(e.target.value);
                    setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/20 bg-white/5 focus:border-primary h-14 placeholder:text-white/40 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal transition-all duration-200"
                  placeholder="Enter a valid Solana address or SNS domain"
                />
                <button
                  onClick={handlePaste}
                  className="text-white/60 hover:text-white flex border border-white/20 bg-white/5 hover:bg-white/10 items-center justify-center px-4 rounded-r-lg border-l-0 transition-colors duration-200"
                >
                  <span className="material-symbols-outlined">
                    content_paste
                  </span>
                </button>
              </div>
              {errors.address && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    error
                  </span>
                  {errors.address}
                </p>
              )}
            </label>

            {/* Save Contact Button */}
            <div className="flex pt-4">
              <button
                onClick={handleSave}
                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-background-dark text-lg font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity duration-200"
              >
                <span className="truncate">Save Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Material Symbols & Fonts */}
      {/* <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      /> */}
    </div>
  );
};

export default AddContactModal;
