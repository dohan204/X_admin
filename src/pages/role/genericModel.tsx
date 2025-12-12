export interface RoleView {
    id: string, 
    userName: string,
    fullName: string,
    email: string,
    isActive: boolean,
    roleName: string[]
}
export interface PropsOpenAdd {
    open: boolean,
    userId: string | null,
    handleOpenAdd?: () => void
    handleCloseAdd: () => void
    onSuccess: () => void
}


export interface AddRoleToUser {
    userID: string, 
    roleName: string,
}

export interface UpdateRole {
    id: string, 
    name: string
    createdAt: Date,
}


export interface EditRoleForUser {
    userId: string, 
    userName: string, 
    roleName: string
}
export interface PropsEditUser {
    open: boolean
    handleClose: () => void
    userId: string | null, 
    userName: string | null
    onSuccess: () => void
}

export interface RoleViewModel {
    id: string,
    name: string,
    active: boolean,
    description: string,
    createdAt: string,
    updatedAt: string
}

export interface AddNewRoleProps {
    openAddRole: boolean,
    handleCloseAddRole: () => void,
    loadData: () => void
}
export interface AddNewRoleParameter {
    name: string, 
    description: string,
}
export interface DeleteRoleProps {
    roleId: string | null,
    openDelete: boolean
    handleCloseDelete: () => void
    loadData: () => void
}
export interface AddPermissionProps {
    openAddPermission: boolean,
    handleCloseAddPermission: () => void,
    roles: RoleViewModel[]
}
export interface FunctionPermission {
  functionId: number;
  functionName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
export interface RolePermissionData {
  roleId: string;
  roleName: string;
  permissions: FunctionPermission[];
}
export type PermissionFormData = {
    [key: `perm_${number}_${'create' | 'read' | 'update' | 'delete'}`]: boolean
}
export interface propsDetails {
  open: boolean,
  handleClose: () => void
  roleId: string
}
export interface ModuleDto {
    id: number,
    name: string
    functions: FunctionDto[]
}
export interface FunctionDto {
    id: number,
    moduleId: number,
    name: string,
    permissionDtos: PermissionDto[]
}
export interface PermissionDto {
    canRead: boolean,
    canCreate: boolean
    canDelete: boolean,
    canUpdate: boolean
}
export interface UpdatePermission {
    FunctionId: number;
    Name: string;
    CanRead: boolean;
    CanCreate: boolean;
    CanWrite: boolean;
    CanDelete: boolean;
}