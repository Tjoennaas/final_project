
const mainContentContainer = document.querySelector('.content-main-container');
const signInForm = document.querySelector(".sign-in-form");
const signOutButton = document.querySelector(".sign-out-button");
const uploadForm = document.querySelector('.upload-form');
const accountFormButton = document.querySelector(".account-form-button");
const uploadContainer = document.querySelector(".upload-container");
const currencyContainer = document.querySelector('.currency-container');
const signInFormContainer = document.querySelector( ".sign-in-form-container");




function displayLoggedInState() {
    mainContentContainer.style.display = 'flex';
    signInForm.style.display = 'none'; 
    signOutButton.style.display = 'block';
    uploadForm.style.display = 'block';
    accountFormButton.style.display = "none";
    uploadContainer.style.display = "block";
    currencyContainer.style.display ="block";
    signInFormContainer.style.display ="block"
   
  }
  
  function displayLoggedOutState() {
    signOutButton.style.display = "none";
    mainContentContainer.style.display = 'none';
    signInForm.style.display = 'flex';
    uploadForm.style.display = 'none';
    accountFormButton.style.display = "block";
    uploadContainer.style.display = "none";
    currencyContainer.style.display ="none";
    signInFormContainer.style.display ="none"
  }
  
  export { displayLoggedInState, displayLoggedOutState };