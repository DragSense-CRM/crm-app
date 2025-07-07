import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { promisify } from 'util';

import { FileType } from './enums/resource.enum';

const unlinkAsync = promisify(fs.unlink);


@Injectable()
export class FilesService {
  private readonly uploadDirectory: string;
  private readonly uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get('fileUpload').fileUploadDir;
    this.uploadDirectory = path.join(process.cwd(), this.uploadPath);

    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    if (!fs.existsSync(this.uploadDirectory)) {
      fs.mkdirSync(this.uploadDirectory, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadDirectory, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return this.getFileUrl(fileName);
  }

  private getFileUrl(fileName: string): string {
    return `${this.uploadPath}/${fileName}`;
  }


  getFileType(mimeType: string): FileType {
    const typeMap = {
      // Image types
      'image/jpeg': FileType.IMAGE,
      'image/png': FileType.IMAGE,
      'image/gif': FileType.IMAGE,
      'image/webp': FileType.IMAGE,
      'image/svg+xml': FileType.IMAGE,

      // Video types
      'video/mp4': FileType.VIDEO,
      'video/quicktime': FileType.VIDEO,
      'video/x-msvideo': FileType.VIDEO, // AVI
      'video/x-matroska': FileType.VIDEO, // MKV
      'video/webm': FileType.VIDEO,

      // Audio types
      'audio/mpeg': FileType.AUDIO,
      'audio/wav': FileType.AUDIO,
      'audio/ogg': FileType.AUDIO,
      'audio/webm': FileType.AUDIO,

      // Document types
      'application/pdf': FileType.DOCUMENT,
      'application/msword': FileType.DOCUMENT, // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileType.DOCUMENT, // .docx
      'text/plain': FileType.DOCUMENT,
      'application/rtf': FileType.DOCUMENT,

      // Spreadsheet types
      'application/vnd.ms-excel': FileType.DOCUMENT, // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileType.DOCUMENT, // .xlsx

      // Archive types
      'application/zip': FileType.ARCHIVE,
      'application/x-rar-compressed': FileType.ARCHIVE,
      'application/x-7z-compressed': FileType.ARCHIVE,
      'application/x-tar': FileType.ARCHIVE,
      'application/gzip': FileType.ARCHIVE,
      'application/x-bzip2': FileType.ARCHIVE,

    };

    return typeMap[mimeType] || FileType.OTHER;
  }

  async removeFile(fileUrl: string): Promise<void> {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDirectory, fileName);

      await unlinkAsync(filePath);
      console.log(`File unlinked: ${filePath}`);
    } catch (err) {
      console.warn(`Failed to unlink file: ${fileUrl}`, err.message);
    }
  }
}
