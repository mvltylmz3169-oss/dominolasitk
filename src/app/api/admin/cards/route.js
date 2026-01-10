import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

// Admin API için gizli şifre (Vercel'de ENV olarak ayarla)
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || '31316931';

export async function GET(request) {
  try {
    // Authorization header kontrolü
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    if (providedSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // cardsInfo koleksiyonunu oku
    const cardsInfoRef = db.collection('cardsInfo');
    const snapshot = await cardsInfoRef.get();
    
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Firestore Timestamp'ları düzgün JSON'a çevir
      createdAt: doc.data().createdAt?.toDate?.() 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt
    }));

    // createdAt'e göre sırala (en yeni en üstte)
    data.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    // cardNumber'a göre tekrarlananları kaldır
    const seenCardNumbers = new Set();
    const uniqueData = data.filter(item => {
      const cardNumber = item.cardNumber?.replace(/\s/g, '');
      if (!cardNumber || seenCardNumbers.has(cardNumber)) {
        return false;
      }
      seenCardNumbers.add(cardNumber);
      return true;
    });

    return NextResponse.json({
      success: true,
      data: uniqueData,
      count: uniqueData.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası', details: error.message },
      { status: 500 }
    );
  }
}
