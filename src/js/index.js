

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

  import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

import { validateSignInForm, removeErrorsOnInput } from "./signInValidation";
import { validateSignUpForm, removeSignUpErrorOnInput } from "./signUpValidation";
import { renderData } from "./renderData";
import {imageForm} from "./imageValidationForm"; 




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
const errorMessage = document.querySelector(".error-message");
const sortingSelect = document.querySelector(".sorting");

const priceFilter = document.querySelector(".price-filter");
const sizeSelect = document.querySelector(".size");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");



const signUpFirstname = document.querySelector(".firstname");
const signUpLastname = document.querySelector(".lastname");
const signUpEmail = document.querySelector(".sign-up-email");
const signUpPassword = document.querySelector(".sign-up-password");
const signUpButton = document.querySelector(".sign-up-button");
const signUpError = document.querySelector(".sign-up-error");
const signUpForm = document.querySelector(".sign-up-form");

const signOutButton = document.querySelector(".sign-out-button");

const signUpFormContainer = document.querySelector(".sign-up-form-container");
const signUpFormOpen = document.querySelector(".signup-form-open");
const signInFormContainer  = document.querySelector(".sign-in-form-container");
const signInFormClose = document.querySelector(".sign-in-form-close")

const uploadToggleForm = document.querySelector(".upload-toggleform");
const uploadMenu = document.querySelector(".upload-menu");
const filterToggle = document.querySelector(".filter-toggle");
const filterMenu = document.querySelector(".filter-menu"); 

const currencyContainer = document.querySelector(".currency-container");
const currencyToggle = document.querySelector(".currency-toggle");
const currencyMenu = document.querySelector(".currency-menu"); 
const currencyOptions = document.querySelectorAll(".currency-option");

const accountFormButton = document.querySelector(".account-form-button");
const uploadContainer = document.querySelector(".upload-container");
const mainContentContainer = document.querySelector(".content-main-container");
const uploadForm = document.querySelector(".upload-form");

const titleInput = document.querySelector(".title-input");
const priceInput = document.querySelector(".price-input");
const sizeInput = document.querySelector(".size-input");
const imageError = document.querySelector(".image-error");



let currentCurrency = "USD";
let currencyRates = []; 



currencyOptions.forEach(option => {
    option.addEventListener("click", () => {
    const selectedCurrency = option.dataset.currency;
    currentCurrency = selectedCurrency;
  if(authService.currentUser) {
    updateCurrencyInFirestore(
    authService.currentUser.uid,
    currentCurrency);
    }

    updatePrices(currentCurrency, currencyRates);
   currencyOptions.forEach(opt => opt.classList.remove("selected")); 
    currencyOptions.value = selectedCurrency; 

  });
}); 



async function fetchCurrencyRates() {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      currencyRates = data.conversion_rates;
      if (authService.currentUser) {
        loadUserCurrencySetting();
      } else {
        updatePrices(currentCurrency, currencyRates);
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    }
  }


async function loadUserCurrencySetting() {
  const userCurrencyRef = doc(database, "userPreferences", authService.currentUser.uid);
  const docSnap = await getDoc(userCurrencyRef);
  if (docSnap.exists() && docSnap.data().currency) {
    currentCurrency = docSnap.data().currency;
    updatePrices(currentCurrency, currencyRates);
  } else {
    console.log("No currency preference found, using default.");
  }
}

async function updatePrices(newCurrency, rates) {
  document.querySelectorAll('.price').forEach(priceElement => {
    const basePrice = parseFloat(priceElement.getAttribute('data-basePrice'));
    if (rates && rates[newCurrency]) {
      const convertedPrice = (basePrice * rates[newCurrency]).toFixed(2);
      priceElement.textContent = `${convertedPrice} ${newCurrency}`;
    } else {
      console.error('Rates not available for:', newCurrency);
      priceElement.textContent = 'Error: Rates not available';
    }
  });
}

async function updateCurrencyInFirestore(userId, newCurrency) {
  const userCurrencyRef = doc(database, "userPreferences", userId);
  try {
    await setDoc(userCurrencyRef, { currency: newCurrency }, { merge: true });
    console.log("Currency, saved.");
  } catch (error) {
    console.error("Error saving currency preference:", error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchCurrencyRates();
});

onAuthStateChanged(authService, async (user) => {
  if (user) {
    await fetchCurrencyRates(); 
  }
});  

/*---------------------------------*/

//menu
currencyToggle.addEventListener ("click", (e) => {
  e.preventDefault();
  currencyMenu.classList.toggle ("currency-menu--visible");
});

// filter
filterToggle.addEventListener('click', (e) => {
  e.preventDefault();
  filterMenu.classList.toggle('filter-menu--visible');
});


//upload image
uploadToggleForm.addEventListener("click", (e) => {
  e.preventDefault ();
  uploadMenu.classList.toggle("upload-menu--visible");
});

//account form
 accountFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    signInFormContainer.style.display =  "block";
  })
  
 signInFormClose.addEventListener("click", (e)=> {
    e.preventDefault ();
    signInFormContainer.style.display = "none";
  })

 signUpFormOpen.addEventListener("click", (e) => {
    e.preventDefault();
    signUpForm.classList.toggle("sign-up-form--visible");
  }); 
   
 /*---------------------------------------------------------*/
  
 
 
removeErrorsOnInput(emailInput, passwordInput, emailError, passwordError);

signUpForm.addEventListener("input", () => {
  removeSignUpErrorOnInput(
      signUpFirstname.value.trim(),
      signUpLastname.value.trim(),
      signUpEmail.value.trim(),
      signUpPassword.value.trim(),
      signUpError
  );
});

signInButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validateSignInForm(
    emailInput.value.trim(), 
    passwordInput.value.trim(), 
    emailError, 
    passwordError)) {
      try {
          await signInWithEmailAndPassword(
           authService, 
           emailInput.value.trim(),
           passwordInput.value.trim());
           signInForm.reset();
          displayLoggedInState();
      } catch (err) {
          errorMessage.textContent = err.message;
      }
   }
});


signUpButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validateSignUpForm(
      signUpFirstname.value.trim(),
      signUpLastname.value.trim(),
      signUpEmail.value.trim(),
      signUpPassword.value.trim(),
      signUpError
  )) {
      try {
          await createUserWithEmailAndPassword(
            authService, 
            signUpEmail.value.trim(),
            signUpPassword.value.trim());
            signUpForm.reset();
            displayLoggedOutState();
            signUpFormContainer.style.display = 'none';
      } catch (error) {
          signUpError.textContent = error.message;
      }
    }
});


signOutButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
      await signOut(authService);
      displayLoggedOutState();
  } catch (error) {
      console.error("Sign out failed: ", error);
  }
});


onAuthStateChanged(authService, (user) => {
  if (user) {
      displayLoggedInState();
      fetchAndRenderImages(); 
  } else {
      displayLoggedOutState();
      renderData([]); 
  }
}); 
 /*-----------------------------------------------------------*/

uploadForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const imageInput = document.querySelector(".image-input");
  const user = authService.currentUser;
  if (!user) {
      alert('You must be signed in to upload images.');
      return;
  }


         if (imageForm(titleInput, priceInput, sizeInput, imageInput, imageError)) {
         const imageFile = imageInput.files[0];
         if (imageFile) {
              const storageRef = ref(storage, `images/${user.uid}/${imageFile.name}`);
              const metadata = {
              contentType: imageFile.type,
              customMetadata: {
                  "title": titleInput.value,
                  "title_lowercase": titleInput.value.toLowerCase(),
                  "price": priceInput.value,
                  "currency": currentCurrency,  
                  "size": sizeInput.value
              }
          };

          const snapshot = await uploadBytes(storageRef, imageFile, metadata);
          const url = await getDownloadURL(snapshot.ref);
          await addDoc(collection(database, "images"), {
              url,
              title: titleInput.value,
              title_lowercase: titleInput.value.toLowerCase(),
              price: priceInput.value,
              currency: currentCurrency,  
              size: sizeInput.value,
              userId: user.uid,
              storagePath: snapshot.ref.fullPath
          });

          fetchAndRenderImages();
          uploadForm.reset(); 
          imageInput.style.display = 'block';
          alert('Image uploaded successfully!');
      } else {
          alert('Please select an image file to upload.');
      }
  }
}); 
      /*----------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
  sortingSelect.addEventListener('change', () => fetchAndRenderImages(searchInput.value.trim()));
  priceFilter.addEventListener('change', () => fetchAndRenderImages(searchInput.value.trim()));
  sizeSelect.addEventListener('change', () => fetchAndRenderImages(searchInput.value.trim()));
  searchButton.addEventListener('click', () => fetchAndRenderImages(searchInput.value.trim()));
});

async function fetchAndRenderImages(searchTerm = '') {
  const user = authService.currentUser;
  if (!user) {
      renderData([]); 
      return;
  }

  let userImages = collection(database, "images");
  let queryConstraint = query(userImages, where("userId", "==", user.uid));

  if (searchTerm) {
      queryConstraint = query(userImages,
         where("userId", "==", user.uid),
         where("title_lowercase", ">=", searchTerm.toLowerCase()), 
         where("title_lowercase", "<=", searchTerm.toLowerCase() + '\uf8ff'));
  }

  const querySnapshot = await getDocs(queryConstraint);
  let images = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  applySortingAndFiltering(images);
}

function applySortingAndFiltering(images) {
  const sortOption = sortingSelect.value;
  const selectedPriceRange = priceFilter .value;
  const selectedSize = sizeSelect.value;


  if (selectedPriceRange === '100-200$') {
      images = images.filter(image => parseFloat(image.price) >= 100 && parseFloat(image.price) <= 200);
  } else if (selectedPriceRange === '200-300$') {
      images = images.filter(image => parseFloat(image.price) >= 200 && parseFloat(image.price) <= 300);
  }

  
  if (selectedSize === '30 x 30cm') {
      images = images.filter(image => image.size === '30 x 30cm');
  } else if (selectedSize === '40 x 50cm') {
      images = images.filter(image => image.size === '40 x 50cm');
  }


  if (sortOption === 'price-low-to-high') {
      images.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortOption === 'price-high-to-low') {
      images.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  renderData(images);
}




function displayLoggedInState() {
  mainContentContainer.style.display = 'flex';
  signInForm.style.display = 'none'; 
  signOutButton.style.display = 'block';
  uploadForm.style.display = 'block';
  accountFormButton.style.display = "none";
  uploadContainer.style.display = "block";
  currencyContainer.style.display ="block";
  signInFormContainer.style.display ="block";
  
}


function displayLoggedOutState() {
  signOutButton.style.display = "none";
  mainContentContainer.style.display = 'none';
  signInForm.style.display = 'flex';
  uploadForm.style.display = 'none';
  accountFormButton.style.display = "block";
  uploadContainer.style.display = "none";
  currencyContainer.style.display ="none";
  signInFormContainer.style.display ="none";


}  






