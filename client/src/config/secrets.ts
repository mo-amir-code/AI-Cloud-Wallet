const { VITE_API_BASE_URL: API_BASE_URL, VITE_HELIUS_API_KEY: HELIUS_API_KEY } = import.meta.env;


const SECRETS = {
    API_BASE_URL: API_BASE_URL || "http://localhost:8080",
    HELIUS_API_KEY: HELIUS_API_KEY!
}

export {
    SECRETS
};
