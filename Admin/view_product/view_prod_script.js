const productBody = document.getElementById("productBody");


fetch("../sidebar/sidebar.html")
.then((res) => res.text())
.then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;
});

async function fetchProducts() {

    try {

        const res = await fetch("http://localhost:3000/products");

        const products = await res.json();

        displayProducts(products);

    } 
    catch (error) {

        console.log(error);

    }

}

function displayProducts(products) {

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
                <img src="${product.imgUrl}" alt="">
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
                <button class="edit-btn" onclick="editProduct('${product.id}')">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteProduct('${product.id}')">
                    Delete
                </button>
            </td>
        
        `;

        productBody.appendChild(tr);

    }

}

   

function editProduct(id){

    // redirect to edit product page with product id

    window.location.href = `../edit_product/edit_prod.html?id=${id}`;

}

async function deleteProduct(id){

       console.log(id);

    try {

        await fetch(`http://localhost:3000/products/${id}`, {
            method:"DELETE"
        });

        fetchProducts();

    } 
    catch (error) {

        console.log(error);

    }

}

fetchProducts();