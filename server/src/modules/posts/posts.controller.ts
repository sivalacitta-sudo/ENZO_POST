import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('tag') tag?: string) {
    return this.postsService.findAll(Number(page), Number(limit), tag);
  }

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    const post = await this.postsService.findOne(Number(id));
    
    // 只有作者或管理员可以编辑
    if (post.author.id !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenException('You can only edit your own posts');
    }
    
    return this.postsService.update(Number(id), updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req) {
    const post = await this.postsService.findOne(Number(id));
    
    // 只有作者或管理员可以删除
    if (post.author.id !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own posts');
    }
    
    await this.postsService.remove(Number(id));
    return { message: 'Post deleted successfully' };
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async findAllAdmin(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postsService.findAllAdmin(Number(page), Number(limit));
  }
  
  // 获取当前用户的所有文章
  @Get('my/posts')
  @UseGuards(AuthGuard('jwt'))
  async getMyPosts(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postsService.getMyPosts(req.user.userId, Number(page), Number(limit));
  }
}
