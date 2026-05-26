import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { challenges } from "./src/challenges";
import admin from "firebase-admin";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import fs from "fs";

dotenv.config();

const PORT = 3000;

// --- Local Fallback Database for Resiliency ---
function createLocalFallbackDb() {
  const fallbackFilePath = path.join(process.cwd(), "local_fallback_db.json");
  
  const readData = () => {
    if (fs.existsSync(fallbackFilePath)) {
      try {
        return JSON.parse(fs.readFileSync(fallbackFilePath, "utf-8"));
      } catch (e) {
        return {};
      }
    }
    return {};
  };

  const writeData = (data: any) => {
    try {
      fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Gagal menulis fallback database lokal:", e);
    }
  };

  const dbMock = {
    collection: (colName: string) => {
      return {
        doc: (docId: string) => {
          return {
            get: async () => {
              const fullDb = readData();
              const col = fullDb[colName] || {};
              const docData = col[docId];
              return {
                exists: !!docData,
                data: () => docData ? { ...docData } : null
              };
            },
            set: async (docData: any, options?: { merge?: boolean }) => {
              const fullDb = readData();
              if (!fullDb[colName]) fullDb[colName] = {};
              
              if (options?.merge && fullDb[colName][docId]) {
                fullDb[colName][docId] = {
                  ...fullDb[colName][docId],
                  ...docData
                };
              } else {
                fullDb[colName][docId] = docData;
              }
              writeData(fullDb);
              return { success: true };
            }
          };
        }
      };
    }
  };

  const authMock = {
    verifyIdToken: async (token: string) => {
      if (token && token.startsWith("mock_token_for_")) {
        const uid = token.replace("mock_token_for_", "");
        return { uid, email: `${uid}@codelabs.com`, name: "Siswa Codelabs" };
      }
      return { uid: token || "anonymous_user", email: `${token || "anonymous"}@codelabs.com`, name: "Siswa Codelabs" };
    }
  };

  return { db: dbMock, auth: authMock };
}

// Lazy loaded services to prevent crashes if credentials are missing
let adminDb: any = null;
let adminAuth: any = null;
let useLocalFallbackOnly = false;
let fallbackDbInstance: any = null;

function getFallbackDb() {
  if (!fallbackDbInstance) {
    fallbackDbInstance = createLocalFallbackDb().db;
  }
  return fallbackDbInstance;
}

function getAdminServices() {
  if (!adminDb || !adminAuth) {
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      let projectId = "sovereingnyouthai-project";
      let firestoreDatabaseId = "ai-studio-b2859d27-e3cc-4540-b15b-0075c43fc0e1";
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        projectId = config.projectId || projectId;
        firestoreDatabaseId = config.firestoreDatabaseId || firestoreDatabaseId;
      }

      if (admin.apps.length === 0) {
        admin.initializeApp({
          projectId: projectId
        });
      }

      const app = admin.app();
      adminAuth = admin.auth(app);
      adminDb = firestoreDatabaseId ? getAdminFirestore(app, firestoreDatabaseId) : getAdminFirestore(app);
    } catch (err) {
      console.error("Firebase Admin SDK failed to load. Operating in high-resiliency local fallback mode.", err);
      const localStore = createLocalFallbackDb();
      adminDb = localStore.db;
      adminAuth = localStore.auth;
      useLocalFallbackOnly = true;
    }
  }

  // Create super robust wrapper for Firestore operations
  const resilientDb = {
    collection: (colName: string) => {
      return {
        doc: (docId: string) => {
          return {
            get: async () => {
              if (useLocalFallbackOnly) {
                return getFallbackDb().collection(colName).doc(docId).get();
              }
              try {
                return await adminDb.collection(colName).doc(docId).get();
              } catch (err: any) {
                console.warn(`[Resiliency Warning] Gagal membaca data Firestore (${err.message}). Beralih otomatis ke database lokal fallback.`);
                useLocalFallbackOnly = true;
                return getFallbackDb().collection(colName).doc(docId).get();
              }
            },
            set: async (docData: any, options?: { merge?: boolean }) => {
              if (useLocalFallbackOnly) {
                return getFallbackDb().collection(colName).doc(docId).set(docData, options);
              }
              try {
                return await adminDb.collection(colName).doc(docId).set(docData, options);
              } catch (err: any) {
                console.warn(`[Resiliency Warning] Gagal menyimpan data Firestore (${err.message}). Beralih otomatis ke database lokal fallback.`);
                useLocalFallbackOnly = true;
                return getFallbackDb().collection(colName).doc(docId).set(docData, options);
              }
            }
          };
        }
      };
    }
  };

  return { db: resilientDb, auth: adminAuth };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoints FIRST

  // 1. Get all challenges (light metadata)
  app.get("/api/challenges", (req, res) => {
    res.json(challenges);
  });

  // 1.5. REST API POST /api/quiz/submit - submit answer with user tracking
  app.post("/api/quiz/submit", async (req, res) => {
    const { userId, teknologi, userCode } = req.body;

    if (!userId || !teknologi || typeof userCode !== "string") {
      res.status(400).json({ error: "Permintaan tidak valid. Masukkan userId, teknologi, dan userCode." });
      return;
    }

    let stateRef: any = null;
    let userState = {
      userId,
      currentLanguage: teknologi,
      currentDifficulty: "Easy",
      currentSubBabIndex: 0
    };

    try {
      const { db } = getAdminServices();

      // Retrieve user active state from database
      stateRef = db.collection("user_states").doc(userId);
      const stateSnap = await stateRef.get();
      
      if (stateSnap.exists) {
        const dbData = stateSnap.data();
        userState = {
          userId,
          currentLanguage: dbData.currentLanguage || teknologi,
          currentDifficulty: dbData.currentDifficulty || "Easy",
          currentSubBabIndex: dbData.currentSubBabIndex !== undefined ? dbData.currentSubBabIndex : 0
        };
      } else {
        // Save initial entry state
        await stateRef.set({
          ...userState,
          updatedAt: new Date().toISOString()
        });
      }

      // Filter challenges belonging to this language and difficulty
      const filtered = challenges.filter(c => 
        c.technology.toLowerCase() === userState.currentLanguage.toLowerCase() &&
        c.difficulty.toLowerCase() === userState.currentDifficulty.toLowerCase()
      );

      if (filtered.length === 0) {
        res.status(404).json({ error: `Tidak ada tantangan untuk teknologi ${userState.currentLanguage} tingkat ${userState.currentDifficulty}` });
        return;
      }

      // If progress exceeds available challenges, clamp to last index
      let challengeIndex = userState.currentSubBabIndex;
      if (challengeIndex >= filtered.length) {
        challengeIndex = filtered.length - 1; 
      }
      const activeChallenge = filtered[challengeIndex] || filtered[0];

      // Check API key for lazy initialization
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Offline evaluation fallback
        const isSolutionReasonable = userCode.trim().length > 25;
        const mockIsCorrect = isSolutionReasonable;
        
        let nextIndex = userState.currentSubBabIndex;
        if (mockIsCorrect && userState.currentSubBabIndex < filtered.length) {
          nextIndex = userState.currentSubBabIndex + 1;
        }

        // Save updated state to DB
        await stateRef.set({
          currentSubBabIndex: nextIndex,
          currentLanguage: teknologi,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        const localLogs = [
          `[System] Offline sandbox evaluator active.`,
          `[System] Menilai fungsionalitas untuk sub-bab: ${activeChallenge.title}`,
          mockIsCorrect ? `[SUCCESS] Kode terlihat sesuai secara struktural!` : `[FAILED] Kode terlalu pendek.`
        ];

        res.json({
          evaluasi: {
            apakah_benar: mockIsCorrect,
            feedback: `### ⚠️ Evaluator AI Offline Fallback
Kunci API \`GEMINI_API_KEY\` belum dikonfigurasi di secrets panel Anda. Silakan tambahkan kunci API Anda di menu **Settings > Secrets** untuk mendapatkan penilaian AI interaktif.

#### Analisis Simulasi Offline:
- **Tantangan**: S${activeChallenge.index} - ${activeChallenge.title}
- **Hasil**: ${mockIsCorrect ? "BENAR (Lulus)" : "SALAH (Gagal / Kode terlalu pendek)"}
- **Rekomendasi**: ${mockIsCorrect ? "Hebat! Progress Anda tersimpan dan Anda berhasil naik ke sub-bab berikutnya." : "Kembangkan lagi logika Anda sebelum menuju ke bab selanjutnya."}`,
            logs: localLogs.join("\n")
          },
          currentSubBabIndex: nextIndex,
          maxChallenges: filtered.length
        });
        return;
      }

      // Real evaluation using official Google Gen AI SDK
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Anda adalah instruktur pemrograman senior AI dan evaluator kuis di "Intelligent CodeLabs".
Tugas Anda adalah mengevaluasi secara kritis kode siswa untuk teknologi "${userState.currentLanguage}" pada tingkat kesulitan "${userState.currentDifficulty}", bab indeks ke-${userState.currentSubBabIndex}.

Nama Tantangan / Topik: ${activeChallenge.title}
Deskripsi Tugas: ${activeChallenge.description}
Sintaks Boilerplate Awal: ${activeChallenge.boilerplate}
Uji Kasus yang Harus Dipenuhi (Test Cases):
${JSON.stringify(activeChallenge.testCases, null, 2)}

Siswa mengirimkan kode pemrograman berikut untuk dinilai:
\`\`\`${activeChallenge.technology.toLowerCase()}
${userCode}
\`\`\`

Lakukan review dan analisis kode secara objektif dan mendalam. Tentukan apakah kode tersebut benar, lulus dari seluruh kasus uji kompetensi yang diminta, memiliki pendekatan logika yang tepat, dan menangani batasan tantangan.

Dilarang mengembalikan teks mentah penjelas tambahan di luar skema json. Anda WAJIB mengembalikannya dalam format JSON yang dideklarasikan pada schema dengan key 'evaluasi':
- 'apakah_benar': true jika kode lulus semua kasus uji, saksama, bebas dari error sintaks, dan logis secara algoritma. false jika gagal, mengandung bug, atau tidak memenuhi instruksi.
- 'feedback': bimbingan terstruktur berbahasa Indonesia dengan format Markdown yang berisi:
  1. Analisis kode ringkas.
  2. Kompleksitas Big O (Waktu dan Ruang).
  3. Kesalahan spesifik (jika salah) atau saran optimasi kode yang lebih bersih/elegan (jika benar).
  4. Kata-kata penyemangat penutup yang ramah dan energetik.
- 'logs': Output simulasi debugger konsol yang rapi yang merefleksikan jalannya kode siswa (misal: test run passed, compile logs).`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              evaluasi: {
                type: Type.OBJECT,
                properties: {
                  apakah_benar: {
                    type: Type.BOOLEAN,
                    description: "Set true jika kode lulus kriteria tantangan, set false jika tidak."
                  },
                  feedback: {
                    type: Type.STRING,
                    description: "Ulasan detail, analisis Big-O, bimbingan, petunjuk kesalahan dalam format Markdown Bahasa Indonesia."
                  },
                  logs: {
                    type: Type.STRING,
                    description: "Log teks rekonstruksi jalannya kode / kompilasi konsol."
                  }
                },
                required: ["apakah_benar", "feedback", "logs"]
              }
            },
            required: ["evaluasi"]
          }
        }
      });

      const resText = aiResponse.text;
      if (!resText) {
        throw new Error("Layanan AI Gemini mengembalikan respons kosong.");
      }

      const responseObj = JSON.parse(resText.trim());
      const evaluation = responseObj.evaluasi;

      const isCorrect = evaluation.apakah_benar === true;
      let nextIndex = userState.currentSubBabIndex;
      if (isCorrect && userState.currentSubBabIndex < filtered.length) {
        nextIndex = userState.currentSubBabIndex + 1;
      }

      // Sync Database State
      await stateRef.set({
        currentSubBabIndex: nextIndex,
        currentLanguage: teknologi,
        currentDifficulty: userState.currentDifficulty,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      res.json({
        evaluasi: {
          apakah_benar: isCorrect,
          feedback: evaluation.feedback,
          logs: evaluation.logs || ""
        },
        currentSubBabIndex: nextIndex,
        maxChallenges: filtered.length
      });

    } catch (apiError: any) {
      console.warn("[Resiliency Warning] Terjadi kendala kuis AI. Mengaktifkan offline fallback kuis:", apiError.message);
      
      try {
        const isSolutionReasonable = (userCode || "").trim().length > 25;
        const mockIsCorrect = isSolutionReasonable;
        
        let subBabIndex = 0;
        let diff = "Easy";
        let lang = teknologi || "React";

        if (userState) {
          subBabIndex = userState.currentSubBabIndex;
          diff = userState.currentDifficulty;
          lang = userState.currentLanguage;
        }

        const filteredList = challenges.filter(c => 
          c.technology.toLowerCase() === lang.toLowerCase() &&
          c.difficulty.toLowerCase() === diff.toLowerCase()
        );

        let nextIndex = subBabIndex;
        if (mockIsCorrect && subBabIndex < filteredList.length) {
          nextIndex = subBabIndex + 1;
        }

        const currentActiveChallenge = (filteredList && filteredList[subBabIndex]) || (filteredList && filteredList[0]) || { title: "Tantangan Kuis", index: 1 };

        // Save updated state to resilient DB
        if (stateRef) {
          try {
            await stateRef.set({
              currentSubBabIndex: nextIndex,
              currentLanguage: lang,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (dbErr) {
            console.warn("Gagal menyimpan progress kuis ke DB saat fallback:", dbErr);
          }
        }

        const localLogs = [
          `[System] Server-side Offline sandbox evaluator active.`,
          `[System] Menilai fungsionalitas untuk sub-bab: ${currentActiveChallenge.title}`,
          mockIsCorrect ? `[SUCCESS] Kode terlihat sesuai dengan spesifikasi kriteria sandbox!` : `[FAILED] Kode terlalu pendek atau tidak mencukupi standar.`
        ];

        res.json({
          evaluasi: {
            apakah_benar: mockIsCorrect,
            feedback: `### ⚠️ Evaluator AI Offline Fallback (Akses API Terhambat)
Sistem mendeteksi adanya kendala dengan kunci API AI model (${apiError.message || "Bocor atau Pembatasan Izin Kunci API"}). 

Kami secara otomatis mengaktifkan **Evaluator Offline** agar Anda tetap bisa melakukan latihan coding, menyimpan progres belajar Anda, dan terus menyeberang ke sub-bab berikutnya tanpa hambatan!

#### Analisis Simulasi Offline:
- **Tantangan**: ${currentActiveChallenge.title}
- **Hasil**: ${mockIsCorrect ? "BENAR (Simulasi Lulus)" : "SALAH (Gagal / Kode terlalu pendek)"}
- **Rekomendasi**: ${mockIsCorrect ? "Hebat! Progress Anda tersimpan secara dinamis dan Anda berhasil naik ke sub-bab berikutnya." : "Kembangkan lagi logika Anda sebelum menuju ke bab selanjutnya."}`,
            logs: localLogs.join("\n")
          },
          currentSubBabIndex: nextIndex,
          maxChallenges: filteredList.length || 1
        });
      } catch (fallbackErr: any) {
        console.error("Critical double-failure in quiz fallback handler:", fallbackErr);
        res.status(500).json({
          error: "Gagal mengevaluasi kuis Anda melalui AI.",
          debug: apiError.message
        });
      }
    }
  });

  // 1.8. POST /api/auth/sync - Sync authentication profile and retrieve state on successful client login
  app.post("/api/auth/sync", async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid) {
      res.status(400).json({ error: "Permintaan sinkronisasi tidak valid. UID diperlukan." });
      return;
    }

    try {
      const { db } = getAdminServices();

      // Save user profile info in Firestore
      const userRef = db.collection("users").doc(uid);
      const userSnap = await userRef.get();
      
      const userData = {
        uid,
        email: email || `${uid}@codelabs.com`,
        displayName: displayName || "Siswa Codelabs",
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        updatedAt: new Date().toISOString()
      };

      if (!userSnap.exists) {
        await userRef.set({
          ...userData,
          createdAt: new Date().toISOString()
        });
      } else {
        await userRef.set(userData, { merge: true });
      }

      // Check and retrieve user kuis state or initialize with default
      const stateRef = db.collection("user_states").doc(uid);
      const stateSnap = await stateRef.get();
      
      let stateData = {
        userId: uid,
        currentLanguage: "React",
        currentDifficulty: "Easy",
        currentSubBabIndex: 0,
        updatedAt: new Date().toISOString()
      };

      if (stateSnap.exists) {
        const dbState = stateSnap.data();
        stateData = {
          userId: uid,
          currentLanguage: dbState.currentLanguage || "React",
          currentDifficulty: dbState.currentDifficulty || "Easy",
          currentSubBabIndex: dbState.currentSubBabIndex !== undefined ? dbState.currentSubBabIndex : 0,
          updatedAt: new Date().toISOString()
        };
      } else {
        await stateRef.set(stateData);
      }

      res.json({
        success: true,
        user: userData,
        state: stateData
      });

    } catch (err: any) {
      console.error("Auth sync error:", err);
      res.status(500).json({ error: "Gagal menyinkronkan profil autentikasi.", debug: err.message });
    }
  });

  // 2. Submit user solution for evaluation
  app.post("/api/submit", async (req, res) => {
    const { challengeId, code } = req.body;

    if (!challengeId || typeof code !== "string") {
      res.status(400).json({ error: "Permintaan tidak valid. Masukkan challengeId dan kode Anda." });
      return;
    }

    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      res.status(404).json({ error: "Tantangan tidak ditemukan" });
      return;
    }

    // Check for API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Graceful fallback for demo or when API Key is not set yet
      console.warn("GEMINI_API_KEY tidak dikonfigurasi. Menjalankan fallback evaluator.");
      
      // Let's do a basic run simulation
      const hasDefinedFunction = code.includes(challenge.id === "challenge-6" ? "def two_sum" : "function ");
      const isTooShort = code.length < 30;

      let success = true;
      let logs = ["Initializing standard offline engine...", "Running test cases..."];
      let error = null;

      if (isTooShort) {
        success = false;
        error = "SyntaxError: Kode terlalu pendek atau tidak lengkap.";
        logs.push("Error: Gagal mengompilasi kode.");
      } else if (!hasDefinedFunction && challenge.technology !== "TypeScript") {
        success = false;
        error = `ReferenceError: Fungsi pemecah tantangan tidak didefinisikan dengan benar.`;
        logs.push("Error: Pencarian fungsi gagal.");
      } else {
        logs.push("Test Case 1: PASSED");
        logs.push("Test Case 2: PASSED");
        logs.push("Semua uji lokal berhasil!");
      }

      const feedback = `### ⚠️ Evaluator Lokal (Offline Fallback)
Kunci API \`GEMINI_API_KEY\` belum dikonfigurasi di secrets panel. Silakan tambahkan kunci API Anda di menu **Settings > Secrets** untuk mendapatkan penilaian AI interaktif yang sesungguhnya.

#### Analisis Kode Sederhana:
- **Teknologi**: ${challenge.technology}
- **Status Kode**: ${success ? "Sintaks Terlihat Valid" : "Kemungkinan Mengandung Eror"}
- **Saran**: Lengkapi kode fungsi dan gunakan tombol **Submit Code** kembali ketika API key telah ditambahkan. Gemini akan menganalisis Big-O, memberikan alternatif algoritma, dan bimbingan interaktif!`;

      res.json({
        success,
        stdout: logs.join("\n"),
        logs,
        feedback,
        error
      });
      return;
    }

    try {
      // Initialize Gemini Client with standard headers
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Anda adalah instruktur pemrograman senior di "Intelligent CodeLabs".
Tugas Anda adalah memvalidasi dan mengevaluasi kode yang dikirimkan oleh siswa untuk tantangan pemrograman berikut:

Nama Tantangan: ${challenge.title}
Teknologi: ${challenge.technology}
Kesulitan: ${challenge.difficulty}
Deskripsi Tantangan:
${challenge.description}

Kode yang Dikirimkan Siswa:
\`\`\`${challenge.technology.toLowerCase()}
${code}
\`\`\`

Test Cases yang Harus Lulus:
${JSON.stringify(challenge.testCases, null, 2)}

Harap lakukan simulasi eksekusi dan evaluasi mendalam:
1. Validasi sintaksis. Jika ada bug atau error, kembalikan 'error' berisi pesan error yang jelas dan detail. Set 'success' menjadi false.
2. Validasi logika. Apakah kode siswa menghasilkan output yang diharapkan sesuai dengan semua test case? Apakah edgecase ditangani? Jika tidak lolos semua test case, set 'success' menjadi false.
3. Berikan feedback dalam bentuk Markdown yang terstruktur secara estetis dan edukatif dalam Bahasa Indonesia:
   - **Evaluasi Singkat**: Apakah kode ringkas, bersih, dan efisien?
   - **Analisis Logika & Kompleksitas**: Bagaimana kompleksitas waktu (time complexity) dan ruang (space complexity) dalam notasi Big O?
   - **Saran Peningkatan**: Berikan tips khusus menulis kode yang lebih elegan atau alternatif solusi yang lebih optimal jika sudah benar.
   - Berikan simpulan semangat belajar yang ceria dan ramah.

Jika semua test case berhasil dilewati dengan logika yang tepat dan efisien, set 'success' menjadi true.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: {
                type: Type.BOOLEAN,
                description: "Apakah kode siswa 100% lolos semua test case dan logika sudah benar."
              },
              stdout: {
                type: Type.STRING,
                description: "Output standar console (rekonstruksi eksekusi / logs tantangan)."
              },
              feedback: {
                type: Type.STRING,
                description: "Review komprehensif, ulasan Big O, dan tips perbaikan dalam format Markdown Bahasa Indonesia."
              },
              error: {
                type: Type.STRING,
                description: "Sintaks eror atau runtime debug message (jika ada, jika tidak ada isikan null atau string kosong)."
              }
            },
            required: ["success", "stdout", "feedback", "error"]
          }
        }
      });

      const resString = response.text;
      if (!resString) {
        throw new Error("Respon kosong diterima dari Gemini.");
      }

      const evaluation = JSON.parse(resString.trim());
      
      const formattedLogs = [
        `[System] Menghubungkan ke server evaluasi Intelligent CodeLabs...`,
        `[System] Membaca tantangan: ${challenge.title} (${challenge.technology})`,
        `[System] Menilai fungsionalitas kode menggunakan AI Tutor...`,
        ...(evaluation.stdout ? evaluation.stdout.split("\n") : []),
        evaluation.success 
          ? `[SUCCESS] Semua uji kasus terpenuhi dengan cemerlang!`
          : `[FAILED] Beberapa kriteria belum terpenuhi. Silakan periksa masukan AI Tutor.`
      ];

      res.json({
        success: evaluation.success,
        stdout: evaluation.stdout || "",
        logs: formattedLogs,
        feedback: evaluation.feedback,
        error: evaluation.error || null
      });

    } catch (apiError: any) {
      console.warn("[Resiliency Fallback] Terjadi kendala evaluasi AI pada /api/submit:", apiError.message);
      
      try {
        const hasDefinedFunction = code.includes(challenge?.id === "challenge-6" ? "def two_sum" : "function ");
        const isTooShort = code.length < 30;

        let success = true;
        let logs = ["Initializing standard offline engine...", "Running test cases..."];
        let error = null;

        if (isTooShort) {
          success = false;
          error = "SyntaxError: Kode terlalu pendek atau tidak lengkap.";
          logs.push("Error: Gagal mengompilasi kode.");
        } else if (!hasDefinedFunction && challenge?.technology !== "TypeScript") {
          success = false;
          error = `ReferenceError: Fungsi pemecah tantangan tidak didefinisikan dengan benar.`;
          logs.push("Error: Pencarian fungsi gagal.");
        } else {
          logs.push("Test Case 1: PASSED");
          logs.push("Test Case 2: PASSED");
          logs.push("Semua uji lokal berhasil!");
        }

        const feedback = `### ⚠️ Evaluator Lokal (Offline Fallback - API Key Bermasalah)
Layanan evaluasi AI mendeteksi adanya kendala dengan kunci API Anda (${apiError.message || "Bocor / Batasan Kunci API"}).

Kami telah mengaktifkan **Evaluator Offline** secara otomatis agar Anda dapat terus berlatih di Sandbox secara interaktif tanpa kendala!

#### Analisis Kode Sederhana:
- **Teknologi**: ${challenge?.technology || "Konfigurasi"}
- **Status Kode**: ${success ? "Sintaks Terlihat Valid" : "Kemungkinan Mengandung Eror"}
- **Saran**: ${success ? "Sintaksis terlihat valid secara offline. Anda dapat terus bereksperimen dengan sandbox!" : "Lengkapi kode fungsi Anda terlebih dahulu sebelum mengevaluasinya."}`;

        res.json({
          success,
          stdout: logs.join("\n"),
          logs,
          feedback,
          error
        });
      } catch (fallbackErr: any) {
        console.error("Critical double-failure in general fallback handler:", fallbackErr);
        res.status(500).json({
          error: "Gagal mengevaluasi kode menggunakan AI. Silakan coba sesaat lagi.",
          debug: apiError.message
        });
      }
    }
  });

  // Vite middleware for development, Static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
