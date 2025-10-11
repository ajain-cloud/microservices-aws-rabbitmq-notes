// SOLID PRINCIPLES
// S - Single Responsibility Principle (SRP)
// O - Open/Closed Principle (OCP)
// L - Liskov Substitution Principle (LSP)
// I - Interface Segregation Principle (ISP)
// D - Dependency Inversion Principle (DIP)


// ----------------------------------------------------------------------------------

// Single Responsibility Principle - A class should do only one thing, and do it well
// Problem: Violates SRP as class does multiple things
// class createUser {
//     constructor(name, email) {
//         this.name = name;
//         this.email = email;
//     }

//     getName() {
//         console.log(`The name of user is: ${this.name}`);
//     }

//     getEmail() {
//         console.log(`The email of user is: ${this.email}`);
//     }
// }

// Solution:
// class createUser {
//     constructor(name, email) {
//         this.name = name;
//         this.email = email;
//     }
// }

// class Name {
//     getName(user) {
//         console.log(`The name of user is: ${user.name}`);
//     }
// }

// class Email {
//     getEmail(user) {
//         console.log(`The email of user is: ${user.email}`);
//     }
// }

// const user = new createUser("Shyam", "shyama326@gmail.com");
// const userName = new Name();
// const userEmail = new Email();
// userName.getName(user);
// userEmail.getEmail(user);

// ----------------------------------------------------------------------------------

// Open/Closed Principle - Software should be open for extension but closed for modification. In short, you can add new features without changing existing code.
// Problem: Violates OCP as need to edit class every time a new shape is added
// class AreaCalculator {
//     calculateArea(shape) {
//         if (shape.type == 'rectangle') {
//             console.log(`The area of rectangle is: ${shape.width * shape.height}`);
//         } else if (shape.type == 'circle') {
//             console.log(`The area of circle is: ${3.14 * shape.radius * shape.radius}`);
//         }
//     }
// }

// Solution:
// class Rectangle {
//     constructor(width, height) {
//         this.width = width;
//         this.height = height
//     }

//     getArea() {
//         return this.width * this.height;
//     }
// }

// class Circle {
//     constructor(radius) {
//         this.radius = radius;
//     }

//     getArea() {
//         return 3.14 * this.radius * this.radius;
//     }
// }

// class AreaCalculator {
//     calculate(shapes) {
//         return shapes.map(shape => shape.getArea());
//     }
// }

// const shapes = [
//     new Rectangle(10, 20),
//     new Circle(5)
// ];

// const area = new AreaCalculator();
// console.log(area.calculate(shapes));
// area.calculateArea({ type: "rectangle", width: 5, height: 10 });
// area.calculateArea({ type: "circle", radius: 5 });

// ----------------------------------------------------------------------------------

// Liskov Substitution Principle - You should be able to replace a parent class with a child class without breaking the program.
// Problem: Violates LSP as square breaks behavior of Rectangle
// class Rectangle {
//     constructor(width, height) {
//         this.width = width;
//         this.height = height;
//     }

//     setWidth(w) {
//         this.width = w;
//     }

//     setHeight(h) {
//         this.height = h;
//     }

//     getArea() {
//         return this.width * this.height;
//     }
// }

// class Square extends Rectangle {
//     setWidth(w) {
//         this.width = w;
//         this.height = w;
//     }

//     setHeight(h) {
//         this.width = h;
//         this.height = h;
//     }
// }

// function printArea(rectangle){
//     rectangle.setWidth(5);
//     rectangle.setHeight(10);
//     console.log(rectangle.getArea());
// }

// const rectangle = new Rectangle();
// const square = new Square();
// printArea(rectangle);
// printArea(square);

// Solution:
class Shape {
    getArea() {
        throw new Error("Must be implemented");
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}

class Square extends Shape {
    constructor(side) {
        super();
        this.side = side;
    }

    getArea() {
        return this.side * this.side;
    }
}

const shapes = [new Rectangle(10, 20), new Square(7)];
shapes.forEach(shape => console.log(shape.getArea()));
// const lsv2 = new Square();
// lsv.setWidth(5);
// lsv.setHeight(10);
// lsv2.setWidth(5);
// lsv2.setHeight(10);
// console.log(lsv.getArea());
// console.log(lsv2.getArea());

// ----------------------------------------------------------------------------------

// Interface Segregation Principle - Don’t force someone to use methods they don’t need. Like giving a remote with 100 buttons when you only need volume and power.
// Problem: Violates ISP as too many unnecessary methods for some devices
// class MultiFunctionPrinter {
//     print() {
//         console.log("This MultiFunctionPrinter printer can print");
//     }

//     scanner() {
//         console.log("This MultiFunctionPrinter scanner can scan");
//     }

//     fax() {
//         console.log("This MultiFunctionPrinter fax machine can fax");
//     }
// }

// class OldFunctionPrinter extends MultiFunctionPrinter {
//     print() {
//         console.log("This OldFunctionPrinter printer can print");
//     }

//     scanner() {
//         throw new error("This scanner is not supported");
//     }

//     fax() {
//         throw new error("This fax machine is not supported");
//     }
// }

// Solution:
// class Printer {
//     print() {
//         console.log("Printing...........");
//     }
// }

// class Scanner {
//     scanner() {
//         console.log("Scanning...........");
//     }
// }

// class Fax {
//     fax() {
//         console.log("Faxing...........");
//     }
// }

// class MultiFunctionPrinter {
//     constructor(printer, scanner, fax) {
//         this.printer = printer;
//         this.scanners = scanner;
//         this.faxes = fax
//     }

//     print() {
//         this.printer.print();
//     }

//     scanner() {
//         this.scanners.scanner();
//     }

//     fax() {
//         this.faxes.fax();
//     }
// }

// class OldFunctionPrinter {
//     constructor(printer) {
//         this.printer = printer;
//     }

//     print() {
//         this.printer.print();
//     }
// }

// const mfp = new MultiFunctionPrinter(new Printer(), new Scanner(), new Fax());
// const ofp = new OldFunctionPrinter(new Printer());
// mfp.print();
// mfp.scanner();
// mfp.fax();
// ofp.print();
// ofp.scanner();
// ofp.fax();

// ----------------------------------------------------------------------------------

// Dependency Inversion Principle - High-level modules shouldn’t depend on low-level ones. Both should depend on abstractions.
// Problem: Violates DIP as High-level module depends on low-level module
// class MySQLDatabase {
//     save(data) {
//         console.log(`${data} has been saved in MySQLDatabase`);
//     }
// }

// class App {
//     constructor(){
//         this.db = new MySQLDatabase();
//     }

//     save(data){
//         this.db.save(data);
//     }
// }

// Solution:
// class Database {
//     save(data) {
//         throw new Error("Not Implemented!");
//     }
// }

// class MySQLDatabase extends Database {
//     save(data) {
//         console.log(`${data} has been saved in MySQLDatabase`);
//     }
// }

// class MongoDBDatabase extends Database {
//     save(data) {
//         console.log(`${data} has been saved in MongoDBDatabase`);
//     }
// }

// class App {
//     constructor(database) {
//         this.database = database;
//     }

//     save(data) {
//         this.database.save(data);
//     }
// }

// const db = new MongoDBDatabase();
// const app = new App(db);
// app.save("Shyam");
// const db2 = new MySQLDatabase();
// const app2 = new App(db2);
// app2.save("Raju");