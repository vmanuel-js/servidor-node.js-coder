import fs from "fs/promises";

class ProductosManager {
  constructor(ruta) {
    this.ruta = ruta;
  }

  // Leer todos los productos
  async obtenerProductos() {
    try {
      const data = await fs.readFile(this.ruta, { encoding: "utf-8" });
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (error) {
      console.error("Hubo un error: ", error);
      return [];
    }
  }

  // Obtener productos por ID
  async obtenerProductosPorId(id) {
    try {
      const data = await this.obtenerProductos();
      return data.find((p) => p.id === id);
    } catch (error) {
      console.error("Hubo un error: ", error);
    }
  }

  // Agregar un nuevo producto
  async agregarProducto(productoData) {
    const producto = await this.obtenerProductos();

    const nuevoProducto = {
      id: producto.length ? producto[producto.length - 1].id + 1 : 1,
      ...productoData,
    };

    producto.push(nuevoProducto);
    await fs.writeFile(this.ruta, JSON.stringify(producto, null, 2));
    return nuevoProducto;
  }

  async actualizarProducto(id, field) {
    const productos = await this.obtenerProductos();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1) {
      return null;
    }

    // Hacer que el ID no se actualice
    const productoActualizado = {
      ...productos[index],
      ...field,
      id: productos[index].id,
    };

    productos[index] = productoActualizado;

    await fs.writeFile(this.ruta, JSON.stringify(productos, null, 2));
    return productoActualizado;
  }

  async eliminarProducto(id) {
    const productos = await this.obtenerProductos();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1) {
      return false;
    }

    productos.splice(index, 1);
    await fs.writeFile(this.ruta, JSON.stringify(productos, null, 2));
    return true;
  }
}

export default new ProductosManager("productos.json");
