const productBody = document.getElementById("productBody");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const statusFilter = document.getElementById("statusFilter");
const brandFilter = document.getElementById("brandFilter");
const sortSelect = document.getElementById("sortSelect");
const limitSelect = document.getElementById("limitSelect");

const pageNumbers = document.getElementById("pageNumbers");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


let allProducts = [];

let currentPage = 1;

let limit = 5;



fetch("../sidebar/sidebar.html")
.then((res) => res.text())
.then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;
});



async function fetchProducts(){

    try {

        const res = await fetch("http://localhost:3000/products");

        const products = await res.json();

        allProducts = products;

        updateDashboard(products);

        fetchOrdersData();

        applyFeatures();

    } 
    catch (error) {

        console.log(error);

    }

}



function updateDashboard(products){

    document.getElementById("totalProducts").innerText = products.length;

    let inStock = 0;
    let outStock = 0;
    let lowStock = 0;

    for(let i = 0; i < products.length; i++){

        if(products[i].status === "In Stock"){
            inStock++;
        }
        else if(products[i].status === "Low Stock"){
            lowStock++;
        }
        else{
            outStock++;
        }

    }

    document.getElementById("instockCount").innerText = inStock;
    document.getElementById("outstockCount").innerText = outStock;
    document.getElementById("lowstockCount").innerText = lowStock;

}


async function fetchOrdersData(){

    try {

        const res = await fetch("http://localhost:3000/orders");

        const orders = await res.json();



        // TOTAL ORDERS

        document.getElementById("totalOrders").innerText = orders.length;



        // TOTAL REVENUE

        let revenue = 0;

        let pendingOrders = 0;

        let cancelledOrders = 0;



        for(let i = 0; i < orders.length; i++){

            revenue += Number(orders[i].totalAmount);



            if(orders[i].orderStatus === "Pending"){

                pendingOrders++;

            }



            if(orders[i].orderStatus === "Cancelled"){

                cancelledOrders++;

            }

        }



        document.getElementById("totalRevenue").innerText = `₹${revenue}`;

        document.getElementById("pendingOrders").innerText = pendingOrders;

        document.getElementById("cancelledOrders").innerText = cancelledOrders;

    } 
    catch (error) {

        console.log(error);

    }

}



function applyFeatures(){

    let filteredProducts = [...allProducts];



    // SEARCH

    const searchValue = searchInput.value.toLowerCase();

    filteredProducts = filteredProducts.filter((product) => {

        return (

            product.prodname.toLowerCase().includes(searchValue) ||

            product.brand.toLowerCase().includes(searchValue) ||

            product.category.toLowerCase().includes(searchValue)

        );

    });



    // CATEGORY FILTER

    if(categoryFilter.value !== ""){

        filteredProducts = filteredProducts.filter((product) => {

            return product.category === categoryFilter.value;

        });

    }



    // STATUS FILTER

    if(statusFilter.value !== ""){

        filteredProducts = filteredProducts.filter((product) => {

            return product.status === statusFilter.value;

        });

    }



    // BRAND FILTER

    if(brandFilter.value !== ""){

        filteredProducts = filteredProducts.filter((product) => {

            return product.brand === brandFilter.value;

        });

    }



    // PRICE FILTER

    if(priceFilter.value === "0-5000"){

        filteredProducts = filteredProducts.filter((product) => {

            return product.price >= 0 && product.price <= 5000;

        });

    }

    else if(priceFilter.value === "5000-20000"){

        filteredProducts = filteredProducts.filter((product) => {

            return product.price > 5000 && product.price <= 20000;

        });

    }

    else if(priceFilter.value === "20000+"){

        filteredProducts = filteredProducts.filter((product) => {

            return product.price > 20000;

        });

    }



    // SORTING

    if(sortSelect.value === "priceLow"){

        filteredProducts.sort((a,b) => a.price - b.price);

    }

    else if(sortSelect.value === "priceHigh"){

        filteredProducts.sort((a,b) => b.price - a.price);

    }

    else if(sortSelect.value === "nameAZ"){

        filteredProducts.sort((a,b) => 
            a.prodname.localeCompare(b.prodname)
        );

    }

    else if(sortSelect.value === "nameZA"){

        filteredProducts.sort((a,b) => 
            b.prodname.localeCompare(a.prodname)
        );

    }

    else if(sortSelect.value === "stockHigh"){

        filteredProducts.sort((a,b) => b.qty - a.qty);

    }



    // PAGINATION

    limit = Number(limitSelect.value);

    const totalPages = Math.ceil(filteredProducts.length / limit);

    if(currentPage > totalPages){
        currentPage = 1;
    }

    const start = (currentPage - 1) * limit;

    const end = start + limit;

    const paginatedProducts = filteredProducts.slice(start, end);

    displayProducts(paginatedProducts);

    createPagination(totalPages);

}



function displayProducts(products){

    productBody.innerHTML = "";

    for(let i = 0; i < products.length; i++){

        let product = products[i];

        let statusClass = "";

        if(product.status === "In Stock"){
            statusClass = "instock";
        }
        else if(product.status === "Low Stock"){
            statusClass = "lowstock";
        }
        else{
            statusClass = "outstock";
        }

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>
                <img src="${product.imgUrl}">
            </td>

            <td>${product.prodname}</td>

            <td>${product.brand}</td>

            <td>${product.category}</td>

            <td>₹${product.price}</td>

            <td>${product.qty}</td>

            <td>
                <span class="status ${statusClass}">
                    ${product.status}
                </span>
            </td>

            <td>

                <button 
                    class="edit-btn"
                    onclick="editProduct('${product.id}')"
                >
                    Edit
                </button>

                <button 
                    class="delete-btn"
                    onclick="deleteProduct('${product.id}')"
                >
                    Delete
                </button>

            </td>

        `;

        productBody.appendChild(tr);

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

    const totalPages = Math.ceil(filteredProducts.length / limit);

    if(currentPage < totalPages){

        currentPage++;

        applyFeatures();

    }

});



searchInput.addEventListener("input", applyFeatures);

categoryFilter.addEventListener("change", applyFeatures);

priceFilter.addEventListener("change", applyFeatures);

statusFilter.addEventListener("change", applyFeatures);

brandFilter.addEventListener("change", applyFeatures);

sortSelect.addEventListener("change", applyFeatures);

limitSelect.addEventListener("change", applyFeatures);



function editProduct(id){

    window.location.href = `../edit_product/edit_prod.html?id=${id}`;

}



async function deleteProduct(id){

    try {

        await fetch(`http://localhost:3000/products/${id}`,{
            method:"DELETE"
        });

        fetchProducts();

    } 
    catch (error) {

        console.log(error);

    }

}



document.getElementById("addProductBtn")
.addEventListener("click", () => {

    window.location.href = "../add_product/add_product.html";

});


fetchProducts();