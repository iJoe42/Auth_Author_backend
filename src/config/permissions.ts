import { Role } from "@prisma/client";

type Permissions = {
    [key: string]: {
        [key: string]: string
    };
};


export const permissions: Permissions = {
    basic: {
        read: "read",
        create: "create",
        update: "update",
        delete: "delete",
    },
};

const userPermissions = [permissions.basic.read];
const managerPermissions = [...userPermissions, permissions.basic.create, permissions.basic.update];
const adminPermissions = [...managerPermissions, permissions.basic.delete];

const permissionByRole = {
    [Role.USER]: userPermissions,
    [Role.MANAGER]: managerPermissions,
    [Role.ADMIN]: adminPermissions, 
};

export const getPermissionsByRoles = (roles: Role[]) => {

    // a Set filters out duplicated permissions
    const permissionsSet = new Set<string>();

    // extract permissions from "roles" and fill them in a Set
    roles.forEach((role) => {
        permissionByRole[role].forEach((permissions) => {
            permissionsSet.add(permissions);
        });
    });

    // fill Array from Set
    const permissions = Array.from(permissionsSet);
    if(permissions.length === 0) return null;
    return permissions;
};