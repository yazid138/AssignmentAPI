import sendResponse from "@/utils/responseHandler";
import { Router, Request, Response } from "express";
import auth from "@/middleware/auth";
import authController from "@/controller/membership/auth.controller";
import profileController from "@/controller/membership/profile.controller";
import bannerController from "@/controller/information/banner.controller";
import serviceController from "@/controller/information/service.controller";
import transactionController from "@/controller/transaction/transaction.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return sendResponse(res, {
    status: 0,
    statusCode: 200,
    message: "Welcome to the API",
    data: null,
  });
});

// Membership Routes
// Auth Routes
// router.use("/auth", authRouter);
router.post("/registration", authController.register);
router.post("/login", authController.login);
// router.delete("/logout", auth, authController.logout);

// Profile Routes
router.get("/profile", auth, profileController.profile);
router.put("/profile/update", auth, profileController.updateProfile);
router.put("/profile/image", auth, profileController.updateImage);

// Information Routes
// Banner Routes
router.get("/banner", bannerController.listBanner);
// Service Routes
router.get("/services", auth, serviceController.listService)

// Transaction Routes
// Balance Routes
router.get("/balance", auth, transactionController.getBalance);
router.post("/topup", auth, transactionController.topUp);
router.post("/transaction", auth, transactionController.createTransaction);
router.get("/transaction/history", auth, transactionController.transactionList);

export default router;
