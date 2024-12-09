/**
 * Main
 */

"use strict";

/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @Before get full customer information
 * @callback render all infomation, navbar, menu
 * @NotInclude dark style -> code if have free time
 * @param {json} customerInfor in local storage callback when login
 * @function logout - logout and remove all infomation in local storage
 * @jQuert get type of product when click on menu
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */




let isRtl = window.Helpers.isRtl(),
  isDarkStyle = window.Helpers.isDarkStyle(),
  menu,
  animate,
  isHorizontalLayout = false;
  let ApiHost = 'http://localhost:8080';


if (document.getElementById("layout-menu")) {
  isHorizontalLayout = document
    .getElementById("layout-menu")
    .classList.contains("menu-horizontal");
}

$(document).ready(function() {
  $('.menu-item a').on('click', function(e) {
    e.preventDefault();
    const menuItemText = $(this).text().trim();
    localStorage.setItem('menuItemSelected', menuItemText);
    window.location.href = $(this).attr('href');
  });
});

(function () {
  const menu_layout = `
    <div class="container-xxl d-flex h-100">
                <ul class="menu-inner">
                  <!-- Dashboards -->
                  <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                      <i class="menu-icon tf-icons bx bx-home-circle"></i>
                       Trang Chủ
                    </a>
                    <ul class="menu-sub">
                      <li class="menu-item">
                        <a href="../home/" class="menu-link">
                          <i class="menu-icon tf-icons bx bx-pie-chart-alt-2"></i>
                           Landing
                        </a>
                        <a href="../timeline/" class="menu-link">
                          <i class="menu-icon tf-icons bx bx-timer"></i>
                           Timeline
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                      <i class="menu-icon tf-icons bx bx-store-alt"></i>
                       Sản phẩm
                    </a>
                    <ul class="menu-sub">
                      <li class="menu-item">
                        <a href="../product/" class="menu-link">
                          <i class="menu-icon tf-icons bx bx-grid"></i>
                           Tất cả
                        </a>
                        <a href="../product/" class="menu-link">
                          <i class="menu-icon tf-icons bx bx-phone"></i>
                           Điện thoại
                        </a>
                        <a href="../product/" class="menu-link">
                          <i class="menu-icon tf-icons bx bx-laptop"></i>
                           Máy tính
                        </a>
                        <a href="../product/" class="menu-link">
                          <i class="menu-icon tf-icons bx bxs-discount"></i>
                           Giảm giá
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                      <i class="menu-icon tf-icons bx bxs-wallet"></i>
                       Đơn hàng
                    </a>
                    <ul class="menu-sub">
                      <li class="menu-item">
                        <a href="../order/" class="menu-link">
                          <i class="menu-icon tf-icons bx bxs-shopping-bags"></i>
                           Tất cả
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
  `;
  document.querySelector(".menu").innerHTML = menu_layout;
  const navbar = `
        <div class="container-xxl">
            <div class="navbar-brand app-brand demo d-none d-xl-flex py-0 me-4">
              <a href="../home/" class="app-brand-link gap-2">
                <span class="app-brand-logo demo">
                  <svg
                    width="26px"
                    height="26px"
                    viewBox="0 0 26 26"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <title>icon</title>
                    <defs>
                      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
                        <stop stop-color="#5A8DEE" offset="0%"></stop>
                        <stop stop-color="#699AF9" offset="100%"></stop>
                      </linearGradient>
                      <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="linearGradient-2">
                        <stop stop-color="#FDAC41" offset="0%"></stop>
                        <stop stop-color="#E38100" offset="100%"></stop>
                      </linearGradient>
                    </defs>
                    <g id="Pages" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Login---V2" transform="translate(-667.000000, -290.000000)">
                        <g id="Login" transform="translate(519.000000, 244.000000)">
                          <g id="Logo" transform="translate(148.000000, 42.000000)">
                            <g id="icon" transform="translate(0.000000, 4.000000)">
                              <path
                                d="M13.8863636,4.72727273 C18.9447899,4.72727273 23.0454545,8.82793741 23.0454545,13.8863636 C23.0454545,18.9447899 18.9447899,23.0454545 13.8863636,23.0454545 C8.82793741,23.0454545 4.72727273,18.9447899 4.72727273,13.8863636 C4.72727273,13.5423509 4.74623858,13.2027679 4.78318172,12.8686032 L8.54810407,12.8689442 C8.48567157,13.19852 8.45300462,13.5386269 8.45300462,13.8863636 C8.45300462,16.887125 10.8856023,19.3197227 13.8863636,19.3197227 C16.887125,19.3197227 19.3197227,16.887125 19.3197227,13.8863636 C19.3197227,10.8856023 16.887125,8.45300462 13.8863636,8.45300462 C13.5386269,8.45300462 13.19852,8.48567157 12.8689442,8.54810407 L12.8686032,4.78318172 C13.2027679,4.74623858 13.5423509,4.72727273 13.8863636,4.72727273 Z"
                                id="Combined-Shape"
                                fill="#4880EA"></path>
                              <path
                                d="M13.5909091,1.77272727 C20.4442608,1.77272727 26,7.19618701 26,13.8863636 C26,20.5765403 20.4442608,26 13.5909091,26 C6.73755742,26 1.18181818,20.5765403 1.18181818,13.8863636 C1.18181818,13.540626 1.19665566,13.1982714 1.22574292,12.8598734 L6.30410592,12.859962 C6.25499466,13.1951893 6.22958398,13.5378796 6.22958398,13.8863636 C6.22958398,17.8551125 9.52536149,21.0724191 13.5909091,21.0724191 C17.6564567,21.0724191 20.9522342,17.8551125 20.9522342,13.8863636 C20.9522342,9.91761479 17.6564567,6.70030817 13.5909091,6.70030817 C13.2336969,6.70030817 12.8824272,6.72514561 12.5388136,6.77314791 L12.5392575,1.81561642 C12.8859498,1.78721495 13.2366963,1.77272727 13.5909091,1.77272727 Z"
                                id="Combined-Shape2"
                                fill="url(#linearGradient-1)"></path>
                              <rect
                                id="Rectangle"
                                fill="url(#linearGradient-2)"
                                x="0"
                                y="0"
                                width="7.68181818"
                                height="7.68181818"></rect>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span class="app-brand-text demo menu-text fw-bold">FPS Shop</span>
              </a>

              <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-xl-none">
                <i class="bx bx-x bx-sm align-middle"></i>
              </a>
            </div>

            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                <i class="bx bx-menu bx-sm"></i>
              </a>
            </div>

            <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              <ul class="navbar-nav flex-row align-items-center ms-auto">
                <!-- User -->
                <li class="nav-item navbar-dropdown dropdown-user dropdown">
                  <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                    <div class="avatar avatar-online">
                      <img src="https://i.ibb.co/g3gSyKF/user-success.png" alt class="rounded-circle avatar-full" />
                    </div>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="../user/">
                        <div class="d-flex">
                          <div class="flex-shrink-0 me-3">
                            <div class="avatar avatar-online">
                              <img src="https://i.ibb.co/g3gSyKF/user-success.png" alt class="rounded-circle avatar-full" />
                            </div>
                          </div>
                          <div class="flex-grow-1">
                            <span class="fw-medium d-block lh-1 name"></span>
                            <small>Khách hàng</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div class="dropdown-divider"></div>
                    </li>
                    <li>
                      <a class="dropdown-item" href="../user/">
                        <i class="bx bx-user me-2"></i>
                        <span class="align-middle">Thông tin cá nhân</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href=".">
                        <i class="bx bx-cog me-2"></i>
                        <span class="align-middle">Cài đặt tài khoản</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="../order/">
                        <span class="d-flex align-items-center align-middle">
                          <i class="flex-shrink-0 bx bx-credit-card me-2"></i>
                          <span class="flex-grow-1 align-middle">Đơn hàng của tôi</span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <div class="dropdown-divider"></div>
                    </li>
                    <li>
                      <a class="dropdown-item" href="../cart/">
                        <i class="bx bx-cart me-2"></i>
                        <span class="align-middle">Giỏ hàng</span>
                      </a>
                    </li>
                    <li>
                      <div class="dropdown-divider"></div>
                    </li>
                    <li>
                      <a id="logout" class="dropdown-item" href="" target="">
                        <i class="bx bx-power-off me-2"></i>
                        <span class="align-middle">Log Out</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <!--/ User -->
                <!-- Search -->
                <li class="nav-item navbar-search-wrapper me-2 me-xl-0">
                  <a class="nav-item nav-link search-toggler" href="javascript:void(0);">
                    Xin chào, <i class="name">Loading...</i>
                  </a>
                </li>
                <!-- /Search -->
              </ul>
            </div>

          </div>
    `;
  document.querySelector(".navbar").innerHTML = navbar;


  async function getAddressDeli() {
    try{
      const customerId = JSON.parse(
        localStorage.getItem("user_data")
      ).customerId;
      const response = await fetch(ApiHost+"/api/address?customerId="+customerId);
      const data = await response.json();
      localStorage.setItem("allAddress", JSON.stringify(data.result));
      return data.result;
    } catch (error) {
      console.error(error);
    }
  }


  setTimeout(function () {
    window.Helpers.initCustomOptionCheck();
  }, 1000);
  //render infomation
  let isLogin = false;
  if (localStorage.getItem("logged_in") == "true") {
    console.log("Login done");
    isLogin = true;
  }
  if (isLogin == false) {
    setTimeout(function () {
      location.href = "../home/";
    }, 0);
  }
  const data_user = JSON.parse(localStorage.getItem("user_data"));
  // console.log(data_user, " NOTE: that being file js/main.js");
  document.querySelectorAll(".name").forEach((element, index) => {
    element.innerHTML = data_user.firstName + " " + data_user.lastName;
  });
  try {
    document.querySelectorAll('.avatar-full').forEach((element, index) => {
      element.src = data_user.avatar;
    });
    document.querySelector(".makhachhang").innerHTML = data_user.customerId;
    document.querySelector(".verified").innerHTML = data_user.citizenId;
    document.querySelector(".sex").innerHTML = data_user.gender == "MALE" ? "Nam" : "Nữ";
    document.querySelector(".phone").innerHTML = data_user.phone;
    document.querySelector(".email").innerHTML = data_user.email;
    document.querySelector('.avatar-full').src = data_user.avatar;
    //address
    getAddressDeli().then(data => {
      var allAddress = document.querySelector(".all-deli-address");
      data.forEach((element, index) => {
        if (element) {
          allAddress.innerHTML += `
          <li class="timeline-item timeline-item-transparent">
          <div class="timeline-event">
          <div class="timeline-header mb-1">
          <h6 class="mb-0">${element.fullName}</h6>
          </div>
          <p class="mb-2 address">${element.phone}</p>
          <p class="mb-2 address">${element.street + ", " + element.state + ", " + element.city + ", " + element.country}.</p>
          </div>
          </li>
          `
        }
      });
    })
    //get sum of order and points
    // const sum_of_order = 11;
    const sum_of_points = 146;
    document.querySelector(".points").innerHTML = sum_of_points;
  } catch (e) {
    console.log("That site out of user page");
  }
  // })
  // .catch(error => {
  //   console.error(error);
  // });

  //!render infomation
  // Initialize menu
  //-----------------

  let logout = document.getElementById("logout");
  logout.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    setTimeout(function () {
      location.href = "../home/";
    }, 100);
  });

  let layoutMenuEl = document.querySelectorAll("#layout-menu");
  layoutMenuEl.forEach(function (element) {
    menu = new Menu(element, {
      orientation: isHorizontalLayout ? "horizontal" : "vertical",
      closeChildren: isHorizontalLayout ? true : false,
      // ? This option only works with Horizontal menu
      showDropdownOnHover: localStorage.getItem(
        "templateCustomizer-" + templateName + "--ShowDropdownOnHover"
      ) // If value(showDropdownOnHover) is set in local storage
        ? localStorage.getItem(
            "templateCustomizer-" + templateName + "--ShowDropdownOnHover"
          ) === "true" // Use the local storage value
        : window.templateCustomizer !== undefined // If value is set in config.js
        ? window.templateCustomizer.settings.defaultShowDropdownOnHover // Use the config.js value
        : true, // Use this if you are not using the config.js and want to set value directly from here
    });
    // Change parameter to true if you want scroll animation
    window.Helpers.scrollToActive((animate = false));
    window.Helpers.mainMenu = menu;
  });

  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll(".layout-menu-toggle");
  menuToggler.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      window.Helpers.toggleCollapsed();
      // Enable menu state with local storage support if enableMenuLocalStorage = true from config.js
      if (config.enableMenuLocalStorage && !window.Helpers.isSmallScreen()) {
        try {
          localStorage.setItem(
            "templateCustomizer-" + templateName + "--LayoutCollapsed",
            String(window.Helpers.isCollapsed())
          );
          // Update customizer checkbox state on click of menu toggler
          let layoutCollapsedCustomizerOptions = document.querySelector(
            ".template-customizer-layouts-options"
          );
          if (layoutCollapsedCustomizerOptions) {
            let layoutCollapsedVal = window.Helpers.isCollapsed()
              ? "collapsed"
              : "expanded";
            layoutCollapsedCustomizerOptions
              .querySelector(`input[value="${layoutCollapsedVal}"]`)
              .click();
          }
        } catch (e) {}
      }
    });
  });

  // Menu swipe gesture

  // Detect swipe gesture on the target element and call swipe In
  window.Helpers.swipeIn(".drag-target", function (e) {
    window.Helpers.setCollapsed(false);
  });

  // Detect swipe gesture on the target element and call swipe Out
  window.Helpers.swipeOut("#layout-menu", function (e) {
    if (window.Helpers.isSmallScreen()) window.Helpers.setCollapsed(true);
  });

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName("menu-inner"),
    menuInnerShadow = document.getElementsByClassName("menu-inner-shadow")[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener("ps-scroll-y", function () {
      if (this.querySelector(".ps__thumb-y").offsetTop) {
        menuInnerShadow.style.display = "block";
      } else {
        menuInnerShadow.style.display = "none";
      }
    });
  }

  // Update light/dark image based on current style
  function switchImage(style) {
    if (style === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        style = "dark";
      } else {
        style = "light";
      }
    }
    const switchImagesList = [].slice.call(
      document.querySelectorAll("[data-app-" + style + "-img]")
    );
    switchImagesList.map(function (imageEl) {
      const setImage = imageEl.getAttribute("data-app-" + style + "-img");
      imageEl.src = assetsPath + "img/" + setImage; // Using window.assetsPath to get the exact relative path
    });
  }

  // Navbar Scroll class
  //---------------------
  function scrollTopFn() {
    if (document.getElementById("layout-navbar")) {
      if (
        document.body.scrollTop > 10 ||
        document.documentElement.scrollTop > 10
      ) {
        document
          .getElementById("layout-navbar")
          .classList.add("navbar-elevated");
      } else {
        document
          .getElementById("layout-navbar")
          .classList.remove("navbar-elevated");
      }
    }
  }
  window.onscroll = function () {
    scrollTopFn();
  };

  //Style Switcher (Light/Dark/System Mode)
  let styleSwitcher = document.querySelector(".dropdown-style-switcher");

  // Get style from local storage or use 'system' as default
  let storedStyle =
    localStorage.getItem("templateCustomizer-" + templateName + "--Style") || //if no template style then use Customizer style
    (window.templateCustomizer?.settings?.defaultStyle ?? "light"); //!if there is no Customizer then use default style as light

  // Set style on click of style switcher item if template customizer is enabled
  if (window.templateCustomizer && styleSwitcher) {
    let styleSwitcherItems = [].slice.call(
      styleSwitcher.children[1].querySelectorAll(".dropdown-item")
    );
    styleSwitcherItems.forEach(function (item) {
      item.addEventListener("click", function () {
        let currentStyle = this.getAttribute("data-theme");
        if (currentStyle === "light") {
          window.templateCustomizer.setStyle("light");
        } else if (currentStyle === "dark") {
          window.templateCustomizer.setStyle("dark");
        } else {
          window.templateCustomizer.setStyle("system");
        }
      });
    });

    // Update style switcher icon based on the stored style

    const styleSwitcherIcon = styleSwitcher.querySelector("i");

    if (storedStyle === "light") {
      styleSwitcherIcon.classList.add("bx-sun");
      new bootstrap.Tooltip(styleSwitcherIcon, {
        title: "Light Mode",
        fallbackPlacements: ["bottom"],
      });
    } else if (storedStyle === "dark") {
      styleSwitcherIcon.classList.add("bx-moon");
      new bootstrap.Tooltip(styleSwitcherIcon, {
        title: "Dark Mode",
        fallbackPlacements: ["bottom"],
      });
    } else {
      styleSwitcherIcon.classList.add("bx-desktop");
      new bootstrap.Tooltip(styleSwitcherIcon, {
        title: "System Mode",
        fallbackPlacements: ["bottom"],
      });
    }
  }

  // Run switchImage function based on the stored style
  switchImage(storedStyle);

  // Internationalization (Language Dropdown)
  // ---------------------------------------

  // if (typeof i18next !== 'undefined' && typeof i18NextHttpBackend !== 'undefined') {
  //   i18next
  //     .use(i18NextHttpBackend)
  //     .init({
  //       lng: window.templateCustomizer ? window.templateCustomizer.settings.lang : 'en',
  //       debug: false,
  //       fallbackLng: 'en',
  //       backend: {
  //         loadPath: assetsPath + 'json/locales/{{lng}}.json'
  //       },
  //       returnObjects: true
  //     })
  //     .then(function (t) {
  //       localize();
  //     });
  // }

  let languageDropdown = document.getElementsByClassName("dropdown-language");

  if (languageDropdown.length) {
    let dropdownItems = languageDropdown[0].querySelectorAll(".dropdown-item");

    for (let i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].addEventListener("click", function () {
        let currentLanguage = this.getAttribute("data-language");
        let textDirection = this.getAttribute("data-text-direction");

        for (let sibling of this.parentNode.children) {
          var siblingEle = sibling.parentElement.parentNode.firstChild;

          // Loop through each sibling and push to the array
          while (siblingEle) {
            if (
              siblingEle.nodeType === 1 &&
              siblingEle !== siblingEle.parentElement
            ) {
              siblingEle
                .querySelector(".dropdown-item")
                .classList.remove("active");
            }
            siblingEle = siblingEle.nextSibling;
          }
        }
        this.classList.add("active");

        i18next.changeLanguage(currentLanguage, (err, t) => {
          window.templateCustomizer
            ? window.templateCustomizer.setLang(currentLanguage)
            : "";
          directionChange(textDirection);
          if (err) return console.log("something went wrong loading", err);
          localize();
        });
      });
    }
    function directionChange(textDirection) {
      if (textDirection === "rtl") {
        if (
          localStorage.getItem(
            "templateCustomizer-" + templateName + "--Rtl"
          ) !== "true"
        )
          window.templateCustomizer
            ? window.templateCustomizer.setRtl(true)
            : "";
      } else {
        if (
          localStorage.getItem(
            "templateCustomizer-" + templateName + "--Rtl"
          ) === "true"
        )
          window.templateCustomizer
            ? window.templateCustomizer.setRtl(false)
            : "";
      }
    }
  }

  function localize() {
    let i18nList = document.querySelectorAll("[data-i18n]");
    // Set the current language in dd
    let currentLanguageEle = document.querySelector(
      '.dropdown-item[data-language="' + i18next.language + '"]'
    );

    if (currentLanguageEle) {
      currentLanguageEle.click();
    }

    i18nList.forEach(function (item) {
      item.innerHTML = i18next.t(item.dataset.i18n);
    });
  }

  // Notification
  // ------------
  const notificationMarkAsReadAll = document.querySelector(
    ".dropdown-notifications-all"
  );
  const notificationMarkAsReadList = document.querySelectorAll(
    ".dropdown-notifications-read"
  );

  // Notification: Mark as all as read
  if (notificationMarkAsReadAll) {
    notificationMarkAsReadAll.addEventListener("click", (event) => {
      notificationMarkAsReadList.forEach((item) => {
        item
          .closest(".dropdown-notifications-item")
          .classList.add("marked-as-read");
      });
    });
  }
  // Notification: Mark as read/unread onclick of dot
  if (notificationMarkAsReadList) {
    notificationMarkAsReadList.forEach((item) => {
      item.addEventListener("click", (event) => {
        item
          .closest(".dropdown-notifications-item")
          .classList.toggle("marked-as-read");
      });
    });
  }

  // Notification: Mark as read/unread onclick of dot
  const notificationArchiveMessageList = document.querySelectorAll(
    ".dropdown-notifications-archive"
  );
  notificationArchiveMessageList.forEach((item) => {
    item.addEventListener("click", (event) => {
      item.closest(".dropdown-notifications-item").remove();
    });
  });

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == "show.bs.collapse" || e.type == "show.bs.collapse") {
      e.target.closest(".accordion-item").classList.add("active");
    } else {
      e.target.closest(".accordion-item").classList.remove("active");
    }
  };

  const accordionTriggerList = [].slice.call(
    document.querySelectorAll(".accordion")
  );
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener(
      "show.bs.collapse",
      accordionActiveFunction
    );
    accordionTriggerEl.addEventListener(
      "hide.bs.collapse",
      accordionActiveFunction
    );
  });

  // If layout is RTL add .dropdown-menu-end class to .dropdown-menu
  // if (isRtl) {
  //   Helpers._addClass('dropdown-menu-end', document.querySelectorAll('#layout-navbar .dropdown-menu'));
  // }

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Init PerfectScrollbar in Navbar Dropdown (i.e notification)
  window.Helpers.initNavbarDropdownScrollbar();

  let horizontalMenuTemplate = document.querySelector(
    "[data-template^='horizontal-menu']"
  );
  if (horizontalMenuTemplate) {
    // if screen size is small then set navbar fixed
    if (window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT) {
      window.Helpers.setNavbarFixed("fixed");
    } else {
      window.Helpers.setNavbarFixed("");
    }
  }

  // On window resize listener
  // -------------------------
  window.addEventListener(
    "resize",
    function (event) {
      // Hide open search input and set value blank
      if (window.innerWidth >= window.Helpers.LAYOUT_BREAKPOINT) {
        if (document.querySelector(".search-input-wrapper")) {
          document
            .querySelector(".search-input-wrapper")
            .classList.add("d-none");
          document.querySelector(".search-input").value = "";
        }
      }
      // Horizontal Layout : Update menu based on window size
      if (horizontalMenuTemplate) {
        // if screen size is small then set navbar fixed
        if (window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT) {
          window.Helpers.setNavbarFixed("fixed");
        } else {
          window.Helpers.setNavbarFixed("");
        }
        setTimeout(function () {
          if (window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT) {
            if (document.getElementById("layout-menu")) {
              if (
                document
                  .getElementById("layout-menu")
                  .classList.contains("menu-horizontal")
              ) {
                menu.switchMenu("vertical");
              }
            }
          } else {
            if (document.getElementById("layout-menu")) {
              if (
                document
                  .getElementById("layout-menu")
                  .classList.contains("menu-vertical")
              ) {
                menu.switchMenu("horizontal");
              }
            }
          }
        }, 100);
      }
    },
    true
  );

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (isHorizontalLayout || window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  if (typeof TemplateCustomizer !== "undefined") {
    if (window.templateCustomizer.settings.defaultMenuCollapsed) {
      window.Helpers.setCollapsed(true, false);
    } else {
      window.Helpers.setCollapsed(false, false);
    }
  }

  // Manage menu expanded/collapsed state with local storage support If enableMenuLocalStorage = true in config.js
  if (typeof config !== "undefined") {
    if (config.enableMenuLocalStorage) {
      try {
        if (
          localStorage.getItem(
            "templateCustomizer-" + templateName + "--LayoutCollapsed"
          ) !== null
        )
          window.Helpers.setCollapsed(
            localStorage.getItem(
              "templateCustomizer-" + templateName + "--LayoutCollapsed"
            ) === "true",
            false
          );
      } catch (e) {}
    }
  }
})();
