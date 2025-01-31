import { IPasswordResetToken } from '@/interfaces/IPasswordResetToken';
import { IUserInputDTO } from '@/interfaces/IUser';
import AuthService from '@/services/authService';
import { NextFunction, Request, Response } from 'express';
import { Inject } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

export class AuthController {
  protected logger: Logger;
  protected authServiceInstance: AuthService;

  constructor(@Inject('logger') logger: Logger, authService: AuthService) {
    this.logger = logger;
    this.authServiceInstance = authService;
  }

  public getUser = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling get user details endpoint with query: %o', req.query);
    try {
      const user = await this.authServiceInstance.getUser(req.currentUser.userId);
      return res.status(200).json(Result.success(user));
    } catch (e) {
      return next(e);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Sign-Up endpoint with body: %o', { ...req.body, password: '***' });
    try {
      const { user, token } = await this.authServiceInstance.signUp(req.body as IUserInputDTO);
      return res.status(201).json(Result.success({ user, token }));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  public signin = async (req: Request, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Sign-In endpoint with body: %o', { ...req.body, password: '***' });
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authServiceInstance.signIn(email, password);
      return res.json(Result.success<Object>({ user, token })).status(200);
    } catch (error) {
      return next(error);
    }
  };

  public forgot = async (req: Request, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Forgot Password endpoint with body: %o', req.body);
    try {
      const email = req.body.email;
      const status = await this.authServiceInstance.forgotPassword(email);
      return res.status(200).json(Result.success<Object>(status));
    } catch (e) {
      return next(e);
    }
  };

  public reset = async (req: Request & { token: IPasswordResetToken }, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Reset Password endpoint with body: %o', { ...req.body, password: '***' }); //protects from exposing password to the log
    try {
      const user = await this.authServiceInstance.resetPassword(req.body.email, req.body.otp, req.body.password);
      return res.status(200).json(Result.success(user));
    } catch (e) {
      return next(e);
    }
  };
}
