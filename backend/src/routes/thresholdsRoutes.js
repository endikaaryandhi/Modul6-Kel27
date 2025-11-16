import express from "express";
import { ThresholdsController } from "../controllers/thresholdsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // Impor middleware

const router = express.Router();

// HAPUS: router.use(authMiddleware);
// Baris ini sebelumnya memblokir SEMUA rute di file ini.

// Rute PUBLIK: Biarkan 'GET' dapat diakses oleh siapa saja
// Ini agar simulator dan halaman monitoring (mode tamu) bisa membaca data.
router.get("/", ThresholdsController.list);
router.get("/latest", ThresholdsController.latest);

// Rute TERPROTEKSI: Terapkan middleware HANYA ke rute 'POST'.
// Hanya pengguna yang login (dari aplikasi) yang bisa mengubah threshold.
router.post("/", authMiddleware, ThresholdsController.create);

export default router;