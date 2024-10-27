import { PayloadAction } from '@reduxjs/toolkit'

export interface IError {
    errMessage: string,
    errFunc?: PayloadAction<string | number >,
}

export interface IFile {
    id: number,
    key: string,
    file_name: string,
    comment: string,
    size: number,
    uploaded: string,
    downloaded: string,
    specialLink: string,
}

export interface IFilesSize {
  size: number,
  str_size: string,
}

export interface IChangeFileData {
    id: number,
    file_name?: string,
    comment?: string | null,
}

export interface IDownloadFileData {
    id: number,
    file_name: string,
}

export interface IUser {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    is_staff: boolean,
  }
  
export interface IUserForAdmin {
    id: number,
    key: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    is_staff: boolean,
    files: IFilesSize[],
  }
  
  export interface ILoginFormData {
    username: string,
    password: string,
  }

  export interface IRegisterFormData {
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  }
   
  export interface IUpdateUserData {
    id: number,
    username?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    isAdmin?: boolean;
  }