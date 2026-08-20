import api from "./api";

export const getTechnologies = async (search = "") => {

    const response = await api.get("/technologies/", {
        params: {
            search: search,
        },
    });

    return response.data;
};