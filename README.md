# 🛒 Entrega 1 - Backend con Express

Este proyecto es una entrega del curso de **Backend en Coderhouse**.  
Consiste en un servidor básico desarrollado con **Node.js** y **Express** que permite gestionar **productos** y **carritos de compra** utilizando archivos como sistema de persistencia.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- File System (`fs/promises`)

---

## ⚙️ Instalación y uso

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/entrega1.git
cd entrega1
```

2️⃣ Instalar dependencias
`npm install`

3️⃣ Ejecutar el servidor
`npm run dev`

El servidor se iniciará en el puerto 8080
👉 URL base: http://localhost:8080

---

## 📦 Endpoints

### 🔹 Productos

| Método | Endpoint             | Descripción                   |
| :----- | -------------------- | :---------------------------- |
| GET    | `/api/products`      | Obtiene todos los productos   |
| GET    | `/api/products/:pid` | Obtiene un producto por su ID |
| POST   | `/api/products `     | Agrega un nuevo producto      |

Ejemplo de body para POST:

```
{
  "title": "Mouse gamer",
  "description": "RGB ergonómico",
  "code": "MG001",
  "price": 99,
  "status": true,
  "stock": 30,
  "category": "Periféricos",
  "thumbnails": ["mouse1.png", "mouse2.png"]
}
```

---

### 🔹 Carrito

| Método | Endpoint      | Descripción                 |
| :----- | ------------- | :-------------------------- |
| POST   | `/api/carts ` | Crea un nuevo carrito vacío |

---

### 📁 Archivos de persistencia

productos.txt → almacena los productos registrados

carrito.txt → almacena los carritos creados

Ambos archivos contienen información en formato JSON.

---

✨ Autor

Manuel Jordan Solis
Curso de Backend - Coderhouse
