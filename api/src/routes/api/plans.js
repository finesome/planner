// зависимости
const express = require("express");
const router = express.Router();

// контроллер
const plansController = require("../../controllers/plansController");

// все планы
router.get("/", plansController.getPlans);
// мои планы
router.get("/my", plansController.getMyPlans);
// создание плана
router.post("/", plansController.createPlan);
// запрос плана (основная информация)
router.get("/:id", plansController.getPlan);
// базовая информация плана
router.get("/:id/info", plansController.getPlanBasicInformation);
// этапы плана
router.get("/:id/stages", plansController.getPlanStages);
// ресурсы плана
router.get("/:id/resources", plansController.getPlanResources);
// отзывы плана
router.get("/:id/reviews", plansController.getPlanReviews);
// редактирование плана
router.post("/:id", plansController.editPlan);
// удаление плана
router.delete("/:id", plansController.deletePlan);
// копирование плана
router.post("/:id/copy", plansController.copyPlan);
// опубликование плана
router.post("/:id/publish", plansController.publishPlan);
// отзыв на план
router.post("/:id/review", plansController.reviewPlan);

module.exports = router;
