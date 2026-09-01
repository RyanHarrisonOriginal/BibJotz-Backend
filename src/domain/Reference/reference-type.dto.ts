export interface ICreateReferenceTypeRequestDTO {
  userId?: number;
  name?: string;
}

export interface IUpdateReferenceTypeRequestDTO {
  id?: string;
  name?: string;
}

export interface IDeleteReferenceTypeParamsDTO {
  id?: string;
}

export interface IListReferenceTypesQueryParamsDTO {
  userId?: string | string[];
}

export interface IReferenceTypeResponseDTO {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
