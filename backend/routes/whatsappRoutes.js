const express = require("express");
const qrcode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");

const auth = require("../middleware/auth");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

const router = express.Router();

const clients = {};
const sessions = {};

const createEmptySession = () => ({
  status: "starting",
  qr: null,
  error: null,
  startedAt: new Date(),
});

const renderQrPage = (res, session) => {
  if (!session?.qr) {
    return res.status(202).send(`
      <!doctype html>
      <html>
        <head><title>WhatsApp QR</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 48px;">
          <h2>QR not generated yet</h2>
          <p>Status: ${session?.status || "not_started"}</p>
          <p>${session?.error || "Refresh this page after a few seconds."}</p>
        </body>
      </html>
    `);
  }

  return res.send(`
    <!doctype html>
    <html>
      <head><title>WhatsApp QR</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 48px;">
        <h2>Scan WhatsApp QR</h2>
        <img src="${session.qr}" alt="WhatsApp QR Code" style="width: 320px; height: 320px;" />
      </body>
    </html>
  `);
};

router.post("/start", auth, async (req, res) => {
  try {
    const vendorId = String(req.vendor.id);

    if (clients[vendorId]) {
      return res.json({
        message: "Whatsapp Already Started",
        status: sessions[vendorId]?.status || "starting",
        qrAvailable: Boolean(sessions[vendorId]?.qr),
      });
    }

    sessions[vendorId] = createEmptySession();

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: vendorId }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      },
    });

    clients[vendorId] = client;

    client.on("qr", async (qr) => {
      sessions[vendorId] = {
        ...sessions[vendorId],
        status: "qr",
        qr: await qrcode.toDataURL(qr),
        error: null,
      };
    });

    client.on("ready", () => {
      sessions[vendorId] = {
        ...sessions[vendorId],
        status: "ready",
        qr: null,
        error: null,
      };
      console.log("Whatsapp Ready for vendor ", vendorId);
    });

    client.on("authenticated", () => {
      sessions[vendorId] = {
        ...sessions[vendorId],
        status: "authenticated",
        error: null,
      };
    });

    client.on("auth_failure", (message) => {
      sessions[vendorId] = {
        ...sessions[vendorId],
        status: "auth_failure",
        qr: null,
        error: message,
      };
      delete clients[vendorId];
    });

    client.on("disconnected", (reason) => {
      sessions[vendorId] = {
        ...sessions[vendorId],
        status: "disconnected",
        qr: null,
        error: reason,
      };
      delete clients[vendorId];
    });

    client.on("message", async (message) => {
      try {
        const text = message.body.toLowerCase();
        const products = await Product.find({ vendor: vendorId });
        if (
          text.includes("product") ||
          text.includes("list") ||
          text.includes("item")
        ) {
          let reply = "Available Products: \n\n";

          products.forEach((p, index) => {
            reply += `${index + 1}. ${p.product_name} - ${p.cost}/${p.unit} - Stock: ${p.stock}\n`;
          });

          reply += "\nOrder format order rice 2";
          return message.reply(reply);
        }
        if (text.startsWith("order")) {
          const parts = text.split(" ");
          const productName = parts[1];
          const quantity = Number(parts[2]);
          if (!productName || !quantity) {
            return message.reply("Please send order like: order rice 2");
          }

          const product = await Product.findOne({
            vendor: vendorId,
            product_name: new RegExp(productName, "i"),
          });

          if (!product) {
            return message.reply("Product Not Found");
          }
          const mobile = message.from.replace("@c.us", "");
          let customer = await Customer.findOne({
            vendor: vendorId,
            mobile,
          });
          if (!customer) {
            customer = await Customer.create({
              vendor: vendorId,
              name: "Whatsapp Customer",
              mobile,
              address: "",
            });
          }

          const pricing = product.cost * quantity;

          await Order.create({
            vendor: vendorId,
            order_items: [
              {
                customer: customer._id,
                product: product._id,
                product_name: product.product_name,
                quantity,
                rate: product.cost,
                pricing,
              },
            ],
            total_quantity: quantity,
            total_pricing: pricing,
          });

          message.reply(`Order placed successfully. \n\n 
            Product : ${product.product_name} \n Qty: ${quantity} \n Total: ${pricing}`);
        } else {
          message.reply(
            "Hello, Please type: \n\nproduct list \n or \n order productname qunatity \n\n Example: order rice 2",
          );
        }
      } catch (err) {
        console.error("Whatsapp message handler error:", err.message);
      }
    });

    client.initialize().catch((err) => {
      sessions[vendorId] = {
        ...sessions[vendorId],
        status: "error",
        qr: null,
        error: err.message,
      };
      delete clients[vendorId];
      console.error("Whatsapp initialize error:", err.message);
    });

    res.json({
      message: "Whatsapp starting. Get QR after few seconds",
      status: "starting",
      qrUrl: "/api/whatsapp/qr",
    });
  } catch (err) {
    res.status(500).json({
      message: "Some error while connecting Whatsapp",
      error: err.message,
    });
  }
});

router.get("/qr", auth, async (req, res) => {
  const vendorId = String(req.vendor.id);
  const session = sessions[vendorId];
  const acceptHeader = req.headers.accept || "";
  const wantsHtml =
    req.query.format === "html" ||
    (acceptHeader.includes("text/html") &&
      !acceptHeader.includes("application/json"));

  if (wantsHtml) {
    return renderQrPage(res, session);
  }

  if (!session?.qr) {
    return res.json({
      qr: null,
      status: session?.status || "not_started",
      error: session?.error || null,
      message: "QR not generated yet, Try again after few seconds",
    });
  }
  res.json({
    qr: session.qr,
    status: session.status,
  });
});

module.exports = router;
