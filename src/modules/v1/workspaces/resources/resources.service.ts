import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Not, Repository } from 'typeorm';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Resource } from './entities/resource.entity';

import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceListDto } from './dto/resource-list.dto';
import { ResourceType } from './enums/resource.enum';
import { UsersService } from '../../users/users.service';
import { FilesService } from './files.service';


@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly userService: UsersService,
    
    private readonly dataSource: DataSource,
    private readonly fileService: FilesService,


  ) { }

  async create(workspace: Pick<Workspace, 'id'>, createResourceDto: CreateResourceDto, file?: Express.Multer.File): Promise<MessageResponse> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const existing = await manager.findOne(this.resourceRepository.target, {
        where: { name: createResourceDto.name, workspace: { id: workspace.id } },
        
      });

      if (existing) {
        throw new BadRequestException('A resource with this name already exists.');
      }


      if (file) {
        createResourceDto.fileUrl = await this.fileService.uploadFile(file);
        createResourceDto.fileType = this.fileService.getFileType(file.mimetype);
        createResourceDto.size = file.size;
        createResourceDto.mimeType = file.mimetype;
      }

      const {
        firstName,
        lastName,
        email,
        password,
        address,
        gender,
        contactPhone,
        parentResourceId,
        file: resourceFile,
        ...rest
      } = createResourceDto;


      let parentResource;
      if (parentResourceId) {
        parentResource = await manager.findOne(this.resourceRepository.target, {
          where: { id: parentResourceId },
        });

        if (!parentResource) {
          throw new NotFoundException('Parent resource not found.');
        }
      }

      let user;
      if (createResourceDto.type === ResourceType.USER) {

        user = await this.userService.createUserWithProfile({
          firstName,
          lastName,
          email,
          password,
          address,
          gender,
          contactPhone
        }, manager);
      }

      delete createResourceDto.parentResourceId;
      delete createResourceDto.file;

      const resource = manager.create(this.resourceRepository.target, {
        ...rest,
        user,
        parentResource,
        workspace,
      });

      await manager.save(this.resourceRepository.target, resource);

      return { message: 'Resource created successfully.' };
    });
  }


  async findAll(workspace: Pick<Workspace, "id">, queryDto: ResourceListDto): Promise<PaginationResponse<Resource>> {
    const {
      page = 1,
      limit = 10,
      search,
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      ...filters
    } = queryDto;

    const query = this.resourceRepository.createQueryBuilder('resource');

    query
      .leftJoin('resource.workspace', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId: workspace.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('resource.createdAt', 'DESC');

    if (search) {
      query.andWhere(`resource.name ILIKE :search`, { search: `%${search}%` });
    }

    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`resource.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }

    if (createdAfter) {
      query.andWhere('resource.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('resource.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('resource.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('resource.updatedAt <= :updatedBefore', { updatedBefore });
    }

    const [data, total] = await query.getManyAndCount();
    const lastPage = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      lastPage,
      hasNextPage: page < lastPage,
      hasPrevPage: page > 1,
    };
  }

  async findOne(workspace: Pick<Workspace, "id">, id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: ['workspace', 'user', 'user.profile'],
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found.`);
    }

    if (resource.workspace.id !== workspace.id) {
      throw new BadRequestException('You are not authorized to access this resource.');
    }

    return resource;
  }

 async update(
  workspace: Pick<Workspace, "id">,
  id: number,
  updateResourceDto: UpdateResourceDto,
  file?: Express.Multer.File
): Promise<MessageResponse> {
  return await this.dataSource.transaction(async (manager: EntityManager) => {
    const resource = await this.findOne(workspace, id);

    // Check for duplicate name
    if (updateResourceDto.name && updateResourceDto.name !== resource.name) {
      const existing = await manager.findOne(this.resourceRepository.target, {
        where: { name: updateResourceDto.name, id: Not(resource.id), workspace: { id: workspace.id } },
      });

      if (existing) {
        throw new BadRequestException('A resource with this name already exists.');
      }
    }

    const {
      firstName,
      lastName,
      email,
      password,
      address,
      gender,
      contactPhone,
      file: resourceFile,
      ...rest
    } = updateResourceDto;

 
    if (file) {
      updateResourceDto.fileUrl = await this.fileService.uploadFile(file);
      updateResourceDto.fileType = this.fileService.getFileType(file.mimetype);
      updateResourceDto.size = file.size;
      updateResourceDto.mimeType = file.mimetype;
    }

    // Update user if resource is of type USER
    if (resource.type === ResourceType.USER && resource.user) {
      await this.userService.updateUserWithProfile(
        resource.user.id,
        {
          firstName,
          lastName,
          email,
          password,
          address,
          gender,
          contactPhone,
        },
        manager 
      );
    }

    delete updateResourceDto.file;

    // Merge and save resource
    const updated = manager.merge(this.resourceRepository.target, resource, rest);
    await manager.save(this.resourceRepository.target, updated);

    // Remove old file only after successful save
    if (file && resource.fileUrl) {
      await this.fileService.removeFile(resource.fileUrl);
    }

    return { message: 'Resource updated successfully.' };
  });
}

  async remove(workspace: Pick<Workspace, "id">, id: number): Promise<void> {
    const resource = await this.findOne(workspace, id);

    if (!resource) {
      throw new NotFoundException('Resource not found.');
    }

    // Example: check if resource has dependent entities (optional logic)

    await this.resourceRepository.remove(resource);
  }
}
