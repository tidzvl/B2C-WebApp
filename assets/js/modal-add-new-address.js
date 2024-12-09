/**
 * Add New Address
 */

/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @jQuery call modal add new address and validate form
 * @NOTE i have not write anything logical for this script lol :))
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */




'use strict';



setTimeout(function () {
  document.querySelector(".add-address").addEventListener('click', function (event) {
    event.preventDefault();
    var person = {
        "fullName": document.querySelector("#target-lastname").value + " " + document.querySelector("#target-firstname").value,
        "phone": document.querySelector("#target-phone").value,
        "email": JSON.parse(localStorage.getItem("user_data")).email,
        "street": document.querySelector("#target-address").value,
        "city": document.querySelector("#city-address").value,
        "state": document.querySelector("#state-address").value,
        "zipCode": "10000",
        "country": document.querySelector("#select2-modalAddressCountry-container").innerText.split("\n")[1]
    };
    // console.log(person);
    var customerId = JSON.parse(localStorage.getItem("user_data")).customerId;
    fetch(ApiHost+'/api/address?customerId='+customerId, {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(person)
    }).then((response) => {
      if (response.ok) {
        // var oldAddress = JSON.parse(localStorage.getItem("allAddress"));
        // oldAddress.push(person);
        // localStorage.setItem("allAddress", JSON.stringify(oldAddress));
        // window.location.href = "../user/";
        fetch(ApiHost+'/api/address?customerId='+customerId).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              localStorage.setItem("allAddress", JSON.stringify(data.result));
              window.location.reload();
            })
          }
        })
      }
    })
  })

  document.querySelector(".change-address").addEventListener('click', function (event) {
    event.preventDefault();
    var person = {
        "fullName": document.querySelector("#target-lastname").value + " " + document.querySelector("#target-firstname").value,
        "phone": document.querySelector("#target-phone").value,
        "email": JSON.parse(localStorage.getItem("user_data")).email,
        "street": document.querySelector("#target-address").value,
        "city": document.querySelector("#city-address").value,
        "state": document.querySelector("#state-address").value,
        "zipCode": "10000",
        "country": document.querySelector("#select2-modalAddressCountry-container").innerText.split("\n")[1]
    };
    // console.log(person);
    var customerId = JSON.parse(localStorage.getItem("user_data")).customerId;
    var edit_id = parseInt(localStorage.getItem("edit_id"));
    fetch(ApiHost+'/api/address/'+edit_id, {
      method: 'PATCH',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(person)
    }).then((response) => {
      if (response.ok) {
        fetch(ApiHost+'/api/address?customerId='+customerId).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              localStorage.setItem("allAddress", JSON.stringify(data.result));
              Swal.fire({
                title: "Thay đổi thành công!",
                text: "Thông tin nhận hàng của bạn đã được thay đổi!",
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
                buttonsStyling: false,
              }).then(function (result) {
                window.location.reload();
              })
            })
          }
        })
      }
    })
  })


  document.querySelectorAll(".form-check.custom-option.custom-option-basic").forEach((element) => {
    element.querySelector(".edit-address").addEventListener('click', function (event) {
      event.preventDefault();
      var edit_id = element.querySelector(".custom-option-body").getAttribute("id");
      localStorage.setItem("edit_id", edit_id);
      var address_edit = JSON.parse(localStorage.getItem("allAddress")).find((item) => item.id == edit_id);
      console.log(address_edit);
      document.querySelector("#target-lastname").value = address_edit.fullName.split(" ")[1];
      document.querySelector("#target-firstname").value = address_edit.fullName.split(" ")[0];
      document.querySelector("#target-phone").value = address_edit.phone;
      document.querySelector("#target-address").value = address_edit.street;
      document.querySelector("#city-address").value = address_edit.city;
      document.querySelector("#state-address").value = address_edit.state;
      document.querySelector("#select2-modalAddressCountry-container").innerText = address_edit.country;
      document.querySelector("#select2-modalAddressCountry-container").setAttribute("title", address_edit.country);
      document.querySelector(".add-address").classList.add("d-none");
      document.querySelector(".change-address").classList.remove("d-none");

    })
  })

}, 3000);

// Select2 (jquery)
$(function () {
  const select2 = $('.select2');

  // Select2 Country
  if (select2.length) {
    select2.each(function () {
      var $this = $(this);
      $this.wrap('<div class="position-relative"></div>').select2({
        placeholder: 'Select value',
        dropdownParent: $this.parent()
      });
    });
  }
});

// Add New Address form validation
document.addEventListener('DOMContentLoaded', function () {
  (function () {
    // initCustomOptionCheck on modal show to update the custom select
    let addNewAddress = document.getElementById('addNewAddress');
    addNewAddress.addEventListener('show.bs.modal', function (event) {
      // Init custom option check
      window.Helpers.initCustomOptionCheck();
    });

    FormValidation.formValidation(document.getElementById('addNewAddressForm'), {
      fields: {
        modalAddressFirstName: {
          validators: {
            notEmpty: {
              message: 'Please enter your first name'
            },
            regexp: {
              regexp: /^[a-zA-Zs]+$/,
              message: 'The first name can only consist of alphabetical'
            }
          }
        },
        modalAddressLastName: {
          validators: {
            notEmpty: {
              message: 'Please enter your last name'
            },
            regexp: {
              regexp: /^[a-zA-Zs]+$/,
              message: 'The last name can only consist of alphabetical'
            }
          }
        }
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          // eleInvalidClass: '',
          eleValidClass: '',
          rowSelector: '.col-12'
        }),
        submitButton: new FormValidation.plugins.SubmitButton(),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus()
      }
    });
  })();
});
