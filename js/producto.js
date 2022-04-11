class producto{
    constructor(id,nombre,precio,categoria,img,cantidad){
            this.id = parseInt(id);
            this.nombre = nombre.toUpperCase();
            this.precio = parseFloat(precio);
            this.categoria = categoria.toUpperCase();
            this.img = img;
            this.cantidad = cantidad || 1;                         
    }
    sumarItems(){
        this.cantidad++;
    }
    restarItems(){
        this.cantidad--;
    }    
    subTotal(){
        return precioNeto(this.precio,iva,iibb) * this.cantidad;
    }    
    precioNeto(montoBruto,impuestoIva,impuestoIibb){
        let neto = montoBruto + impuestoIva(montoBruto) + impuestoIibb(montoBruto);
        return neto * this.cantidad;
    }
    sumarRestar(valor){
        this.cantidad+=valor;
    }
}

