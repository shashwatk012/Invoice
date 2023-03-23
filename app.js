require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyparser = require("body-parser");
const port = process.env.PORT || 3000;
require("./conn");
const { Invoicedetails, createInvoice1 } = require("./schema");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to API world");
});

app.post("/createaccount", async (req, res) => {
  try {
    const data = new Invoicedetails(req.body);
    await data.save();
    res.status(200).send(data);
  } catch (e) {
    res.status(200).send(e);
  }
});

app.post("/createinvoice", async (req, res) => {
  try {
    const date = new Date().toLocaleDateString();
    const { customerId, accountArray, totalAmount, invoiceNumber, year } =
      req.body;
    req.body.date = date;

    let sum = 0;
    accountArray.forEach((account) => {
      const amt = Number(account.amount);
      sum += amt;
    });

    if (sum !== totalAmount) {
      res.status(200).send("Not equal sum and totamount");
    }

    accountArray.forEach((account) => {
      const currid = account.accountId;
      const ispresent = Invoicedetails.findOne({ currid });
      if (!ispresent) {
        res.status(200).send(`${currid} Not present`);
      }
    });

    const invoice_year = await createInvoice1.find({
      invoiceNumber: invoiceNumber,
    });
    let flag = 0;
    invoice_year.forEach((ele) => {
      if (ele.year === year) {
        flag = 1;
      }
    });
    const data = new createInvoice1(req.body);
    if (flag === 0) {
      await data.save();
      res.status(200).send("Validated");
    }
    res.status(200).send("same year and Invoice number so invalid");
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/invoicelist/:key", async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const key = req.params.key;
    const accountnameid = await Invoicedetails.find({ name: key });
    var searchstring = ""; //641ae5c0e954d0d4e1743d20
    if (accountnameid.length > 0) {
      searchstring = accountnameid[0]._id.toString();
    }
    const data = await createInvoice1.find({
      $or: [
        { invoiceNumber: key },
        { customerId: searchstring },
        { totalAmount: { $regex: key } },
      ],
    });
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
