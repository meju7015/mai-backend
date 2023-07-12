import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { Assets } from './entity/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PineconeNamespaces } from './entity/pinecone-namespace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assets, PineconeNamespaces])],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
