
const validateSignUpForm = (
  firstname,
  lastname,
  email,
  password,
  signUpError
) => {
  let errorStatus = false;
  if (!firstname || !lastname || !email || !password) {
    errorStatus = true;
    signUpError.style.visibilety = "visible";
  } else {
    errorStatus = false;
    signUpError.style.visibilety = "hidden";
    signUpError.textContent = "";
  }

return { errorStatus, signUpErrorStatus: () => errorStatus };
}; 

const removeSignUpErrorOnInput = (
  firstname,
  lastname,
  email,
  password,
  signUpError
) => {
  if (firstname && lastname && email && password) {
    signUpError.style.visibilety = "hidden";
  }
}; 



export { validateSignUpForm, removeSignUpErrorOnInput };