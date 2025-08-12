const http = require("http");

exports.handler = async function (event) {
  // CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      },
      body: ""
    };
  }

  const eiinNo = event.queryStringParameters?.eiinNo;
  if (!eiinNo) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      },
      body: JSON.stringify({ error: "Missing 'eiinNo' query parameter" })
    };
  }

  // মূল API এর তথ্য
  const API_HOST = "202.72.235.218";
  const API_PATH = `/api/v1/institute/list?eiinNo=${eiinNo}`;
  const API_PORT = 8082;

  return new Promise((resolve) => {
    const req = http.get({
      hostname: API_HOST,
      port: API_PORT,
      path: API_PATH,
      method: "GET",
    }, (res) => {
      let data = "";

      res.on("data", chunk => data += chunk);

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            body: JSON.stringify(json)
          });
        } catch (err) {
          resolve({
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            body: JSON.stringify({ error: "Invalid JSON from API" })
          });
        }
      });
    });

    req.on("error", (error) => {
      resolve({
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
        },
        body: JSON.stringify({ error: `Request failed: ${error.message}` })
      });
    });
  });
};
