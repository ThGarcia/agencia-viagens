const PASSWORD = "1234";

export const login = (password: string) => {
    if (password === PASSWORD) {
        sessionStorage.setItem("admin_auth", "true");
        return true;
    }
    return false
};

export const logout = () => {
    sessionStorage.removeItem("admin_auth");
};

export const isAuthenticated = () => {
    return sessionStorage.getItem("admin_auth") === "true";
};
