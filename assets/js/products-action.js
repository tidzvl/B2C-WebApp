/**
 * Products Action
 */

"use strict";

/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @function addToCart - add product to cart and show notification
 * * @todo Check out of stock -> pop up notification -> POST API add to cart.
 * @function renderFromAPI - render products from API
 * * @param {string} url - url of JSON have been get or can edit it to get JSON from API
 * * @todo Get JSON from API -> render product
 * @callback search.onclick - render product again after click search
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */

//BEGIN CALL ADD TO CART API

function addToCart(element) {
  const id = element.parentNode
    .querySelector(".product-id")
    .getAttribute("data-id");
  console.log(id); //that's product id

  const noti = {
    title: "Thêm thành công!",
    text: "Một lựa chọn thật tuyệt vời!",
    icon: "success",
  }; //default is success
  //check if out of stock -> noti type is error and text is out of stock

  Swal.fire({
    title: noti.title,
    text: noti.text,
    icon: noti.icon,
    customClass: {
      confirmButton: "btn btn-primary",
    },
    buttonsStyling: false,
  });
}

//END CALL ADD TO CART API


$(document).ready(function() {
  const text = localStorage.getItem('menuItemSelected');
  $('.type-product').text(text);
  renderFromAPI("/assets/json/all-products.json");
});


(function () {
  //loading product do not use jQuery

  //BEGIN SEARCH BUTTON
  const search = document.querySelector(".search");
  const searchInput = document.querySelector(".search-input");
  search.onclick = function () {
    const brand = document.querySelector("#brand").value;
    const price = document.querySelector("#price").value;
    const os = document.querySelector("#os").value;
    const fromto = document
      .querySelector("#slider-primary")
      .querySelectorAll(".noUi-tooltip");
    const from = fromto[0].innerText;
    const to = fromto[1].innerText;
    console.log(brand, price, os);
    console.log(from, to);
    document.querySelector(".all-products").innerHTML = `
    <div class="card-body card-widget-separator">
    <div class="text-center">
                        <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div> 
                      </div>
                      `;
    //FETCH API TO GET PRODUCT BY BRAND, PRICE, OS, FROM, TO
    /** TODO */
    //END
    renderFromAPI("/assets/json/all-products.json"); //EDIT THAT
  };

  //END SEARCH BUTTON

  //VALUE SUPPORT BEGIN
  const max_per_page = 8;
  var a = 0;
  var active = 1;
  var begin = [true, 1];
  var end = [false, 5, 100];
  var middle;
  //VALUE SUPPORT END
  renderFromAPI("/assets/json/all-products.json");
  function renderFromAPI(list_products) {
    fetch(list_products)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        end[2] = Math.ceil(data.data.length / max_per_page);
        function renderProducts(products, start, step) {
          var productsList = document.querySelector(".all-products");
          productsList.innerHTML = "";

          var end = start + step;
          for (var i = start; i < end; i++) {
            if (i >= products.length) break;
            var product = products[i];
            var productDiv = document.createElement("div");
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
                      <div class="carousel-item active">
                        <img class="d-block w-100" src="../../assets/img/products/${product.image[0]}" alt="First slide" />
                        <div class="carousel-caption d-none d-md-block">
                        </div>
                      </div>
                      <div class="carousel-item">
                        <img class="d-block w-100" src="../../assets/img/products/${product.image[1]}" alt="Second slide" />
                        <div class="carousel-caption d-none d-md-block">
                        </div>
                      </div>
                      <div class="carousel-item">
                        <img class="d-block w-100" src="../../assets/img/products/${product.image[2]}" alt="Third slide" />
                        <div class="carousel-caption d-none d-md-block">
                        </div>
                      </div>
                    </div>
                  </div>        
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
                    <span class="product-id" data-id="${product.productId}"></span>
                    <h5 class="card-text"> ${product.price} đ</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><small class="text-muted">Click vào <i class="tf-icons bx bx-fullscreen"></i> để xem chi tiết.</small></p>
                    <a onclick="addToCart(this)" id="type" type="button" class="btn btn-primary " style="color: white; position: absolute; bottom: 0; margin-bottom: 5%">Thêm vào giỏ hàng</a>
                    </div>
                </div>`;

            productsList.appendChild(productDiv);
          }
        }

        function renderPagination() {
          const pagination = document.querySelectorAll(".page-get");
          const allpagination = document.querySelector(".pagination");
          if (active > 1) begin[0] = false;
          else begin[0] = true;
          if (active == end[2]) end[0] = true;
          else end[0] = false;
          for (let i = 0; i < 5; i++) {
            for (const element of pagination) {
              element.classList.remove("active");
            }
            if (active > 3)
              pagination[i].querySelector(".page-link").innerText =
                begin[1] + i - 2;
            else pagination[i].querySelector(".page-link").innerText = i + 1;
            if (active < 4) pagination[active - 1].classList.add("active");
            else pagination[2].classList.add("active");
          }
          if (!begin[0]) {
            allpagination.querySelector(".prev").classList.remove("disabled");
            allpagination.querySelector(".first").classList.remove("disabled");
          } else {
            allpagination.querySelector(".prev").classList.add("disabled");
            allpagination.querySelector(".first").classList.add("disabled");
          }
          if (!end[0]) {
            allpagination.querySelector(".next").classList.remove("disabled");
            allpagination.querySelector(".last").classList.remove("disabled");
          } else {
            allpagination.querySelector(".next").classList.add("disabled");
            allpagination.querySelector(".last").classList.add("disabled");
          }
        }

        const products = data.data;
        renderProducts(products, a, max_per_page);
        renderPagination();

        //NEXT FUNCTION BEGIN
        var next = document.querySelector(".next");
        document.querySelector(".first").onclick = function () {
          if (!begin[0]) {
            renderProducts(products, 0, max_per_page);
            a = 0;
            active = 1;
            begin[1] = 1;
            renderPagination();
          }
        };
        next.onclick = function () {
          if (!end[0]) {
            renderProducts(products, (a += max_per_page), max_per_page);
            active++;
            begin[1]++;
            renderPagination();
          }
        };
        //NEXT FUNCTION END

        //PREVIOUS FUNCTION BEGIN
        var previous = document.querySelector(".prev");
        document.querySelector(".last").onclick = function () {
          if (!end[0]) {
            renderProducts(
              products,
              products.length - max_per_page,
              max_per_page
            );
            a = products.length - max_per_page;
            active = end[2];
            begin[1] = end[2];
            renderPagination();
          }
        };
        previous.onclick = function () {
          if (!begin[0]) {
            renderProducts(products, (a -= max_per_page), max_per_page);
            active--;
            begin[1]--;
            renderPagination();
          }
        };
        //PREVIOUS FUNCTION END

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

              expandElement
                .closest(".card")
                .classList.toggle("card-fullscreen");
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
  }
})();
