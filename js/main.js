//DATOS JSON
fetch("productos/productos.json")
.then(respuesta=>respuesta.json())
.then(dato =>{
    for (const literal of dato) {
        productos.push(new producto(literal.id, literal.nombre, literal.precio,literal.categoria ,literal.img, literal.cantidad));
        productosHud(productos);
    }
}).catch(mensaje=>console.error(mensaje));


//FILTRADO POR NOMBRE
filtrarPorNombre.addEventListener("input", ()=>{    
    let filtradoNombre= productos.filter(producto => producto.nombre.includes(filtrarPorNombre.value.toUpperCase()));    
    productosHud(filtradoNombre);
})

//FILTRADO POR CATEGORIA--INPUT
filtrarPorCategoria.addEventListener("input", ()=>{    
    let filtradoCategoria= productos.filter(producto => producto.categoria.includes(filtrarPorCategoria.value.toUpperCase()));    
    productosHud(filtradoCategoria);
})                

//CHAT DE AYUDA (DEMO)
setTimeout(()=>{    
    /*intente usar la function pero no me funciona el onClick si la uso, el chat se dispara simultaneamente con el alert.
    tostada(`¿Necesitas ayuda?`,10000,"top","left",chat());*/
    Toastify({
        text:   `¿Necesitas ayuda?`,                
        duration: 6000,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true,
        onClick:()=>{
            chat();            
        },
        style: {
            background: "linear-gradient(to right, rgba(205,235,139,1) 0%,rgba(205,235,139,1) 100%)",                                                          
          },                
        }).showToast();}
    ,5000);

//NUEVOS PRODUCTOS   
cargaProducto()
llamadoJsonNuevoProducto()

//BOTON CARRITO LLAMADO
carritoFull() 

//LLAMADO HUD
productosHud(productos);