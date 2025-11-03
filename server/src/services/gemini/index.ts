import axios from "axios";
import { ENV_VARS } from "../../config/constants.js";
import { GEMINI_AI_URL, SYSTEM_PROMPT } from "../../config/gemini.js";
import { AIJSONResponseType, ChatType, CreateInstructionArgsType } from "../../types/services/gemini.js";
import { createInstruction, executeInstructions, getAllTokenAccounts, getSolBalance, getSolPrice } from "./utils.js";
import { DriveFileType } from "../../types/services/drive/index.js";
import { Response } from "express";
import { getSettingsByUserId } from "../../utils/db/settings.services.db.js";
import { getSolanaConnection } from "../../config/solana.js";
import { NetworkMode } from "@prisma/client";


const processUserRequest = async (driveFileData: DriveFileType, query: string, res: Response, userId: string) => {
    const sendUpdate = (msg: string) => {
        res.write(`data: ${msg}\n\n`);
    };

    // Fetch user settings to determine network
    const userSettings = await getSettingsByUserId(userId);
    const networkMode = userSettings?.mode || NetworkMode.mainnet;
    const connection = getSolanaConnection(networkMode);

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
        const response = await queryToAI(chatHistory, 0);

        console.log(response, "\n\n\n")

        if (!response) {
            console.log("Stopped!");
            res.write(`event: error\ndata: AI server is not responding...\n\n`);
            return false;
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
                toolResponse = await getSolBalance(driveFileData.wallet.publicKey, connection);

                sendUpdate("fetching SOL balance...");

            } else if (response.content === "getAllTokenAccounts") {
                toolResponse = await getAllTokenAccounts(driveFileData.wallet.publicKey, connection);

                sendUpdate("fetching token accounts...");

            } else if (response.content === "createInstruction") {
                const args = response.args! as CreateInstructionArgsType
                const ix = await createInstruction({ ...args, fromSecretKey: driveFileData.wallet.secretKey, connection });
                instructions.push(ix);

                sendUpdate("creating instructions...");

            } else if (response.content === "executeInstructions") {
                const signature = await executeInstructions(driveFileData.wallet.secretKey, instructions, connection);
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
            res.write(`event: error\ndata: ${response.content}\n\n`);
            return false;
        } else if (response.step === "output") {
            sendUpdate(response.content);
            break;
        }

        chatHistory.push({
            role: "assistant",
            content: JSON.stringify(response)
        })
    }

    console.log("Exited from the loop..........")

    // const url = `https://lite-api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112`;
    // const response = await axios.get(url);
    // console.log(response.data);
    // while (true) {
    // const res = await queryToAI(chatHistory);

    // }
    return true;
};


const queryToAI = async (chatHistory: ChatType[], retries: number): Promise<AIJSONResponseType | null> => {
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
        if (retries < 10) {
            console.log(`Retrying... attempt ${retries + 1}`);
            await new Promise(res => setTimeout(res, 2000)); // wait 2s before retry
            return queryToAI(chatHistory, retries + 1);
        }

        return null;
    }
}

export { processUserRequest };