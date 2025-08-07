const https = require("https");

exports.handler = async function(event, context) {
  const eiinNo = event.queryStringParameters.eiinNo;
  const API_HOST = "202.72.235.218";
  const API_PATH = `/api/v1/institute/list?eiinNo=${eiinNo}`;

  return new Promise((resolve, reject) => {
    const request = https.get({
      hostname: API_HOST,
      port: 8082,
      path: API_PATH,
      method: "GET",
    }, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Methods": "GET, POST, OPTION"
            },
            body: JSON.stringify(parsedData)
          });
        } catch (e) {
          reject({
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Methods": "GET, POST, OPTION"
            },
            body: JSON.stringify({ error: "Failed to parse API response." })
          });
        }
      });
    });

    request.on("error", (error) => {
      reject({
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTION"
        },
        body: JSON.stringify({ error: `Failed to fetch data from external API: ${error.message}` })
      });
    });
  });
};

