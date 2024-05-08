const validateSignUpForm = (
  firstname,
  lastname,
  email,
  password,
  signUpErrorMsg
) => {
  let errorStatus = false;
  if (!firstname || !lastname || !email || !password) {
    errorStatus = true;
    signUpErrorMsg.style.visibility = "visible";
    signUpErrorMsg.textContent = "Please complete all the fields";
  } else {
    errorStatus = false;
    signUpErrorMsg.style.visibility = "hidden";
    signUpErrorMsg.textContent = "";
  }

  const signUpErrorStatus = () => {
    return errorStatus;
  };

  return { errorStatus, signUpErrorStatus };
};

const removeSignUpErrorOnInput = (
  firstname,
  lastname,
  email,
  password,
  signUpErrorMsg
) => {
  if (firstname && lastname && email && password) {
    signUpErrorMsg.style.visibility = "hidden";
  }
};
export { validateSignUpForm, removeSignUpErrorOnInput };