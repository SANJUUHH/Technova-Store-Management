const orderBody = document.getElementById("orderBody");

const searchInput = document.getElementById("searchInput");

const statusFilter = document.getElementById("statusFilter");

const paymentFilter = document.getElementById("paymentFilter");

const sortSelect = document.getElementById("sortSelect");

const limitSelect = document.getElementById("limitSelect");

const pageNumbers = document.getElementById("pageNumbers");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");


let allOrders = [];

let currentPage = 1;

let limit = 5;



// LOAD SIDEBAR

fetch("../emp_sidebar/emp_sidebar.html")
.then((res) => res.text())
.then((data) => {

    document.getElementById("sidebar-container").innerHTML = data;

});




// FETCH ORDERS

async function fetchOrders(){

    try {

        const res = await fetch("http://localhost:3000/orders");

        const orders = await res.json();

        allOrders = orders;

        applyFeatures();

    } 
    catch (error) {

        console.log(error);

    }

}





function applyFeatures(){

    let filteredOrders = [...allOrders];



    // SEARCH

    const searchValue = searchInput.value.toLowerCase();

    filteredOrders = filteredOrders.filter((order) => {

        return (

            order.customerName.toLowerCase().includes(searchValue) ||

            order.id.toString().includes(searchValue) ||

            order.paymentStatus.toLowerCase().includes(searchValue)

        );

    });




    // STATUS FILTER

    if(statusFilter.value !== ""){

        filteredOrders = filteredOrders.filter((order) => {

            return order.orderStatus === statusFilter.value;

        });

    }




    // PAYMENT FILTER

    if(paymentFilter.value !== ""){

        filteredOrders = filteredOrders.filter((order) => {

            return order.paymentStatus === paymentFilter.value;

        });

    }




    // SORTING

    if(sortSelect.value === "latest"){

        filteredOrders.reverse();

    }

    else if(sortSelect.value === "oldest"){

        filteredOrders.sort((a,b) => a.id - b.id);

    }

    else if(sortSelect.value === "highestBill"){

        filteredOrders.sort((a,b) => b.totalAmount - a.totalAmount);

    }

    else if(sortSelect.value === "status"){

        filteredOrders.sort((a,b) => 
            a.orderStatus.localeCompare(b.orderStatus)
        );

    }




    // PAGINATION

    limit = Number(limitSelect.value);

    const totalPages = Math.ceil(filteredOrders.length / limit);

    if(currentPage > totalPages){
        currentPage = 1;
    }

    const start = (currentPage - 1) * limit;

    const end = start + limit;

    const paginatedOrders = filteredOrders.slice(start, end);

    displayOrders(paginatedOrders);

    createPagination(totalPages);

}





function displayOrders(orders){

    orderBody.innerHTML = "";



    for(let i = 0; i < orders.length; i++){

        let order = orders[i];



        let paymentClass = "";

        if(order.paymentStatus === "Paid"){
            paymentClass = "paid";
        }
        else{
            paymentClass = "unpaid";
        }




        let statusClass = "";

        if(order.orderStatus === "Pending"){
            statusClass = "pending";
        }
        else if(order.orderStatus === "Delivered"){
            statusClass = "delivered";
        }
        else{
            statusClass = "cancelled";
        }




        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${order.id}</td>

            <td>${order.customerName}</td>

            <td>${order.mobileNumber}</td>

            <td>${order.productPurchased}</td>

            <td>${order.quantityOrdered}</td>

            <td>₹${order.totalAmount}</td>

            <td>
                <span class="payment ${paymentClass}">
                    ${order.paymentStatus}
                </span>
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${order.orderStatus}
                </span>
            </td>

            <td>

                <button 
                    class="edit-btn"
                    onclick="editOrder('${order.id}')"
                >
                    Edit
                </button>

                <button 
                    class="delete-btn"
                    onclick="deleteOrder('${order.id}')"
                >
                    Delete
                </button>

            </td>

        `;

        orderBody.appendChild(tr);

    }

}





function createPagination(totalPages){

    pageNumbers.innerHTML = "";

    for(let i = 1; i <= totalPages; i++){

        const btn = document.createElement("button");

        btn.innerText = i;

        btn.classList.add("page-btn");

        if(i === currentPage){
            btn.classList.add("active-page");
        }

        btn.addEventListener("click", () => {

            currentPage = i;

            applyFeatures();

        });

        pageNumbers.appendChild(btn);

    }

}





prevBtn.addEventListener("click", () => {

    if(currentPage > 1){

        currentPage--;

        applyFeatures();

    }

});





nextBtn.addEventListener("click", () => {

    const totalPages = Math.ceil(allOrders.length / limit);

    if(currentPage < totalPages){

        currentPage++;

        applyFeatures();

    }

});




// EVENTS

searchInput.addEventListener("input", applyFeatures);

statusFilter.addEventListener("change", applyFeatures);

paymentFilter.addEventListener("change", applyFeatures);

sortSelect.addEventListener("change", applyFeatures);

limitSelect.addEventListener("change", applyFeatures);




// ADD ORDER

document.getElementById("addOrderBtn")
.addEventListener("click", () => {

    window.location.href = "../add_order/add_order.html";

});




// EDIT ORDER

function editOrder(id){

    window.location.href = `../edit_order/edit_order.html?id=${id}`;

}




// DELETE ORDER

async function deleteOrder(id){

    try {

        await fetch(`http://localhost:3000/orders/${id}`, {

            method:"DELETE"

        });

        fetchOrders();

    } 
    catch (error) {

        console.log(error);

    }

}



fetchOrders();