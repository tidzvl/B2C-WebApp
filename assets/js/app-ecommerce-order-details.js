/**
 * app-ecommerce-order-details Script
 */

'use strict';

// Datatable (jquery)

$(function () {
  // Variable declaration for table

  var statusObj = {
    1: { title: 'Cancelled', class: 'bg-label-warning', noti: 'Đơn hàng của bạn đã bị hủy!' },
    2: { title: 'Completed', class: 'bg-label-success', noti: 'Đơn hàng đã hoàn thành!' },
    3: { title: 'In Progress', class: 'bg-label-primary', noti: 'Đơn hàng đang giao đến bạn!' },
    4: { title: 'Not Started', class: 'bg-label-info', noti: 'Đơn hàng chưa bắt đầu!' }
  };

  var dt_details_table = $('.datatables-order-details');
  var order_id = localStorage.getItem("order_id");
  if(!order_id) window.location.href = "../order/";

  if (dt_details_table.length) {
    fetch(ApiHost+'/api/order/details?id=' + order_id)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }).then((data) => {
      // console.log(data);
      const order = data.result;
      //BEFORE RENDER 
      document.querySelectorAll('.order-id').forEach(item => item.innerHTML = order.orderId);
      document.querySelectorAll('.order-date').forEach(item => item.innerHTML = order.orderDate.split("T")[0]);
      document.querySelector('.total-amount').innerHTML = order.totalPrice.toLocaleString('vi-VN')  + " VNĐ";
      document.querySelector('.discount').innerHTML = order.totalDiscount.toLocaleString('vi-VN') + " VNĐ"; //CHECK PLSSSSS
      document.querySelector('.shipping-fee').innerHTML = order.shippingFee.toLocaleString('vi-VN') + " VNĐ";
      document.querySelector('.total-price').innerHTML = order.totalAmount.toLocaleString('vi-VN') + " VNĐ";

      var status;
      if(order.status == statusObj[1].title) status = statusObj[1];
      else if(order.status == statusObj[2].title) status = statusObj[2];
      else if(order.status == statusObj[3].title) status = statusObj[3];
      else if(order.status == statusObj[4].title) status = statusObj[4];
      document.querySelectorAll('.order-status').forEach(item => item.innerHTML = status.title);
      document.querySelector('.order-status').classList.add(status.class);
      document.querySelector('.order-noti').innerHTML = status.noti;
      if(status.title == "Completed") {
        document.querySelectorAll('.timeline-point').forEach(item => item.classList.remove("timeline-point-secondary"));
        document.querySelector('.deli-date').innerHTML = order.deliveryDate.split("T")[0];
      }
      try {
        document.querySelector(".num-of-invoice").innerHTML = localStorage.getItem("number_of_order");
        document.querySelector('.email').innerHTML = order.deliveryAddress.email;
        document.querySelector('.phone').innerHTML = order.deliveryAddress.phone;
        document.querySelector('.addressOrder').innerHTML = order.deliveryAddress.street + ', ' + order.deliveryAddress.state + ', ' + order.deliveryAddress.city + ', ' + order.deliveryAddress.country;
      } catch (e) {console.log("Not render sum of invoice");}


    //   fetch( assetsPath + '/json/order-detail-list.json')
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }
    //   return response.json();
    // }).then((data) => {
    //   const order_detail_list = data.data;
    //   const order_details = order_detail_list.filter(order_detail => order_detail.order_id == order_id);
    //   fetch( assetsPath + '/json/all-products.json')
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   }).then((data) => {
    //     const product_list = data.data;
    //     var all_order_detail = [];
    //     order_details.forEach(order_detail => {
    //       const product = product_list.find(product => product.productId == order_detail.product_id);
    //       const orderDetail = {
    //         product_id: product.productId,
    //         name: product.name,
    //         version: product.version,
    //         image: product.image[0],
    //         price: order_detail.price,
    //         qty: order_detail.quantity
    //       };
    //       all_order_detail.push(orderDetail);
    //     });
    //     localStorage.setItem("order_detail", JSON.stringify(all_order_detail));
    //   });
    // });


    //   //END RENDER

    // })


    var order_detail = order.orderDetails;
    var dt_products = dt_details_table.DataTable({
      // ajax: {
      //   // JSON.parse(localStorage.getItem("order_detail")), // JSON file to add data
      // },
      data: order_detail,
      columns: [
        // columns according to JSON
        { data: 'orderDetailId' },
        { data: 'orderDetailId' },
        { data: 'product' },
        { data: 'price' },
        { data: 'quantity' },
        { data: '' }
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
          // Product name and product info
          targets: 2,
          responsivePriority: 1,
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            var $name = full["product"]['name'],
              $product_brand = full["product"]['version'];
              var $image;
              if(full["product"]['images'].length == 0) $image = "https://i.ibb.co/Cs8hwmp/cube.png";
              else $image = full["product"]['images'][0].url;
            if ($image) {
              // For Product image
              var $output =
                '<img src="' +
                $image +
                '" alt="product-' +
                $name +
                '" class="rounded-2">';
            } 
            // Creates full output for Product name and product_brand
            var $row_output =
              '<div class="d-flex justify-content-start align-items-center text-nowrap">' +
              '<div class="avatar-wrapper">' +
              '<div class="avatar me-2">' +
              $output +
              '</div>' +
              '</div>' +
              '<div class="d-flex flex-column">' +
              '<h6 class="text-body mb-0">' +
              $name +
              '</h6>' +
              '<small class="text-muted">' +
              $product_brand +
              '</small>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          // For Price
          targets: 3,
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            var $price = full['price'];
            var $output = '<span>' + $price.toLocaleString('vi-VN') + ' VNĐ</span>';
            return $output;
          }
        },
        {
          // For Qty
          targets: 4,
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            var $qty = full['quantity'];
            var $output = '<span class="text-body">' + $qty + '</span>';
            return $output;
          }
        },
        {
          // Total
          targets: 5,
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            var $total = full['quantity'] * full['price'];
            var $output = '<h6 class="mb-0" style="text-wrap: nowrap;">' + $total.toLocaleString('vi-VN') + ' VNĐ</h6>';
            return $output;
          }
        }
      ],
      order: [2, ''], //set any columns order asc/desc
      dom: 't',
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
  });
  }
  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});

//sweet alert
(function () {
  const deleteOrder = document.querySelector('.delete-order');
  // Suspend User javascript
  if (deleteOrder) {
    deleteOrder.onclick = function () {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert order!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete order!',
        customClass: {
          confirmButton: 'btn btn-primary me-2',
          cancelButton: 'btn btn-label-secondary'
        },
        buttonsStyling: false
      }).then(function (result) {
        if (result.value) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Order has been removed.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Cancelled Delete :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        }
      });
    };
  }

  //for custom year
  // function getCurrentYear() {
  //   var currentYear = new Date().getFullYear();
  //   return currentYear;
  // }

  // var year = getCurrentYear();
  // document.getElementById('orderYear').innerHTML = year;
})();
