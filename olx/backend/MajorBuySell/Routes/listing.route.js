const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const upload = require("../Middlewares/upload");
const listingController = require("../Controllers/listing.controller");

router.post("/", auth, upload.single("image"), listingController.createListing);
router.get("/", listingController.getAllListings);
router.get("/my-ads", auth, listingController.getMyListings);
router.get("/:id", listingController.getListingById);
router.delete("/:id", auth, listingController.deleteListing);
router.put("/:id", auth, listingController.updateListing);

module.exports = router;