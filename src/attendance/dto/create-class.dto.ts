import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsNotEmpty()
  @IsString()
  classCode: string;

  @IsNotEmpty()
  @IsString()
  section: string;

  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teachers?: string[];
}
