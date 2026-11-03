const express = require("express");
const cors = require("cors");

const slotRoutes = require("./routes/slotRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Interview Slot Booking API is running"
    });
});

app.use("/slots", slotRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "Route not found"
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});