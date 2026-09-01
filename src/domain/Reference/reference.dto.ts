export interface ICreateReferenceRequestDTO {
  userId?: number;
  typeId?: number;
  title?: string;
  author?: string | null;
}

export interface IUpdateReferenceRequestDTO {
  id?: string;
  typeId?: number;
  title?: string;
  author?: string | null;
}

export interface IGetReferenceParamsDTO {
  id?: string;
}

export interface IDeleteReferenceParamsDTO {
  id?: string;
}

export interface IListReferencesQueryParamsDTO {
  userId?: string | string[];
  typeId?: string | string[];
}

export interface IReferenceResponseDTO {
  id: number;
  userId: number;
  typeId: number;
  typeName: string;
  title: string;
  author: string | null;
  createdAt: string;
  updatedAt: string;
}
