const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAVMKGNVAodmoF8voVG4VKEgF98UMtasig",
  authDomain: "lastikalsana-da880.firebaseapp.com",
  projectId: "lastikalsana-da880",
  storageBucket: "lastikalsana-da880.firebasestorage.app",
  messagingSenderId: "406529038310",
  appId: "1:406529038310:web:485655f7d0279e25a52827",
  measurementId: "G-Q6SCJDZEMQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function replaceCategory() {
  console.log('Kategori degisikligi yapiliyor...\n');
  console.log('SADECE categories collection - products\'a DOKUNULMUYOR!\n');

  try {
    // 1. is-makinesi-lastikleri kategorisini sil
    console.log('is-makinesi-lastikleri siliniyor...');
    await deleteDoc(doc(db, 'categories', 'is-makinesi-lastikleri'));
    console.log('is-makinesi-lastikleri silindi\n');

    // 2. earac-lastikleri kategorisini ekle
    console.log('earac-lastikleri ekleniyor...');
    const newCategory = {
      categoryId: 'earac-lastikleri',
      name: 'Elektrikli Arac Lastikleri',
      description: 'Elektrikli araclar icin ozel uretilmis dusuk yuvarlanma direncli lastikler',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600',
      order: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'categories', 'earac-lastikleri'), newCategory);
    console.log('earac-lastikleri eklendi\n');

    console.log('Islem tamamlandi!');
    console.log('Silinen: is-makinesi-lastikleri');
    console.log('Eklenen: earac-lastikleri (Elektrikli Arac Lastikleri)');
  } catch (error) {
    console.error('Hata:', error);
  }

  process.exit(0);
}

replaceCategory();
