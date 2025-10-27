const shortenSolAddress = (address: string): string => {
    if (!address) throw new Error("Address cannot be empty");
    if (address.length <= 10) return address; // too short to shorten

    const start = address.slice(0, 8);
    const end = address.slice(-5);
    return `${start}...${end}`;
};


export {
    shortenSolAddress
};
