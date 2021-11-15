import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Schema, Document } from 'mongoose';
import { Observable } from 'rxjs';
import { User, UserDocument } from '../schemas/user.schema';

/**
 * A pretty simple guard to enforce a user only access its own profile
 */
@Injectable()
export class SameUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const user = request.user as UserDocument;

    if (!id || !user) {
      return true;
    }

    if (id === user._id.toString()) {
      return true;
    }

    return false;
  }
}
