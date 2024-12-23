// src/utils/types.ts

export interface UpdateData {
    username?: string;
    email?: string;
    password?: string;     
    oldPassword?: string;
    newPassword?: string;
    profilePicture?: File | string;
  }