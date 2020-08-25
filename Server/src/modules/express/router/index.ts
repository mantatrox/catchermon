import { Router } from "express";
import { entities, objects, pages } from "../controller";
// import { check } from "../middlewares";

const router = Router();

//get
router.get("/pages", pages.get);
router.get("/pages/:pageId", pages.get);
router.get("/entities/:entityId/open", entities.getOpen);
router.get("/entities/:entityId", entities.get);

router.put("/entities/:pageId", entities.create);
router.post("/entities", entities.update);

router.put("/objects", objects.create);
router.post("/objects/deliver", objects.deliver);
router.post("/objects/book", objects.book);
router.post("/objects/remove", objects.remove);
router.post("/objects/clear", objects.clear);

export default router;
