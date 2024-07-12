import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  // importer repositroy and PostEntiry
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  create(createPostDto: CreatePostDto) {
    try {
      const post = this.postRepository.create(createPostDto);
      return this.postRepository.save(post);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({ relations: ['category'] });
  }

  findOne(id: number): Promise<PostEntity> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = this.postRepository
        .createQueryBuilder('post')
        .where('post.id = :id', { id: id })
        .update(updatePostDto)
        .execute()
        .then((result) => {
          return result;
        });

      return post;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: number) {
    try {
      const post = this.postRepository
        .createQueryBuilder('post')
        .where('post.id = :id', { id: id })
        .delete()
        .execute();

      return post;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
