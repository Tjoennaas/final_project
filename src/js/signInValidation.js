function validateSignInForm(email, password, emailError, passError) {
  const errors = {
    errorStatus: false,
    emailError: "",
    passwordError: "",
  };
  if (!email && !password) {
    errors.errorStatus = true;
    errors.emailError = "Email is required  ⚠️ ";
    errors.passwordError = "Password is required  ⚠️ ";

    emailError.style.visibility = "visible";
    passError.style.visibility = "visible";

    emailError.textContent = errors.emailError;
    passError.textContent = errors.passwordError;
  } else if (!email) {
    errors.errorStatus = true;
    errors.emailError = "Email is required  ⚠️ ";
    errors.passwordError = "";

    emailError.style.visibility = "visible";
    passError.style.visibility = "hidden";
    emailError.textContent = errors.emailError;
    passError.textContent = errors.passwordError;
  } else if (!password) {
    errors.errorStatus = true;
    errors.emailError = "";
    errors.passwordError = "Password is required  ⚠️ ";

    emailError.style.visibility = "hidden";
    passError.style.visibility = "visible";

    emailError.textContent = errors.emailError;
    passError.textContent = errors.passwordError;
  } else {
    errors.errorStatus = false;
    errors.emailError = "";
    errors.passwordError = "";

    emailError.style.visibility = "hidden";
    passError.style.visibility = "hidden";

    emailError.textContent = errors.emailError;
    passError.textContent = errors.passwordError;
  }
  const signInFormStatus = () => {
    return errors.errorStatus;
  };
  return { signInFormStatus };
}

function removeErrorsOnInput(emailInput, passwordInput, emailError, passError) {

  emailInput.addEventListener("input", () => {
    if (emailInput.value.trim() === "") {
        emailError.style.visibility = "visible";
    } else {
        emailError.style.visibility = "hidden";
    }
});

passwordInput.addEventListener("input", () => {
    if (passwordInput.value.trim() === "") {
        passError.style.visibility = "visible";
    } else {
        passError.style.visibility = "hidden";
    }
});
  
}

export { validateSignInForm, removeErrorsOnInput };