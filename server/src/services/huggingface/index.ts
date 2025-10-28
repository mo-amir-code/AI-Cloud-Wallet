import axios from "axios";


interface TranscriptionResult {
    text: string;
    language?: string;
    confidence?: number;
}

export async function transcribeWithHuggingFace(
    audioBuffer: Buffer,
    // filename: string = 'audio.wav'
): Promise<TranscriptionResult> {
    // console.log("BUFFER: ", audioBuffer)
    try {
        const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

        if (!HUGGINGFACE_API_KEY) {
            throw new Error('HUGGINGFACE_API_KEY is not set');
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
            audioBuffer,
            {
                headers: {
                    'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'audio/wav',
                    'Accept': 'application/json', // Fix: Explicitly set Accept header
                },
                timeout: 60000, // 60 second timeout
                responseType: 'json', // Expect JSON response
            }
        );

        return {
            text: response.data.text,
        };
    } catch (error: any) {
        console.error('Hugging Face transcription error:', error.response?.data || error.message);
        throw new Error('Failed to transcribe audio with Hugging Face');
    }
}