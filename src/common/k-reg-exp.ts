export class KRegExp {
  protected static _email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  protected static _password = /(?=.*[A-Za-z].*)(?=.*[\d].*)(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\\\|\[\{\]\}\;\:\'\"\,\<\.\>\/\?].*)(^.{8,24}$)/;
  protected static _passwordAlphabet = /(?=.*[A-Za-z].*)/;
  protected static _passwordNumber = /(?=.*[\d].*)/;
  protected static _passwordSpecial = /(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\\\|\[\{\]\}\;\:\'\"\,\<\.\>\/\?].*)/;
  protected static _passwordLength = /(^.{8,24}$)/;
  protected static _nickname = /(^[a-zA-Z\d\_][a-zA-Z\d\_\.\!]{3,15}$)/;
  protected static _nicknameFirst = /(^[a-zA-Z\d\_])/;
  protected static _nicknameLetter = /(^[a-zA-Z\d\_\.\!]+$)/;
  protected static _nicknameLength = /(^.{4,16}$)/;

  public static get email(): RegExp { return KRegExp._email; }
  public static get password(): RegExp { return KRegExp._password; }
  public static get passwordAlphabet(): RegExp { return KRegExp._passwordAlphabet; }
  public static get passwordNumber(): RegExp { return KRegExp._passwordNumber; }
  public static get passwordSpecial(): RegExp { return KRegExp._passwordSpecial; }
  public static get passwordLength(): RegExp { return KRegExp._passwordLength; }
  public static get nickname(): RegExp { return KRegExp._nickname; }
  public static get nicknameFirst(): RegExp { return KRegExp._nicknameFirst; }
  public static get nicknameLetter(): RegExp { return KRegExp._nicknameLetter; }
  public static get nicknameLength(): RegExp { return KRegExp._nicknameLength; }

  public static checkEmail(value: string): boolean {
    return KRegExp.email.test(value);
  }

  public static checkPassword(value: string, option?: string): boolean {
    if (option) {
      switch (option.toLocaleLowerCase()) {
        case 'alphabet':
          return KRegExp.passwordAlphabet.test(value);
        case 'number':
          return KRegExp.passwordNumber.test(value);
        case 'special':
          return KRegExp.passwordSpecial.test(value);
        case 'length':
          return KRegExp.passwordLength.test(value);
      }
    } else {
      return KRegExp.password.test(value);
    }
    return false;
  }

  public static checkNickname(value: string, option?: string): boolean {
    if (option) {
      switch (option.toLocaleLowerCase()) {
        case 'first':
          return KRegExp.nicknameFirst.test(value);
        case 'letter':
          return KRegExp.nicknameLetter.test(value);
        case 'length':
          return KRegExp.nicknameLength.test(value);
      }
    } else {
      return KRegExp.nickname.test(value);
    }
    return false;
  }
};
