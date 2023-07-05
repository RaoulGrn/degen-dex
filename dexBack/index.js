const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const axios = require('axios');
app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {

  const {query} = req;
  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne
  })
  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo
  })
  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice/responseTwo.raw.usdPrice
  }
/*
  console.log(responseOne.raw);
  console.log(responseTwo.raw);*/
  return res.status(200).json(usdPrices);
});

app.get("/tokenRankings", async (req, res) => {


  let response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.X_CMC_PRO_API_KEY,
    },
  });




  return res.status(200).json(response.data);
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
