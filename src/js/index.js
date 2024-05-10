



import { firebaseConfig } from "./firebaseConfig";
import {API_KEY} from "./key";

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {   
      getFirestore,
      collection,
      addDoc, 
      getDocs,
      query,
      where,
      doc,
      setDoc,
      getDoc 
    } from "firebase/firestore";

  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 


  import { validateSignInForm, removeErrorsOnInput } from "./signInValidation";
  import { validateSignUpForm, removeSignUpErrorOnInput } from "./signUpValidation";
  import { renderData } from "./renderData";
  import {imageForm} from "./imageForm"; 



  import { validateSignInForm, removeErrorsOnInput } from "./signInValidation";
import { validateSignUpForm, removeSignUpErrorOnInput } from "./signUpValidation";
import { renderData } from "./renderData";
import {imageForm} from "./imageForm"; 




const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);


const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const signInButton = document.querySelector(".sign-in-button");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
const signInForm = document.querySelector(".sign-in-form");
const errorMessage = document.querySelector('.error-message');
const sortingSelect = document.querySelector('.sorting');

const priceFilter = document.querySelector('.price-filter');

const sizeSelect = document.querySelector('.size');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

const signUpFirstname = document.querySelector(".firstname");
const signUpLastname = document.querySelector(".lastname");
const signUpEmail = document.querySelector(".sign-up-email");
const signUpPassword = document.querySelector(".sign-up-password");
const signUpButton = document.querySelector(".sign-up-button");
const signUpError = document.querySelector(".sign-up-error");
const signUpForm = document.querySelector(".sign-up-form");

const signOutButton = document.querySelector(".sign-out-button");
const mainContentContainer = document.querySelector('.content-main-container');
const uploadForm = document.querySelector('.upload-form');



const signUpFormContainer = document.querySelector(".sign-up-form-container");
const signUpFormOpen = document.querySelector(".signup-form-open");
const accountFormButton = document.querySelector(".account-form-button");

const signInFormContainer  = document.querySelector( ".sign-in-form-container");
const signInFormClose = document.querySelector( ".sign-in-form-close")


const uploadContainer = document.querySelector(".upload-container");

const uploadToggleForm = document.querySelector(".upload-toggleform");
const uploadMenu = document.querySelector(".upload-menu");
const filterToggle = document.querySelector('.filter-toggle');
const filterMenu = document.querySelector('.filter-menu'); 


const currencyContainer = document.querySelector('.currency-container');
const currencyToggle = document.querySelector('.currency-toggle');
const currencyMenu = document.querySelector('.currency-menu'); 
const currencyOptions = document.querySelectorAll('.currency-option');


let currentCurrency = 'USD';
let currencyRates = []; 
