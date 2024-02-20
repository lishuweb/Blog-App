import express from 'express';
const app = express();
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import userRoutes from './routes/index';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDocs from './documentation';

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(
    "/api-docs", 
    swaggerUI.serve, 
    swaggerUI.setup(swaggerJSDocs, { explorer: true })
);

app.use('/', userRoutes);
  
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});