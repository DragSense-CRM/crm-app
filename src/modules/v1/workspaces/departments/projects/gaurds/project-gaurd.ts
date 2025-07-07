import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { ProjectsService } from '../projects.service';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const department = req.department;


    const projectId =
      Number(req.params.projectId) ||
      Number(req.body.projectId) ||
      Number(req.query.projectId);

    if (!projectId) {
      throw new ForbiddenException('Project ID is required.');
    }



    const project = await this.projectsService.findOne(department, projectId);

    req.project = project;

    return true;
  }
}
