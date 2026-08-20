import api from "./api";

export const getDevelopers = async (search = "") => {
    const response = await api.get("/developers/", {
        params: {
            search: search,
        },
    });

    return response.data;
};


export const getDeveloper = async (email) => {
    const response = await api.get(
        `/developers/${encodeURIComponent(email)}/`
    );

    return response.data;
};


export const getRecommendations = async (email) => {
    const response = await api.get(
        `/developers/${encodeURIComponent(email)}/recommendations/`
    );

    return response.data;
};