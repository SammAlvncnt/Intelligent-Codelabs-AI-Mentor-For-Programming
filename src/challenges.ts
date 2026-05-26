import { Challenge } from "./types";

// Raw syllabus definition mapping for all 20 officially supported technologies
const rawSyllabus: Record<string, {
  icon: string,
  easy: string[],
  medium: string[],
  hard: string[]
}> = {
  "JavaScript": {
    icon: "🟨",
    easy: [
      "S1: Variabel Modern (let vs const)",
      "S2: Tipe Data Primitif & typeof",
      "S3: Operator Aritmatika & Logika",
      "S4: Percabangan (if-else, switch-case)",
      "S5: Perulangan (for, while, do-while)",
      "S6: Fungsi Dasar & Parameter",
      "S7: ES6 Arrow Functions",
      "S8: Template Literals & String Manipulation"
    ],
    medium: [
      "S9: Array Methods Modern (.map(), .filter(), .reduce())",
      "S10: Object Literals & Destructuring Assignment",
      "S11: Rest & Spread Operators (...)",
      "S12: Konsep Asinkronus: Callbacks & Isu Callback Hell",
      "S13: Promises (.then(), .catch(), .finally())",
      "S14: Async / Await & Error Handling try-catch",
      "S15: DOM Manipulation Basics & Event Listeners",
      "S16: Fetch API & Integrasi REST API HTTP Requests"
    ],
    hard: [
      "S17: Scope: Global, Function, Block, & Lexical Scope",
      "S18: Hoisting & Temporal Dead Zone (TDZ)",
      "S19: JavaScript Closures & Encapsulation Data",
      "S20: this Keyword Context & Binding (call, apply, bind)",
      "S21: Prototypes & Prototype Inheritance Chain",
      "S22: ES6 Classes, Constructor, Private Fields, & Getters/Setters",
      "S23: Event Loop, Call Stack, Task Queue, & Microtask Queue",
      "S24: Memory Management: Garbage Collection & Memory Leaks"
    ]
  },
  "TypeScript": {
    icon: "🟦",
    easy: [
      "S1: Instalasi & Konfigurasi tsconfig.json",
      "S2: Type Annotations Dasar (string, number, boolean)",
      "S3: Tipe Data array & tuple",
      "S4: Tipe Data any, unknown, & void",
      "S5: Type Inference Otomatis",
      "S6: Fungsi dengan Type Definition (Parameter & Return Type)",
      "S7: Optional & Default Parameters"
    ],
    medium: [
      "S8: Union Types (|) & Intersection Types (&)",
      "S9: Type Aliases vs Interfaces",
      "S10: Readonly & Optional Properties di Interface",
      "S11: Type Assertions (as syntax & <type>)",
      "S12: Literal Types & Enums (Numeric & String)",
      "S13: Type Guarding & Narrowing (typeof, instanceof, in)",
      "S14: Class di TypeScript (Access Modifiers: public, private, protected)"
    ],
    hard: [
      "S15: Generics Functions, Interfaces, & Classes",
      "S16: Generics Constraints (extends)",
      "S17: Keyof Operator & Mapped Types",
      "S18: Conditional Types (T extends U ? X : Y)",
      "S19: Utility Types Tingkat Lanjut (Partial, Required, Readonly, Pick, Omit, Record)",
      "S20: Advanced Decorators (Class, Method, Property Decorators)",
      "S21: Declaration Files (.d.ts) & Integrasi Library JavaScript Vanilla",
      "S22: Ambient Modules & Namespaces"
    ]
  },
  "Python": {
    icon: "🐍",
    easy: [
      "S1: Aturan Indentasi & Komentar",
      "S2: Variabel & Tipe Data (str, int, float, bool)",
      "S3: Input & Output (input(), print(), F-Strings)",
      "S4: Operator Logika & Kondisional (if, elif, else)",
      "S5: Loops (for dengan range(), while)",
      "S6: Break, Continue, & Pass Statements",
      "S7: Fungsi Dasar (def) & Positional Arguments"
    ],
    medium: [
      "S8: Manipulasi List, Tuple, Set, & Dictionaries",
      "S9: List Comprehensions & Dictionary Comprehensions",
      "S10: Lambda Functions (Anonymous Functions)",
      "S11: Built-in Functions Tinggi (map(), filter(), zip(), enumerate())",
      "S12: File Handling (Membaca & Menulis file .txt/.json)",
      "S13: Modularization (import, from, pembuatan custom module)",
      "S14: Exception Handling (try, except, finally, else, raise)",
      "S15: Argumen Fungsi Fleksibel (*args, **kwargs)"
    ],
    hard: [
      "S16: OOP di Python (Classes, Objects, __init__ constructor)",
      "S17: Inheritance, Method Overriding, & Multiple Inheritance",
      "S18: Encapsulation (Private & Protected Members via Dunder __)",
      "S19: Magic Methods / Dunder Methods (__str__, __repr__, __len__)",
      "S20: Function & Class Decorators (@staticmethod, @classmethod)",
      "S21: Generators & Iterator Protocol (yield keyword)",
      "S22: Context Managers (with statement & __enter__/__exit__)",
      "S23: Konkurensi Dasar (threading, multiprocessing, asyncio)"
    ]
  },
  "Go": {
    icon: "🐹",
    easy: [
      "S1: Struktur Package & Fungsi main()",
      "S2: Variabel & Konstanta (var, short assignment :=)",
      "S3: Tipe Data Numerik, String, & Boolean",
      "S4: Percabangan Tunggal (if-else, switch-case)",
      "S5: Perulangan Tunggal via Keyword for",
      "S6: Fungsi dengan Multi-Return Values",
      "S7: Named Return Values"
    ],
    medium: [
      "S8: Array & Slices (Internal representation, append, copy)",
      "S9: Maps (Key-Value storage)",
      "S10: Pointers Dasar (Alamat memori & & Dereferencing *)",
      "S11: Structs (Definisi & Instansiasi)",
      "S12: Method Receiver (Value vs Pointer Receiver)",
      "S13: Penanganan Error Eksplisit (error interface, errors.New())",
      "S14: Kontrol Alur defer (Penundaan eksekusi)",
      "S15: Pengenalan Go Modules (go mod init, go get)"
    ],
    hard: [
      "S16: Interfaces & Polimorfisme (Implicit Implementation)",
      "S17: Empty Interface (interface{} / any) & Type Assertion",
      "S18: Alur Panic, Recover, & Kapan Harus Digunakan",
      "S19: Concurrency Dasar: Goroutines",
      "S20: Channels untuk Sinkronisasi & Komunikasi Data",
      "S21: Buffered Channels vs Unbuffered Channels",
      "S22: Select Statement untuk Multi-Channel Operations",
      "S23: Sync Package (sync.Mutex, sync.WaitGroup, sync.Once)",
      "S24: Pendekatan Refleksi (reflect package) & Pointer Unsafe"
    ]
  },
  "Rust": {
    icon: "🦀",
    easy: [
      "S1: Struktur Project Cargo (Cargo.toml, src/main.rs)",
      "S2: Variabel Mutability & Immutability (let vs let mut)",
      "S3: Konstanta vs Variabel Immutable",
      "S4: Variabel Shadowing",
      "S5: Tipe Data Skalar & Komposit",
      "S6: Fungsi & Statements vs Expressions",
      "S7: Control Flow (if sebagai ekspresi, loop loop, while, for)"
    ],
    medium: [
      "S8: Sistem Ownership: Move Semantics & Copy Trait",
      "S9: References & Borrowing (Data Sharing Tanpa Pindah Ownership)",
      "S10: Aturan Validasi Borrowing (Satu Mutable atau Banyak Immutable)",
      "S11: Slices (&str, slice array)",
      "S12: Structs (Classic, Tuple Structs, Unit-Like Structs)",
      "S13: Enums & Assosiated Data",
      "S14: Pattern Matching via Ekspresi match",
      "S15: Control Flow Ringkas if let",
      "S16: Error Handling: Result<T, E> & Option<T> dengan Operator ?"
    ],
    hard: [
      "S17: Pengenalan Package, Crates, Modules, & Paths",
      "S18: Vectors, Strings, & Hash Maps secara Mendalam",
      "S19: Traits: Mendefinisikan Perilaku Bersama (Interfaces Rust)",
      "S20: Trait Bounds & Polimorfisme Statis",
      "S21: Explicit Lifetimes ('a) & Aturan Elision Lifetimes Compiler",
      "S22: Smart Pointers (Box<T>, Rc<T>, RefCell<T>)",
      "S23: Concurrency Aman: Threads, Message Passing Channels, & Shared State (Arc, Mutex)",
      "S24: Kode Unsafe Rust & Penggunaan FFI (Foreign Function Interface)"
    ]
  },
  "C++": {
    icon: "👾",
    easy: [
      "S1: Struktur Kode Minimalis, Preprocessor Directive (#include)",
      "S2: Aliran Input/Output Standar (std::cin, std::cout, std::endl)",
      "S3: Namespace Standar (using namespace std)",
      "S4: Variabel, Konstanta (const), & Tipe Data Primitif",
      "S5: Operator Logika, Kondisional (if, else if, else, switch)",
      "S6: Loops Control (for, while, do-while)",
      "S7: Fungsi Dasar, Prototipe Fungsi, & Parameter Pass-by-Value"
    ],
    medium: [
      "S8: Array Statis & Multi-Dimensi",
      "S9: Pengenalan String Standar (std::string)",
      "S10: Pointer Dasar, Operator Alamat (&), & Dereference (*)",
      "S11: References (& parameter) & Keuntungannya (Pass-by-Reference)",
      "S12: Alokasi Memori Dinamis (new & delete keywords)",
      "S13: Pointer Void, Pointer Null (nullptr), & Isu Memory Leaks",
      "S14: Structures (struct) & Enums",
      "S15: File Stream Handling (ifstream, ofstream)"
    ],
    hard: [
      "S16: OOP C++: Classes, Objects, Access Modifiers (public, private, protected)",
      "S17: Constructors (Default, Parameterized, Copy), Destructors, & Initializer Lists",
      "S18: Encapsulation, Inheritance (Single, Multiple, Hierarchical)",
      "S19: Polymorphism: Function Overloading vs Method Overriding",
      "S20: Virtual Functions, Pure Virtual Functions, & Abstract Classes",
      "S21: Operator Overloading (operator+, operator<<)",
      "S22: C++ Templates (Function Templates & Class Templates)",
      "S23: Standard Template Library (STL): Vectors, Maps, Sets, Iterators",
      "S24: Exception Handling (try, catch, throw) & Smart Pointers (std::unique_ptr, std::shared_ptr)"
    ]
  },
  "Java": {
    icon: "☕",
    easy: [
      "S1: Struktur Kelas Java, Method public static void main",
      "S2: Kompilasi Bytecode & Java Virtual Machine (JVM)",
      "S3: Variabel, Tipe Data Primitif vs Tipe Data Referensi",
      "S4: Operator & Aturan Precedence",
      "S5: Struktur Kondisional (if-else, Nested If, switch)",
      "S6: Perulangan (for, Enhanced For-Loop, while, do-while)",
      "S7: Membuat Metode Statis, Parameter, & Return Value"
    ],
    medium: [
      "S8: Manipulasi String (String Immutable, StringBuilder, StringBuffer)",
      "S9: Array Single & Multi-Dimensi",
      "S10: OOP Dasar: Definisi Kelas, Membuat Objek (new), & Variabel Instance",
      "S11: Package, Import, & Pengaturan Scope Access Modifiers",
      "S12: Java Constructors & Keyword this",
      "S13: Pilar OOP: Inheritance (extends) & Polimorfisme",
      "S14: Method Overriding vs Method Overloading, Keyword super",
      "S15: Exception Handling Dasar (try-catch-finally, throw, throws)",
      "S16: Java Collections Framework Dasar: ArrayList & HashMap"
    ],
    hard: [
      "S17: Abstract Classes vs Interfaces Modern (Default & Static Methods)",
      "S18: Encapsulation Ketat, Getters & Setters, POJO Design Pattern",
      "S19: Keyword final (pada Variabel, Method, & Class) & Keyword static",
      "S20: Java Generics (Generic Classes & Methods)",
      "S21: File I/O (FileReader, FileWriter, BufferedReader)",
      "S22: Multithreading Dasar (Kelas Thread, Interface Runnable, synchronized block)",
      "S23: Lambda Expressions & Stream API (.stream(), .filter(), .map(), .collect())",
      "S24: Pengenalan Java Reflection API"
    ]
  },
  "Ruby": {
    icon: "💎",
    easy: [
      "S1: Sintaks Interaktif IRB, Variabel Lokal, & Aturan Penamaan",
      "S2: Tipe Data Dasar: Numbers, Strings, Booleans, Nil",
      "S3: Manipulasi String & String Interpolation (#{})",
      "S4: Metode Output (print, puts, p)",
      "S5: Struktur Logika Kondisional (if, elsif, else, unless)",
      "S6: Perulangan (while, until, Loops Sederhana)",
      "S7: Definisi Metode (def) & Return Implicit"
    ],
    medium: [
      "S8: Array & Hashes (Operasi CRUD & Manipulasi Key-Value)",
      "S9: Ruby Iterators Modern (.each, .map, .select, .reject)",
      "S10: Symbols (:symbol) & Perbedaannya dengan String",
      "S11: Variabel Global ($), Variabel Instance (@), & Variabel Kelas (@@)",
      "S12: OOP Ruby: Definisi Class, Instansiasi Objek (.new), Constructor initialize",
      "S13: Getter & Setter Manual vs attr_reader, attr_writer, attr_accessor",
      "S14: Inheritance Kelas (<) & Method Overriding",
      "S15: Exception Handling (begin, rescue, ensure, raise)"
    ],
    hard: [
      "S16: Blocks, Procs, & Lambdas (Closure ala Ruby)",
      "S17: Penggunaan Pernyataan yield untuk Eksekusi Blok Eksternal",
      "S18: Modules sebagai Namespaces & Modules sebagai Mixins (include vs extend)",
      "S19: RegEx (Regular Expressions) di Ruby",
      "S20: File I/O & Manipulasi Direktori",
      "S21: Metaprogramming Dasar: method_missing, define_method",
      "S22: Object Introspection & send Method",
      "S23: Ruby Gems Ecosystem & Penggunaan Bundler (Gemfile)"
    ]
  },
  "PHP": {
    icon: "🐘",
    easy: [
      "S1: Tag Sintaks PHP (<?php ?>), Penulisan Komentar, echo & print",
      "S2: Deklarasi Variabel ($) & Aturan Loosely Typed",
      "S3: Tipe Data Primitif, Konversi Tipe Data (Type Casting)",
      "S4: Operator Aritmatika, String Concatenation (.)",
      "S5: Struktur Kondisional (if, elseif, else, Ternary Operator)",
      "S6: Loops Control (for, while, do-while, foreach untuk array)",
      "S7: Fungsi Custom, Argumen, & Cakupan Variabel (Global vs Local)"
    ],
    medium: [
      "S8: Array Indexed, Array Asosiatif, & Array Multi-Dimensi",
      "S9: Built-in Array Functions (array_merge, in_array, array_keys)",
      "S10: Integrasi Form HTTP: Variabel Superglobals ($_GET, $_POST, $_REQUEST)",
      "S11: Sanitasi Data Form (htmlspecialchars, filter_var)",
      "S12: State Management: HTTP Cookies ($_COOKIE) & HTTP Sessions ($_SESSION)",
      "S13: Modularitas Kode: include, require, include_once, require_once",
      "S14: Koneksi Database MySQL via MySQLi vs PDO Extension",
      "S15: Keamanan Database: Prepared Statements & SQL Injection Prevention"
    ],
    hard: [
      "S16: OOP PHP: Classes, Objects, Properties, & Methods",
      "S17: Access Modifiers (public, protected, private), Constructor (__construct)",
      "S18: Class Inheritance (extends), Method Overriding, Keyword parent",
      "S19: Abstract Classes vs Interfaces di PHP Modern",
      "S20: Magic Methods di PHP (__get, __set, __call, __toString)",
      "S21: PHP Namespaces & Aturan Autoloading Berstandar PSR-4",
      "S22: Manajemen Dependency Eksternal via Composer (composer.json)",
      "S23: Penanganan Error Modern: Exception Class, try-catch, Custom Exception Handlers",
      "S24: Traits untuk Code Reusability Multi-Inheritance"
    ]
  },
  "Swift": {
    icon: "🦅",
    easy: [
      "S1: Konstanta (let) vs Variabel (var)",
      "S2: Type Inference & Explicit Type Annotations",
      "S3: Tipe Data Dasar (String, Int, Double, Bool)",
      "S4: String Interpolation (\\( ))",
      "S5: Koleksi Data Dasar: Arrays, Sets, Dictionaries",
      "S6: Struktur Kontrol (if-else, switch-case dengan Pattern Matching)",
      "S7: Perulangan (for-in, while, repeat-while)",
      "S8: Fungsi Dasar, Label Parameter (Argument Labels & Parameter Names)"
    ],
    medium: [
      "S9: Konsep Optionals (?), Bahaya Force Unwrapping (!)",
      "S10: Unwrapping Aman: Optional Binding (if let, guard let)",
      "S11: Operator Nil-Coalescing (??)",
      "S12: Enumerations (enum) dengan Raw Values & Associated Values",
      "S13: Structs vs Classes (Value Types vs Reference Types)",
      "S14: Properti Kelas: Stored Properties, Computed Properties, Property Observers (willSet/didSet)",
      "S15: Fungsi Initializers (init(), Failable Initializers)",
      "S16: Closures Dasar (Sintaks Ekspresi Closure, Trailing Closures)"
    ],
    hard: [
      "S17: Manajemen Memori: Automatic Reference Counting (ARC), Strong, Weak, & Unowned References",
      "S18: Isu Memory Leaks via Strong Reference Cycles di Closures",
      "S19: Protocols (Mendefinisikan Blueprint Interface Swift)",
      "S20: Extensions (Menambahkan Fitur ke Tipe Data Eksis / Protocol Extensions)",
      "S21: Generics Code di Swift (Generic Functions & Generic Types)",
      "S22: Error Handling Modern (throws, try, catch, defer)",
      "S23: Modern Swift Concurrency: Struktur async, await, Task, & Actors untuk Thread Safety"
    ]
  },
  "Kotlin": {
    icon: "🤖",
    easy: [
      "S1: Deklarasi Variabel Read-Only (val) vs Mutable (var)",
      "S2: Tipe Data Numerik, String, Boolean, & Char",
      "S3: String Templates & Multiline Strings",
      "S4: Struktur Kondisional: if sebagai ekspresi & Struktur when",
      "S5: Perulangan (for dengan Ranges .., until, downTo, step, while)",
      "S6: Definisi Fungsi (fun), Single-Expression Functions",
      "S7: Default & Named Arguments pada Fungsi"
    ],
    medium: [
      "S8: Sistem Null Safety Mutakhir: Nullable Types (Type?) vs Non-Null Types",
      "S9: Safe Call Operator (?.), Elvis Operator (?:), Not-Null Assertion Operator (!!)",
      "S10: Smart Casts & Explicit Casts (as, as?)",
      "S11: Koleksi di Kotlin: Mutable vs Immutable Lists, Sets, Maps",
      "S12: OOP Kotlin: Primary & Secondary Constructors, Init Blocks",
      "S13: Inheritance Kelas (Secara Default Kelas open untuk di-extend)",
      "S14: Data Classes (Otomatis generate toString(), equals(), copy())",
      "S15: Smart Scope Functions (let, run, with, apply, also)"
    ],
    hard: [
      "S16: Lambda Expressions & Higher-Order Functions",
      "S17: Extension Functions & Extension Properties",
      "S18: Object Declarations (Pembuatan Singleton Instant) & Companion Objects",
      "S19: Interfaces Modern di Kotlin, Properties di Interface",
      "S20: Visibility Modifiers (public, internal, protected, private)",
      "S21: Inline Functions & Reified Type Parameters",
      "S22: Kotlin Coroutines Dasar: CoroutineScope, launch, async, delay()",
      "S23: Suspend Functions & Dispatchers (Main, I/O, Default) untuk Non-Blocking Execution"
    ]
  },
  "SQL SELECT Basic": {
    icon: "📊",
    easy: [
      "S1: Konsep Database Relasional, Tabel, Baris (Rows), & Kolom (Columns)",
      "S2: Struktur Dasar Kueri SELECT & FROM",
      "S3: Mengambil Seluruh Kolom (SELECT *) vs Kolom Spesifik",
      "S4: Menghilangkan Duplikasi Data via SELECT DISTINCT",
      "S5: Penyaringan Baris Dasar via Klausa WHERE",
      "S6: Operator Perbandingan (=, <, >, <=, >=, !=)",
      "S7: Operator Logika SQL (AND, OR, NOT)"
    ],
    medium: [
      "S8: Filter Jangkauan Nilai via Operator BETWEEN ... AND",
      "S9: Filter Pencocokan Nilai di dalam List via Operator IN (...)",
      "S10: Pencarian Pola String Tekstual via Operator LIKE & Wildcards (%, _)",
      "S11: Penanganan Data Kosong / Hilang via IS NULL & IS NOT NULL",
      "S12: Mengurutkan Hasil Kueri via Klausa ORDER BY (ASC / DESC)",
      "S13: Membatasi Jumlah Baris Output via Klausa LIMIT / TOP",
      "S14: Memberikan Nama Samaran Kolom/Tabel via Operator AS (Aliasing)"
    ],
    hard: [
      "S15: Pengenalan Fungsi Agregat Dasar",
      "S16: Menghitung Total Baris Data via COUNT()",
      "S17: Menghitung Total Akumulasi Nilai Numerik via SUM()",
      "S18: Menghitung Nilai Rata-rata Kombinasi via AVG()",
      "S19: Mencari Nilai Ekstrim Terbesar via MAX() & Terkecil via MIN()",
      "S20: Evaluasi Logika Inline via Ekspresi CASE WHEN ... THEN ... ELSE END",
      "S21: Kombinasi Klausa Where, Order By, dan Limit dalam Satu Transaksi Kompleks"
    ]
  },
  "SQL Joins & Group": {
    icon: "🔗",
    easy: [
      "S1: Pengenalan Kunci Relasi: Primary Key vs Foreign Key",
      "S2: Konsep Dasar Pengelompokan Data via Klausa GROUP BY",
      "S3: Aturan Seleksi Kolom Non-Agregat Saat Menggunakan Group By",
      "S4: Melakukan Grouping Berdasarkan Multi-Kolom"
    ],
    medium: [
      "S5: Pengenalan Konsep Penggabungan Tabel (Joins)",
      "S6: Menggabungkan Record yang Cocok Saja via INNER JOIN",
      "S7: Mempertahankan Semua Record Tabel Kiri via LEFT (OUTER) JOIN",
      "S8: Mempertahankan Semua Record Tabel Kanan via RIGHT (OUTER) JOIN",
      "S9: Menggabungkan Multi-Tabel Joins (Lebih dari Dua Tabel)",
      "S10: Penggabungan Kartesian Tanpa Kondisi via CROSS JOIN",
      "S11: Menggabungkan Tabel dengan Dirinya Sendiri via SELF JOIN"
    ],
    hard: [
      "S12: Menyaring Hasil Data Kelompok via Klausa HAVING",
      "S13: Perbedaan Vital Eksplisit Antara Klausa WHERE vs Klausa HAVING",
      "S14: Penggandengan Seluruh Sisi Record via FULL OUTER JOIN",
      "S15: Kombinasi Hasil Set Kueri Bertumpuk via Operator UNION vs UNION ALL",
      "S16: Subqueries Dasar: Menuliskan Query di Dalam Query Lain (Nested Queries)",
      "S17: Subqueries di dalam Klausa WHERE (Operator IN, EXISTS, ANY, ALL)",
      "S18: Subqueries di dalam Klausa FROM (Derived Tables)",
      "S19: Pengenalan Dasar Analytical Window Functions (ROW_NUMBER(), RANK(), PARTITION BY)"
    ]
  },
  "React": {
    icon: "⚛️",
    easy: [
      "S1: Konsep Single Page Application (SPA) & Virtual DOM",
      "S2: Arsitektur Komponen (Functional Components)",
      "S3: Sintaksis JSX (Aturan JavaScript XML, Atribut, Kurung Kurawal)",
      "S4: Melempar Data ke Komponen Anak via Immutable Props",
      "S5: Destructuring Props & Default Props",
      "S6: Rendering Bersyarat (Conditional Rendering via Ternary & &&)",
      "S7: Rendering Berulang List Data menggunakan .map() & Aturan Atribut key",
      "S8: Reaktivitas Lokal via Hook useState"
    ],
    medium: [
      "S9: Siklus Hidup & Sinkronisasi Efek Samping via Hook useEffect",
      "S10: Aturan Dependency Array di useEffect & Cara Membuat Cleanup Function",
      "S11: Menangani Input State Form (Controlled Components vs Uncontrolled Components)",
      "S12: State Lifting Up (Menaikkan State ke Komponen Parent Bersama)",
      "S13: Penanganan Event Handler & Sintaksis Synthetic Events React",
      "S14: Manipulasi Reference Elemen DOM Native via Hook useRef"
    ],
    hard: [
      "S15: Masalah Prop Drilling & Solusi Global State via Context API (createContext, useContext)",
      "S16: Mengurangi Render Ulang Tidak Perlu via Optimasi Memoization (useMemo & useCallback)",
      "S17: Pengenalan Arsitektur State Kompleks via Hook useReducer",
      "S18: Membuat Custom Hooks Sendiri untuk Pemisahan Logika Bisnis Reusable",
      "S19: Penanganan Error UI via Error Boundaries Components",
      "S20: Konsep Code Splitting & Lazy Loading via React.lazy & <Suspense>"
    ]
  },
  "Vue": {
    icon: "💚",
    easy: [
      "S1: Pengenalan Framework Vue, Perbedaan Options API vs Composition API",
      "S2: Ekspresi Template Vue (Mustache Syntax {{ }})",
      "S3: Direktori Pengikatan Atribut via v-bind (Sintaksis Singkat :)",
      "S4: Penanganan Event Handler via v-on (Sintaksis Singkat @)",
      "S5: Reaktivitas State Dasar via Fungsi ref()",
      "S6: Pengikatan Data Dua Arah pada Input Form via Direktif v-model",
      "S7: Rendering Kondisional (v-if, v-else-if, v-else, v-show)",
      "S8: Perulangan List Data via Direktif v-for & Atribut Wajib :key"
    ],
    medium: [
      "S9: Reaktivitas Objek Kompleks via Fungsi reactive() vs ref()",
      "S10: Efisiensi Performa via Properti Terhitung (computed())",
      "S11: Melacak Perubahan State via Pengamat watch() & watchEffect()",
      "S12: Arsitektur Komponen, Mengirim Data via props",
      "S13: Komunikasi Komponen Anak ke Orang Tua via Custom Events Emits (defineEmits)",
      "S14: Template Customization via Fitur Slots (Named Slots & Scoped Slots)",
      "S15: Vue Component Lifecycle Hooks (onMounted, onUnmounted, onUpdated)"
    ],
    hard: [
      "S16: Manajemen State Global Skala Besar Menggunakan Library Pinia Store",
      "S17: Komunikasi State Jarak Jauh Tanpa Prop Drilling via provide() & inject()",
      "S18: Reusability Logika Komponen via Fitur Composables Functions",
      "S19: Membuat Custom Directives Sendiri",
      "S20: Pengenalan Fitur Ekstrim Vue: <Teleport> & <KeepAlive> Komponen",
      "S21: Dynamic Components Rendering via Tag Khusus <component :is=\"...\">"
    ]
  },
  "Next.js": {
    icon: "⚫",
    easy: [
      "S1: Pengenalan Framework Next.js di Atas React, Fitur Utama & Struktur Folder Baru",
      "S2: Sistem Navigasi Berbasis File Modern (App Router Architecture)",
      "S3: Membuat Halaman Baru (page.tsx) & Struktur Tata Layout (layout.tsx)",
      "S4: Navigasi Client-Side Cepat Menggunakan Komponen <Link> Bawaan Next.js",
      "S5: Navigasi Programmatis Menggunakan Hook useRouter",
      "S6: Optimasi Gambar Otomatis Menggunakan Komponen <Image>"
    ],
    medium: [
      "S7: Arsitektur Radikal: React Server Components (RSC) vs Client Components",
      "S8: Aturan Batasan Penggunaan Direktif 'use client' & 'use server'",
      "S9: Pengenalan Rute Dinamis (Dynamic Routing: app/blog/[id]/page.tsx)",
      "S10: Mengambil Parameter URI via params & searchParams",
      "S11: Mengambil Data Asinkronus Langsung di Server via async/await Server Components",
      "S12: Penanganan Halaman Loading Indikator via File loading.tsx",
      "S13: Penanganan Error Graceful via File error.tsx & Halaman Not Found via not-found.tsx"
    ],
    hard: [
      "S14: Strategi Data Fetching Lanjutan: Static Site Generation (SSG) vs Server-Side Rendering (SSR)",
      "S15: Revalidasi Data Caching Konten via Incremental Static Regeneration (ISR)",
      "S16: Membuat Server-Side API Backend Custom via Route Handlers (route.tsx dengan fungsi GET, POST)",
      "S17: Fitur Server Actions untuk Mutasi Data Form Langsung ke Database Tanpa API Endpoint",
      "S18: Mengamankan Rute Web Menggunakan Fitur Next.js Middleware (middleware.ts)",
      "S19: Optimasi Meta-data untuk SEO Maksimal (Static & Dynamic Metadata API)"
    ]
  },
  "Svelte": {
    icon: "🔥",
    easy: [
      "S1: Filosofi Svelte: Tanpa Virtual DOM & Kompilasi Ahead-of-Time (AOT)",
      "S2: Struktur Tunggal Komponen Svelte (.svelte berisi script, style, markup)",
      "S3: Deklarasi State Reaktif Menggunakan Variabel Lokal JavaScript Biasa (let)",
      "S4: Ekspresi Markup Statis Menggunakan Kurung Kurawal tunggal { }",
      "S5: Pengikatan Atribut HTML Elemen & Atribut Singkat",
      "S6: Penanganan Event Handler Sederhana via Atribut on:click",
      "S7: Logika Kondisional di HTML Menggunakan Blok {#if} {:else if} {:else} {/if}",
      "S8: Iterasi List Data di HTML Menggunakan Blok {#each data as item (key)} {/each}"
    ],
    medium: [
      "S9: Deklarasi State Reaktif Otomatis Berantai Menggunakan Sintaksis Label $:",
      "S10: Pengikatan Data Dua Arah Input Form Menggunakan Direktif bind:value",
      "S11: Mengirimkan Properti ke Komponen Anak Menggunakan Keyword export let",
      "S12: Komunikasi Event ke Parent via Fungsi Event Dispatcher (createEventDispatcher)",
      "S13: Modifiers Event Handler (on:click|preventDefault, once)",
      "S14: Mengakses Elemen DOM Asli Menggunakan Fitur bind:this",
      "S15: Svelte Lifecycle Hooks (onMount, onDestroy, beforeUpdate, afterUpdate)"
    ],
    hard: [
      "S16: Pengenalan Centralized State Global: Svelte Stores",
      "S17: Menggunakan writable store, readable store, & Fitur derived stores",
      "S18: Fitur Auto-Subscription Store Menggunakan Prefiks Karakter Unik $",
      "S19: Animasi & Transisi Grafis Bawaan Svelte Engine (svelte/transition, svelte/motion)",
      "S20: Menggunakan Blok Asinkronus Langsung di HTML Template Menggunakan {#await promise} {:then data} {/await}",
      "S21: Svelte Action Directive (use:actionFunction) untuk Intercept Siklus Hidup Elemen DOM"
    ]
  },
  "Express.js": {
    icon: "🚀",
    easy: [
      "S1: Pengenalan Ekosistem Node.js, Inisialisasi Project (npm init)",
      "S2: Instalasi Express, Membuat Server HTTP Minimalis, & Menentukan Port Listening",
      "S3: Anatomi Objek Request (req) & Objek Response (res)",
      "S4: Routing Dasar Berdasarkan HTTP Method (app.get, app.post, app.put, app.delete)",
      "S5: Mengirim Response Teks Standar (res.send) & Response Objek Data (res.json)",
      "S6: Ekstraksi Data URL Parameters (req.params) & URL Query Strings (req.query)"
    ],
    medium: [
      "S7: Mengurai Data Body Request Masuk Menggunakan Middleware express.json() & express.urlencoded()",
      "S8: Menyediakan File Statis (Gambar, CSS) Menggunakan Middleware Bawaan express.static()",
      "S9: Konsep Arsitektur Pipeline: Apa itu Middleware Functions?",
      "S10: Membuat Custom Middleware Sendiri, Parameter req, res, & Fungsi Pemicu next()",
      "S11: Memasang Middleware Tingkat Aplikasi (app.use) vs Middleware Tingkat Rute Spesifik",
      "S12: Modularitas Sistem Routing Menggunakan Fitur express.Router()",
      "S13: Penanganan CORS Policy Menggunakan Third-Party Middleware cors"
    ],
    hard: [
      "S14: Pembuatan Middleware Interceptor untuk Autentikasi Pengguna Menggunakan JSON Web Tokens (JWT)",
      "S15: Ekstraksi & Validasi Header HTTP Authorization Bearer Token",
      "S16: Arsitektur Terpusat Penanganan Error Menggunakan Error Handling Middleware (err, req, res, next)",
      "S17: Validasi Skema Data Input Body Menggunakan Library Eksternal (Joi / Zod) Sebelum Masuk Controller",
      "S18: Integrasi Database Relasional (PostgreSQL/MySQL) atau Non-Relasional (MongoDB via Mongoose)",
      "S19: Pengamanan Server HTTP Menggunakan Middleware Keamanan Header helmet & Rate Limiting (express-rate-limit)"
    ]
  },
  "Laravel": {
    icon: "🟥",
    easy: [
      "S1: Pengenalan Framework Laravel, Arsitektur Model-View-Controller (MVC)",
      "S2: Mengatur Konfigurasi Server Lingkungan via File .env",
      "S3: Mendefinisikan Rute Web Baru di File routes/web.php",
      "S4: Membuat Komponen Controller via Artisan CLI (php artisan make:controller)",
      "S5: Menghubungkan Router ke Fungsi Method di Controller",
      "S6: Pengenalan Blade Templating Engine (@extends, @section, @yield, @include)",
      "S7: Menampilkan Variabel Dinamis di Blade Template Menggunakan Kurung Kurawal Ganda {{ }}"
    ],
    medium: [
      "S8: Membuat Struktur Blueprint Database Menggunakan Fitur Laravel Migrations",
      "S9: Menjalankan & Me-rollback Database via Perintah php artisan migrate",
      "S10: Pengenalan Active Record ORM: Laravel Eloquent Models",
      "S11: Operasi Basis Data CRUD Menggunakan Eloquent (Model::all(), Model::find(), Model::create())",
      "S12: Menangani Data Form HTTP & Validasi Request Menggunakan Fungsi $request->validate()",
      "S13: State Management Session di Laravel, Proteksi Keamanan Form via Direktif @csrf Token",
      "S14: Sistem Autentikasi User Bawaan Laravel & Pengenalan Laravel Breeze / Jetstream"
    ],
    hard: [
      "S15: Memetakan Hubungan Antar Tabel via Eloquent Relationships (hasOne, hasMany, belongsTo, belongsToMany)",
      "S16: Optimasi Query Database Terhindar dari Masalah N+1 Query Problem Menggunakan Eager Loading (with())",
      "S17: Mengamankan Rute Web & Proteksi Akses Menggunakan HTTP Middleware Custom via Perintah Artisan",
      "S18: Membuat API Resource Endpoints di routes/api.php & Transformasi Output Data Menggunakan Eloquent API Resources",
      "S19: Mengamankan Akses API Menggunakan Sistem Token Authentication Laravel Sanctum",
      "S20: Manajemen Tugas Asinkronus di Background Menggunakan Fitur Laravel Queues & Jobs"
    ]
  },
  "Django": {
    icon: "💚",
    easy: [
      "S1: Pengenalan Arsitektur Model-View-Template (MVT) Django & Ekosistem Virtual Environment Python",
      "S2: Membuat Struktur Project (django-admin startproject) & Membuat Modul App (python manage.py startapp)",
      "S3: Mendaftarkan Aplikasi Baru ke Dalam Konfigurasi settings.py",
      "S4: Mengatur Pemetaan URL Routing di File urls.py",
      "S5: Membuat Fungsi Controller Logika di File views.py (Function-Based Views)",
      "S6: Mengembalikan Objek Response HTTP (HttpResponse, render)",
      "S7: Menggunakan Django Template Language (DTL Syntax: {{ variable }}, {% if %}, {% for %})"
    ],
    medium: [
      "S8: Mendefinisikan Struktur Entitas Database Berbasis Object Relational Mapping (ORM) di models.py",
      "S9: Membuat & Mengeksekusi Berkas Perubahan Database via makemigrations & migrate",
      "S10: Menggunakan Django ORM API untuk Query CRUD (Model.objects.all(), Model.objects.filter())",
      "S11: Aktivasi & Kustomisasi Panel Administrasi Instan Bawaan Django (admin.py)",
      "S12: Mengamankan dan Memproses Input Data Pengguna Menggunakan Fitur Django Forms / ModelForms",
      "S13: Proteksi Otomatis Keamanan Form Terhadap Serangan via Tag Template {% csrf_token %}",
      "S14: Sistem Otentikasi Bawaan User Django (User model, login, logout, decorator @login_required)"
    ],
    hard: [
      "S15: Transisi ke Class-Based Views (CBV) untuk Kode yang Lebih Reusable (ListView, DetailView, CreateView)",
      "S16: Pemetaan Relasi Database Tingkat Lanjut: ForeignKey, OneToOneField, ManyToManyField",
      "S17: Pengenalan Pembuatan REST API Menggunakan Framework Eksternal: Django REST Framework (DRF)",
      "S18: Membuat Lapisan Transformasi Data JSON Menggunakan DRF Serializers Class (serializers.ModelSerializer)",
      "S19: Implementasi API Controller Menggunakan DRF API Views (@api_view, APIView, ModelViewSet)",
      "S20: Mengamankan Endpoint API Menggunakan DRF Token Authentication / JWT & Mengatur Custom Permissions",
      "S21: Intercept Alur Request-Response Django Menggunakan Custom Middleware Python Classes"
    ]
  }
};

// Handcrafted custom curated S1 challenges definitions mapped to their original keys
const curatedS1Challenges: Record<string, Omit<Challenge, "id" | "index" | "technology" | "techIcon">> = {
  "JavaScript": {
    difficulty: "Easy",
    subChapter: "S1: Variabel Modern (let vs const)",
    title: "Reverse a String",
    description: `### Reverse a String (S1: Variabel Modern)
Tulis sebuah fungsi bernama \`reverseString(str)\` yang menerima argument berupa sebuah string, dan mengembalikan string tersebut dalam keadaan terbalik.

#### Contoh Penggunaan:
\`\`\`javascript
reverseString("indonesia") // -> "aisenodni"
reverseString("hello")     // -> "olleh"
\`\`\`

#### Kriteria Penilaian:
- Fungsi harus mengembalikan string terbalik yang benar.
- Harus menangani string kosong (\`""\`).`,
    boilerplate: `function reverseString(str) {
  // Tulis kode Anda di bawah ini
  
}`,
    testCases: [
      { id: "1", inputDescription: '"indonesia"', expectedOutput: '"aisenodni"' },
      { id: "2", inputDescription: '"hello"', expectedOutput: '"olleh"' },
      { id: "3", inputDescription: '""', expectedOutput: '""' }
    ]
  },
  "TypeScript": {
    difficulty: "Easy",
    subChapter: "S1: Instalasi & Konfigurasi tsconfig.json",
    title: "User Profile Interface",
    description: `### User Profile Interface (S1: TS Interface)
Tulis sebuah interface bernama \`UserProfile\` yang memiliki properti:
- \`name\`: string
- \`age\`: number
- \`isActive\`: boolean

Lalu buat fungsi generic bernama \`createUser(profile: UserProfile)\` yang memvalidasi dan mengembalikan data profil tersebut.

#### Contoh Penggunaan:
\`\`\`typescript
const user: UserProfile = { name: "Alvin", age: 21, isActive: true };
createUser(user); // -> { name: "Alvin", age: 21, isActive: true }
\`\`\`

#### Kriteria Penilaian:
- Menegakkan tipe-tipe data yang valid secara static.
- Properti wajib ada serta mengembalikan profile dengan presisi.`,
    boilerplate: `interface UserProfile {
  name: string;
  age: number;
  isActive: boolean;
}

function createUser(profile: UserProfile): UserProfile {
  // Tulis kode Anda di bawah ini
  return profile;
}`,
    testCases: [
      { id: "1", inputDescription: "{ name: 'Alvin', age: 21, isActive: true }", expectedOutput: "{ name: 'Alvin', age: 21, isActive: true }" }
    ]
  },
  "Python": {
    difficulty: "Easy",
    subChapter: "S1: Aturan Indentasi & Komentar",
    title: "Filter Positive Numbers",
    description: `### Filter Positive Numbers (S1: Indentasi & List)
Tulis sebuah fungsi bernama \`filter_positives(nums)\` di Python yang mengambil list bilangan bulat dan mengembalikan list baru berisi hanya bilangan positif (lebih besar dari 0) menggunakan list comprehension.

#### Contoh Penggunaan:
\`\`\`python
filter_positives([-2, 3, 0, 5, -1])  # -> [3, 5]
\`\`\`

#### Kriteria Penilaian:
- Mengembalikan persis list of positive integers.
- Menggunakan list comprehension ala Python yang elegan.`,
    boilerplate: `def filter_positives(nums):
    # Tulis kode Anda dengan list comprehension di bawah ini
    return [x for x in nums if x > 0]`,
    testCases: [
      { id: "1", inputDescription: "[-2, 3, 0, 5, -1]", expectedOutput: "[3, 5]" }
    ]
  },
  "Go": {
    difficulty: "Easy",
    subChapter: "S1: Struktur Package & Fungsi main()",
    title: "Simple Hello in Go",
    description: `### Simple Hello in Go (S1: Package Structure)
Tulis fungsi bernama \`Greet(name string) string\` di Go yang menggabungkan nama dengan prefiks "Hello, " dan mengembalikannya ke pemanggil.

#### Contoh Penggunaan:
\`\`\`go
Greet("Samuel") // -> "Hello, Samuel"
\`\`\`

#### Kriteria Penilaian:
- Mengembalikan string gabungan yang tepat.
- Menangani parameter kosong dengan mengembalikan "Hello, Guest".`,
    boilerplate: `package main

func Greet(name string) string {
    if name == "" {
        return "Hello, Guest"
    }
    return "Hello, " + name
}`,
    testCases: [
      { id: "1", inputDescription: '"Samuel"', expectedOutput: '"Hello, Samuel"' },
      { id: "2", inputDescription: '""', expectedOutput: '"Hello, Guest"' }
    ]
  },
  "Rust": {
    difficulty: "Easy",
    subChapter: "S1: Struktur Project Cargo",
    title: "Double Vector Elements",
    description: `### Double Vector Elements (S1: Rust Ownership)
Implementasikan fungsi Rust bernama \`double_vec(val: Vec<i32>) -> Vec<i32>\` yang menerima kepemilikan (ownership) dari Vector integer, mengalikan dua setiap elemen, dan mengembalikan Vector tersebut kembali.

#### Contoh Penggunaan:
\`\`\`rust
double_vec(vec![1, 2, 3]) // -> [2, 4, 6]
\`\`\`

#### Kriteria Penilaian:
- Mengalikan semua integer di dalam Vector.
- Mentaati aturan ownership dan borrowing memori Rust dengan benar.`,
    boilerplate: `pub fn double_vec(val: Vec<i32>) -> Vec<i32> {
    val.into_iter().map(|x| x * 2).collect()
}`,
    testCases: [
      { id: "1", inputDescription: "vec![1, 2, 3]", expectedOutput: "vec![2, 4, 6]" }
    ]
  },
  "C++": {
    difficulty: "Easy",
    subChapter: "S1: Struktur Kode Minimalis",
    title: "Value Swapper Using References",
    description: `### Value Swapper C++ (S1: CPP Reference Swaps)
Tulis sebuah fungsi di C++ bernama \`valSwap(int& a, int& b)\` untuk menukar nilai dari dua buah referensi variabel tanpa menggunakan fungsi library standar swap.

#### Contoh Penggunaan:
\`\`\`cpp
int x = 5, y = 10;
valSwap(x, y); // Sekarang x = 10, y = 5
\`\`\`

#### Kriteria Penilaian:
- Nilai dari kedua variabel bertukar secara efektif pada memori aslinya.`,
    boilerplate: `void valSwap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}`,
    testCases: [
      { id: "1", inputDescription: "a=5, b=10", expectedOutput: "a=10, b=5" }
    ]
  },
  "Java": {
    difficulty: "Easy",
    subChapter: "S1: Struktur Kelas Java",
    title: "Java StringBuilder Sentence Maker",
    description: `### StringBuilder Sentence Maker (S1: JVM String Maker)
Tulis method di Java bernama \`public String buildSentence(String[] words)\` menggunakan StringBuilder untuk merangkai list kata ke dalam sebuah satu kalimat utuh dengan pemisah karakter spasi.

#### Contoh Penggunaan:
\`\`\`java
buildSentence(new String[]{"I", "love", "coding"}) // -> "I love coding"
\`\`\`

#### Kriteria Penilaian:
- Merangkai kumpulan kata dengan spasi yang rapi.
- Tanpa trailing space di ujung kalimat.`,
    boilerplate: `public class Solution {
    public String buildSentence(String[] words) {
        if (words == null || words.length == 0) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            sb.append(words[i]);
            if (i < words.length - 1) sb.append(" ");
        }
        return sb.toString();
    }
}`,
    testCases: [
      { id: "1", inputDescription: "['I', 'love', 'coding']", expectedOutput: '"I love coding"' }
    ]
  },
  "Ruby": {
    difficulty: "Easy",
    subChapter: "S1: Sintaks Interaktif IRB",
    title: "Filter Odd Elements",
    description: `### Filter Odd Elements (S1: Ruby Block Filtering)
Buat sebuah method di Ruby bernama \`filter_odd(arr)\` yang menyaring bilangan ganjil keluar dari array, mengembalikan deret angka genap saja.

#### Contoh Penggunaan:
\`\`\`ruby
filter_odd([1, 2, 3, 4, 5]) # -> [2, 4]
\`\`\`

#### Kriteria Penilaian:
- Mengembalikan array berisi elemen genap saja.`,
    boilerplate: `def filter_odd(arr)
  arr.select { |num| num.even? }
end`,
    testCases: [
      { id: "1", inputDescription: "[1, 2, 3, 4, 5]", expectedOutput: "[2, 4]" }
    ]
  },
  "PHP": {
    difficulty: "Easy",
    subChapter: "S1: Tag Sintaks PHP",
    title: "Find Country Capital",
    description: `### PHP Country Capital Map (S1: Associative Mapping)
Lengkapi fungsi PHP \`getCapitalCity($country)\` yang memetakan nama negara ke ibukotanya berdasarkan associative array bawaan.

#### Contoh Penggunaan:
\`\`\`php
getCapitalCity("Indonesia") // -> "Jakarta"
getCapitalCity("Malaysia")  // -> "Kuala Lumpur"
\`\`\`

#### Kriteria Penilaian:
- Mengembalikan nama ibukota yang benar sesuai database internal fungsi.`,
    boilerplate: `function getCapitalCity($country) {
    $capitals = [
        "Indonesia" => "Jakarta",
        "Malaysia" => "Kuala Lumpur",
        "Jepang" => "Tokyo"
    ];
    return $capitals[$country] ?? "Unknown";
}`,
    testCases: [
      { id: "1", inputDescription: '"Indonesia"', expectedOutput: '"Jakarta"' }
    ]
  },
  "Swift": {
    difficulty: "Easy",
    subChapter: "S1: Konstanta & Variabel",
    title: "Optional Age Unwrapper",
    description: `### Optional Swift Unwrapper (S1: Safe Optionals)
Tulis fungsi Swift bernama \`parseAge(_ birthYear: Int?) -> String\` yang secara aman membuka optional \`birthYear\`. Jika berharga nil, kembalikan "Invalid Year". Jika ada, hitung umur berdasarkan tahun 2026.

#### Contoh Penggunaan:
\`\`\`swift
parseAge(1995) // -> "Age is 31"
parseAge(nil)  // -> "Invalid Year"
\`\`\`

#### Kriteria Penilaian:
- Menggunakan safety binding (guard let / if let) Swift dengan tepat.`,
    boilerplate: `func parseAge(_ birthYear: Int?) -> String {
    guard let year = birthYear else {
        return "Invalid Year"
    }
    return "Age is \\(2026 - year)"
}`,
    testCases: [
      { id: "1", inputDescription: "1995", expectedOutput: '"Age is 31"' },
      { id: "2", inputDescription: "nil", expectedOutput: '"Invalid Year"' }
    ]
  },
  "Kotlin": {
    difficulty: "Easy",
    subChapter: "S1: Deklarasi Variabel",
    title: "Kotlin Square Builder",
    description: `### Kotlin Null-Safe Square Builder (S1: Null Safety)
Buat fungsi Kotlin bernama \`squareNum(num: Int?): Int\` yang memproses angka kuadrat. Jika argument yang dikirimkan bernilai null, gunakan nilai fallback default yaitu 0.

#### Contoh Penggunaan:
\`\`\`kotlin
squareNum(4)    // -> 16
squareNum(null) // -> 0
\`\`\`

#### Kriteria Penilaian:
- Berhasil mengecek null-safety secara optimal didukung Elvis Operator (?:).`,
    boilerplate: `fun squareNum(num: Int?): Int {
    val base = num ?: 0
    return base * base
}`,
    testCases: [
      { id: "1", inputDescription: "4", expectedOutput: "16" },
      { id: "2", inputDescription: "null", expectedOutput: "0" }
    ]
  },
  "SQL SELECT Basic": {
    difficulty: "Easy",
    subChapter: "S1: Sintaks Dasar SELECT",
    title: "Filter High Salary Employees",
    description: `### SQL: Filter High Salary (S1: SELECT query)
Tulis query SQL mendasar untuk menyeleksi seluruh asisten admin atau karyawan yang memiliki gaji (\`salary\`) di atas 80,000 dari tabel \`employees\`.

#### Contoh Skema:
\`\`\`sql
-- employees: id, name, salary, department
\`\`\`

#### Kriteria Penilaian:
- Query SQL harus sintaksis terstandarisasi ANSI SQL: SELECT * FROM ...`,
    boilerplate: `SELECT * FROM employees WHERE salary > 80000;`,
    testCases: [
      { id: "1", inputDescription: "Schema employees [id, name, salary]", expectedOutput: "Filtered employees rows" }
    ]
  },
  "SQL Joins & Group": {
    difficulty: "Easy",
    subChapter: "S1: Pengenalan Relasi Tabel",
    title: "Combine Customers and Orders",
    description: `### SQL Joins and Aggregation (S1: Relation Joins)
Gabungkan tabel \`customers\` dengan tabel \`orders\` menggunakan \`customer_id\`. Dapatkan nama customer (\`customers.name\`) dan hitung seberapa banyak pesanan barang (\`COUNT(orders.id)\`) mereka.

#### Kriteria Penilaian:
- Menggunakan INNER JOIN yang tepat.
- Menambahkan klausa GROUP BY name untuk agregasi data.`,
    boilerplate: `SELECT customers.name, COUNT(orders.id) AS total_orders 
FROM customers 
INNER JOIN orders ON customers.id = orders.customer_id 
GROUP BY customers.name;`,
    testCases: [
      { id: "1", inputDescription: "Schema customers & orders", expectedOutput: "Customers order aggregates" }
    ]
  },
  "React": {
    difficulty: "Easy",
    subChapter: "S1: Pengenalan JSX & Aturan Penulisan",
    title: "Custom Counter Hooks",
    description: `### Custom React Hooks (S1: React JSX & Hooks)
Buat custom React hooks bernama \`useCounter(initialValue)\` yang memelihara state angka hitung secara lokal, mengembalikan sebuah objek berisi \`count\` (state) serta fungsi operator \`increment\` dan \`decrement\`.

#### Contoh Penggunaan:
\`\`\`jsx
const { count, increment, decrement } = useCounter(10);
\`\`\`

#### Kriteria Penilaian:
- Hook harus mengembalikan state count serta fungsi callback yang memanipulasinya dengan aman.`,
    boilerplate: `import { useState } from "react";

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  
  return { count, increment, decrement };
}`,
    testCases: [
      { id: "1", inputDescription: "initialValue = 10", expectedOutput: "{ count: 10, increment: [Function] }" }
    ]
  },
  "Vue": {
    difficulty: "Easy",
    subChapter: "S1: Pengenalan Vue App & Declarative Rendering",
    title: "Reactive Value Watcher",
    description: `### Vue Composition api (S1: Vue Decl Rendering)
Gunakan Vue 3 Composition API (\`ref\` dan \`computed\`) untuk mendefinisikan sebuah state reactive integer \`count\` dan sebuah computed property \`doubleCount\` yang selalu bernilai 2 kali lipat dari \`count\`.

#### Kriteria Penilaian:
- Berhasil merangkai reactivity system bawaan Vue secara fungsional.`,
    boilerplate: `import { ref, computed } from "vue";

export function useReactiveCounter(initial = 0) {
  const count = ref(initial);
  const doubleCount = computed(() => count.value * 2);
  
  return { count, doubleCount };
}`,
    testCases: [
      { id: "1", inputDescription: "ref val = 5", expectedOutput: "computed doubleCount = 10" }
    ]
  },
  "Next.js": {
    difficulty: "Easy",
    subChapter: "S1: Pengenalan Next.js & App Router File Tree",
    title: "Dynamic Metadata Resolver",
    description: `### Next.js Dynamic Metadata (S1: Next Router)
Tulis sebuah fungsi asinkronus \`generateMetadata({ params })\` pada lingkungan Next.js App Router yang menerima slug page pada \`params\` dan mengembalikan entitas metadata dengan title dinamis: "Showcasing - [slug]".

#### Kriteria Penilaian:
- Mengembalikan objek metadata valid dengan property target literal.`,
    boilerplate: `export async function generateMetadata({ params }) {
  const slug = params?.slug || "Default";
  return {
    title: "Showcasing - " + slug,
    description: "Belajar Next.js dinamis"
  };
}`,
    testCases: [
      { id: "1", inputDescription: 'params { slug: "about" }', expectedOutput: 'title: "Showcasing - about"' }
    ]
  },
  "Svelte": {
    difficulty: "Easy",
    subChapter: "S1: Dasar Template Svelte & Ekspresi Dinamis",
    title: "Svelte Reactive Statement",
    description: `### Svelte $: Reactive Double (S1: Svelte Template)
Tulis deklarasi reaktif Svelte menggunakan operator dollar (\`$:\`) untuk melacak status variabel reaktif \`count\` demi mengupdate nilai \`double\` agar terus sebanding dengan \`count * 2\`.

#### Kriteria Penilaian:
- Sintaksis linear reactive sesuai aturan compiler modular Svelte.`,
    boilerplate: `<script>
  export let count = 0;
  $: double = count * 2;
</script>

<p>Double: {double}</p>`,
    testCases: [
      { id: "1", inputDescription: "count = 50", expectedOutput: "double = 100" }
    ]
  },
  "Express.js": {
    difficulty: "Easy",
    subChapter: "S1: Inisialisasi Project Node.js & Express",
    title: "Hello Express JSON Endpoint",
    description: `### Express API Routing (S1: Express Greet router)
Tulis sebuah callback router handler di Express.js untuk path \`GET /api/greet\` yang merespon client dengan status HTTP 200 dan mengembalikan response JSON: \`{"message": "Welcome to CodeLabs"}\`.

#### Kriteria Penilaian:
- Berhasil mengirimkan JSON payload dengan format yang diminta.`,
    boilerplate: `const express = require("express");
const router = express.Router();

router.get("/greet", (req, res) => {
  res.status(200).json({ message: "Welcome to CodeLabs" });
});

module.exports = router;`,
    testCases: [
      { id: "1", inputDescription: "GET /api/greet", expectedOutput: '{"message": "Welcome to CodeLabs"}' }
    ]
  },
  "Laravel": {
    difficulty: "Easy",
    subChapter: "S1: Penjelajahan Struktur Folder Laravel",
    title: "Eloquent Active Scope",
    description: `### Eloquent Query Scope (S1: Laravel Paths)
Di dalam model User Laravel, tulis sebuah local query scope bernama \`scopeActive($query)\` untuk membatasi pemanggilan data SQL agar menyaring baris user yang memiliki status 'active'.

#### Contoh Penggunaan:
\`\`\`php
User::active()->get();
\`\`\``,
    boilerplate: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class User extends Model {
    public function scopeActive($query) {
        return $query->where('status', 'active');
    }
}`,
    testCases: [
      { id: "1", inputDescription: "User::active()->get()", expectedOutput: "Filtered active user models" }
    ]
  },
  "Django": {
    difficulty: "Easy",
    subChapter: "S1: Instalasi & Membuat Project Baru django-admin",
    title: "Django Render Book Context",
    description: `### Django MVC Model-View View (S1: Django installation)
Tulis sebuah Python view handler di Django bernama \`book_list(request)\` yang menarik data dan mengunduh Template "books.html" lengkap dengan dictionary context berisi parameter key bernama "books" dengan value array kosong.

#### Kriteria Penilaian:
- Menggunakan fungsi rendering standard dengan custom context dictionary.`,
    boilerplate: `from django.shortcuts import render

def book_list(request):
    context = {
        "books": []
    }
    return render(request, "books.html", context)`,
    testCases: [
      { id: "1", inputDescription: "Request home page", expectedOutput: "Rendered books template with list" }
    ]
  }
};

// Help map standard original IDs for saved codes
const technologyToOriginalChallengeIdNum: Record<string, number> = {
  "JavaScript": 1,
  "TypeScript": 2,
  "Python": 3,
  "Go": 4,
  "Rust": 5,
  "C++": 6,
  "Java": 7,
  "Ruby": 8,
  "PHP": 9,
  "Swift": 10,
  "Kotlin": 11,
  "SQL SELECT Basic": 12,
  "SQL Joins & Group": 13,
  "React": 14,
  "Vue": 15,
  "Next.js": 16,
  "Svelte": 17,
  "Express.js": 18,
  "Laravel": 19,
  "Django": 20
};

// Get modern language boilerplate for generated chapters
function getLanguageBoilerplate(tech: string, subChapter: string): string {
  switch (tech) {
    case "JavaScript":
    case "TypeScript":
      return `// Sub-bab: ${subChapter}
// Implementasikan fungsionalitas / solusi terbaik Anda di bawah ini
function solveChallenge(input) {
  // Tulis kode program di sini
  return input;
}`;
    case "Python":
    case "Django":
      return `# Sub-bab: ${subChapter}
# Selesaikan tugas pembelajaran untuk menguji kasus uji

def solve_challenge(input_val):
    # Tulis kode program di sini
    return input_val`;
    case "Go":
      return `package main

import "fmt"

// Sub-bab: ${subChapter}
func SolveChallenge(input interface{}) interface{} {
    // Tulis kode program di sini
    return input
}`;
    case "Rust":
      return `// Sub-bab: ${subChapter}
pub fn solve_challenge<T>(input: T) -> T {
    // Tulis kode program di sini
    input
}`;
    case "C++":
      return `#include <iostream>
#include <string>

// Sub-bab: ${subChapter}
// Tulis solusi penyelesaian materi Anda di sini
void runSolution() {
    std::cout << "Materi Selesai!" << std::endl;
}`;
    case "Java":
      return `// Sub-bab: ${subChapter}
public class Solution {
    public Object solve(Object input) {
        // Tulis kode program Anda di sini
        return input;
    }
}`;
    case "Ruby":
      return `# Sub-bab: ${subChapter}
def solve_challenge(input)
  # Tulis kode program di sini
  input
end`;
    case "PHP":
    case "Laravel":
      return `<?php
// Sub-bab: ${subChapter}

function solveChallenge($input) {
    // Tulis kode program di sini
    return $input;
}`;
    case "Swift":
      return `// Sub-bab: ${subChapter}
func solveChallenge(_ input: Any) -> Any {
    // Tulis kode program di sini
    return input;
}`;
    case "Kotlin":
      return `// Sub-bab: ${subChapter}
fun solveChallenge(input: Any): Any {
    // Tulis kode program di sini
    return input
}`;
    case "SQL SELECT Basic":
    case "SQL Joins & Group":
      return `-- Sub-bab: ${subChapter}
-- Tulis query SQL terbaik Anda di bawah ini untuk menguji data
SELECT * FROM records;`;
    case "React":
      return `import React, { useState } from "react";

// Sub-bab: ${subChapter}
export default function CollegeModule() {
  const [data, setData] = useState("React Core");
  return (
    <div className="p-4 border rounded">
      <h4>{data} - Pembelajaran Terstruktur</h4>
    </div>
  );
}`;
    case "Vue":
      return `<script setup>
import { ref } from 'vue';

// Sub-bab: ${subChapter}
const status = ref("Vue Component Ready");
</script>

<template>
  <div class="vue-box">
    <p>{{ status }}</p>
  </div>
</template>`;
    case "Next.js":
      return `// Sub-bab: ${subChapter}
export default async function Page({ params }) {
  const slug = params?.slug || "module";
  return (
    <main className="container">
      <h1>Materi Belajar: ${subChapter}</h1>
    </main>
  );
}`;
    case "Svelte":
      return `<script>
  // Sub-bab: ${subChapter}
  export let progress = 100;
</script>

<div class="svelte-panel">
  <p>Svelte Engine Pro - Progress: {progress}%</p>
</div>`;
    case "Express.js":
      return `const express = require("express");
const router = express.Router();

// Sub-bab: ${subChapter}
router.get("/", (req, res) => {
  res.status(200).json({ status: "success", topic: "${subChapter}" });
});

module.exports = router;`;
    default:
      return `// Sub-bab: ${subChapter}
// Tulis solusi penyelesaian materi di bawah ini`;
  }
}

// Programmatic Generator to build the absolute complete LMS Challenges array
function compileAllChallenges(): Challenge[] {
  const compiledChallenges: Challenge[] = [];
  let globalIncrement = 1;

  for (const [techName, details] of Object.entries(rawSyllabus)) {
    const categoriesList = [
      { list: details.easy, difficulty: "Easy" as const },
      { list: details.medium, difficulty: "Medium" as const },
      { list: details.hard, difficulty: "Hard" as const }
    ];

    let overallTechIndex = 1;

    for (const cat of categoriesList) {
      for (const rawChap of cat.list) {
        const itemIndex = overallTechIndex;
        overallTechIndex++;

        // Determine unique, stable standard ID to support legacy progress state perfectly
        const isS1 = itemIndex === 1;
        const assignedId = isS1 
          ? `challenge-${technologyToOriginalChallengeIdNum[techName]}`
          : `challenge-${techName.toLowerCase().replace(/[^a-z0-9]/g, "")}-s${itemIndex}`;

        const parsedTitle = rawChap.replace(/^S\d+:\s*/, "");

        if (isS1 && curatedS1Challenges[techName]) {
          // Injection of fully handcrafted original curation details for S1
          const originalCurated = curatedS1Challenges[techName];
          compiledChallenges.push({
            id: assignedId,
            index: itemIndex,
            technology: techName,
            techIcon: details.icon,
            difficulty: originalCurated.difficulty,
            subChapter: rawChap,
            title: originalCurated.title,
            description: originalCurated.description,
            boilerplate: originalCurated.boilerplate,
            testCases: originalCurated.testCases
          });
        } else {
          // Automatic structural Generation of official curriculum syllabus subchapters
          const generatedDescription = `### ${parsedTitle} (${rawChap})
Selamat datang di sub-bab **${parsedTitle}** dari kurikulum resmi **${techName}** (${details.icon}) Tingkat **${cat.difficulty}**!

#### Deskripsi Studi Konsep:
Konsep **${parsedTitle}** merupakan salah satu pilar penting di ekosistem pengembangan **${techName}**. Memahami fungsionalitas dan logika aslinya membantu Anda menulis kode yang aman (safe), bebas bug, dan ramah lingkungan scale-up.

#### Tugas Pembelajaran Sandbox:
Tulis sebuah pemrograman fungsional, deklarasi model, controller, atau instruksi query di ${techName} yang menerapkan prinsip inti dari **${parsedTitle}** secara bersih dan efisien.

#### Kriteria Kelulusan:
- Sintaksis program valid, bersih, dan sesuai standar best-practice ${techName}.
- Tidak terdapat syntax error atau runtime crash pada baris logika program.
- Lolos validasi optimasi Big-O, pemetaan parameter, dan fungsional oleh AI Tutor Gemini!`;

          const generatedBoilerplate = getLanguageBoilerplate(techName, rawChap);

          compiledChallenges.push({
            id: assignedId,
            index: itemIndex,
            technology: techName,
            techIcon: details.icon,
            difficulty: cat.difficulty,
            subChapter: rawChap,
            title: parsedTitle,
            description: generatedDescription,
            boilerplate: generatedBoilerplate,
            testCases: [
              { id: "1", inputDescription: `Sintaks & Struktur ${parsedTitle}`, expectedOutput: "Kode berjalan optimal & lulus uji standard" }
            ]
          });
        }
        globalIncrement++;
      }
    }
  }

  return compiledChallenges;
}

export const challenges: Challenge[] = compileAllChallenges();
