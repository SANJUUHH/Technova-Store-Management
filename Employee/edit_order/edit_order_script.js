const customerName = document.getElementById("customerName");

const mobileNumber = document.getElementById("mobileNumber");

const productPurchased = document.getElementById("productPurchased");

const quantityOrdered = document.getElementById("quantityOrdered");

const totalAmount = document.getElementById("totalAmount");

const deliveryAddress = document.getElementById("deliveryAddress");

const paymentStatus = document.getElementById("paymentStatus");

const orderStatus = document.getElementById("orderStatus");

const editOrderForm = document.getElementById("editOrderForm");



// LOAD SIDEBAR

fetch("../emp_sidebar/emp_sidebar.html")
.then((res) => res.text())
.then((data) => {

    document.getElementById("sidebar-container").innerHTML = data;

});




// GET ORDER ID FROM URL

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");




// FETCH SINGLE ORDER

async function fetchSingleOrder(){

    try {

        const res = await fetch(`http://localhost:3000/orders/${orderId}`);

        const order = await res.json();




        // FILL FORM

        customerName.value = order.customerName;

        mobileNumber.value = order.mobileNumber;

        productPurchased.value = order.productPurchased;

        quantityOrdered.value = order.quantityOrdered;

        totalAmount.value = order.totalAmount;

        deliveryAddress.value = order.deliveryAddress;

        paymentStatus.value = order.paymentStatus;

        orderStatus.value = order.orderStatus;

    } 
    catch (error) {

        console.log(error);

    }

}




// UPDATE ORDER

editOrderForm.addEventListener("submit", async (e) => {

    e.preventDefault();




    const updatedOrder = {

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

        await fetch(`http://localhost:3000/orders/${orderId}`, {

            method:"PATCH",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(updatedOrder)

        });




        alert("Order Updated Successfully");



        window.location.href = "../view_order/view_order.html";

    } 
    catch (error) {

        console.log(error);

    }

});



fetchSingleOrder();