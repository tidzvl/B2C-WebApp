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
 * 
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */




'use strict';



// rateyo (jquery)
$(function () {


  //jquery page 1 (gio hang)
  var products;
  //ajax call
  $.getJSON('/assets/json/product-list.json') //from database in
  .then(function(data) {
    products = data.data;
    $('.num-of-item').html(products.length);
    var productsList = document.querySelector('.products_list');
    //loop
    products.forEach(function(product) {
      var productSpan = document.createElement('li');
      productSpan.className = 'list-group-item p-4';
      var status;
      var color;
      //check stock
      if (product.count_in_stock > 0) {
        status = 'In Stock';
        color = 'success';
      } else {
        status = 'Out of Stock';
        color = 'danger';
      }
      productSpan.innerHTML =
      `<div class="d-flex gap-3">
              <div class="flex-shrink-0">
                  <img src="../../assets/img/products/${product.image[0]}"
                      alt="${product.image[0]}" class="w-px-100" />
              </div>
              <div class="flex-grow-1">
                  <div class="row">
                      <div class="col-md-8">
                          <h6 class="me-3">
                              <a href="javascript:void(0)"
                                  class="text-body">${product.name} (${product.version})</a>
                          </h6>
                          <div class="text-muted mb-1 d-flex flex-wrap">
                              <span class="me-1">Sold by:</span>
                              <a href="javascript:void(0)"
                                  class="me-1">${product.origin}</a>
                              <span class="badge bg-label-${color}">${status}</span>
                          </div>
                          <div class="read-only-ratings mb-2"
                              data-rateyo-read-only="true"></div>
                          <input type="number"
                              class="form-control form-control-sm w-px-75"
                              value="1" min="1" max="5" />
                      </div>
                      <div class="col-md-4">
                          <div class="text-md-end">
                              <button type="button"
                                  class="btn-close btn-pinned"
                                  aria-label="Close"></button>
                              <div class="my-2 my-md-4">
                                  <span
                                      class="text-primary price-product">${product.price} VNĐ</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>`;
      productsList.appendChild(productSpan);
      //add star rating
      var readOnlyRating = $('.read-only-ratings');
      if (readOnlyRating) {
        readOnlyRating.rateYo({
          rtl: isRtl,
          rating: product.rating,
          starWidth: '20px'
        });
      }
    });
    var productsListCheckout = document.querySelector('.products_list_checkout');
    products.forEach(function(product) {
      var productSpan = document.createElement('li');
      productSpan.className = 'list-group-item';
      var status;
      var color;
      if (product.count_in_stock > 0) {
        status = 'In Stock';
        color = 'success';
      } else {
        status = 'Out of Stock';
        color = 'danger';
      }
      productSpan.innerHTML =`
      <div class="d-flex gap-3">
        <div class="flex-shrink-0">
            <img src="../../assets/img/products/${product.image[0]}"
                alt="${product.name}" class="w-px-75" />
        </div>
        <div class="flex-grow-1">
            <div class="row">
                <div class="col-md-8">
                    <a href="javascript:void(0)" class="text-body">
                        <h6>${product.name} (${product.version})</h6>
                    </a>
                    <div class="text-muted mb-1 d-flex flex-wrap">
                        <span class="me-1">Sold by:</span>
                        <a href="javascript:void(0)"
                            class="me-1">${product.origin}</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-md-end">
                        <div class="my-2 my-lg-4">
                            <span
                                class="text-primary">${product.price} VNĐ</span><s
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
      `;
      productsListCheckout.appendChild(productSpan);
      var readOnlyRating = $('.read-only-ratings');
      if (readOnlyRating) {
        readOnlyRating.rateYo({
          rtl: isRtl,
          rating: product.rating,
          starWidth: '20px'
        });
      }
    });
    //--!loop

    //calculating price
    var totalPrice = 0;

    productsList.querySelectorAll(".price-product").forEach(function (element) {
      var price = parseInt(element.innerHTML.replace(/[^0-9]/g, ''));
      console.log(price);
      totalPrice += price;
    });
    var totalPrice1 = totalPrice.toLocaleString('vi-VN') + ' VNĐ';
    console.log(totalPrice1);
    $('.total-price').html(totalPrice1);
    var discount = 200000;
    $('.total-discount').html(discount.toLocaleString('vi-VN') + ' VNĐ');
    var price_been_discount = totalPrice - discount;
    $('.total-all').html(price_been_discount.toLocaleString('vi-VN') + ' VNĐ');
    $('.total-pay').html(price_been_discount.toLocaleString('vi-VN') + ' VNĐ');
    //--!calculating price
  })
  .fail(function(xhr, status, error) {
    console.error(error);
  });
  //--!end gio hang

  //delivery
  var beenget = false;
  var pay_origin;
  var ngayHienTai = new Date();
  var ngaySauNNgay;
  $('.time').html(ngayHienTai.toLocaleString('vi-VN'));
  $('.form-check-input').on('click', function() {
    if(!beenget){
      beenget = true;
      pay_origin = parseInt($('.total-pay').html().replace(/[^0-9]/g, ''));
    }
    var paypay = pay_origin;
    var shipPrice = 0;
    if ($(this).attr('id') === 'customRadioDelivery1') {
      shipPrice = 0;
      var shipPriceFree = '<span class="badge bg-label-success">Free</span>';
      $('.total-ship').html(shipPriceFree);
      ngaySauNNgay = new Date(ngayHienTai.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if ($(this).attr('id') === 'customRadioDelivery2') {
      shipPrice = 10000; 
      $('.total-ship').html(shipPrice.toLocaleString('vi-VN') + ' VNĐ');
      ngaySauNNgay = new Date(ngayHienTai.getTime() + 3 * 24 * 60 * 60 * 1000);
    } else if ($(this).attr('id') === 'customRadioDelivery3') {
      shipPrice = 1500000;
      $('.total-ship').html(shipPrice.toLocaleString('vi-VN') + ' VNĐ');
      ngaySauNNgay = new Date(ngayHienTai.getTime() + 30 * 60 * 1000);
    }
    var update_pay = paypay+shipPrice;
    $('.total-pay').html(update_pay.toLocaleString('vi-VN') + ' VNĐ');
    $('.ship-date').html(ngaySauNNgay.toLocaleDateString('vi-VN'));
  });
  //!--delivery

  //render address people //HERE IS ADDRESS//
  $.getJSON('/assets/json/users-list.json') //from database in
  .then(function(data) {
    var person = data.data[0];
    var address = data.data[0].address;
    $('.email').html(person.email);
    // console.log(address.length);
    var addressList = document.querySelector('.address-list');
    var config, config2, have;
    address.forEach(function (element, index) {
      var addressSpan = document.createElement('div');
      addressSpan.className = 'col-md';
      //home or office?
      if(index === 0){
        config = "Home";
        config2 = "primary";
        have = 'checked=""';
      }else{
        config = "Office";
        config2 = "success";
        have = '';
      }
      //--end
      if(index === 0){
        document.querySelector('.that-be-dilivery').innerText = "Home";
        document.querySelector('.that-be-address').innerText = element;
      }
      addressSpan.innerHTML = `
        <div class="form-check custom-option custom-option-basic checked">
          <label class="form-check-label custom-option-content"
              for="customRadioAddress${index}">
              <input name="customRadioTemp" class="form-check-input"
                  type="radio" value="" id="customRadioAddress${index}" ${have}/>
              <span class="custom-option-header">
                  <span class="fw-medium type">${config}</span>
                  <span class="badge bg-label-${config2}">${config}</span>
              </span>
              <span class="custom-option-body">
                  <small class="type-address">${element}<br />
                      Mobile : ${person.phone[index]} </small>
                  <span class="my-3 border-bottom d-block"></span>
                  <span class="d-flex">
                      <a class="me-2"
                          href="javascript:void(0)">Edit</a>
                      <a href="javascript:void(0)">Remove</a>
                  </span>
              </span>
          </label>
      </div>
      `
      addressSpan.querySelector('input.form-check-input').addEventListener('change', function() {
        document.querySelector('.that-be-dilivery').innerText = this.parentElement.querySelector('.type').innerText;
        document.querySelector('.that-be-address').innerText = this.parentElement.querySelector('.type-address').innerText;
      });
      addressList.appendChild(addressSpan);
    })
  })
  .fail(function(xhr, status, error) {
    console.error(error + ' in render address people (get)');
  });


});

(function () {
  // Init custom option check
  window.Helpers.initCustomOptionCheck();
  // libs
  const creditCardMask = document.querySelector('.credit-card-mask'),
    expiryDateMask = document.querySelector('.expiry-date-mask'),
    cvvMask = document.querySelector('.cvv-code-mask');

  // Credit Card
  if (creditCardMask) {
    new Cleave(creditCardMask, {
      creditCard: true,
      onCreditCardTypeChanged: function (type) {
        if (type != '' && type != 'unknown') {
          document.querySelector('.card-type').innerHTML =
            '<img src="' + assetsPath + 'img/icons/payments/' + type + '-cc.png" height="28"/>';
        } else {
          document.querySelector('.card-type').innerHTML = '';
        }
      }
    });
  }
  // Expiry Date Mask
  if (expiryDateMask) {
    new Cleave(expiryDateMask, {
      date: true,
      delimiter: '/',
      datePattern: ['m', 'y']
    });
  }

  // CVV
  if (cvvMask) {
    new Cleave(cvvMask, {
      numeral: true,
      numeralPositiveOnly: true
    });
  }

  // Wizard Checkout
  // --------------------------------------------------------------------

  const wizardCheckout = document.querySelector('#wizard-checkout');
  if (typeof wizardCheckout !== undefined && wizardCheckout !== null) {
    // Wizard form
    const wizardCheckoutForm = wizardCheckout.querySelector('#wizard-checkout-form');
    // Wizard steps
    const wizardCheckoutFormStep1 = wizardCheckoutForm.querySelector('#checkout-cart');
    const wizardCheckoutFormStep2 = wizardCheckoutForm.querySelector('#checkout-address');
    const wizardCheckoutFormStep3 = wizardCheckoutForm.querySelector('#checkout-payment');
    const wizardCheckoutFormStep4 = wizardCheckoutForm.querySelector('#checkout-confirmation');


    
    // Wizard next prev button
    const wizardCheckoutNext = [].slice.call(wizardCheckoutForm.querySelectorAll('.btn-next'));
    const wizardCheckoutPrev = [].slice.call(wizardCheckoutForm.querySelectorAll('.btn-prev'));
    
    let validationStepper = new Stepper(wizardCheckout, {
      linear: false
    });
    
    // Cart
    const FormValidation1 = FormValidation.formValidation(wizardCheckoutFormStep1, {
      fields: {
        // * Validate the fields here based on your requirements
      },

      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          // eleInvalidClass: '',
          eleValidClass: ''
          // rowSelector: '.col-lg-6'
        }),
        autoFocus: new FormValidation.plugins.AutoFocus(),
        submitButton: new FormValidation.plugins.SubmitButton()
      }
    }).on('core.form.valid', function () {
      // Jump to the next step when all fields in the current step are valid
      validationStepper.next();
    });

    // Address
    const FormValidation2 = FormValidation.formValidation(wizardCheckoutFormStep2, {
      fields: {
        // * Validate the fields here based on your requirements
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          // eleInvalidClass: '',
          eleValidClass: ''
          // rowSelector: '.col-lg-6'
        }),
        autoFocus: new FormValidation.plugins.AutoFocus(),
        submitButton: new FormValidation.plugins.SubmitButton()
      }
    }).on('core.form.valid', function () {
      // Jump to the next step when all fields in the current step are valid
      validationStepper.next();
    });

    // Payment
    const FormValidation3 = FormValidation.formValidation(wizardCheckoutFormStep3, {
      fields: {
        // * Validate the fields here based on your requirements
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          // eleInvalidClass: '',
          eleValidClass: ''
          // rowSelector: '.col-lg-6'
        }),
        autoFocus: new FormValidation.plugins.AutoFocus(),
        submitButton: new FormValidation.plugins.SubmitButton()
      }
    }).on('core.form.valid', function () {
      validationStepper.next();
    });

    // Confirmation
    const FormValidation4 = FormValidation.formValidation(wizardCheckoutFormStep4, {
      fields: {
        // * Validate the fields here based on your requirements

      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          // eleInvalidClass: '',
          eleValidClass: '',
          rowSelector: '.col-md-12'
        }),
        autoFocus: new FormValidation.plugins.AutoFocus(),
        submitButton: new FormValidation.plugins.SubmitButton()
      }
    }).on('core.form.valid', function () {
      // You can submit the form
      // wizardCheckoutForm.submit()
      // or send the form data to server via an Ajax request
      // To make the demo simple, I just placed an alert
      alert('Submitted..!!');
    });

    wizardCheckoutNext.forEach(item => {
      item.addEventListener('click', event => {
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
            document.querySelector('.wait-to-enable').disabled = false;
            break;

          case 3:
            FormValidation4.validate();
            break;

          default:
            break;
        }
      });
    });

    wizardCheckoutPrev.forEach(item => {
      item.addEventListener('click', event => {
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
