import {PaginationDto} from './pagination-dto';

export interface MetaListDto {
  data: MetaDto[],
  pagination: PaginationDto,
}

export interface MetaDto {
  id: string;
  name: string;
  description: string;
  reserve: number;
  objective: number;
  completed: boolean;
}
