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
  async function getData() {
    try {
      const customerId = JSON.parse(
        localStorage.getItem("user_data")
      ).customerId;
      const response = await fetch(
        ApiHost+"/api/order/all?customerId=" + customerId
      );
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(error);
    }
  }

  getData().then((data) => {
    let total = 0;
    let completed = 0,
      progress = 0,
      canceled = 0;
    data.forEach((item) => {
      total++;
      if (item.status == "Completed") completed++;
      else if (item.status == "Cancelled") canceled++;
      else if (item.status == "In Progress") progress++;
      else if (item.status == "Not Started") progress++;
    });

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
                            <h3 class="mb-2">${canceled}</h3>
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

    document.querySelector(".overview").innerHTML = orderOverview;
  });
}, 3000);
