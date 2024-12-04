/**
 * Order - main
 */

"use strict";


/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @timeout 3000ms
 * @main display order overview
 * @Error that can count a table, not all -> fix if have free time
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */



setTimeout(function () {
  const inProgress = document.querySelectorAll('.text-warning').length,
    completed = document.querySelectorAll('.text-success').length,
    cancelled = document.querySelectorAll('.text-danger').length,
    notStarted = document.querySelectorAll('.text-secondary').length,
    total = inProgress + completed + cancelled + notStarted,
    progress = inProgress + notStarted;

  const orderOverview = `
        <div class="row gy-4 gy-sm-1">
                      <div class="col-sm-6 col-lg-3">
                        <div
                          class="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                          <div>
                            <h3 class="mb-2">${total}</h3>
                            <p class="mb-0">Đơn hàng của bạn</p>
                          </div>
                          <div class="avatar me-sm-4">
                            <span class="avatar-initial rounded bg-label-secondary">
                              <i class="bx bx-calendar bx-sm"></i>
                            </span>
                          </div>
                        </div>
                        <hr class="d-none d-sm-block d-lg-none me-4" />
                      </div>
                      <div class="col-sm-6 col-lg-3">
                        <div
                          class="d-flex justify-content-between align-items-start card-widget-2 border-end pb-3 pb-sm-0">
                          <div>
                            <h3 class="mb-2">${completed}</h3>
                            <p class="mb-0">Đã hoàn thành</p>
                          </div>
                          <div class="avatar me-lg-4">
                            <span class="avatar-initial rounded bg-label-secondary">
                              <i class="bx bx-check-double bx-sm"></i>
                            </span>
                          </div>
                        </div>
                        <hr class="d-none d-sm-block d-lg-none" />
                      </div>
                      <div class="col-sm-6 col-lg-3">
                        <div
                          class="d-flex justify-content-between align-items-start border-end pb-3 pb-sm-0 card-widget-3">
                          <div>
                            <h3 class="mb-2">${progress}</h3>
                            <p class="mb-0">Đang xử lý</p>
                          </div>
                          <div class="avatar me-sm-4">
                            <span class="avatar-initial rounded bg-label-secondary">
                              <i class="bx bx-wallet bx-sm"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-lg-3">
                        <div class="d-flex justify-content-between align-items-start">
                          <div>
                            <h3 class="mb-2">${cancelled}</h3>
                            <p class="mb-0">Đã hủy</p>
                          </div>
                          <div class="avatar">
                            <span class="avatar-initial rounded bg-label-secondary">
                              <i class="bx bx-error-alt bx-sm"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
    `;

    document.querySelector('.overview').innerHTML = orderOverview;

}, 3000);
