import express from "express";
import { celebrate, Joi } from "celebrate";
import multer from "multer";
import multerConfig from "./config";
import CollectPointsController from "./controllers/CollectPointsController";
import ItemsController from "./controllers/ItemsController";

const routes = express.Router();
const collectPointsController = new CollectPointsController();
const itemsController = new ItemsController();

const upload = multer(multerConfig);

routes.get("/", (request, response) => {
  return response.json({ message: "Hello World" });
});

routes.get("/items", itemsController.index);

routes.get("/collect_points", collectPointsController.index);

routes.post(
  "/collect_points",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  collectPointsController.create
);

routes.get("/collect_points/:id", collectPointsController.show);

export default routes;
