const projectID = 'yxpa71cax49z'

export const headerWithProjectIdOnly = () => {
    return {
        headers: {
            projectID: projectID,
        },
    };
};

export const getHeaderWithProjectIdAndBody = () => {
    return {
        headers: { projectId: projectID, "Content-Type": "application/json" },
    };
};

export const getAuthHeaderConfig = () => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                projectId: projectID,
            },
        };
    } else {
        return {
            error: "user not logged in"
        }
    }
}