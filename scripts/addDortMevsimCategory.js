const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function addCategory() {
  console.log('📂 Dört Mevsim Lastikleri kategorisi ekleniyor...\n');
  
  try {
    const categoryData = {
      categoryId: 'dört-mevsim-lastikler',
      name: 'Dört Mevsim Lastikleri',
      icon: '🔄',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      description: 'Her mevsim güvenli sürüş için 4 mevsim lastikler',
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Use categoryId as document ID
    await setDoc(doc(db, 'categories', 'dört-mevsim-lastikler'), categoryData);
    
    console.log('✅ Kategori başarıyla eklendi!');
    console.log(`   - categoryId: ${categoryData.categoryId}`);
    console.log(`   - name: ${categoryData.name}`);
    console.log(`   - icon: ${categoryData.icon}`);
    console.log(`   - order: ${categoryData.order}`);
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  process.exit(0);
}

addCategory();
