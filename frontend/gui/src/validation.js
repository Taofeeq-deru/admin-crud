import validator from "validator";

class ValidateFields {
  validateEmail(email) {
    if (validator.isEmpty(email)) {
      return "Email is required";
    } else if (!validator.isEmail(email)) {
      return "Invalid Email";
    }

    return false;
  }

  validatePassword(password) {
    if (validator.isEmpty(password)) {
      return "Password is required";
    } else if (!validator.isLength(password, { min: 8 })) {
      return "Password should be minimum 8 characters";
    }

    return false;
  }

  validateConfirmPassword(password1, password2) {
    if (validator.isEmpty(password2)) {
      return "Confirm password is required";
    } else if (password1 !== password2) {
      return "Passwords are not equal";
    }

    return false;
  }

  validateUsername(username) {
    if (validator.isEmpty(username)) {
      return "Username is required";
    }

    return false;
  }
}

const validateFields = new ValidateFields();

export { validateFields };
