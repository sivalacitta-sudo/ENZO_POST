import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '../../entities/post.entity';
import { Tag } from '../../entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
