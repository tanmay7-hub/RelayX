import express from "express";
import eventRoutes from "./routes/event.route.js"
import destinationRoutes from "./routes/destination.route.js";
const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "RelayX" });
});


app.use("/v1/events" , eventRoutes);
app.use("/v1/destinations" , destinationRoutes);
export default app;
