
const frontpage = document.querySelector(".frontpage");


class createImageFrontpage {
    constructor(src) {
        this.src = src;


        this.addImg = function ( frontpage) {

        const imgElement = document.createElement('img');

            imgElement.src = this.src;

            imgElement.classList.add('uploaded-image');

            frontpage.appendChild(imgElement);
        };
    }
}

    frontpage.innerText = ""; 

     const images = [
        new CreateImage("../src/assets/01.png"),
        new CreateImage("../src/assets/02.png"),
        new CreateImage("../src/assets/03.png"),
        new CreateImage("../src/assets/04.png"),
        new CreateImage("../src/assets/05.png"),
        new CreateImage("../src/assets/06.png")
    ];

    images.forEach(image => {
        image.addImg(frontpage);
    });

