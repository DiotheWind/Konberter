import express from "express";
import "dotenv/config"
import axios from "axios";

const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;
const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}`;
const supportedCurrencies = (async () => {
    const response = (await axios.get(`${apiURL}/codes`)).data.supported_codes;
    let currencies = [];

    for (const code of response) {
        currencies.push(code[0]);
    }

    return currencies;
})();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs", { supportedCurrencies: await supportedCurrencies });
});

app.post("/", async (req, res) => {
    const money = Number(req.body["money"]).toFixed(2);
    const baseCurrency = req.body["base-currency"];
    const targetCurrency = req.body["target-currency"];

    const convertedMoney = (await axios.get(`${apiURL}/pair/${baseCurrency}/${targetCurrency}/${money}`)).data.conversion_result;

    const context = {
        supportedCurrencies: await supportedCurrencies,
        baseMoney: money,
        convertedMoney: convertedMoney.toFixed(2),
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
    };

    res.render("index.ejs", context);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
