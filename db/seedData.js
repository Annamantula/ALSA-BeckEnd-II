const  client  = require('./client');
const {createUser, createProduct, getAllProducts, getProductById, getProductByName, updateProduct, getProductByCategory,createContactInfo, updateContact} = require('./index');
  

  async function dropTables() {
    try {
    console.log("Dropping All Tables...")
    await client.query (`
        DROP TABLE IF EXISTS orders_products;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS cart_products;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS guest_cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS contacts;
        DROP TABLE IF EXISTS users;
    `)
    console.log("Finished dropping tables")
    }catch(error){
      console.error("error dropping tables")
      throw error
    }
  }
  
  async function createTables() {
    try {
    console.log("Starting to build tables...")
    await client.query (`
    CREATE TABLE users( 
      id SERIAL PRIMARY KEY, 
      password VARCHAR(255) NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "isActive" BOOLEAN DEFAULT true,
      "isAdmin" BOOLEAN DEFAULT false
      );
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price FLOAT NOT NULL,
      price_type TEXT NOT NULL,
      category TEXT NOT NULL,
      inventory FLOAT,
      img_url VARCHAR(255)
      );
    CREATE TABLE contacts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      phone BIGINT,
      street TEXT NOT NULL,
      street_num INT,
      apt VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      zip INT
      );
      CREATE TABLE guest_cart(
      id SERIAL PRIMARY KEY,
      code INT
      );
      CREATE TABLE cart(
        id SERIAL PRIMARY KEY,
        guest_cart_id INT,
        user_id INTEGER REFERENCES users(id)
      );
    CREATE TABLE cart_products(
      id SERIAL PRIMARY KEY,
      cart_id INTEGER REFERENCES cart(id),
      product_id INTEGER REFERENCES products(id),
      count FLOAT,
      UNIQUE (cart_id, product_id)
    );

    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      customer_id INT,
      delivery_date VARCHAR(255) NOT NULL
    );
    CREATE TABLE orders_products(
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES cart(id),
      product_id INTEGER REFERENCES products(id),
      count FLOAT,
      purchase_price FLOAT
    );
  
   `)
   console.log("Finished building table")
    }catch(error){
      console.error("error building table")
      throw error
    }
  }

  async function createInitialUsers() {
    console.log("Starting to create users...")
    try {
      const usersToCreate = [
        { email: "albert", password: "bertie99", isAdmin: true},
        { email: "sandra", password: "sandra123",isAdmin: false },
        { email: "glamgal", password: "glamgal123",isAdmin: false },
      ]
      const users = await Promise.all(usersToCreate.map(createUser))
  
      console.log("Users created:")
      console.log(users)
      console.log("Finished creating users!")
    } catch (error) {
      console.error("Error creating users!")
      throw error
    }
  }

  async function createInitialProducts() {
    console.log("Starting to create products");
    
    try {
      const productsToCreate = [
        {name: "apple", description: "red apple", price: 1.50, price_type: "unit", category: "fruit", inventory: 5, img_url: "https://th.bing.com/th/id/OIP.tiWHZ4k7FcRXlBanb2zfCgHaHO?pid=ImgDet&rs=1" },
        {name: "corn", description: "corn", price: 1.23, price_type: "dollar", category: "vegetable", inventory: 9, img_url: "https://th.bing.com/th/id/OIP.tiWHZ4k7FcRXlBanb2zfCgHaHO?pid=ImgDet&rs=1" },
        {name: "bread", description: "whole grain bread", price: 2.85, price_type: "$", category: "grocery", inventory: 120, img_url: "https://th.bing.com/th/id/OIP.tiWHZ4k7FcRXlBanb2zfCgHaHO?pid=ImgDet&rs=1" },
        {name: "beef steak", description: "New York Strip steak", price: 9.50, price_type: "/pound", category: "meat", inventory: 85.5, img_url: "https://th.bing.com/th/id/OIP.tiWHZ4k7FcRXlBanb2zfCgHaHO?pid=ImgDet&rs=1" }
      ]

      const products = await Promise.all(productsToCreate.map(createProduct))

      console.log("Products created:")
      console.log(products)
      console.log("Finished creating products!")
    }
    catch (error) {
      console.error("Error creating products!");
      throw error;
    }
  }


  async function createInitialContact() {
    console.log("Starting to create contact");
    
    try {
      const contactToCreate = [
        {first_name: "Albert",last_name:"Gilbert",phone:3425648745,street:"Bryn Mare ave",street_num:3450,apt:"3a",city:"Atlanta",zip:306783},
        {first_name:"Sandra",last_name:"Brown",phone:2244597823,street:"Western ave",street_num:7546,apt:201,city:"Dallas",zip:40786},
        {first_name:"Glamgal",last_name:"Scotch",phone:3021207843,street:"15th ave",street_num:2301,apt:2,city:"Miami",zip:34567},
        
        ]

      const contacts = await Promise.all(contactToCreate.map(createContactInfo))

      console.log("Contact created:")
      console.log(contacts)
      console.log("Finished creating contact!")
    }
    catch (error) {
      console.error("Error creating contact!");
      throw error;
    }

  }


  async function updateInitialContact() {
    console.log("Starting to update contact");
    
    try {
      const contactToUpdate = [
        {id:1, first_name: "Albert",last_name:"Gilbert",phone:3425648745,street:"Bryn Mare ave",street_num:3450,apt:"3a",city:"Chicago",zip:306783},
        {id:3, first_name:"Sandra",last_name:"Brown",phone:2244597823,street:"Western ave",street_num:7546,apt:201,city:"Seattle",zip:40786},
        {id:2, first_name:"Glamgal",last_name:"Scotch",phone:3021207843,street:"15th ave",street_num:2301,apt:2,city:"Minneapolis",zip:34567},
        ]

       const updatedContacts = await Promise.all(contactToUpdate.map(updateContact))

      console.log("Contact created:")
      console.log( updatedContacts )
      console.log("Finished creating contact!")
    }
    catch (error) {
      console.error("Error creating contact!");
      throw error;
    }

  }





  async function rebuildDB() {
    try {
      await dropTables()
      await createTables()
      await createInitialUsers()
      await createInitialProducts();
      console.log("getAllProducts", await getAllProducts());
      console.log("getProductById", await getProductById(3));
      console.log("getProductByName", await getProductByName("apple"));
      console.log("getProductByCategory", await getProductByCategory("fruit"));
      // const name = "banana";
      // const description = "one banana"
      // console.log(await updateProduct({id: 3, name, description}))
      createInitialContact();
      updateInitialContact();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error
    }
  }
  
  module.exports = {
    rebuildDB,
    dropTables,
    createTables,
  }