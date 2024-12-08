/**
 *  Page auth register multi-steps
 */

"use strict";

// Select2 (jquery)
$(function () {
  var select2 = $(".select2");

  // select2
  if (select2.length) {
    select2.each(function () {
      var $this = $(this);
      $this.wrap('<div class="position-relative"></div>');
      $this.select2({
        placeholder: "Select an country",
        dropdownParent: $this.parent(),
      });
    });
  }
});

// Multi Steps Validation
// --------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function (e) {
  (function () {
    async function AcreateAccount(account) {
      try {
        const response = await fetch("/call/api/account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(account),
        });
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.error(error);
      }
    }

    async function createCustomer(customer) {
      try {
        const response = await fetch("/call/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    }

    const stepsValidation = document.querySelector("#multiStepsValidation");
    console.log(stepsValidation);
    stepsValidation
      .querySelector(".btn-submit")
      .addEventListener("click", function (event) {
        event.preventDefault();
        $(".authentication-wrapper").block({
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
        var createAccount = {
          username: stepsValidation.querySelector("#multiStepsUsername").value,
          password: stepsValidation.querySelector("#multiStepsPass").value,
          role: "CUSTOMER",
        };
        try {
          AcreateAccount(createAccount).then((result) => {
            var customerInfo = {
              accountId: result.id,
              firstName: stepsValidation.querySelector("#multiStepsFirstName")
                .value,
              lastName: stepsValidation.querySelector("#multiStepsLastName")
                .value,
              gender: "MALE",
              citizenId:
                stepsValidation.querySelector("#multiStepsPincode").value,
              birthday: "1990-01-01",
              email: stepsValidation.querySelector("#multiStepsEmail").value,
              phone: stepsValidation.querySelector("#multiStepsMobile").value,
              address:
                stepsValidation.querySelector("#multiStepsAddress").value +
                ", " +
                stepsValidation.querySelector("#multiStepsArea").value +
                ", " +
                stepsValidation.querySelector("#multiStepsCity").value +
                ", " +
                stepsValidation.querySelector(
                  "#select2-multiStepsState-container"
                ).value,
              avatar: "https://i.ibb.co/g3gSyKF/user-success.png",
            };
            createCustomer(customerInfo).then((result) => {
              // console.log(result);
              if (result.code == 1000) {
                Swal.fire({
                  title: "Successful!",
                  text: "Tài khoản đã được tạo thành công!",
                  icon: "success",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                  buttonsStyling: false,
                }).then(function (result) {
                  if (result.value) {
                    window.location.href = "../login/";
                  }
                });
              } else {
                Swal.fire({
                  title: "Error!",
                  text: " Có lỗi xảy ra, vui lòng thử lại sau!",
                  icon: "error",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                  buttonsStyling: false,
                });
              }
            });
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: " Có lỗi xảy ra, vui lòng thử lại sau!",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });
        }
      });
    if (typeof stepsValidation !== undefined && stepsValidation !== null) {
      // Multi Steps form
      const stepsValidationForm =
        stepsValidation.querySelector("#multiStepsForm");
      // Form steps
      const stepsValidationFormStep1 = stepsValidationForm.querySelector(
        "#accountDetailsValidation"
      );
      const stepsValidationFormStep2 = stepsValidationForm.querySelector(
        "#personalInfoValidation"
      );
      const stepsValidationFormStep3 = stepsValidationForm.querySelector(
        "#billingLinksValidation"
      );
      // Multi steps next prev button
      const stepsValidationNext = [].slice.call(
        stepsValidationForm.querySelectorAll(".btn-next")
      );
      const stepsValidationPrev = [].slice.call(
        stepsValidationForm.querySelectorAll(".btn-prev")
      );

      const multiStepsExDate = document.querySelector(".multi-steps-exp-date"),
        multiStepsMobile = document.querySelector(".multi-steps-mobile"),
        multiStepsPincode = document.querySelector(".multi-steps-pincode");

      // Expiry Date Mask
      if (multiStepsExDate) {
        new Cleave(multiStepsExDate, {
          date: true,
          delimiter: "/",
          datePattern: ["m", "y"],
        });
      }

      // Mobile
      if (multiStepsMobile) {
        new Cleave(multiStepsMobile, {
          phone: true,
          phoneRegionCode: "VN",
        });
      }

      // Pincode
      if (multiStepsPincode) {
        new Cleave(multiStepsPincode, {
          delimiter: "",
          numeral: true,
        });
      }

      let validationStepper = new Stepper(stepsValidation, {
        linear: true,
      });

      // Account details
      const multiSteps1 = FormValidation.formValidation(
        stepsValidationFormStep1,
        {
          fields: {
            multiStepsUsername: {
              validators: {
                notEmpty: {
                  message: "Please enter username",
                },
                stringLength: {
                  min: 6,
                  max: 30,
                  message:
                    "The name must be more than 6 and less than 30 characters long",
                },
                regexp: {
                  regexp: /^[a-zA-Z0-9 ]+$/,
                  message:
                    "The name can only consist of alphabetical, number and space",
                },
              },
            },
            multiStepsEmail: {
              validators: {
                notEmpty: {
                  message: "Please enter email address",
                },
                emailAddress: {
                  message: "The value is not a valid email address",
                },
              },
            },
            multiStepsPass: {
              validators: {
                notEmpty: {
                  message: "Please enter password",
                },
              },
            },
            multiStepsConfirmPass: {
              validators: {
                notEmpty: {
                  message: "Confirm Password is required",
                },
                identical: {
                  compare: function () {
                    return stepsValidationFormStep1.querySelector(
                      '[name="multiStepsPass"]'
                    ).value;
                  },
                  message: "The password and its confirm are not the same",
                },
              },
            },
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
              // Use this for enabling/changing valid/invalid class
              // eleInvalidClass: '',
              eleValidClass: "",
              rowSelector: ".col-sm-6",
            }),
            autoFocus: new FormValidation.plugins.AutoFocus(),
            submitButton: new FormValidation.plugins.SubmitButton(),
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
        }
      ).on("core.form.valid", function () {
        // Jump to the next step when all fields in the current step are valid
        validationStepper.next();
      });

      // Personal info
      const multiSteps2 = FormValidation.formValidation(
        stepsValidationFormStep2,
        {
          fields: {
            multiStepsFirstName: {
              validators: {
                notEmpty: {
                  message: "Please enter first name",
                },
              },
            },
            multiStepsAddress: {
              validators: {
                notEmpty: {
                  message: "Please enter your address",
                },
              },
            },
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
              // Use this for enabling/changing valid/invalid class
              // eleInvalidClass: '',
              eleValidClass: "",
              rowSelector: function (field, ele) {
                // field is the field name
                // ele is the field element
                switch (field) {
                  case "multiStepsFirstName":
                    return ".col-sm-6";
                  case "multiStepsAddress":
                    return ".col-md-12";
                  default:
                    return ".row";
                }
              },
            }),
            autoFocus: new FormValidation.plugins.AutoFocus(),
            submitButton: new FormValidation.plugins.SubmitButton(),
          },
        }
      ).on("core.form.valid", function () {
        // Jump to the next step when all fields in the current step are valid
        validationStepper.next();
      });

      stepsValidationNext.forEach((item) => {
        item.addEventListener("click", (event) => {
          // When click the Next button, we will validate the current step
          switch (validationStepper._currentIndex) {
            case 0:
              multiSteps1.validate();
              break;

            case 1:
              multiSteps2.validate();
              break;

            case 2:
              multiSteps3.validate();
              break;

            default:
              break;
          }
        });
      });

      stepsValidationPrev.forEach((item) => {
        item.addEventListener("click", (event) => {
          switch (validationStepper._currentIndex) {
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
});
