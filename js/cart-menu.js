// FUNCIONES DEL CARRITO DE COMPRAS

//Esto es de un tutorial de youtube. En el "leéme por favor" está la fuente

//alert ('hello') -- Verificar si está enlazado el archivo .js al HTML

const ListProducts = document.querySelector('#listproducts');
const contentProducts = document.querySelector('#contentProducts');
const emptyCart = document.querySelector('emptyCart');

let productsArray = [];

document.addEventListener('DOMContentLoaded', function() {
    addEventListener();
});

//recolectar data
function eventListeners () {
    ListProducts.addEventListener('click', getDataElements);
    emptyCart.addEventListener('click', function() {
        productsArray = [];
        productsHtml();
        updateCartCount();
        updateTotal();
    })

    const loadProduct = localStorage.getItem('products');
    if (loadProduct) {
        productsArray = JSON.parse(loadProduct);
        productsHtml (); //llamados a funciones
        updateCartCount ();
    } else {
        productsArray = [];
    }
    
}

function updateCartCount () {
    const cartCount = document.querySelector('#cartCount');
    cartCount.textContent = productsArray.length; //
}

function updateTotal () {
    const total = document.querySelector('#total');
    let totalProduct = productsArray.reduce (total, prod => total + prod.price * prod.quantity, 0); //Ceación de variable | .reduce se utiliza para reducir a un Array a un solo valor mediante una función de acumulación. Va a empezar en cero
    total.textContent = `$${totalProduct.toFixed(2)}`; //Actualiza el precio en sentido suma
}


//evento 'e' -->al dar click en el botón 'add cart' saldrán las etiquetas del botón en la consola del navegador
function getDataElements(e) {
    if (e.target.classList.contains('btn-add'));
    const elementHtml = e.target.parentElement.parentElement;
    selectData (elementHtml);
}

function selectData(prod){
    //console.log(prod); //--->verificación
    const productObj ={
        img: prod.querySelector ('img').src, //--->seleccionar la imágen
        title: prod.querySelector ('h4').textContent, //--->título del producto
        price: parseFloat(prod.querySelector ('#currentPrice').textContent.replace('$', '')), //--->seleccionar el precio con Float en caso de decimales
        id: parseInt(prod.querySelector('button[type="button"]').dataset.id, 10),
        quantity: 1 //--->Cantidad del productos
    }

    const exists = productsArray.some(prod => prod.id == productObj.id); //verificar si al menos un elemento cumple cpn una condición específica a través de true - false

    if (exists) {
        showAlert('El producto ya está en tu carrito', 'error');
        return; // Para detener la ejecución de código y no pase nada
    }

    productsArray = [...productsArray, productObj];
    
    //console.log('el producto fue agregado exitosamente') //---> Mostrar alerta en la consola HTML//

    //llamados de las funciones
    showAlert('El producto ha sido agregado a tu bolsa', 'sucess')
    productsHtml();
    updateCartCount();
    updateTotal();
}

function productsHtml() {
    cleanHtml(); //Para limpiar html; evitar duplicaciones de data a la hora guardar los prductos
    productsArray.forEach(prod => {
        const { img, title, price, quantity, id } = prod;

        const tr = document.createElement('tr');

        const tdImg = document.createElement('td');
        const prodImg = document.createElement ('img');
        prodImg.alt = 'image product'; // --> Aparece la eqtiqueta Alt de la imagen la consola del navegador
        prodImg.src = img;
        tdImg.appendChild(prodImg);

        const tdTitle = document.createElement('td');
        const prodTitle = document.createElement('p');
        prodTitle.textContent = title;
        tdTitle.appendChild(prodTitle);

        const tdPrice = document.createElement('td');
        const prodPrice = document.createElement('p');
        //prodPrice.textContent = `$${price.toFixed(2)}`; //Formatea el precio
        const newPrice = price *quantity
        prodPrice.textContent = `$${newPrice.toFixed(2)}`;
        tdPrice.appendChild(prodTitle);

        const tdQuantity = document.createElement('td');
        const prodQuantity = document.createElement('input');
        prodQuantity.type = 'number';
        prodQuantity.min = '1'; //El mínimo es 1 para que no hallan valores negativos
        prodQuantity.value = quantity;
        prodQuantity.dataset.id = id;
        prodQuantity.oninput = updateQuantity;
        tdQuantity.appendChild(prodQuantity);

        //Botón de eliminar
        const tdDelete = document.createElement('td');
        const prodDelete = document.createElement('button');
        prodDelete = 'button';
        prodDelete.textContent = 'X'; // La "x" para eliminar
        prodDelete.onclick = ( )=> destroyProduct(id);
        tdDelete.appendChild(prodDelete);


        tr.append(tdImg, tdTitle, tdPrice, tdQuantity, tdDelete);

        contentProducts.appendChild(tr);

    })

    saveLocalStorage();

}

function saveLocalStorage () {
    localStorage.setItem('products', JSON.stringify(productsArray)); //--> Guardar strings
}


function updateQuantity (e) {
    const newQuantity = parseInt (e.target.value, 10); // tomar el valor de e, en números enteros
    const idProd = parseInt(e.target.datset.id, 10);

    const product = productsArray.find(prod => prod.id === idPro); //Array method que se utiliza para buscar el primer elemento en un Array que cumpla determinadas condiciones y la retorna
    if (product && newQuantity > 0){
        product.quantity = newQuantity; // Se va actualizar la cantidad
    }
    productsHtml();
    updateTotal ();
    saveLocalStorage();
}   

//EVITAR DUPLICACIONES EN EL PRODUCTO EN LA CARRITO
function destroyProduct (idProd) {
    productsArray = productsArray.filter(prod => prod.id !== idProd); //.filter crea un nuevo Array con los elementos que cumplan una condición especificada.
    showAlert('El producto a sido eliminado de tu Bolsa', 'sucess'); //Alerta que muestra si el producto fue eliminado
    productsHtml ();
    updateCartCount(); //llamado de la función para que elimine de la cuenta el producto eliminado del carrito
    updateTotal (); //Actualiza el precio cuando un producto es retirado del carrito
    saveLocalStorage(); //Elimina el producto del localStorage
}

function cleanHtml () {
       contentProducts.innerHTML = ''; //Elimina HTML previo
    }

//ALERTAS
function showAlert(message, type) {
    const nonRepeatAlert = document.querySelector('.alert'); //Evitar duplicaciones en la alerta
    if (nonRepeatAlert) {
        nonRepeatAlert.remove ();} //Si existe Repeatalert se va a eliminar
    
    const div = document.createElement ('div');
    div.classList.add('alert', type);
    div.textContent = message;

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 5000) // Que desaparezca la alerta en 5 segundos
}