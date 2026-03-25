const PASSWORD = "1234";

export const login = (password: string) => {
    if (password === PASSWORD) {
        localStorage.setItem("admin_auth", "true");
        return true;
    }
    return false
};

export const logout = () => {
    localStorage.removeItem("admin_auth");
};

export const isAuthenticated = () => {
    return localStorage.getItem("admin_auth") === "true";
};
