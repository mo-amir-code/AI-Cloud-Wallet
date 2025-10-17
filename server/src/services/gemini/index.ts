import axios from "axios";
import { ENV_VARS } from "../../config/constants.js";
import { GEMINI_AI_URL, SYSTEM_PROMPT } from "../../config/gemini.js";
import { AIJSONResponseType, ChatType, CreateInstructionArgsType } from "../../types/services/gemini.js";
import { createInstruction, executeInstructions, getAllTokenAccounts, getSolBalance, getSolPrice } from "./utils.js";
import { DriveFileType } from "../../types/services/drive/index.js";
import { Response } from "express";


const processUserRequest = async (driveFileData: DriveFileType, query: string, res: Response) => {
    const sendUpdate = (msg: string) => {
        res.write(`data: ${msg}\n\n`);
    };

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

                sendUpdate("fetching contacts...");

            } else if (response.content === "getSolPrice") {
                toolResponse = await getSolPrice();

                sendUpdate("fetching SOL price...");
            }
            else if (response.content === "getSolBalance") {
                toolResponse = await getSolBalance(driveFileData.wallet.publicKey);

                sendUpdate("fetching SOL balance...");

            } else if (response.content === "getAllTokenAccounts") {
                toolResponse = await getAllTokenAccounts(driveFileData.wallet.publicKey);

                sendUpdate("fetching token accounts...");

            } else if (response.content === "createInstruction") {
                const args = response.args! as CreateInstructionArgsType
                const ix = await createInstruction({ ...args, fromSecretKey: driveFileData.wallet.secretKey });
                instructions.push(ix);

                sendUpdate("creating instructions...");

            } else if (response.content === "executeInstructions") {
                const signature = await executeInstructions(driveFileData.wallet.secretKey, instructions);
                toolResponse = { message: "This is the signature of the transaction: " + signature }

                sendUpdate("executing instructions...");
            }

            // toolResponse = {
            //     step: "observer",
            //     content: JSON.stringify(toolResponse)
            // }

            chatHistory.push({
                role: "assistant",
                content: JSON.stringify(toolResponse)
            })
        } else if (response.step === "error") {
            sendUpdate(response.content);
            break;
        } else if (response.step === "output") {
            sendUpdate(response.content);
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

        // console.log("Cleaned: ", cleaned)

        const output = JSON.parse(cleaned || "{}");

        // console.log(output, "\n\n\n")

        return output;
    } catch (error) {
        console.log("Error occurred while querying to AI: ");
        return queryToAI(chatHistory)
    }
}

export { processUserRequest };