export declare const registerUser: (name: string, email: string, password: string) => Promise<{
    id: string;
    role: import(".prisma/client").$Enums.Role;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    user: {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        email: string;
        password: string;
        createdAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refreshUserToken: (token: string) => Promise<{
    accessToken: string;
}>;
export declare const logoutUser: () => {
    message: string;
};
//# sourceMappingURL=auth.service.d.ts.map