
import { firebaseConfig } from "./firebaseConfig";
import { API_KEY } from "./key"; 
import { initializeApp } from "firebase/app";



//ref: https://firebase.google.com/docs/auth/web/password-auth
//ref: https://firebase.google.com/docs/auth/web/start
//ref: https://firebase.google.com/docs/auth/web/manage-users

import {
  getAuth, 
  createUserWithEmailAndPassword, //Allows new users to register with the app using email address and a password.
  signOut, //To sign out user.
  signInWithEmailAndPassword, //Signs in to the app, with email address and password.
  onAuthStateChanged, // When a user are signs in, get information about the user in the observer.
} from "firebase/auth";




//ref:  https://firebase.google.com/docs/firestore

import{
  getFirestore,
  doc, //Creates a reference to a specific document.
  addDoc, //Add new document to a collection.
  setDoc, // Ensure that  metadata is stored with a specific document ID
  getDoc, //Retrieves document from Firestore.
  getDocs, //Retrieves all documents from a collection.
  collection,  // Allow users to store and retrieve metadata withimages.
  query, //Specifies the criteria for selecting documents from a collection.
  where,  //Filters documents based on specific values.

} from "firebase/firestore";





// ref: https://firebase.google.com/docs/storage/web/create-reference
// ref: https://firebase.google.com/docs/storage/web/upload-files
// ref: https://firebase.google.com/docs/storage/web/download-files

// Using storag to uplod images in firebase. 

import { 
   getStorage, 
   ref, //Points to the root of my storage.
   uploadBytes, //uploads images to storage.
   getDownloadURL // Get the download URL for a file.
   } from "firebase/storage";


import {
  validateSignInForm,
  removeErrorsOnInput,
} from "./signInValidation";

import {
  validateSignUpForm,
  removeSignUpErrorOnInput,
} 
from "./signUpValidation";

import {renderData  }from "./renderData";

/*import { imageForm } from "./imageValidationForm";*/


const app = initializeApp(firebaseConfig); 
const authService = getAuth(app); 
const database = getFirestore(app); 
const storage = getStorage(app); 



/* ------- Select elements in HTML ------------ */


const UserFrontpage = document.querySelector(".user-frontpage");

// Forms and buttons for sign in, up and out.

const accountFormContainer = document.querySelector(".account-form-container");
const accountFormButton = document.querySelector(".account-form-button");

const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const signInButton = document.querySelector(".sign-in-button");
const signInForm = document.querySelector(".sign-in-form");
const signInFormClose = document.querySelector(".sign-in-form-close");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
const errorMessage = document.querySelector(".error-message");

const signUpFormContainer = document.querySelector(".sign-up-form-container");
const signUpForm = document.querySelector(".sign-up-form");
const signUpFirstname = document.querySelector(".firstname");
const signUpLastname = document.querySelector(".lastname");
const signUpEmail = document.querySelector(".sign-up-email");
const signUpPassword = document.querySelector(".sign-up-password");
const signUpButton = document.querySelector(".sign-up-button");
const signUpFormOpen = document.querySelector(".signup-form-open");
const signUpError = document.querySelector(".sign-up-error");
const signOutButton = document.querySelector(".sign-out-button");


//Search, filter button, filter option.

const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

const filterToggle = document.querySelector(".filter-toggle");
const filterMenu = document.querySelector(".filter-menu");

const priceFilterOptions = document.querySelectorAll(".price-filter .filter-option");
const sizeFilterOptions = document.querySelectorAll(".size-filter .filter-option");
const sortOptions = document.querySelectorAll(".sorting-filter .filter-option");


//Currensy form and image form.

const uploadImageContainer= document.querySelector(".upload-image-container");
const uploadImageMenu = document.querySelector(".upload-image-menu");
const uploadImageForm = document.querySelector(".upload-image-form");
const uploadImageButton = document.querySelector(".upload-image-button");
const titleInput = document.querySelector(".title-input");
const priceInput = document.querySelector(".price-input");
const sizeInput = document.querySelector(".size-input");


const currencyContainer = document.querySelector(".currency-container");
const currencyToggle = document.querySelector(".currency-toggle");
const currencyMenu = document.querySelector(".currency-menu");
const currencyOptions = document.querySelectorAll(".currency-option");



/* ------ Fecth and render currency -------- */

let currentCurrency = "USD"; //Defult value.
let currencyRates = {}; //Will store exchang rat for chosen currencies.


//Add click event listeners that allows users to select a currency

  currencyOptions.forEach(currencyOption => {
  currencyOption.addEventListener("click", () => {
  const selectedCurrency = currencyOption.dataset.currency; //The data-currency attribute in the HTML element, becomes dataset.currency in javascript
  currentCurrency = selectedCurrency; //Updates the currentCurrency to the newly selected currency. 
  
  if (authService.currentUser ) {
    
    updateCurrencyInFirestore( authService.currentUser.uid , currentCurrency);//Saves the user's currency preference if they are signed in.
  }
    updatePrices(currentCurrency, currencyRates); //Updates the prices based on the selected currency.
    currencyOptions.forEach(currencyOption => currencyOption.classList.remove("selected-currency"));//Remove the selected class from option.
    currencyOption.classList.add("selected-currency"); // Add "selected" class to the clicked option.
  });
});


//Fetch the api currency

 async function fetchCurrencyRates() {
 const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`; 
  console.log(API_KEY);

  try {
    const response = await fetch(url); //Sends HTTP request to the url and waits for the respons.
    const data = await response.json(); //The parsed JSON object is assigned to data variable.
    currencyRates = data.conversion_rates; //Assigns the value of data.conversion_rates to currencyRates, for updating prices based on different currencies.
    if  ( authService.currentUser)  {
      loadUserCurrencySetting(); //If the user is sign in sett the prefered currensy.
    } else {
      updatePrices(currentCurrency, currencyRates); //If the user is not sign in.
    }
  } catch (error) {
    console.error("Error fetching currency rates", error);
  }
}


// Load the currency to the webpage from firebase

async function loadUserCurrencySetting() {  //Loads the users currensy preferanse from  firestore to the websithe.
  const userCurrencyRef = doc(database, "userPreferences", authService.currentUser.uid ); //Creates a reference to a document in the Firestore.
  const docSnap = await getDoc(userCurrencyRef); //Fetching the document.
  if (docSnap.exists() && docSnap.data().currency) { //Cheks if the document exsist and if it contais a currensy. 
    currentCurrency = docSnap.data().currency; //To get the preferd currensy from firestore.
    updatePrices(currentCurrency, currencyRates); // Updates the prices displayed on the website.
  } else {
    console.log("No currency preference found.");
  }
}


//update the new currency

async function updatePrices(newCurrency, rates) {
  document.querySelectorAll(".price").forEach(priceElement => {
    const basePrice = parseFloat(priceElement.getAttribute("data-basePrice"));// Parsfloat convert a string to a number.And the basePrice holdes the numrik value.

    if (rates && rates[newCurrency]) { // Check if the rates object and newCurrensy exsists.
      const convertedPrice = (basePrice * rates[newCurrency]).toFixed(2); // Calculate the converted price.
      priceElement.textContent = `${convertedPrice} ${newCurrency}`; // Update the text to show the converted price and the new currency.
    } else {
      console.error("Rates not available for:", newCurrency);
      priceElement.textContent = "Error: Rates not available";
    }
 });
}

async function updateCurrencyInFirestore(userId, newCurrency) {
  const userCurrencyRef = doc(
        database,
       "userPreferences", 
        userId
    );
  try {
    await setDoc(userCurrencyRef, 
      { currency: newCurrency }, 
      { merge: true });
       console.log("Currency saved.");
  } catch (error) {
       console.error("Error saving currency preference:");
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchCurrencyRates();
});


onAuthStateChanged(authService, async (user) => {
  if (user) {
      await fetchCurrencyRates(); 
      await loadUserCurrencySetting(); 
      fetchAndRenderImages();
  } else {
      displayLoggedOutState();
      renderData([]);
  }
});


/* ---------- Buttons and accordions ------------- */


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


/* -------- Account forms ----------- */


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
     }  catch (error) {
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

/* --------- Upload images ------------- */

uploadImageForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const imageInput = document.querySelector(".image-input");
  const user = authService.currentUser;


  // Validate form fields
  if (!imageInput.value || !titleInput.value || !sizeInput.value) {
    alert("Please complete all the fields");
    return; // If validation fails, stop the execution.
  }

//Ref:  https://firebase.google.com/docs/storage/web/file-metadata
  const imageFile = imageInput.files[0];
  if (imageFile) {
    const storageRef = ref(storage, `images/${user.uid}/${imageFile.name}`); // Creates a reference to a storage location based on the user's unique ID and the image file's name.
    const metadata = {   // Contains information about the file being uploaded.     
      customMetadata: {
        title: titleInput.value,
        title_lowercase: titleInput.value.toLowerCase(),
        price: priceInput.value,
        currency: currentCurrency,
        size: sizeInput.value
      }
    };

      //Ref: https://firebase.google.com/docs/storage/web/download-files
    
      const snapshot = await uploadBytes(storageRef, imageFile, metadata); // Uploads the imageFile to the storage specified by storageRef
      const url = await getDownloadURL(snapshot.ref); // Generate a URL to download the uploaded files.
      await addDoc(collection(database, "images"), { // Add document in Firestore, to the collection named images 
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
      uploadImageForm.reset();
      alert("Image uploaded successfully!");
      }  else {
    alert("Please select an image file to upload.");
  }
});


/* --------  sort, filter and serch  images ---------- */

// Set up event listeners to manage filter categories

document.addEventListener("DOMContentLoaded", () => {

  const filterCategories = document.querySelectorAll(".filter-category"); 

  filterCategories.forEach(filterCategory => {
    const filterToggleButton = filterCategory.querySelector(".filter-toggle-button");
    const filterOptions = filterCategory.querySelector(".filter-options");
    const filterOption = filterCategory.querySelectorAll(".filter-option");

    toggleFilterOptions(filterToggleButton, filterOptions);

    updateFilterState(filterOption, "selected-filter-option");
  });
});

function toggleFilterOptions(filterToggleButton, filterOptions) {
    filterToggleButton.addEventListener('click', () => {
    filterOptions.classList.toggle("filter-options--visible");
  });
}

function updateFilterState(filterOption, selectedFilterOption) {
    filterOption.forEach(option => {
    option.addEventListener('click', () => {
      filterOption.forEach(option => 
      option.classList.remove(selectedFilterOption));
      option.classList.add(selectedFilterOption);

      fetchAndRenderImages(searchInput.value.trim());
    });
  });
}

function getSelectedFilterValue(filterOption) {
  
const selectedOption = Array.from(filterOption)
  .find(option => option.classList.contains("selected-filter-option"));

  if (selectedOption) {
     return selectedOption.getAttribute("data-value");
  }  else {
     return "all";
  }
} 

async function fetchAndRenderImages(searchTerm = "") {
  const user = authService.currentUser; 
  if (!user) {
    renderData([]);
    return;
  }


  //Apply sorting and filtering based on user criteria. 


  //ref: https://firebase.google.com/docs/firestore/query-data/get-data

  let userImages = collection(database, "images"); //Set up a referanse to image collection to firestore
  let queryConstraint = query(userImages, where("userId", "==", user.uid)); //Fetch document from the "images", ensure that only the images is uploaded by the current user.


  //ref: https://stackoverflow.com/questions/38618953/how-to-do-a-simple-search-in-string-in-firebase-database

  if (searchTerm) {
    queryConstraint = query(userImages,
      where("userId", "==", user.uid),
      where("title_lowercase", ">=", searchTerm.toLowerCase()),
      where("title_lowercase", "<=", searchTerm.toLowerCase() + "\uf8ff"));
  }

  const querySnapshot = await getDocs(queryConstraint); // The function returns a new object for each document snapshot 
  let images = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


  applySortingAndFiltering(images); //Filters the images based on certain criteria.

  updatePrices(currentCurrency, currencyRates); //Adjusts the prices of the images to reflect the specified currency.

}

function applySortingAndFiltering(images) {
  const sortOption = getSelectedFilterValue(sortOptions);
  const selectedPriceRange = getSelectedFilterValue(priceFilterOptions);
  const selectedSize = getSelectedFilterValue(sizeFilterOptions);


// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

  if (selectedPriceRange !== "all") {
    if (selectedPriceRange === "100-200$") {
      images = images.filter(image => parseFloat(image.price) >= 100 && parseFloat(image.price) <= 200);
    } else if (selectedPriceRange === "200-300$") {
      images = images.filter(image => parseFloat(image.price) >= 200 && parseFloat(image.price) <= 300);
    }
  }

  if (selectedSize !== "all") {
    if (selectedSize === "30 x 30cm") {
      images = images.filter(image => image.size === 
        image.size === "30 x 30cm" ||
        image.size === "30 x 30 cm" ||
        image.size === "30x30cm" ||
        image.size === "30x30 cm"
      );
    }
     else if (selectedSize === "40 x 50cm") {
     images = images.filter(image => image.size ===
      image.size === "40 x 50cm" ||
      image.size === "40 x 50 cm" ||
      image.size === "40x50cm" ||
      image.size === "40x50 cm"
     );
  }
}

  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

  if (sortOption !== "all") {
    if (sortOption === "price-low-to-high") {
      images.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === "price-high-to-low") {
      images.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
  }
  renderData(images, currentCurrency, currencyRates);  
}

// Logic to the search input

document.addEventListener('DOMContentLoaded', () => {
  searchButton.addEventListener('click', () => fetchAndRenderImages(searchInput.value.trim()));

  
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
      fetchAndRenderImages(); // Reset filter when input is empty
    } 
  });
})

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
  uploadImageForm.style.display = "block";
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
  uploadImageForm.style.display = "none";
  accountFormButton.style.display = "block";
  uploadImageContainer.style.display = "none"; 
  currencyContainer.style.display = "none";
  accountFormContainer.style.display = "none";
  frontpageContainer.style.display = "block";
  document.body.style.backgroundColor =  "rgb(208, 251, 212)"; 
  navigation.style.backgroundColor = "rgb(130, 126, 115)";
}
