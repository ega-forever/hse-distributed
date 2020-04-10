import IToken from './IToken';

export default interface IContext {
  authorization_token?: string;
  refresh_token?: string;
  user?: IToken;
  refresh?: IToken;
  req?: any;
}
