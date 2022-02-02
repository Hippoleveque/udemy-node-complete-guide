const requestHandler = (req, res) => {
  const { url, method } = req;

  if (url === "/") {
    res.write("<html>");
    res.write("<body>");
    res.write("<h1>Greetings</h1>");
    res.write("<form action='create-user' method='POST'>");
    res.write("<input name='username' type='text'>");
    res.write("<button type='submit'>");
    res.write("Submit");
    res.write("</button>");
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.write("<html>");
    res.write(
      "<body><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log(username);
      res.statusCode = 302;
      res.setHeader("Location", "/users");
      return res.end();
    });
  }
};

exports.handler = requestHandler;