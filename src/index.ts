import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import config from "@/config";
import NotFoundException from "@/exception/NotFoundException";
import routes from "@/routes/";
import passport from "passport";
import errorHandler from "@/middleware/errorHandler";
import fileUpload from 'express-fileupload';
import { testConnection } from "@/database/connection";
import "@/config/passport";
import path from "path";

const app = express();

testConnection()
	.then(() => {
		console.log("Database connection established");
	})
	.catch((error) => {
		console.error("Error establishing database connection:", error);
		process.exit(1); // Exit the process with an error code
	});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(passport.initialize());
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: "/temp",
}));

app.use(express.static(path.join(process.cwd(), "/public")));

app.use(routes);

app.use((req: Request, res: Response, next: NextFunction) => {
	throw new NotFoundException(100);
});

app.use(errorHandler());

app.listen(config.port, () => {
	console.log(`Server is running on ${config.baseUrl}:${config.port}`);
});
