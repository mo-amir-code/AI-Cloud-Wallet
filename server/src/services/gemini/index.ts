import axios from "axios";
import { ENV_VARS } from "../../config/constants.js";
import { GEMINI_AI_URL, SYSTEM_PROMPT } from "../../config/gemini.js";
import { AIJSONResponseType, ChatType, CreateInstructionArgsType } from "../../types/services/gemini.js";
import { createInstruction, executeInstructions, getAllTokenAccounts, getSolBalance } from "./utils.js";
import { DriveFileType } from "../../types/services/drive/index.js";


const processUserRequest = async (driveFileData: DriveFileType, query: string) => {
    const chatHistory: ChatType[] = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        }
    ]

    chatHistory.push({
        role: "user",
        content: query
    });

    const instructions = [];

    // const tokenAccounts = await getAllTokenAccounts(driveFileData.wallet.publicKey);
    // console.log(tokenAccounts)

    while (true) {
        const response = await queryToAI(chatHistory);

        if (!response) {
            console.log("Stopped!");
            break;
        }


        if (response.step === "action") {
            let toolResponse: any;

            if (response.content === "getContacts") {
                toolResponse = driveFileData.contacts;
            } else if (response.content === "getSolBalance") {
                toolResponse = await getSolBalance(driveFileData.wallet.publicKey);
            } else if (response.content === "getAllTokenAccounts") {
                toolResponse = await getAllTokenAccounts(driveFileData.wallet.publicKey);
            } else if (response.content === "createInstruction") {
                const args = response.args! as CreateInstructionArgsType
                const ix = await createInstruction({ ...args, fromSecretKey: driveFileData.wallet.secretKey });
                instructions.push(ix);
            } else if (response.content === "executeInstructions") {
                const signature = await executeInstructions(driveFileData.wallet.secretKey, instructions);
                toolResponse = { message: "This is the signature of the transaction: " + signature}
            }

            // toolResponse = {
            //     step: "observer",
            //     content: JSON.stringify(toolResponse)
            // }

            chatHistory.push({
                role: "assistant",
                content: JSON.stringify(toolResponse)
            })
        }

        if (response.step === "output") {
            console.log("Stopping....");
            break;
        }

        chatHistory.push({
            role: "assistant",
            content: JSON.stringify(response)
        })
    }

    // const url = `https://lite-api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112`;
    // const response = await axios.get(url);
    // console.log(response.data);
    // while (true) {
    // const res = await queryToAI(chatHistory);

    // }
};


const queryToAI = async (chatHistory: ChatType[]): Promise<AIJSONResponseType | null> => {
    const textToSend = chatHistory
        .map(msg => `[${msg.role}] ${msg.content}`)
        .join("\n");

    try {
        const response = await axios.post(
            GEMINI_AI_URL,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: textToSend, // The text query passed in from caller
                            },
                        ],
                    },
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": ENV_VARS.GOOGLE.GEMINI_AI_KEY!,
                },
            }
        );



        const aiResponse = JSON.parse(JSON.stringify(response.data));
        const result = aiResponse.candidates[0].content.parts[0].text;

        // console.log("Result: ", result)

        // console.log("AI Response: ", typeof(result))

        // // Remove markdown-style JSON code fences to clean the output
        const cleaned = result?.replace(/```json\n?|\n```/g, "");

        console.log("Cleaned: ", cleaned)

        const output = JSON.parse(cleaned || "{}");

        console.log(output, "\n\n\n")

        return output;
    } catch (error) {
        console.log("Error occurred while querying to AI: ");
        return queryToAI(chatHistory)
    }
}

export { processUserRequest };