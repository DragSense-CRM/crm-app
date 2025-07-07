import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { WorkspacesService } from '../workspaces.service';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly workspacesService: WorkspacesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const workspaceId =
      Number(req.params.workspaceId) ||
      Number(req.body.workspaceId) ||
      Number(req.query.workspaceId);

    if (!workspaceId) {
      throw new ForbiddenException('Workspace ID is required.');
    }

    const workspace = await this.workspacesService.findOne(user, workspaceId);

    req.workspace = workspace;

    return true;
  }
}
