

type ChatModelType = "user" | "system" | "assistant";

type ChatType = {
    role: ChatModelType,
    content: string
}

type AIStepType = "start" | "think" | "action" | "onserve" | "output" | "error";

type AIJSONResponseType = {
    step: AIStepType,
    content: string
    args?: object
}

type CreateInstructionArgsType = {
    fromSecretKey: string
    toAddress: string
    amount: number
    decimals: number
    mintAddress: string | null
    tokenProgramId: string | null
}

export type {
    ChatModelType,
    ChatType,
    AIJSONResponseType,
    AIStepType,
    CreateInstructionArgsType
}