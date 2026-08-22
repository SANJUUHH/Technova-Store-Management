const orderForm = document.getElementById("orderForm");

const customerName = document.getElementById("customerName");

const mobileNumber = document.getElementById("mobileNumber");

const productPurchased = document.getElementById("productPurchased");

const quantityOrdered = document.getElementById("quantityOrdered");

const totalAmount = document.getElementById("totalAmount");

const deliveryAddress = document.getElementById("deliveryAddress");

const paymentStatus = document.getElementById("paymentStatus");

const orderStatus = document.getElementById("orderStatus");



// LOAD SIDEBAR

fetch("../emp_sidebar/emp_sidebar.html")
.then((res) => res.text())
.then((data) => {

    document.getElementById("sidebar-container").innerHTML = data;

});



// ADD ORDER

orderForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const order = {

        customerName: customerName.value,

        mobileNumber: Number(mobileNumber.value),

        productPurchased: productPurchased.value,

        quantityOrdered: Number(quantityOrdered.value),

        totalAmount: Number(totalAmount.value),

        deliveryAddress: deliveryAddress.value,

        paymentStatus: paymentStatus.value,

        orderStatus: orderStatus.value

    };


    try {

        await fetch("http://localhost:3000/orders", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(order)

        });


        alert("Order Added Successfully");


        window.location.href = "../view_order/view_order.html";

    } 
    catch (error) {

        console.log(error);

    }

});