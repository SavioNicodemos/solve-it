import { FetchCommentDTO, IComment } from '@/dtos/CommentDTO';
import {
  ComplaintDTO,
  FetchComplaint,
  FetchMyComplaintsResponse,
  IComplaintId,
} from '@/dtos/ComplaintDTO';
import { IFiltersDTO } from '@/dtos/FiltersDTO';
import { LaravelPagination } from '@/dtos/RequestsDTO';
import { api } from '@/services/api';

export const getSolves = async (
  filters: IFiltersDTO,
  groupId: number,
): Promise<ComplaintDTO[]> => {
  const params = new URLSearchParams();
  if (filters?.complaintName) {
    params.append('query', filters.complaintName);
  }
  params.append('group_id', String(groupId));

  const paramsString = params.toString();

  const response = await api.get(`/complaints?${paramsString}`);
  return response.data;
};

export const getMySolves = async (
  groupId: number,
): Promise<FetchMyComplaintsResponse[]> => {
  const params = new URLSearchParams();
  params.append('group_id', String(groupId));
  const response = await api.get(`/users/complaints?${params.toString()}`);
  return response.data;
};

export const getComplaint = async (
  complaintId: IComplaintId,
): Promise<FetchComplaint> => {
  const response = await api.get<FetchComplaint>(`/complaints/${complaintId}`);

  return response.data;
};

export const getComments = async ({
  complaintId,
  page,
}: IGetComments): Promise<LaravelPagination<IComment>> => {
  const response = await api.get<LaravelPagination<FetchCommentDTO>>(
    `/complaints/${complaintId}/comments?page=${page}`,
  );

  const comments: IComment[] = response.data.data.map(comment => ({
    ...comment,
    created_at: new Date(comment.created_at),
  }));

  const newComments: LaravelPagination<IComment> = {
    ...response.data,
    data: comments,
  };

  return newComments;
};

type IGetComments = {
  complaintId: IComplaintId;
  page: number;
};
