/**
 * Class to reprsent an authenticated user
 */
export class User {
  constructor(
    public uid: string,
    public email: string | null,
    public displayName: string | null,
    public emailVerified: boolean
  ) {}
}
