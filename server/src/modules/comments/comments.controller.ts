import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CommentsService } from './comments.service';

class CreateCommentDto {
  content: string;
  postId: number;
}

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async findAll(@Query('postId') postId?: string) {
    if (postId) {
      return this.commentsService.findByPost(Number(postId));
    }
    return this.commentsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateCommentDto, @Request() req) {
    return this.commentsService.create(body.content, req.user.username, body.postId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.commentsService.remove(Number(id));
    return { message: 'Comment deleted successfully' };
  }
}
