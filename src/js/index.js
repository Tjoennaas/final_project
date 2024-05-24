
import { firebaseConfig } from "./firebaseConfig";
/*import { API_KEY } from "./key"; */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { 
  getStorage,
   ref, 
   uploadBytes,
   getDownloadURL } from "firebase/storage";

import {
  validateSignInForm,
  removeErrorsOnInput,
} from "./signInValidation";

import {
  validateSignUpForm,
  removeSignUpErrorOnInput,
} 

from "./signUpValidation";
import { renderData } from "./renderData";
import { imageForm } from "./imageValidationForm";

const app = initializeApp(firebaseConfig);
const authService = getAuth(app); //ref: https://firebase.google.com/docs/auth/web/start#web-modular-api_2
const database = getFirestore(app);
const storage = getStorage(app); //ref: https://firebase.google.com/docs/storage/web/upload-files


const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const signInButton = document.querySelector(".sign-in-button");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
const signInForm = document.querySelector(".sign-in-form");
const errorMessage = document.querySelector(".error-message");

const priceFilterToggle = document.querySelector('.price-filter .filter-toggle-button');
const sizeFilterToggle = document.querySelector('.size-filter .filter-toggle-button');
const sortingFilterToggle = document.querySelector('.sorting-filter .filter-toggle-button');

const priceFilterOptions = document.querySelectorAll('.price-filter .filter-option');
const sizeFilterOptions = document.querySelectorAll('.size-filter .filter-option');
const sortOptions = document.querySelectorAll('.sorting-filter .filter-option');

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
const accountFormContainer = document.querySelector(".account-form-container");
const signInFormClose = document.querySelector(".sign-in-form-close");

const uploadImageButton = document.querySelector(".upload-image-button");
const uploadImageMenu = document.querySelector(".upload-image-menu");
const filterToggle = document.querySelector(".filter-toggle");
const filterMenu = document.querySelector(".filter-menu");

const currencyContainer = document.querySelector(".currency-container");
const currencyToggle = document.querySelector(".currency-toggle");
const currencyMenu = document.querySelector(".currency-menu");
const currencyOptions = document.querySelectorAll(".currency-option");

const accountFormButton = document.querySelector(".account-form-button");
const uploadImageContainer= document.querySelector(".upload-image-container");
const UserFrontpage = document.querySelector(".user-frontpage");
const uploadForm = document.querySelector(".upload-image-form");

const titleInput = document.querySelector(".title-input");
const priceInput = document.querySelector(".price-input");
const sizeInput = document.querySelector(".size-input");
const imageError = document.querySelector(".image-error");


/*--------------------*/


let currentCurrency = "USD";
let currencyRates = [];

currencyOptions.forEach(option => {
  option.addEventListener("click", () => {
    const selectedCurrency = option.dataset.currency;
    currentCurrency = selectedCurrency;
    if (authService.currentUser) {

      updateCurrencyInFirestore(
        authService.currentUser.uid,  //ref https://firebase.google.com/docs/auth/web/manage-users
        currentCurrency
      );
    }

    updatePrices(currentCurrency, currencyRates);
    currencyOptions.forEach(opt => opt.classList.remove("selected"));
    option.classList.add("selected");
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
    console.error("Error fetching currency rates", error);
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
  document.querySelectorAll(".price").forEach(priceElement => {
    const basePrice = parseFloat(priceElement.getAttribute("data-basePrice"));

    if (rates && rates[newCurrency]) {
      const convertedPrice = (basePrice * rates[newCurrency]).toFixed(2);
      priceElement.textContent = `${convertedPrice} ${newCurrency}`;
    } else {
      console.error("Rates not available for:", newCurrency);
      priceElement.textContent = "Error: Rates not available";
    }
  });
}

async function updateCurrencyInFirestore(userId, newCurrency) {
  const userCurrencyRef = doc(database, "userPreferences", userId);
  try {
    await setDoc(userCurrencyRef, { currency: newCurrency }, { merge: true });
    console.log("Currency saved.");
  } catch (error) {
    console.error("Error saving currency preference:", error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchCurrencyRates();
});

onAuthStateChanged(authService, async (user) => {
  if (user) {
    await fetchCurrencyRates();  //ref: https://firebase.google.com/docs/auth/web/start#web-modular-api_3
  }
});


/*-----------------------*/


// currency toggle
currencyToggle.addEventListener("click", (e) => {
  e.preventDefault();
  currencyMenu.classList.toggle("currency-menu--visible");
});

// Filter toggle
filterToggle.addEventListener("click", (e) => {
  e.preventDefault();
  filterMenu.classList.toggle("filter-menu--visible");
});


// Upload image toggle
uploadImageButton.addEventListener("click", (e) => {
  e.preventDefault();
uploadImageMenu.classList.toggle("upload-image-menu--visible");
});

// Account form toggle
accountFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  accountFormContainer.style.display = "block";
});

signInFormClose.addEventListener("click", (e) => {
  e.preventDefault();
  accountFormContainer.style.display = "none";
});

signUpFormOpen.addEventListener("click", (e) => {
  e.preventDefault();
  signUpForm.classList.toggle("sign-up-form--visible");
});




/*-------------------*/



// Remove errors on input
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

// Sign up
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
        signUpPassword.value.trim()
      );
      signUpForm.reset();
      displayLoggedOutState();
      signUpFormContainer.style.display = "none";
    } catch (error) {
      signUpError.textContent = error.message;
    }
  }
});

// Sign in
signInButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validateSignInForm(
    emailInput.value.trim(),
    passwordInput.value.trim(),
    emailError,
    passwordError
  )) {
    try {
      await signInWithEmailAndPassword(
        authService,
        emailInput.value.trim(),
        passwordInput.value.trim()
      );
      signInForm.reset();
      displayLoggedInState();
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  }
});

// Sign out
signOutButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(authService);
    displayLoggedOutState();
  } catch (error) {
    console.error("Sign out failed:", error);
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


/*-----------------------*/


// Upload form submission
uploadForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const imageInput = document.querySelector(".image-input");
  const user = authService.currentUser;
  if (!user) {
    alert("You must be signed in to upload images.");
    return;
  }

  if (imageForm(titleInput, priceInput, sizeInput, imageInput, imageError)) {
    const imageFile = imageInput.files[0];
    if (imageFile) {
      const storageRef = ref(storage, `images/${user.uid}/${imageFile.name}`); //ref: https://firebase.google.com/docs/storage/web/upload-files
      const metadata = {
        contentType: imageFile.type,
        customMetadata: {
          title: titleInput.value,
          title_lowercase: titleInput.value.toLowerCase(),
          price: priceInput.value,
          currency: currentCurrency,
          size: sizeInput.value
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
      imageInput.style.display = "block";
      alert("Image uploaded successfully!");
    } else {
      alert("Please select an image file to upload.");
    }
  }
});


/*--------------------*/

// sort, filter and serch 


toggleFilterOptions(priceFilterToggle, document.querySelector(".price-filter .filter-options"));
toggleFilterOptions(sizeFilterToggle, document.querySelector(".size-filter .filter-options"));
toggleFilterOptions(sortingFilterToggle, document.querySelector(".sorting-filter .filter-options"));
function toggleFilterOptions(filterToggle, filterOptionsContainer) {
  filterToggle.addEventListener('click', () => {
    filterOptionsContainer.classList.toggle('filter-options--visible');
  });
} 

function updateFilterState(options, selectedClass) {
  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => opt.classList.remove(selectedClass));
      option.classList.add(selectedClass);
      fetchAndRenderImages(searchInput.value.trim());
    });
  });
}

updateFilterState(priceFilterOptions, "selected");
updateFilterState(sizeFilterOptions, "selected");
updateFilterState(sortOptions, "selected");

function getSelectedFilterValue(options) {
 const selectedOption = Array.from(options).find(option => option.classList.contains("selected"));
return selectedOption ? selectedOption.getAttribute("data-value") : "all";
}

async function fetchAndRenderImages(searchTerm = "") {
  const user = authService.currentUser;    // ref: https://firebase.google.com/docs/firestore/query-data/multiple-range-fields
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
      where("title_lowercase", "<=", searchTerm.toLowerCase() + "\uf8ff"));
  }


  const querySnapshot = await getDocs(queryConstraint);   // ref: https://firebase.google.com/docs/firestore/manage-data/add-data
  let images = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  applySortingAndFiltering(images);
}

function applySortingAndFiltering(images) {
  const sortOption = getSelectedFilterValue(sortOptions);
  const selectedPriceRange = getSelectedFilterValue(priceFilterOptions);
  const selectedSize = getSelectedFilterValue(sizeFilterOptions);

  if (selectedPriceRange !== "all") {
    if (selectedPriceRange === "100-200$") {
      images = images.filter(image => parseFloat(image.price) >= 100 && parseFloat(image.price) <= 200);
    } else if (selectedPriceRange === "200-300$") {
      images = images.filter(image => parseFloat(image.price) >= 200 && parseFloat(image.price) <= 300);
    }
  }


  if (selectedSize !== "all") {
    if (selectedSize === "30 x 30cm") {
      images = images.filter(image => image.size = "30 x 30cm");
    } else if (selectedSize === "40 x 50cm") {
      images = images.filter(image => image.size === "40 x 50cm" );
    }
  }

  if (sortOption !== "all") {
    if (sortOption === "price-low-to-high") {
      images.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === "price-high-to-low") {
      images.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
  }

  renderData(images);
}

document.addEventListener('DOMContentLoaded', () => {
  searchButton.addEventListener('click', () => fetchAndRenderImages(searchInput.value.trim()));
});


 const resetSearchFieldButton = document.querySelector(".reset-search-field-button");
 resetSearchFieldButton.addEventListener("click", () => {
   searchInput.value = ""; 
   fetchAndRenderImages(); 
 });


/*------------------------*/


const frontpageContainer = document.querySelector(".frontpage-container");
const navigation = document.querySelector(".navigation");

function displayLoggedInState() {
  UserFrontpage.style.display = "flex";
  signInForm.style.display = "none";
  signOutButton.style.display = "block";
  uploadForm.style.display = "block";
  accountFormButton.style.display = "none";
 uploadImageContainer.style.display = "block"; 
  currencyContainer.style.display = "block";
  accountFormContainer.style.display = "block";
  frontpageContainer.style.display = "none";
 document.body.style.backgroundColor = "rgb(208, 251, 212)"; 
  navigation.style.backgroundColor = "#3114E5";
}

function displayLoggedOutState() {
  signOutButton.style.display = "none";
  UserFrontpage.style.display = "none";
  signInForm.style.display = "flex";
  uploadForm.style.display = "none";
  accountFormButton.style.display = "block";
  uploadImageContainer.style.display = "none"; 

  currencyContainer.style.display = "none";
  accountFormContainer.style.display = "none";
  frontpageContainer.style.display = "block";
 /* document.body.style.backgroundColor = "#ff4362"; */

  document.body.style.backgroundColor =  "rgb(208, 251, 212)"; 
  navigation.style.backgroundColor = "rgb(130, 126, 115)";
}
