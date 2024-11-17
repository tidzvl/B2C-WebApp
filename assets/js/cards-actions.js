/**
 * Cards Actions
 */

"use strict";

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
      for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var productDiv = document.createElement("div");
        productDiv.className = "col-md";
        productDiv.innerHTML = `
        <div class="card card-action mb-4">
            <img src="../../assets/img/products/${product.image[0]}" class="card-img-top" alt="...">
            <div class="card-header">
            <span class="product-id" data-id="${product.id}"></span>
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
            <h5 class="card-text"> ${product.price} đ</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><small class="text-muted">Click vào <i class="tf-icons bx bx-fullscreen"></i> để xem chi tiết.</small></p>
            <a href="#" class="btn btn-primary">Thêm vào giỏ hàng</a>
            </div>
        </div>`;
        productsList.appendChild(productDiv);
      }
      const collapseElementList = [].slice.call(
        document.querySelectorAll(".card-collapsible")
      );
      const expandElementList = [].slice.call(
        document.querySelectorAll(".card-expand")
      );
      const closeElementList = [].slice.call(
        document.querySelectorAll(".card-close")
      );

      let cardDnD = document.getElementById("sortable-4");

      // Collapsible card
      // --------------------------------------------------------------------
      if (collapseElementList) {
        collapseElementList.map(function (collapseElement) {
          collapseElement.addEventListener("click", (event) => {
            event.preventDefault();
            // Collapse the element
            new bootstrap.Collapse(
              collapseElement.closest(".card").querySelector(".collapse")
            );
            // Toggle collapsed class in `.card-header` element
            collapseElement
              .closest(".card-header")
              .classList.toggle("collapsed");
            // Toggle class bx-chevron-down & bx-chevron-up
            Helpers._toggleClass(
              collapseElement.firstElementChild,
              "bx-chevron-down",
              "bx-chevron-up"
            );
          });
        });
      }

      // Card Toggle fullscreen
      // --------------------------------------------------------------------
      if (expandElementList) {
        expandElementList.map(function (expandElement) {
          expandElement.addEventListener("click", (event) => {
            event.preventDefault();
            // Toggle class bx-fullscreen & bx-exit-fullscreen
            Helpers._toggleClass(
              expandElement.firstElementChild,
              "bx-fullscreen",
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

// Card reload (jquery)
// --------------------------------------------------------------------
// $(function () {
//   const cardReload = $('.card-reload');
//   if (cardReload.length) {
//     cardReload.on('click', function (e) {
//       e.preventDefault();
//       var $this = $(this);
//       $this.closest('.card').block({
//         message:
//           '<div class="sk-fold sk-primary"><div class="sk-fold-cube"></div><div class="sk-fold-cube"></div><div class="sk-fold-cube"></div><div class="sk-fold-cube"></div></div><h5>LOADING...</h5>',

//         css: {
//           backgroundColor: 'transparent',
//           border: '0'
//         },
//         overlayCSS: {
//           backgroundColor: $('html').hasClass('dark-style') ? '#000' : '#fff',
//           opacity: 0.55
//         }
//       });
//       setTimeout(function () {
//         $this.closest('.card').unblock();
//         if ($this.closest('.card').find('.card-alert').length) {
//           $this
//             .closest('.card')
//             .find('.card-alert')
//             .html(
//               '<div class="alert alert-solid-danger alert-dismissible fade show" role="alert"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button><span class="fw-medium">Holy grail!</span> Your success/error message here.</div>'
//             );
//         }
//       }, 2500);
//     });
//   }
// });
