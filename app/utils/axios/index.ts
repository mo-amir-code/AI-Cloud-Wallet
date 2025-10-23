import { SECRETS } from "@/config/secrets";
import axios from "axios";

const httpAxios = axios.create({
    baseURL: SECRETS.API_BASE_URL + "/api/v1",
    headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTW8gQW1pciIsImVtYWlsIjoibW8uYW1pci5jb2RlQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMdWpPN2dNMTJibmhNVWVUbFExWUI1NERMVVZUbzdUMzBkeEllbFhtdnhfYVlneHdJPXM5Ni1jIiwiaWF0IjoxNzYxMjM4MTE3LCJleHAiOjE3NjEyNDE3MTd9.c1sshIYZgUo_MXqgLC12NKWE48N61CbUNsiwp2dbGYk`, // You can set token here dynamically
    },
});

const ROUTES = {
    USER: {
        ROOT: '/user',
    }
}

export {
    httpAxios, ROUTES
};

