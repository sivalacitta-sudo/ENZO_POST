import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.posts', 'post')
      .addSelect('COUNT(post.id)', 'postCount')
      .groupBy('tag.id')
      .getMany();
  }

  async findOne(slug: string): Promise<Tag> {
    const tag = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.posts', 'post')
      .where('tag.slug = :slug', { slug })
      .getOne();

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async create(name: string): Promise<Tag> {
    const slug = slugify(name, { lower: true, strict: true });

    const existingTag = await this.tagRepository.findOne({ where: { slug } });
    if (existingTag) {
      return existingTag;
    }

    const tag = this.tagRepository.create({ name, slug });
    return this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    await this.tagRepository.remove(tag);
  }
}
