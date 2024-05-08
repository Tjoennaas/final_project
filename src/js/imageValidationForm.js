


function imageValidationForm(titleInput, descriptionInput, imageInput, imageError) {
    let errorStatus = false;
    if (!imageInput.value || !titleInput.value || !descriptionInput.value) {
        errorStatus = true;
        imageError.style.display = "block";
        imageError.textContent = "Please complete all the fields";
    } else {
        errorStatus = false;
        imageError.style.display = "none"; 
        imageError.textContent = "";
    }
    return { errorStatus };
  }
  
  export {imageValidationForm};