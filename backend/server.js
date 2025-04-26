import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(helmet()); //add security in the middleware
app.use(morgan("dev")); //log the request

app.use(async (req,res,next)=>{
    try {
        const decision = await aj.protect(req,{
            requested:1, //Each request consumes one token
        })
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({success:false,message:"Rate limit exceeded"})
            }else if(decision.reason.isBot()){
                return res.status(403).json({success:false,message:"Bot detected"})
            }else{res.status(403).json({success:false,message: "Forbidden"})}
            return
        }
        //check for spoofed bots
        if(decision.results.some((result)=>(result.reason.isBot() && result.reason.isSpoofed()))){
            return res.status(403).json({success:false,message:"Spoofed bot detected"})
        }
        console.log("Everything is fine")
        next()
    } catch (error) {
        console.log("Arcjet Error")
        next(error)
    }
})

app.use("/api/products", productRoutes);

const initDB = async () => {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT current_timestamp,
            updated_at TIMESTAMP DEFAULT current_timestamp
            )
        `;
        console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
