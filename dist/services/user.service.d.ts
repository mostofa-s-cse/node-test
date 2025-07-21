export declare const getMeService: (userId: string) => Promise<{
    id: string;
    role: import(".prisma/client").$Enums.Role;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}>;
export declare const getAllUsersService: () => Promise<{
    id: string;
    role: import(".prisma/client").$Enums.Role;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}[]>;
export declare const deleteUserService: (id: string) => Promise<{
    id: string;
    role: import(".prisma/client").$Enums.Role;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}>;
export declare const searchUserService: (query: string) => Promise<{
    id: string;
    role: import(".prisma/client").$Enums.Role;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}[]>;
//# sourceMappingURL=user.service.d.ts.map