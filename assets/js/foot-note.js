/**
 * All - Foot Note
 */
'use strict';


(function () {
  var now = new Date().getFullYear();
    const footnote = `
      <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
        <div class="mb-2 mb-md-0">
          ©
          <script>
          </script>
          2024, made with ❤️ by
          <a href="https://tinlikesub.pro" target="_blank" class="footer-link fw-medium">TiDz</a>
        </div>
        <div class="d-none d-lg-inline-block">
          <a href="https://github.com/tidzvl" class="footer-link me-4" target="_blank"
            >Github</a
          >
          <a href="https://www.facebook.com/Wall.Bat.Baiz/" target="_blank" class="footer-link me-4"
            >Contact</a
          >
        </div>
      </div>
    `
    document.querySelector('.foot-note').innerHTML = footnote;
})();