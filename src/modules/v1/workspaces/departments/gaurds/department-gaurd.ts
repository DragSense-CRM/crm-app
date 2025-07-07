import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { DepartmentsService } from '../departments.service';


@Injectable()
export class DepartmentGuard implements CanActivate {
  constructor(private readonly departmentsService: DepartmentsService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const workspace = req.workspace;

    const departmentId =
      Number(req.params.departmentId) ||
      Number(req.body.departmentId) ||
      Number(req.query.departmentId);

    if (!departmentId) {
      throw new ForbiddenException('Department ID is required.');
    }


    const department = await this.departmentsService.findOne(workspace, departmentId);

    req.department = department;

    return true;
  }
}
