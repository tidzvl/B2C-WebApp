/**
 * Cards Actions
 */

"use strict";

//BEGIN CALL ADD TO CART API

function addToCart(element) {
  const id = element.parentNode.querySelector(".product-id").getAttribute("data-id");
  console.log(id);
  
}


//END CALL ADD TO CART API


(function () {
  //loading product do not use jQuery
  fetch("/assets/json/all-products.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const products = data.data;
      console.log(products.length);
      var productsList = document.querySelector(".all-products");
      //loop
      for (var i = 0; i < 12; i++) {
        var product = products[i];
        var productDiv = document.createElement("div");
        productDiv.className = "col-md";
        productDiv.innerHTML = `
        <div class="card card-action mb-4" style="height: 100%">
            <img src="../../assets/img/products/${product.image[0]}" class="card-img-top" alt="..." style="margin-top: 5%">
            <div class="card-header">
            <h3 class="card-action-title">${product.name}</h3>
            <div class="card-action-element">
                <ul class="list-inline mb-0">
                <li class="list-inline-item">
                    <a href="javascript:void(0);" class="card-expand"><i class="tf-icons bx bx-fullscreen"></i></a>
                </li>
                </ul>
            </div>
            </div>
            <div class="card-body">
              <span class="product-id" data-id="${product.product_id}"></span>
              <h5 class="card-text"> ${product.price} đ</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text"><small class="text-muted">Click vào <i class="tf-icons bx bx-fullscreen"></i> để xem chi tiết.</small></p>
              <a onclick="addToCart(this)"  class="btn btn-primary " style="color: white; position: absolute; bottom: 0; margin-bottom: 5%">Thêm vào giỏ hàng</a>
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