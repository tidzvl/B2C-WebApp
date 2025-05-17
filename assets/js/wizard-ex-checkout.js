/**
 *  Form Wizard
 */

/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @jQuery render all products in product-list.json -> want to change with api get cart and edit some display format
 * @default main - calculator total price when render product -> you can create the invoice with that price, that be easy
 * @NOTE discount is not working! Edit and remove address is not working!
 * @search "HERE IS ADDRESS" to go edit code if format not working!
 * @add ".that-be-dilivery and .that-be-address" - home or office and dilivery address, default is home and first address
 * @todo render if item in cart -> get id product of id item -> get product info -> end render
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */

"use strict";

$(function () {
  $(".layout-wrapper").block({
    message:
      '<div class="d-flex justify-content-center"><p class="me-2 mb-0">Please wait...</p> <div class="sk-wave sk-primary m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
    timeout: 3000,
    css: {
      backgroundColor: "transparent",
      border: "0",
    },
    overlayCSS: {
      backgroundColor: "#fff",
      opacity: 0.8,
    },
  });
});

setTimeout(function () {
  function calcNewPrice() {
    try {
      var qty_price = document.querySelectorAll(".qty-price");
      console.log(qty_price);
      var totalPrice = 0;
      var discount = document
        .querySelector(".total-discount")
        .innerHTML.split(" ")[0]
        .replaceAll(".", "");
      qty_price.forEach((item) => {
        var product_price = item
          .querySelector(".price-product")
          .innerHTML.split(" ")[0]
          .replaceAll(".", "");
        var product_qty = item.querySelector(".qty-product").value;
        totalPrice += parseInt(product_price) * parseInt(product_qty);
      });
      $(".total-price").html(totalPrice.toLocaleString("vi-VN") + " VNĐ");
      var price_been_discount = totalPrice - parseInt(discount);
      $(".total-all").html(
        price_been_discount.toLocaleString("vi-VN") + " VNĐ"
      );
      $(".total-pay").html(
        price_been_discount.toLocaleString("vi-VN") + " VNĐ"
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function putQty(productId, newQty) {
    try {
      var customerId = JSON.parse(localStorage.getItem("user_data")).customerId;
      calcNewPrice();
      const response = await fetch(
        ApiHost +
          "/api/cart/quantity?cartId=" +
          customerId +
          "&productId=" +
          productId,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            newQuantity: newQty,
          }),
        }
      );
      return response.json().code;
    } catch (error) {
      console.error(error);
    }
  }
  const inputElement = document
    .querySelectorAll(".qty-product")
    .forEach((element) => {
      element.addEventListener("input", (e) => {
        const newValue = e.target.value;
        element.setAttribute("value", newValue);
        // console.log(e.target.attributes['data-id'].value);
        // console.log(
        //   "id input: " +
        //     e.target.attributes["data-id"].value +
        //     ` Giá trị mới: ${newValue}`
        // );
        putQty(e.target.attributes["data-id"].value, newValue).then((data) => {
          // console.log("Cập nhật số lượng thành công!");
        });
      });
    });
}, 3000);

setTimeout(function () {
  async function ApplyDiscount() {
    try {
      var CartAndDiscount = [];
      var alldiscount = JSON.parse(localStorage.getItem("alldiscount"));
      var discountTitle = document.querySelector(
        "#select2-discount-select-container"
      ).title;
      var discount = alldiscount.filter(function (discount) {
        return discount.name === discountTitle;
      })[0];
      localStorage.setItem("apply_discount", discount.discountId);
      var totalDiscount = 0;
      var allProduct = document.querySelector(".products_list");
      allProduct.querySelectorAll(".list-group-item").forEach((item) => {
        if (
          discount.productNames.includes(
            item.querySelector(".product-name").innerHTML
          )
        ) {
          totalDiscount +=
            (parseInt(
              item
                .querySelector(".price-product")
                .innerHTML.split(" ")[0]
                .replace(".", "")
            ) *
              parseInt(item.querySelector(".qty-product").value) *
              discount.discountValue) /
            100;
          CartAndDiscount.push({
            cartItemId: item
              .querySelector(".qty-product")
              .getAttribute("cartitemid"),
            discountId: parseInt(discount.discountId),
          });
        } else {
          CartAndDiscount.push({
            cartItemId: item
              .querySelector(".qty-product")
              .getAttribute("cartitemid"),
            discountId: null,
          });
        }
      });
      localStorage.setItem("CartAndDiscount", JSON.stringify(CartAndDiscount));
      return totalDiscount;
    } catch {
      console.error(error);
    }
  }
  ApplyDiscount().then((data) => {
    $(".total-discount").html(data.toLocaleString("vi-VN") + " VNĐ");
    var totalPrice = parseInt(
      document
        .querySelector(".total-price")
        .innerHTML.split(" ")[0]
        .replaceAll(".", "")
    );
    // console.log(totalPrice);
    var price_been_discount = totalPrice - parseInt(data);
    $(".total-all").html(price_been_discount.toLocaleString("vi-VN") + " VNĐ");
    $(".total-pay").html(price_been_discount.toLocaleString("vi-VN") + " VNĐ");
  });
  document
    .querySelector(".apply-discount")
    .addEventListener("click", function (event) {
      ApplyDiscount().then((data) => {
        $(".total-discount").html(data.toLocaleString("vi-VN") + " VNĐ");
        var totalPrice = parseInt(
          document
            .querySelector(".total-price")
            .innerHTML.split(" ")[0]
            .replaceAll(".", "")
        );
        // console.log(totalPrice);
        var price_been_discount = totalPrice - parseInt(data);
        $(".total-all").html(
          price_been_discount.toLocaleString("vi-VN") + " VNĐ"
        );
        $(".total-pay").html(
          price_been_discount.toLocaleString("vi-VN") + " VNĐ"
        );
      });
    });
}, 3000);

setTimeout(function () {
  async function createOrder() {
    try {
      // console.log(document.querySelector(".final-address").id);
      if (document.querySelector(".final-address").id == "final-address") {
        var addId = parseInt(
          JSON.parse(localStorage.getItem("allAddress"))[0].id
        );
      } else addId = parseInt(document.querySelector(".final-address").id);
      // console.log(JSON.parse(localStorage.getItem("CartAndDiscount")));
      const response = await fetch(ApiHost + "/api/order/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          customerId: parseInt(
            JSON.parse(localStorage.getItem("user_data")).customerId
          ),
          addressId: addId,
          cartItems: JSON.parse(localStorage.getItem("CartAndDiscount")),
          isUseLoyalty: false,
        }),
      });
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }
  async function createPayment(orderid) {
    try {
      const response = await fetch(
        ApiHost + "/api/payment/create?orderId=" + orderid,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function createInvoice(orderid) {
    try {
      const response = await fetch(ApiHost + "/api/invoice", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          orderId: orderid,
        }),
      });
      localStorage.removeItem("order_id");
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function CheckPayment() {
    try {
      var orderCode = parseInt(localStorage.getItem("orderCode"));
      var orderid = localStorage.getItem("order_id");
      const response = await fetch(
        ApiHost + "/api/payment?orderCode=" + orderCode + "&orderId=" + orderid
      );
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  document
    .querySelector(".pay-create")
    .addEventListener("click", function (event) {
      // console.log("Đang kiểm tra!");
      createOrder().then((data) => {
        console.log(data);
        if (data.message == "Order created successfully") {
          //that is running ok
          var orderid = data.result.orderId;
          localStorage.setItem("order_id", orderid);
          createPayment(orderid).then((data) => {
            // console.log(data);
            if (data.code == 1000) {
              // console.log("Thanh toán thanh cong");
              document.querySelector(".loading-payment-ifame").src =
                data.data.checkoutUrl;
              document
                .querySelector(".loading-payment")
                .classList.add("d-none");
              localStorage.setItem("orderCode", data.data.orderCode);
            }
          });
        } else {
          document.querySelector(".loading-payment-ifame").src =
            "https://i.ibb.co/DLQnN5r/page-misc-error-light.png";
          document.querySelector(".loading-payment").classList.add("d-none");
          Swal.fire({
            title: "Oh no! 😢",
            text: "Giỏ hàng của bạn chưa có gì cả. Đến ngay với thiên đường mua sắm nào!",
            icon: "info",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          }).then(function (result) {
            window.location.href = "../product/";
          });
        }
      });
    });

  document
    .querySelector(".check-done")
    .addEventListener("click", function (event) {
      var content = document.querySelector(".end-content");
      CheckPayment().then((data) => {
        $(".modal-content").block({
          message:
            '<div class="sk-wave sk-primary mx-auto"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div>',
          timeout: 10000,
          css: {
            backgroundColor: "transparent",
            border: "0",
          },
          overlayCSS: {
            backgroundColor: "#fff",
            opacity: 0.8,
          },
        });
        console.log(data);
        if (data.data.status == "PAID") {
          //PAID
          $(".modal-content").unblock();
          // console.log("Thanh toán thanh cong");
          document.querySelector(".loading-payment-ifame").src =
            "https://i.ibb.co/68Qf4vC/image.png";
          Swal.fire({
            title: "Thành công! 😇",
            text: "Bạn đã thanh toán thành công đơn hàng, chúc bạn một ngày tốt lành!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });
          document.querySelector(".endgame").classList.remove("d-none");
          localStorage.removeItem("order_id");
          //Success noti
          content.querySelector(".spin-content").classList.add("d-none");
          content.querySelector(".noti-title").innerHTML = "Thank You! 😇";
          content.querySelector(".noti-sub-title").innerHTML =
            "Đơn hàng của bạn đã được tạo!";
          var email = JSON.parse(localStorage.getItem("user_data")).email;
          content.querySelector(".noti-content").innerHTML = `
                                                    Chúng tôi sẽ gửi email xác nhận đến <a class="email">${email}</a> để
                                                    bạn chấp nhận đơn hàng. Mọi chi phí bạn đều phải trả và không được
                                                    hoàn tiền dưới mọi hình thức. Nếu đơn hàng có vấn đề gì, hãy xem nó
                                                    là
                                                    bài học đầu đời.`;
          //
        } else {
          $(".modal-content").unblock();
          Swal.fire({
            title: "Oh no! 😢",
            text: "Thanh toán chưa thành công, vui lòng thử lại!",
            icon: "info",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });
        }
      });
    });

  document
    .querySelector(".pay-cod")
    .addEventListener("click", function (event) {
      var order_id = localStorage.getItem("order_id");
      var content = document.querySelector(".end-content");
      if (order_id) {
        createInvoice(order_id).then((data) => {
          console.log(data);
          //Success noti
          content.querySelector(".spin-content").classList.add("d-none");
          content.querySelector(".noti-title").innerHTML = "Thank You! 😇";
          content.querySelector(".noti-sub-title").innerHTML =
            "Đơn hàng của bạn đã được tạo!";
          var email = JSON.parse(localStorage.getItem("user_data")).email;
          content.querySelector(".noti-content").innerHTML = `
                                                    Chúng tôi sẽ gửi email xác nhận đến <a class="email">${email}</a> để
                                                    bạn chấp nhận đơn hàng. Mọi chi phí bạn đều phải trả và không được
                                                    hoàn tiền dưới mọi hình thức. Nếu đơn hàng có vấn đề gì, hãy xem nó
                                                    là
                                                    bài học đầu đời.`;
          //
        });
      } else {
        console.log("Chua tao don hang");
        createOrder().then((data) => {
          console.log(data);
          if (data.message == "Order created successfully") {
            //Success noti
            content.querySelector(".spin-content").classList.add("d-none");
            content.querySelector(".noti-title").innerHTML = "Thank You! 😇";
            content.querySelector(".noti-sub-title").innerHTML =
              "Đơn hàng của bạn đã được tạo!";
            var email = JSON.parse(localStorage.getItem("user_data")).email;
            content.querySelector(".noti-content").innerHTML = `
                                                      Chúng tôi sẽ gửi email xác nhận đến <a class="email">${email}</a> để
                                                      bạn chấp nhận đơn hàng. Mọi chi phí bạn đều phải trả và không được
                                                      hoàn tiền dưới mọi hình thức. Nếu đơn hàng có vấn đề gì, hãy xem nó
                                                      là
                                                      bài học đầu đời.`;
            //
            var orderid = data.result.orderId;
            localStorage.setItem("order_id", orderid);
            createInvoice(orderid).then((data) => {
              console.log(data);
            });
          } else if (
            data.message == "Error creating order: No items selected for order"
          ) {
            //Fail noti
            content.querySelector(".spin-content").classList.add("d-none");
            content.querySelector(".noti-title").innerHTML = "OH NOOOOO! 😢";
            content.querySelector(".noti-sub-title").innerHTML =
              "Đơn hàng của bạn chưa có gì trong đó mà!!!";
            content.querySelector(".noti-content").innerHTML = `
              Hãy truy cập vào <a href="../product/">đây</a> để lựa chọn sản phẩm phù hợp với mình bạn nhé!
            `;
            //
          }
        });
      }
    });
}, 3000);

// rateyo (jquery)
$(function () {
  async function getData(customerId) {
    try {
      const response = await fetch(
        ApiHost + "/api/cart/allItems?customerId=" + customerId
      );
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  async function getProducts(id) {
    try {
      const response = await fetch(ApiHost + "/api/products/" + id);
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  async function getDiscount() {
    try {
      const response = await fetch(ApiHost + "/api/discounts/all");
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  //jquery page 1 (gio hang)
  var products;
  let totalPrice = 0;
  //ajax call
  var customerId = JSON.parse(localStorage.getItem("user_data")).customerId;

  getData(customerId).then((data) => {
    products = data.result;
    // console.log(products);
    $(".num-of-item").html(products.length);
    var productsList = document.querySelector(".products_list");
    //loop
    products.forEach(function (product) {
      // console.log(product);
      getProducts(product.productId).then((Aproduct) => {
        var productSpan = document.createElement("li");
        productSpan.className = "list-group-item p-4";
        var status;
        var color;
        //check stock
        if (Aproduct.result.stockQuantity > 0) {
          status = "In Stock";
          color = "success";
        } else {
          status = "Out of Stock";
          color = "danger";
        }
        var image;
        if (Aproduct.result.images.length == 0) {
          image = "https://i.ibb.co/Cs8hwmp/cube.png";
        } else image = Aproduct.result.images[0].url;
        productSpan.innerHTML = `<div class="d-flex gap-3">
              <div class="flex-shrink-0">
                  <img src="${image}"
                      alt="${image}" class="w-px-100" />
              </div>
              <div class="flex-grow-1">
                  <div class="row qty-price">
                      <div class="col-md-8">
                          <h6 class="me-3">
                              <a href="javascript:void(0)"
                                  class="text-body"> <span class="product-name">${
                                    Aproduct.result.name
                                  }</span> (${Aproduct.result.version})</a>
                          </h6>
                          <div class="text-muted mb-1 d-flex flex-wrap">
                              <span class="me-1">Sold by:</span>
                              <a href="javascript:void(0)"
                                  class="me-1">${Aproduct.result.origin}</a>
                              <span class="badge bg-label-${color}">${status}</span>
                          </div>
                          <div class="read-only-ratings mb-2"
                              data-rateyo-read-only="true"></div>
                          <input type="number"
                              class="form-control form-control-sm w-px-75 qty-product"
                              data-id="${
                                Aproduct.result.productId
                              }" cartItemId="${product.cartItemId}"
                              value="${product.quantity}" min="1" max="${
          Aproduct.result.stockQuantity
        }" />
                      </div>
                      <div class="col-md-4">
                          <div class="text-md-end">
                              <button type="button"
                                  class="btn-close btn-pinned"
                                  aria-label="Close"></button>
                              <div class="my-2 my-md-4">
                                  <span
                                      class="text-primary price-product">${Aproduct.result.price.toLocaleString(
                                        "vi-VN"
                                      )} VNĐ</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>`;
        productsList.appendChild(productSpan);
        //add star rating
        var readOnlyRating = $(".read-only-ratings");
        if (readOnlyRating) {
          readOnlyRating.rateYo({
            rtl: isRtl,
            rating: Aproduct.result.evaluate,
            starWidth: "20px",
          });
        }
        var productsListCheckout = document.querySelector(
          ".products_list_checkout"
        );
        var productSpan = document.createElement("li");
        productSpan.className = "list-group-item";
        var status;
        var color;
        if (Aproduct.result.stockQuantity > 0) {
          status = "In Stock";
          color = "success";
        } else {
          status = "Out of Stock";
          color = "danger";
        }
        productSpan.innerHTML = `
                <div class="d-flex gap-3">
                  <div class="flex-shrink-0">
                      <img src="${image}"
                          alt="${Aproduct.result.name}" class="w-px-75" />
                  </div>
                  <div class="flex-grow-1">
                      <div class="row">
                          <div class="col-md-8">
                              <a href="javascript:void(0)" class="text-body">
                                  <h6>${Aproduct.result.name} (${
          Aproduct.result.version
        })</h6>
                              </a>
                              <div class="text-muted mb-1 d-flex flex-wrap">
                                  <span class="me-1">Sold by:</span>
                                  <a href="javascript:void(0)"
                                      class="me-1">${Aproduct.result.origin}</a>
                              </div>
                          </div>
                          <div class="col-md-4">
                              <div class="text-md-end">
                                  <div class="my-2 my-lg-4">
                                      <span
                                          class="text-primary">${Aproduct.result.price.toLocaleString(
                                            "vi-VN"
                                          )} VNĐ</span><s
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
                `;
        productsListCheckout.appendChild(productSpan);
        var readOnlyRating = $(".read-only-ratings");
        if (readOnlyRating) {
          readOnlyRating.rateYo({
            rtl: isRtl,
            rating: Aproduct.result.rating,
            starWidth: "20px",
          });
        }
        totalPrice +=
          parseInt(Aproduct.result.price) * parseInt(product.quantity);
        var totalPrice1 = totalPrice.toLocaleString("vi-VN") + " VNĐ";
        $(".total-price").html(totalPrice1);
        var discount = 0; // EDIT THIS PLS
        $(".total-discount").html(discount.toLocaleString("vi-VN") + " VNĐ");
        var price_been_discount = totalPrice - discount;
        $(".total-all").html(
          price_been_discount.toLocaleString("vi-VN") + " VNĐ"
        );
        $(".total-pay").html(
          price_been_discount.toLocaleString("vi-VN") + " VNĐ"
        );
      });
    });
    //--!loop
    document.querySelector(".spinner-border").setAttribute("hidden", "true");
    // $(".layout-wrapper").unblock();
  });
  //--!end gio hang

  //discount

  getDiscount().then((data) => {
    var alldiscount = data.result;
    localStorage.setItem("alldiscount", JSON.stringify(alldiscount));
    // console.log(alldiscount);
    var discountList = document.querySelector(".discount-list");
    alldiscount.forEach((discount) => {
      discountList.innerHTML += `
      <option id="${discount.discountId}" value="${discount.discountValue}">${discount.name}</option>
      `;
    });
  });

  //end discount

  //delivery
  var beenget = false;
  var pay_origin;
  var ngayHienTai = new Date();
  var ngaySauNNgay;
  $(".time").html(ngayHienTai.toLocaleString("vi-VN"));
  $(".form-check-input").on("click", function () {
    if (!beenget) {
      beenget = true;
      pay_origin = parseInt(
        $(".total-pay")
          .html()
          .replace(/[^0-9]/g, "")
      );
    }
    var paypay = pay_origin;
    var shipPrice = 0;
    if ($(this).attr("id") === "customRadioDelivery1") {
      shipPrice = 0;
      var shipPriceFree = '<span class="badge bg-label-success">Free</span>';
      $(".total-ship").html(shipPriceFree);
      ngaySauNNgay = new Date(ngayHienTai.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if ($(this).attr("id") === "customRadioDelivery2") {
      shipPrice = 25000;
      $(".total-ship").html(shipPrice.toLocaleString("vi-VN") + " VNĐ");
      ngaySauNNgay = new Date(ngayHienTai.getTime() + 3 * 24 * 60 * 60 * 1000);
    } else if ($(this).attr("id") === "customRadioDelivery3") {
      shipPrice = 1500000;
      $(".total-ship").html(shipPrice.toLocaleString("vi-VN") + " VNĐ");
      ngaySauNNgay = new Date(ngayHienTai.getTime() + 30 * 60 * 1000);
    }
    var update_pay = paypay + shipPrice;
    $(".total-pay").html(update_pay.toLocaleString("vi-VN") + " VNĐ");
    $(".ship-date").html(ngaySauNNgay.toLocaleDateString("vi-VN"));
  });
  //!--delivery

  //render address people //HERE IS ADDRESS//
  var person = JSON.parse(localStorage.getItem("user_data"));
  var address = JSON.parse(localStorage.getItem("allAddress"));
  // console.log(address);
  $(".email").html(person.email);
  // console.log(address.length);
  var addressList = document.querySelector(".address-list");
  var config, config2, have;
  address.forEach(function (element, index) {
    // console.log(element);
    var addressSpan = document.createElement("div");
    addressSpan.className = "col-md";
    //home or office?
    if (index === 0) {
      config = "Home";
      config2 = "primary";
      have = 'checked=""';
    } else {
      config = "Office";
      config2 = "success";
      have = "";
    }
    //--end
    if (index === 0) {
      document.querySelector(".that-be-dilivery").innerText = "Home";
      document.querySelector(".that-be-address").innerText =
        element.street +
        ", " +
        element.state +
        ", " +
        element.city +
        ", " +
        element.country;
    }
    addressSpan.innerHTML = `
        <div class="form-check custom-option custom-option-basic checked">
          <label class="form-check-label custom-option-content"
              for="customRadioAddress${index}">
              <input name="customRadioTemp" class="form-check-input"
                  type="radio" value="" id="customRadioAddress${index}" ${have}/>
              <span class="custom-option-header">
                  <span class="fw-medium type">${element.fullName}</span>
                  <span class="badge bg-label-${config2}">${config}</span>
              </span>
              <span class="custom-option-body" id="${element.id}">
                  <small class="type-address">${
                    element.street +
                    ", " +
                    element.state +
                    ", " +
                    element.city +
                    ", " +
                    element.country
                  }<br />
                      Mobile : ${element.phone} </small>
                  <span class="my-3 border-bottom d-block"></span>
                  <span class="d-flex">
                      <a class="me-2 edit-address"
                          data-bs-toggle="modal" data-bs-target="#addNewAddress"">Edit</a>
                  </span>
              </span>
          </label>
      </div>
      `;
    addressSpan
      .querySelector("input.form-check-input")
      .addEventListener("change", function () {
        document.querySelector(".that-be-dilivery").innerText =
          this.parentElement.querySelector(".type").innerText;
        document.querySelector(".that-be-address").innerText =
          this.parentElement.querySelector(".type-address").innerText;
        document.querySelector(".final-address").id =
          this.parentElement.querySelector(".custom-option-body").id;
      });
    addressList.appendChild(addressSpan);
  });
});

(function () {
  // Init custom option check
  window.Helpers.initCustomOptionCheck();
  // libs
  const creditCardMask = document.querySelector(".credit-card-mask"),
    expiryDateMask = document.querySelector(".expiry-date-mask"),
    cvvMask = document.querySelector(".cvv-code-mask");

  // Credit Card
  if (creditCardMask) {
    new Cleave(creditCardMask, {
      creditCard: true,
      onCreditCardTypeChanged: function (type) {
        if (type != "" && type != "unknown") {
          document.querySelector(".card-type").innerHTML =
            '<img src="' +
            assetsPath +
            "img/icons/payments/" +
            type +
            '-cc.png" height="28"/>';
        } else {
          document.querySelector(".card-type").innerHTML = "";
        }
      },
    });
  }
  // Expiry Date Mask
  if (expiryDateMask) {
    new Cleave(expiryDateMask, {
      date: true,
      delimiter: "/",
      datePattern: ["m", "y"],
    });
  }

  // CVV
  if (cvvMask) {
    new Cleave(cvvMask, {
      numeral: true,
      numeralPositiveOnly: true,
    });
  }

  // Wizard Checkout
  // --------------------------------------------------------------------

  const wizardCheckout = document.querySelector("#wizard-checkout");
  if (typeof wizardCheckout !== undefined && wizardCheckout !== null) {
    // Wizard form
    const wizardCheckoutForm = wizardCheckout.querySelector(
      "#wizard-checkout-form"
    );
    // Wizard steps
    const wizardCheckoutFormStep1 =
      wizardCheckoutForm.querySelector("#checkout-cart");
    const wizardCheckoutFormStep2 =
      wizardCheckoutForm.querySelector("#checkout-address");
    const wizardCheckoutFormStep3 =
      wizardCheckoutForm.querySelector("#checkout-payment");
    const wizardCheckoutFormStep4 = wizardCheckoutForm.querySelector(
      "#checkout-confirmation"
    );

    // Wizard next prev button
    const wizardCheckoutNext = [].slice.call(
      wizardCheckoutForm.querySelectorAll(".btn-next")
    );
    const wizardCheckoutPrev = [].slice.call(
      wizardCheckoutForm.querySelectorAll(".btn-prev")
    );

    let validationStepper = new Stepper(wizardCheckout, {
      linear: false,
    });

    // Cart
    const FormValidation1 = FormValidation.formValidation(
      wizardCheckoutFormStep1,
      {
        fields: {
          // * Validate the fields here based on your requirements
        },

        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            // Use this for enabling/changing valid/invalid class
            // eleInvalidClass: '',
            eleValidClass: "",
            // rowSelector: '.col-lg-6'
          }),
          autoFocus: new FormValidation.plugins.AutoFocus(),
          submitButton: new FormValidation.plugins.SubmitButton(),
        },
      }
    ).on("core.form.valid", function () {
      // Jump to the next step when all fields in the current step are valid
      validationStepper.next();
    });

    // Address
    const FormValidation2 = FormValidation.formValidation(
      wizardCheckoutFormStep2,
      {
        fields: {
          // * Validate the fields here based on your requirements
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            // Use this for enabling/changing valid/invalid class
            // eleInvalidClass: '',
            eleValidClass: "",
            // rowSelector: '.col-lg-6'
          }),
          autoFocus: new FormValidation.plugins.AutoFocus(),
          submitButton: new FormValidation.plugins.SubmitButton(),
        },
      }
    ).on("core.form.valid", function () {
      // Jump to the next step when all fields in the current step are valid
      validationStepper.next();
    });

    // Payment
    const FormValidation3 = FormValidation.formValidation(
      wizardCheckoutFormStep3,
      {
        fields: {
          // * Validate the fields here based on your requirements
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            // Use this for enabling/changing valid/invalid class
            // eleInvalidClass: '',
            eleValidClass: "",
            // rowSelector: '.col-lg-6'
          }),
          autoFocus: new FormValidation.plugins.AutoFocus(),
          submitButton: new FormValidation.plugins.SubmitButton(),
        },
      }
    ).on("core.form.valid", function () {
      validationStepper.next();
    });

    // Confirmation
    const FormValidation4 = FormValidation.formValidation(
      wizardCheckoutFormStep4,
      {
        fields: {
          // * Validate the fields here based on your requirements
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            // Use this for enabling/changing valid/invalid class
            // eleInvalidClass: '',
            eleValidClass: "",
            rowSelector: ".col-md-12",
          }),
          autoFocus: new FormValidation.plugins.AutoFocus(),
          submitButton: new FormValidation.plugins.SubmitButton(),
        },
      }
    ).on("core.form.valid", function () {
      // You can submit the form
      // wizardCheckoutForm.submit()
      // or send the form data to server via an Ajax request
      // To make the demo simple, I just placed an alert
      alert("Submitted..!!");
    });

    wizardCheckoutNext.forEach((item) => {
      item.addEventListener("click", (event) => {
        // When click the Next button, we will validate the current step
        switch (validationStepper._currentIndex) {
          case 0:
            FormValidation1.validate();
            break;

          case 1:
            FormValidation2.validate();
            break;

          case 2:
            FormValidation3.validate();
            document.querySelector(".wait-to-enable").disabled = false;
            break;

          case 3:
            FormValidation4.validate();
            break;

          default:
            break;
        }
      });
    });

    wizardCheckoutPrev.forEach((item) => {
      item.addEventListener("click", (event) => {
        switch (validationStepper._currentIndex) {
          case 3:
            validationStepper.previous();
            break;

          case 2:
            validationStepper.previous();
            break;

          case 1:
            validationStepper.previous();
            break;

          case 0:

          default:
            break;
        }
      });
    });
  }
})();
