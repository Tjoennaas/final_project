
import { getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, deleteObject, ref } from 'firebase/storage';

function renderData(images) {
    const imagesContainer = document.querySelector(".images-container");
    imagesContainer.innerText = " "; 

    images.forEach((image) => {
        const container = document.createElement("div");
        const imageElement = document.createElement("img");
        const titleElement = document.createElement("p");
        const sizeElement = document.createElement("p");
        const deleteButton = document.createElement("button");
        const priceElement = document.createElement("p");
        const displayCurrency = image.currency || "USD";  
        const basePrice = parseFloat(image.price);  //basePrice: Store the numeric form of the image's price
                                                   // parseFloat: converts the price from a string format to a float (numeric format).
    
       
        imageElement.classList.add("uploaded-image");
        deleteButton.classList.add("delete-button");
        priceElement.classList.add("price");
        priceElement.setAttribute("data-basePrice", basePrice); // Attach data to the priceElement.
       

        container.append(
            titleElement, 
            sizeElement, 
            priceElement, 
            imageElement, 
            deleteButton);
        imagesContainer.appendChild(container);


        imageElement.src = image.url;
        imageElement.alt = image.title; 
        titleElement.textContent = image.title;
        sizeElement.textContent = image.size;
        priceElement.textContent = `${basePrice.toFixed(2)} ${displayCurrency}`; 
        deleteButton.textContent = "Delete";
      

        deleteButton.addEventListener('click', async () => {
            const docRef = doc(getFirestore(), "images", image.id);
            const storageRef = ref(getStorage(), image.storagePath);
             
            try {
                await deleteDoc(docRef);
                await deleteObject(storageRef);
                container.remove();
            } catch (error) {
                console.error("Error removing image: ", error);
                alert('Failed to delete image!');
            }
        });
    });
}


export {renderData};