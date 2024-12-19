# FPS Shop

## Context
FPS Shop is a B2C (Business-to-Consumer) electronic store located at [http://fpsshop.pro](http://fpsshop.pro). Customers can visit this website to search for and purchase their favorite electronic products. The store aims to provide high-quality, diverse, and rich electronic products to meet market demands, with a strong focus on phones and laptops.

## Technology Overview
The application is designed to handle the shopping process for customers, making it user-centric. As a Web App, it can be used on most devices and ensures full responsiveness for each device type.

- **User Interface (UI)**: Implemented primarily using **jQuery**, a previously popular JavaScript library, to build rich and fast JavaScript functionalities. Data fetched from APIs and rendered on the UI is supported by modules like Ajax, DOM, event, selector, etc. The UI is made more visually appealing and intuitive using Bootstrap, with additional styling from CSS and HTML.
- **Backend**: The system uses **Spring Boot** as the main framework for building the web application. Spring Boot provides flexible configuration, dependency management, and easy integration with other services, accelerating the development process.
- **Payment Integration**: **PayOS** is used for payment integration, ensuring secure and efficient financial transactions. This robust payment platform meets modern system requirements for security and speed.
- **Media Management**: **Cloudinary** is used for managing and storing multimedia resources (images, videos). This service supports optimization, format conversion, and fast content delivery via CDN, enhancing user experience when loading or accessing multimedia data from the system.

## Application Architecture
The Client-Server architecture is a common model in network application development, dividing the system into two main components: Client and Server. Each component has a specific role, supporting easy development, operation, and system expansion.

- **Client**: Interacts directly with users, sending requests to the Server via protocols like HTTP/HTTPS or WebSocket. The Client displays the results returned from the Server through the user interface. It handles functions such as input data validation, navigation, UI rendering, and simple client-side logic. Popular frontend technologies like React, Angular, or Vue.js are often used to build the Client part.
- **Server**: Handles requests from the Client, performing complex business logic, managing data, and interacting with databases like MySQL, PostgreSQL, or MongoDB. The Server also integrates with external services like PayOS for payment processing and Cloudinary for multimedia file management. In this system, Spring Boot serves as the main framework for building RESTful APIs or WebSocket services, ensuring performance and scalability.

### Workflow
1. The user performs an action on the interface (Client).
2. The Client sends a request to the Server.
3. The Server processes the business logic, interacts with the database or integrates with external services if needed, and then returns the result to the Client.
4. The returned data is usually in JSON or HTML format for intuitive display.

This architecture offers several advantages, including clear separation of roles for each component, allowing independent expansion or upgrade of each part. Additionally, the Server provides reusable APIs across different platforms like web, mobile, and desktop. The Client-Server model ensures high performance and easy integration with modern services, meeting complex user requirements effectively.

---

**End of Document**
