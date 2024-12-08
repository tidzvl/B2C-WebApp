/**
 *  Pages Authentication
 */

/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @jQuery call when click login button and run some simple function login check authentication
 * * @param {string} username search from users-list.json -> want to change to API
 * * @param {string} password is hardcode "tindeptrai"
 * @callback login.onclick - save information in local storage and go to user page -> change if you want!
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */

"use strict";

const formAuthentication = document.querySelector("#formAuthentication");

$("#login-button").click(function (event) {
  event.preventDefault();
  var userName = document.getElementById("email").value;
  var pwd = document.getElementById("password").value;
  async function checkContain(userName) {
    try {
      const response = await fetch('/call/api/customers');
      const data = await response.json();
      const result = data.result.find((user) => user.email === userName || user.phone === userName);
      return result;
    } catch (error) {
      console.error(error);
    }
  }


  $.getJSON("/assets/json/users-list.json")
    .then(function (data) {
      const user_list = data.data;
      const user = user_list.find((user) => user.email === userName);
      // if(user &&  pwd=="tindeptrai"){

      checkContain(userName).then(data => {
        if (data) {
          $("form").fadeOut(500);
          $(".wrapper").addClass("form-success");
          localStorage.setItem("logged_in", true);
          localStorage.setItem("user_data", JSON.stringify(data));
          console.log("Login done");
          setTimeout(function () {
            location.href = "../user/";
          }, 2000);
        } else {
          alert("Wrong Password");
        }
      })
    })
    .catch(function (error) {
      console.error(error);
    });
});

document.addEventListener("DOMContentLoaded", function (e) {
  (function () {
    // Form validation for Add new record
    if (formAuthentication) {
      const fv = FormValidation.formValidation(formAuthentication, {
        fields: {
          username: {
            validators: {
              notEmpty: {
                message: "Please enter username",
              },
              stringLength: {
                min: 6,
                message: "Username must be more than 6 characters",
              },
            },
          },
          email: {
            validators: {
              notEmpty: {
                message: "Please enter your email",
              },
              emailAddress: {
                message: "Please enter valid email address",
              },
            },
          },
          "email-username": {
            validators: {
              notEmpty: {
                message: "Please enter email / username",
              },
              stringLength: {
                min: 6,
                message: "Username must be more than 6 characters",
              },
            },
          },
          password: {
            validators: {
              notEmpty: {
                message: "Please enter your password",
              },
              stringLength: {
                min: 6,
                message: "Password must be more than 6 characters",
              },
            },
          },
          "confirm-password": {
            validators: {
              notEmpty: {
                message: "Please confirm password",
              },
              identical: {
                compare: function () {
                  return formAuthentication.querySelector('[name="password"]')
                    .value;
                },
                message: "The password and its confirm are not the same",
              },
              stringLength: {
                min: 6,
                message: "Password must be more than 6 characters",
              },
            },
          },
          terms: {
            validators: {
              notEmpty: {
                message: "Please agree terms & conditions",
              },
            },
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            eleValidClass: "",
            rowSelector: ".mb-3",
          }),
          submitButton: new FormValidation.plugins.SubmitButton(),

          defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          autoFocus: new FormValidation.plugins.AutoFocus(),
        },
        init: (instance) => {
          instance.on("plugins.message.placed", function (e) {
            if (e.element.parentElement.classList.contains("input-group")) {
              e.element.parentElement.insertAdjacentElement(
                "afterend",
                e.messageElement
              );
            }
          });
        },
      });
    }
    //  Two Steps Verification
    // const numeralMask = document.querySelectorAll('.numeral-mask');

    // // Verification masking
    // if (numeralMask.length) {
    //   numeralMask.forEach(e => {
    //     new Cleave(e, {
    //       numeral: true
    //     });
    //   });
    // }
  })();
});
