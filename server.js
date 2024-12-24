const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const server = http.createServer((req, res) => {
    let { method } = req;

    if (method == "GET") {
        // Get request handling
        if (req.url === "/") {
            console.log("inside / route and GET request");
            fs.readFile("User.json", "utf8", (err, data) => {
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
        } else if (req.url === "/register") {
            // Updated file name from register.html to contact.html
            fs.readFile("contact.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending contact.html file");
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

    // POST method handling: Store the user data in a file
    else {
        if (req.url === "/register") {
            console.log("inside /register route and POST request");
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                let readdata = fs.readFileSync("User.json", "utf-8"); // Read data from User.json
                console.log(readdata);

                if (!readdata) {  // If the file is empty, add an empty array
                    fs.writeFileSync("User.json", JSON.stringify([]));
                }
                else {      // If the file already has data
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
    }
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
