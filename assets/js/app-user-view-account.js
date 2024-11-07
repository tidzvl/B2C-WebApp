/**
 * App User View - Account (jquery)
 */

$(function () {
  'use strict';
  // const data_user = JSON.parse(localStorage.getItem('data_user'));
  const data_user = {
    "data": [
      {
        "user_id" : "2213491",
        "name" : "Tin Dep Trai",
        "status" : "Đã xác thực",
        "sex" : "Nam",
        "phone" : [
          "0353431537"
        ],
        "email" : "tin.nguyentidz1476@hcmut.edu.vn",
        "address" : [
          "440/40/5 Thống Nhất, P. 16, Gò Vấp, TP. HCM",
          "46 Bạch Đằng, Tân Bình, TP. HCM"
        ]
      }
    ]
  }
  //get sum of order and points
  const sum_of_order = 13;
  const sum_of_points = 146;

  //render infomation

  // document.querySelectorAll('.name').innerHTML = data_user.data[0].name;
  document.querySelectorAll('.name').forEach((element, index) => { 
    element.innerHTML = data_user.data[0].name;
  });
  document.querySelector('.makhachhang').innerHTML = data_user.data[0].user_id;
  document.querySelector('.verified').innerHTML = data_user.data[0].status;
  document.querySelector('.sex').innerHTML = data_user.data[0].sex;
  document.querySelector('.phone').innerHTML = data_user.data[0].phone;
  document.querySelector('.email').innerHTML = data_user.data[0].email;
  document.querySelector('.num-of-invoice').innerHTML = sum_of_order;
  document.querySelector('.points').innerHTML = sum_of_points;

  //address
  document.querySelectorAll('.address').forEach((element, index) => { 
    if (data_user.data[0].address[index]) { 
      element.innerHTML = data_user.data[0].address[index];
    }
  });

  //!render infomation


  // Variable declaration for table
  var dt_project_table = $('.datatable-project'),
    dt_invoice_table = $('.datatable-invoice');

  // Project datatable
  // --------------------------------------------------------------------
  if (dt_project_table.length) {
    var dt_project = dt_project_table.DataTable({
      ajax: assetsPath + 'json/order-list.json', // JSON file to add data
      columns: [
        // columns according to JSON
        { data: 'delivery_date' },
        { data: 'delivery_date' },
        { data: 'order_id' },
        { data: 'total_amount' },
        { data: 'progress' },
        { data: 'delivery_date' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          searchable: false,
          orderable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          checkboxes: {
            selectAllRender: '<input type="checkbox" class="form-check-input">'
          },
          render: function () {
            return '<input type="checkbox" class="dt-checkboxes form-check-input" >';
          },
          searchable: false
        },
        {
          // User full name and email
          targets: 2,
          responsivePriority: 1,
          render: function (data, type, full, meta) {
            var $name = full['order_id'],
              $order_date = full['order_date'];
            // Creates full output for row
            var $row_output =
              '<div class="d-flex justify-content-left align-items-center">' +
              '<div class="d-flex flex-column">' +
              '<span class="text-truncate fw-medium">' +
              $name +
              '</span>' +
              '<small class="text-muted">' +
              $order_date +
              '</small>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          targets: 3,
          orderable: false
        },
        {
          // Label
          targets: 4,
          responsivePriority: 3,
          render: function (data, type, full, meta) {
            var $progress = full['progress'];
            return (
              '<div class="d-flex flex-column"><span class="text-truncate fw-medium">' +
              $progress +
              '</span>'
            );
          }
        },
        {
          targets: 5,
          orderable: false
        }
      ],
      order: [[2, 'desc']],
      dom:
        '<"d-flex justify-content-between align-items-center flex-column flex-sm-row mx-4 row"' +
        '<"col-sm-4 col-12 d-flex align-items-center justify-content-sm-start justify-content-center"l>' +
        '<"col-sm-8 col-12 d-flex align-items-center justify-content-sm-end justify-content-center"f>' +
        '>t' +
        '<"d-flex justify-content-between mx-4 row"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      language: {
        sLengthMenu: 'Show _MENU_',
        // search: '',
        searchPlaceholder: 'Search Project'
      },
      // For responsive popup
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['full_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
  }

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});
