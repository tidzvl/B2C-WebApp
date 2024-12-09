/**
 * App User View - Account (jquery)
 */

/**
 * @author TiDz
 * @version 1.0
 * @since 1.0
 *
 *
 * @ajax to API get list order - use mechanic Data table and bootstrap modal
 * @ajax to get cart from API - do not use mechanic Data table and bootstrap modal
 *
 * DO NOT EDIT ANYTHING EXCEPT <TODO>
 */

$(function () {
  "use strict";

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
  getData().then((dataa) => {
    $(".num-of-invoice").html(dataa.length);
    localStorage.setItem("number_of_order", dataa.length);

    // Variable declaration for table
    var dt_project_table = $(".datatable-project"),
      dt_invoice_table = $(".datatable-invoice");

    // Project datatable
    // --------------------------------------------------------------------
    if (dt_project_table.length) {
      var dt_project = dt_project_table.DataTable({
        // ajax: assetsPath + 'json/order-list.json', // JSON file to add data
        data: dataa,
        columns: [
          // columns according to JSON
          { data: "deliveryDate" },
          { data: "deliveryDate" },
          { data: "orderId" },
          { data: "totalAmount" },
          { data: "status" },
          { data: "deliveryDate" },
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
            targets: 2,
            responsivePriority: 1,
            render: function (data, type, full, meta) {
              // var $count = localStorage.getItem("number_of_order");
              // localStorage.setItem("number_of_order", parseInt($count) + 1);
              var $id = dataa.findIndex(item => item.orderId === full["orderId"]),
                $order_date = full["orderDate"].split("T")[0];
              // Creates full output for row
              var $row_output =
                '<div class="d-flex justify-content-left align-items-center ">' +
                '<div class="d-flex flex-column">' +
                '<span class="text-truncate fw-medium">#' +
                $id +
                "</span>" +
                '<small class="text-muted">' +
                $order_date +
                "</small>" +
                "</div>" +
                "</div>";
              return $row_output;
            },
          },
          {
            targets: 3,
            orderable: true,
            render: function (data, type, full, meta) {
              var $price = full["totalAmount"].toLocaleString("vi-VN") + " VNĐ";
              return (
                '<div class="d-flex flex-column"><span class="text-truncate fw-medium">' +
                $price +
                "</span>"
              );
            },
          },
          {
            // Label
            targets: 4,
            responsivePriority: 3,
            render: function (data, type, full, meta) {
              var $progress = full["status"];
              return (
                '<div class="d-flex flex-column"><span class="text-truncate fw-medium">' +
                $progress +
                "</span>"
              );
            },
          },
          {
            targets: 5,
            orderable: false,
            render: function (data, type, full, meta) {
              var $deli_date;
              if(full["deliveryDate"]) $deli_date = full["deliveryDate"].split("T")[0];
              else $deli_date = "Vui lòng đợi!";
              return (
                '<div class="d-flex flex-column"><span class="text-truncate fw-medium">' +
                $deli_date +
                "</span>"
              );
            },
          },
        ],
        order: [[2, "desc"]],
        dom:
          '<"d-flex justify-content-between align-items-center flex-column flex-sm-row mx-4 row"' +
          '<"col-sm-4 col-12 d-flex align-items-center justify-content-sm-start justify-content-center"l>' +
          '<"col-sm-8 col-12 d-flex align-items-center justify-content-sm-end justify-content-center"f>' +
          ">t" +
          '<"d-flex justify-content-between mx-4 row"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          ">",
        displayLength: 7,
        lengthMenu: [7, 10, 25, 50, 75, 100],
        language: {
          sLengthMenu: "Show _MENU_",
          // search: '',
          searchPlaceholder: "Search Project",
        },
        // For responsive popup
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.modal({
              header: function (row) {
                var data = row.data();
                return "Details of " + data["full_name"];
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
    }
  });
  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $(".dataTables_filter .form-control").removeClass("form-control-sm");
    $(".dataTables_length .form-select").removeClass("form-select-sm");
  }, 300);
});
