import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  keyword!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  newsIds!: string[];
}
