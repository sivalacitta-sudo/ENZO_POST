import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Post } from '../../entities/post.entity';
import { Tag } from '../../entities/tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number): Promise<Post> {
    let slug = slugify(createPostDto.title, { lower: true, strict: true });

    // Check for slug uniqueness
    const existingPost = await this.postRepository.findOne({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    const tags = createPostDto.tagIds
      ? await this.tagRepository.findByIds(createPostDto.tagIds)
      : [];

    const post = this.postRepository.create({
      ...createPostDto,
      slug,
      status: createPostDto.status || 'draft',
      author: { id: authorId },
      tags,
    });

    return this.postRepository.save(post);
  }

  async findAll(page = 1, limit = 10, tagSlug?: string): Promise<{ posts: Post[]; total: number }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.status = :status', { status: 'published' })
      .orderBy('post.createdAt', 'DESC');

    if (tagSlug) {
      queryBuilder.andWhere('tags.slug = :tagSlug', { tagSlug });
    }

    const [posts, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }

  async findOneBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.slug = :slug', { slug })
      .getOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment view count
    post.viewCount += 1;
    await this.postRepository.save(post);

    return post;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    if (updatePostDto.title && updatePostDto.title !== post.title) {
      let slug = slugify(updatePostDto.title, { lower: true, strict: true });
      const existingPost = await this.postRepository.findOne({ where: { slug } });
      if (existingPost && existingPost.id !== id) {
        slug = `${slug}-${Date.now()}`;
      }
      post.slug = slug;
    }

    if (updatePostDto.tagIds) {
      post.tags = await this.tagRepository.findByIds(updatePostDto.tagIds);
    }

    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }

  async findAllAdmin(page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
    const [posts, total] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }

  async getMyPosts(authorId: number, page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
    const [posts, total] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.authorId = :authorId', { authorId })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }
}
