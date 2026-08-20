import api from "./api";

export const getProjects = async ({
    page = 1,
    pageSize = 3,
    search = "",
    difficulty = "",
} = {}) => {

    const response = await api.get("/projects/", {
        params: {
            page: page,
            page_size: pageSize,
            search: search,
            difficulty: difficulty,
        },
    });

    return response.data;
};