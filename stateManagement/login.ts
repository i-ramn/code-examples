/**
 * SignUp store
 */
class SignUpStore implements IDomain {
  static isSingleton = true;

  static id = "SignUpStore";

  /**
   * @private
   */
  private readonly api: Endpoints;

  /**
   * @constructor
   */
  constructor({ endpoints }: IConstructorParams) {
    this.api = endpoints;

    makeObservable(this, {
      register: action.bound,
      checkUsernameUniqueness: action.bound,
      checkEmailUniqueness: action.bound,
    });
  }

  /**
   * Register new user
   */
  public register = async ({
    email,
    confirmEmail,
    confirmPassword,
    password,
    fullName,
    username,
  }: ISignUpForm) => {
    const signUpData: ISignUpInput = {
      username,
      firstName: fullName,
      emailAddress: email,
      confirmEmail,
      confirmPassword,
      newPassword: password,
      agreeToS: true,
      middleName: "",
      surName: "",
      prefix: "",
      suffix: "",
    };

    const { result, error } = await this.api.users.user.signUp(signUpData);

    if (error) {
      createNotification(error?.message ?? error.title);
    }

    return Boolean(result);
  };

  /**
   * Check new username uniqueness
   */
  public checkUsernameUniqueness = (
    username?: string | undefined | null
  ): Promise<boolean | null> => {
    if (!username) {
      return Promise.resolve(null);
    }

    return this.api.users.unique
      .username({ username })
      .then((response) => Boolean(response?.result?.isUnique))
      .catch(() => null);
  };

  /**
   * Check new email uniqueness
   */
  public checkEmailUniqueness = (
    emailAddress?: string | undefined | null
  ): Promise<boolean | null> => {
    if (!emailAddress) {
      return Promise.resolve(null);
    }

    return this.api.users.unique
      .email({ emailAddress, name: "name" })
      .then((response) => Boolean(response?.result?.isUnique))
      .catch(() => null);
  };
}

export default SignUpStore;
