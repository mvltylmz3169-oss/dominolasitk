const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

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

async function update() {
  console.log('motor-yaglari kategorisine productCategoryId ekleniyor...\n');

  try {
    await updateDoc(doc(db, 'categories', 'motor-yaglari'), {
      productCategoryId: 'motor-yaglari2',
      updatedAt: new Date()
    });

    console.log('motor-yaglari kategorisi guncellendi:');
    console.log('  productCategoryId: "motor-yaglari2"');
    console.log('\nProducts collectionina DOKUNULMADI.');
  } catch (error) {
    console.error('Hata:', error);
  }

  process.exit(0);
}

update();
