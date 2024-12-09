/**
 * Cards Actions
 */

"use strict";


//BEGIN CALL ADD TO CART API

function addToCart(element) {
  const id = element.parentNode.querySelector(".product-id").getAttribute("data-id");
  // console.log(id);
  
}


//END CALL ADD TO CART API


(function () {

  async function getData(){
    try{
      const response = await fetch(ApiHost+"/api/products/all");
      const data = await response.json();
      // console.log(data);
      return data.result;
    }catch(error){
      console.error(error);
    }
  }


  //loading product do not use jQuery
  getData()
    .then((data) => {
      const products = data;
      var productsList = document.querySelector(".all-products");
      //loop
      var count;
      if(products.length < 12) count = products.length;
      else count = 12;
      for (var i = 0; i < count; i++) {
        var product = products[i];
        var productDiv = document.createElement("div");
        var image = [];
        if(product.images.length == 0) image = Array.from({length: 3}, () => "https://i.ibb.co/Cs8hwmp/cube.png");
        else {
          image = product.images.slice(0, 3).map(function(img) {
            return img.url;
          });
        }
        productDiv.className = "col-md";
        productDiv.innerHTML = `
        <div class="card card-action mb-4" style="height: 100%">
        <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                      <button
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide-to="0"
                        class="active"
                        aria-current="true"
                        aria-label="Slide 1"></button>
                      <button
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide-to="1"
                        aria-label="Slide 2"></button>
                      <button
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                      ${image.map(function(img, index) {
                        return `
                          <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img class="d-block w-100" src="${img}" alt="Slide ${index + 1}" />
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>    
        <div class="card-header">
            <h3 class="card-action-title">${product.name}</h3>
            <div class="card-action-element">
                <ul class="list-inline mb-0">
                <li class="list-inline-item">
                    <p>
                      <span class="badge badge-center rounded-pill bg-label-primary">${product.stockQuantity}</span>
                    </p>
                </li>
                </ul>
            </div>
            </div>
            <div class="card-body">
              <span class="product-id" data-id="${product.productId}"></span>
              <h5 class="card-text"> ${product.price.toLocaleString("vi-VN")} đ</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text"><small class="text-muted">Số lượng đã bán: ${product.quantitySold || 0}</small></p>
              <a href="../product/"  class="btn btn-primary " style="color: white; position: absolute; bottom: 0; margin-bottom: 5%">Mua ngay kẻo lỡ!!!</a>
            </div>
        </div>`;
        productsList.appendChild(productDiv);
      }

      const expandElementList = [].slice.call(
        document.querySelectorAll(".card-expand")
      );
      const closeElementList = [].slice.call(
        document.querySelectorAll(".card-close")
      );

      let cardDnD = document.getElementById("sortable-4");
      // Card Toggle fullscreen
      // --------------------------------------------------------------------
      if (expandElementList) {
        expandElementList.map(function (expandElement) {
          expandElement.addEventListener("click", (event) => {
            event.preventDefault();
            // Toggle class bx-fullscreen & bx-exit-fullscreen
            Helpers._toggleClass(
              expandElement.firstElementChild,
              "bx-fullscreen-alt",
              "bx-exit-fullscreen"
            );

            expandElement.closest(".card").classList.toggle("card-fullscreen");
          });
        });
      }

      // Toggle fullscreen on esc key
      document.addEventListener("keyup", (event) => {
        event.preventDefault();
        //Esc button
        if (event.key === "Escape") {
          const cardFullscreen = document.querySelector(".card-fullscreen");
          // Toggle class bx-fullscreen & bx-exit-fullscreen

          if (cardFullscreen) {
            Helpers._toggleClass(
              cardFullscreen.querySelector(".card-expand").firstChild,
              "bx-fullscreen",
              "bx-exit-fullscreen"
            );
            cardFullscreen.classList.toggle("card-fullscreen");
          }
        }
      });

      // Card close
      // --------------------------------------------------------------------
      if (closeElementList) {
        closeElementList.map(function (closeElement) {
          closeElement.addEventListener("click", (event) => {
            event.preventDefault();
            closeElement.closest(".card").classList.add("d-none");
          });
        });
      }

      // Sortable.js (Drag & Drop cards)
      // --------------------------------------------------------------------
      if (typeof cardDnD !== undefined && cardDnD !== null) {
        Sortable.create(cardDnD, {
          animation: 500,
          handle: ".card",
        });
      }
    })
    .catch(function (error) {
      console.error("Error occurred while loading products: " + error);
    });
})();