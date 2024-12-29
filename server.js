//server.js=ddetails.html,user1.json
const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const server = http.createServer((req, res) => {
    let { method } = req;

    // GET request handling
    if (method === "GET") {
        if (req.url === "/") {
            console.log("inside / route and GET request");
            fs.readFile("user1.json", "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log(data);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (req.url === "/dashboard") {
            fs.readFile("dashboard.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("Sending dashboard.html file");
                    res.end(data);
                }
            });
        }
            else if (req.url == "/ddetails") {
                fs.readFile("ddetails.html", "utf8", (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Server Error");
                    } else {
                        console.log("sending ETData.html file");
                        res.end(data);
                    }
                });
         
            }
            else if (req.url === "/register") {
            fs.readFile("register.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("Sending register.html file");
                    res.end(data);
                }
            });
        } else if (req.url == "/allstudent") {
            fs.readFile("allstudent.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending allstudent.html file");
                    res.end(data);
                }
            });
        } else {
            // Error handling for routes not found
            console.log(req.url);
            res.writeHead(404);
            res.end("Not Found");
        }
     }

    // POST request handling
    else if (method === "POST") {
        if (req.url === "/dashboard") {
            console.log("inside /addExpense route and POST request");
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                // Read existing data from Expenses.json
                let readdata;
                try {
                    readdata = fs.readFileSync("user1.json", "utf8");
                    if (!readdata) {
                        readdata = "[]"; // Initialize as an empty array if file is empty
                    }
                } catch (err) {
                    console.log(err);
                    readdata = "[]"; // Initialize as an empty array if file doesn't exist
                }

                const jsonData = JSON.parse(readdata);
                const convertedBody = qs.decode(body);

                // Append the new expense
                jsonData.push(convertedBody);

                // Write the updated data back to Expenses.json
                fs.writeFile("user1.json", JSON.stringify(jsonData), (err) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(500);
                        res.end("Failed to add .");
                    } else {
                        console.log("added successfully");
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(" added successfully!");
                    }
                });
            });
        } else 
        if (req.url === "/register") {
            console.log("inside /contact route and POST request");
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                let readdata = fs.readFileSync("User.json", "utf-8"); // Read data from User.json
                console.log(readdata);

                if (!readdata) {  // If the file is empty, add an empty array
                    fs.writeFileSync("User.json", JSON.stringify([]));
                } else {      // If the file already has data
                    let jsonData = JSON.parse(readdata);
                    let users = [...jsonData];
                    console.log(users);

                    let convertedbody = qs.decode(body); // Parse the data from the form
                    users.push(convertedbody);  // Add the new user data
                    console.log(convertedbody);

                    // Write the new data back to User.json
                    fs.writeFile("User.json", JSON.stringify(users), (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("User data inserted successfully");
                        }
                    });
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("Registration successful!");
            });
        } else {
            res.writeHead(404);
            res.end("Not Found in POST request");
        }
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});