import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class ReorderRoutesDto {
  @IsUUID('4', { message: 'Nhà xe không hợp lệ.' })
  company_uuid: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Danh sách tuyến không hợp lệ.' })
  @IsUUID('4', { each: true, message: 'Danh sách tuyến không hợp lệ.' })
  ids: string[];
}
