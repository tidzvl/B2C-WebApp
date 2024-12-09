/**
 * app-ecommerce-order-list Script
 */

"use strict";

/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @ajax to API get list order - use mechanic Data table and bootstrap modal
 * @callback order.js render overview order
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */

function checkClick() {
  localStorage.removeItem("order_detail");
  const order_click = document.querySelectorAll(".order-id");
  //listen click
  order_click.forEach((item) => {
    item.addEventListener("click", (event) => {
      localStorage.setItem("order_id", item.getAttribute("value"));
      window.location.href = "../orderDetail/";
    });
  });
}

// Datatable (jquery)

$(function () {
  let borderColor, bodyBg, headingColor;

  if (isDarkStyle) {
    borderColor = config.colors_dark.borderColor;
    bodyBg = config.colors_dark.bodyBg;
    headingColor = config.colors_dark.headingColor;
  } else {
    borderColor = config.colors.borderColor;
    bodyBg = config.colors.bodyBg;
    headingColor = config.colors.headingColor;
  }

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

  // Variable declaration for table

  var dt_order_table = $(".datatables-order"),
    statusObj = {
      1: { title: "Cancel", class: "bg-label-warning" },
      2: { title: "Completed", class: "bg-label-success" },
      3: { title: "In Progress", class: "bg-label-primary" },
      4: { title: "Not Started", class: "bg-label-info" },
    },
    paymentObj = {
      1: { title: "Completed", class: "text-success" },
      2: { title: "In Progress", class: "text-warning" },
      3: { title: "Not Started", class: "text-secondary" },
      4: { title: "Cancelled", class: "text-danger" },
    };

  getData().then((dataa) => {
    // console.log(dataa);
    if (dt_order_table.length) {
      var dt_products = dt_order_table.DataTable({
        // ajax: assetsPath + "json/order-list.json", // JSON file to add data
        data: dataa,
        drawCallback: function (settings) {
          checkClick();
        },
        columns: [
          // columns according to JSON
          { data: "orderId" },
          { data: "orderId" },
          { data: "orderId" },
          { data: "orderDate" },
          { data: "totalAmount" },
          { data: "status" },
          { data: "deliveryDate" },
          { data: "" },
        ],
        columnDefs: [
          {
            // For Responsive
            className: "control",
            searchable: false,
            orderable: false,
            responsivePriority: 2,
            targets: 0,
            render: function (data, type, full, meta) {
              return "";
            },
          },
          {
            // For Checkboxes
            targets: 1,
            orderable: false,
            checkboxes: {
              selectAllRender:
                '<input type="checkbox" class="form-check-input">',
            },
            render: function () {
              return '<input type="checkbox" class="dt-checkboxes form-check-input" >';
            },
            searchable: false,
          },
          {
            // Order ID
            targets: 2,
            render: function (data, type, full, meta) {
              var $index = dataa.findIndex(
                (item) => item.orderId === full["orderId"]
              );
              var $order_id = full["orderId"];
              // Creates full output for row
              var $row_output =
                '<a href="javascript:void();"><span class="fw-medium order-id" value="' +
                $order_id +
                '">#' +
                $index +
                "</span></a>";
              return $row_output;
            },
          },
          {
            // Date and Time
            targets: 3,
            render: function (data, type, full, meta) {
              var $date = full.orderDate.split("T")[0];
              return '<span class="text-nowrap">' + $date + "</span>";
            },
          },
          {
            targets: 4,
            render: function (data, type, full, meta) {
              var $totalAmount =
                full["totalAmount"].toLocaleString("vi-VN") + " VNĐ";
              // Creates full output for row
              var $row_output =
                '<span class="fw-medium">' + $totalAmount + "</span>";
              return $row_output;
            },
          },
          {
            targets: 5,
            render: function (data, type, full, meta) {
              var $payment = full["status"];
              if ($payment == "In Progress") {
                $payment = 2;
              } else if ($payment == "Completed") {
                $payment = 1;
              } else if ($payment == "Not Started") {
                $payment = 3;
              } else if ($payment == "Cancelled") {
                $payment = 4;
              }
              var $deli = paymentObj[$payment];
              if ($deli) {
                return (
                  '<h6 class="mb-0 w-px-100 text-nowrap ' +
                  $deli.class +
                  '"><i class="bx bxs-circle fs-tiny me-2"></i>' +
                  $deli.title +
                  "</h6>"
                );
              }
              // return data;
            },
          },
          {
            targets: -2,
            render: function (data, type, full, meta) {
              var $date;
              if (full["deliveryDate"])
                $date = full["deliveryDate"].split("T")[0];
              else $date = "Đơn hàng đang được xử lý!";

              return (
                '<div class="d-flex align-items-center text-nowrap">' +
                '<span class="text-truncate fw-medium">' +
                $date +
                "</span>" +
                "</div>"
              );
            },
          },
          {
            // Actions
            targets: -1,
            title: "Actions",
            searchable: false,
            orderable: false,
            render: function (data, type, full, meta) {
              return (
                '<div class="d-flex justify-content-sm-center align-items-sm-center">' +
                '<button class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-end m-0">' +
                '<a href="javascript:0;" class="dropdown-item view-detail">Xem chi tiết</a>' +
                '<a href="javascript:0;" class="dropdown-item delete-record">' +
                "Report bug" +
                "</a>" +
                "</div>" +
                "</div>"
              );
            },
          },
        ],
        order: [3, "asc"], //set any columns order asc/desc
        dom:
          '<"card-header d-flex flex-column flex-md-row align-items-start align-items-md-center"<f><"d-flex align-items-md-center justify-content-md-end mt-2 mt-md-0 ps-1 ms-1"l<"dt-action-buttons"B>>' +
          ">t" +
          '<"row mx-2"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          ">",
        lengthMenu: [10, 40, 60, 80, 100], //for length of menu
        language: {
          sLengthMenu: "_MENU_",
          search: "",
          searchPlaceholder: "Search Order",
          info: "Displaying _START_ to _END_ of _TOTAL_ entries",
        },
        // Buttons with Dropdown
        buttons: [
          {
            extend: "collection",
            className: "btn btn-label-secondary dropdown-toggle me-3",
            text: '<i class="bx bx-export me-1"></i>Export',
            buttons: [
              {
                extend: "print",
                text: '<i class="bx bx-printer me-2" ></i>Print',
                className: "dropdown-item",
                exportOptions: {
                  columns: [2, 3, 4, 5, 6, 7],
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = "";
                      $.each(el, function (index, item) {
                        if (
                          item.classList !== undefined &&
                          item.classList.contains("order-name")
                        ) {
                          result =
                            result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    },
                  },
                },
                customize: function (win) {
                  // Customize print view for dark
                  $(win.document.body)
                    .css("color", headingColor)
                    .css("border-color", borderColor)
                    .css("background-color", bodyBg);
                  $(win.document.body)
                    .find("table")
                    .addClass("compact")
                    .css("color", "inherit")
                    .css("border-color", "inherit")
                    .css("background-color", "inherit");
                },
              },
              {
                extend: "csv",
                text: '<i class="bx bx-file me-2" ></i>Csv',
                className: "dropdown-item",
                exportOptions: {
                  columns: [2, 3, 4, 5, 6, 7],
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = "";
                      $.each(el, function (index, item) {
                        if (
                          item.classList !== undefined &&
                          item.classList.contains("order-name")
                        ) {
                          result =
                            result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    },
                  },
                },
              },
              {
                extend: "excel",
                text: '<i class="bx bxs-file-export me-2"></i>Excel',
                className: "dropdown-item",
                exportOptions: {
                  columns: [2, 3, 4, 5, 6, 7],
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = "";
                      $.each(el, function (index, item) {
                        if (
                          item.classList !== undefined &&
                          item.classList.contains("order-name")
                        ) {
                          result =
                            result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    },
                  },
                },
              },
              {
                extend: "pdf",
                text: '<i class="bx bxs-file-pdf me-2"></i>Pdf',
                className: "dropdown-item",
                exportOptions: {
                  columns: [2, 3, 4, 5, 6, 7],
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = "";
                      $.each(el, function (index, item) {
                        if (
                          item.classList !== undefined &&
                          item.classList.contains("order-name")
                        ) {
                          result =
                            result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    },
                  },
                },
              },
              {
                extend: "copy",
                text: '<i class="bx bx-copy me-2" ></i>Copy',
                className: "dropdown-item",
                exportOptions: {
                  columns: [2, 3, 4, 5, 6, 7],
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = "";
                      $.each(el, function (index, item) {
                        if (
                          item.classList !== undefined &&
                          item.classList.contains("order-name")
                        ) {
                          result =
                            result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    },
                  },
                },
              },
            ],
          },
        ],
        // For responsive popup
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.modal({
              header: function (row) {
                var data = row.data();
                return "Details of " + data["customer"];
              },
            }),
            type: "column",
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.title !== "" // ? Do not show row in modal popup if title is blank (for check box)
                  ? '<tr data-dt-row="' +
                      col.rowIndex +
                      '" data-dt-column="' +
                      col.columnIndex +
                      '">' +
                      "<td>" +
                      col.title +
                      ":" +
                      "</td> " +
                      "<td>" +
                      col.data +
                      "</td>" +
                      "</tr>"
                  : "";
              }).join("");

              return data
                ? $('<table class="table"/><tbody />').append(data)
                : false;
            },
          },
        },
      });
      $(".dataTables_length").addClass("mt-0 mt-md-3 me-3");
      $(".dt-action-buttons").addClass("pt-0");
    }
    // Delete Record
    $(".datatables-order tbody").on("click", ".delete-record", function () {
      dt_products.row($(this).parents("tr")).remove().draw();
    });
  });

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $(".dataTables_filter .form-control").removeClass("form-control-sm");
    $(".dataTables_length .form-select").removeClass("form-select-sm");
  }, 300);
});
