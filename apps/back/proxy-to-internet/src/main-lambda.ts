const https = require('https');

exports.handler = async (params) => {
  console.log(
    'ºº ~ file: main-lambda.ts:4 ~ {ELOCUENCY_AUTO_VERSION}  event:',
    params
  );
  // const params = JSON.parse(event.body);

  const responseData = await makeHttpRequest(
    params.url,
    params.method,
    params.body ? params.body : {}
  );

  return {
    statusCode: 200,
    body: JSON.stringify(responseData),
  };
};

function makeHttpRequest(url, method, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);

    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('ºº ~ file: main-lambda.ts:42 ~ res.statusCode:', {
          statusCode: res.statusCode,
          responseData,
        });
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(responseData),
        });
      });
    });

    req.on('error', (error) => {
      reject({
        message: 'Error making HTTP request',
        error: error.message,
      });
    });

    // Escribe los datos en la solicitud
    req.write(data);
    req.end();
  });
}
