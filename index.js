
const http = require("http");
const fs = require('fs');
const requests = require('requests');


const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp); 
temperature = temperature.replace("{%sunrise%}", orgVal.main.temp_min);
temperature = temperature.replace("{%sunset%}", orgVal.main.temp_max);
temperature = temperature.replace("{%location%}", orgVal.name);
temperature = temperature.replace("{%country%}", orgVal.sys.country);
temperature = temperature.replace("{tempstatus}", orgVal.weather[0].main);

return temperature;
}


const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=ujjain&units=metric&appid=e8ef4570be1706e4e46d4e0f6803ecd9`)
            .on('data', (chunk) =>  {
                const objdata = JSON.parse(chunk);
                const arryData = [objdata];

                // console.log(arryData[0].main.temp)
                const realTimeData = arryData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    };
});

server.listen(8000, "127.0.0.1", () => {
    console.log("server starting on localhost:8000");
});