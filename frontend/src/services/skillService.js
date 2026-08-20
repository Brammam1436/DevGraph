import api from "./api";

export const getSkills = async (search = "") => {

    const response = await api.get("/skills/", {
        params: {
            search: search,
        },
    });

    return response.data;
};