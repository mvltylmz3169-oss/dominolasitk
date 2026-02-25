const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

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

const DRY_RUN = process.argv.includes('--dry-run');

async function fixJantPrices() {
  console.log(DRY_RUN ? '=== DRY RUN - SADECE LISTELEME ===' : '=== GUNCELLEME MODU ===');
  console.log('Hedef: category === "jant" VE price === 0');
  console.log('Islem: price alanini 6000-9000 arasi random deger ile guncelle');
  console.log('UYARI: Sadece price alani degistirilecek, baska hicbir alan DOKUNULMAYACAK\n');

  try {
    const q = query(collection(db, 'products'), where('category', '==', 'jant'));
    const snapshot = await getDocs(q);

    console.log(`Toplam "jant" kategorisinde ${snapshot.size} urun bulundu.\n`);

    const zeroPriceProducts = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.price === 0 || data.price === '0' || !data.price) {
        zeroPriceProducts.push({ id: docSnap.id, name: data.name, price: data.price });
      }
    });

    if (zeroPriceProducts.length === 0) {
      console.log('Fiyati 0 olan jant urunu BULUNAMADI. Islem yapilmasina gerek yok.');
      process.exit(0);
      return;
    }

    console.log(`Fiyati 0 olan ${zeroPriceProducts.length} urun bulundu:\n`);

    for (const product of zeroPriceProducts) {
      const newPrice = Math.floor(Math.random() * (9000 - 6000 + 1)) + 6000;

      console.log(`  ID: ${product.id}`);
      console.log(`  Ad: ${product.name}`);
      console.log(`  Mevcut fiyat: ${product.price}`);
      console.log(`  Yeni fiyat: ${newPrice} TL`);

      if (!DRY_RUN) {
        await updateDoc(doc(db, 'products', product.id), { price: newPrice });
        console.log(`  >>> GUNCELLENDI`);
      } else {
        console.log(`  >>> (dry run - degisiklik yapilmadi)`);
      }
      console.log('');
    }

    console.log('---');
    console.log(`Toplam: ${zeroPriceProducts.length} urun ${DRY_RUN ? 'guncellenecek (dry run)' : 'guncellendi'}`);
  } catch (error) {
    console.error('HATA:', error);
  }

  process.exit(0);
}

fixJantPrices();
