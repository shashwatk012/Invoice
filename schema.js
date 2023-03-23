const express = require("express");
const mongoose = require("mongoose");

const Invoice = new mongoose.Schema({
  name: { type: String, required: [true, "Please enter your Name"] },
  balances: {
    type: [Object],
    required: [true, "Please fill all the details"],
  },
});

const createInvoice = new mongoose.Schema({
  date: { type: String, required: [true, "Please enter your Name"] },
  customerId: {
    type: String,
    required: [true, "Please fill all the details"],
  },
  accountArray: {
    type: [Object],
    required: true,
  },
  totalAmount: {
    type: String,
    required: [true, "Please fill all the details"],
  },
  invoiceNumber: {
    type: String,
    required: [true, "Please fill all the details"],
  },
  year: {
    type: String,
    required: [true, "Please fill all the details"],
  },
});

const Invoicedetails = new mongoose.model("Invoicedetails", Invoice);
const createInvoice1 = new mongoose.model("createInvoice1", createInvoice);

module.exports = { Invoicedetails, createInvoice1 };
