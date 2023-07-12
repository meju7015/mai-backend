import {
  Body,
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseResponse } from '../../base/BaseResponse';
import { Assets } from './entity/asset.entity';
import { PineconeNamespaces } from './entity/pinecone-namespace.entity';
import { CreatePlaintextRequestDto } from './dto/create-plaintext-request';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  /**
   * 에셋 업로드
   *
   * @param file: Express.Multer.File
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createAsset(
    @UploadedFile(new ParseFilePipe({}))
    file: Express.Multer.File,
  ) {
    return BaseResponse.created<Assets>(
      await this.assetService.createAsset(file),
    );
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async createPdf(@UploadedFile(new ParseFilePipe({})) file) {
    return BaseResponse.created<PineconeNamespaces>(
      await this.assetService.createPdf(file),
    );
  }

  @Post('text')
  @UseInterceptors(FileInterceptor('file'))
  async createText(@UploadedFile(new ParseFilePipe({})) file) {
    return BaseResponse.created<PineconeNamespaces>(
      await this.assetService.createText(file),
    );
  }

  @Post('plain-text')
  async createPlainText(@Body() req: CreatePlaintextRequestDto) {
    return BaseResponse.created<PineconeNamespaces>(
      await this.assetService.createPlainText(req.plainText),
    );
  }

  @Post('web')
  async createWeb(@Body() req: { url: string }) {
    return BaseResponse.success<PineconeNamespaces>(
      await this.assetService.createWeb(req.url),
    );
  }

  @Post('sitemap')
  async getSitemap(@Body() { url }: { url: string }) {
    return BaseResponse.success<string[]>(
      await this.assetService.getSitemap(url),
    );
  }
}
