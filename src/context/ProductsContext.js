'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllProducts, 
  getAllCategories, 
  getProductsByCategory as getProductsByCategoryFromDB,
  getFeaturedProducts as getFeaturedProductsFromDB,
  getDiscountedProducts as getDiscountedProductsFromDB,
  searchProducts as searchProductsFromDB,
  getProductById as getProductByIdFromDB,
  getCategoryById as getCategoryByIdFromDB
} from '@/lib/productService';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // İlk yüklemede tüm verileri çek
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      setProducts(productsData);
      // Kategorileri order alanına göre sırala (küçükten büyüğe)
      const sortedCategories = categoriesData.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
      setCategories(sortedCategories);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verileri yenile
  const refreshData = () => {
    loadData();
  };

  // ID ile ürün getir (önce cache'den, yoksa Firebase'den)
  const getProductById = async (id) => {
    // Önce mevcut listeden bak
    const cached = products.find(p => p.id === id);
    if (cached) return cached;
    
    // Yoksa Firebase'den çek
    return await getProductByIdFromDB(id);
  };

  // Kategoriye göre ürünleri getir
  const getProductsByCategory = (categoryId) => {
    const decodedId = decodeURIComponent(categoryId);
    const category = categories.find(c => c.categoryId === decodedId || c.categoryId === categoryId);
    if (category?.productCategoryId) {
      return products.filter(p => p.category === category.productCategoryId && p.price > 0);
    }
    return products.filter(p => (p.category === decodedId || p.category === categoryId) && p.price > 0);
  };

  // Öne çıkan ürünleri getir (featured veya homepageSections'da 'featured' olanlar)
  const getFeaturedProducts = () => {
    const featured = products.filter(p => 
      p.featured === true || 
      (p.homepageSections && p.homepageSections.includes('featured'))
    );
    // Sıralamaya göre sırala
    return featured.sort((a, b) => {
      const orderA = a.homepageSectionOrder?.['featured'] ?? 999;
      const orderB = b.homepageSectionOrder?.['featured'] ?? 999;
      return orderA - orderB;
    });
  };

  // Okul alışverişi ürünlerini getir
  const getSchoolShoppingProducts = () => {
    const school = products.filter(p => 
      p.homepageSections && p.homepageSections.includes('school')
    );
    // Sıralamaya göre sırala
    return school.sort((a, b) => {
      const orderA = a.homepageSectionOrder?.['school'] ?? 999;
      const orderB = b.homepageSectionOrder?.['school'] ?? 999;
      return orderA - orderB;
    });
  };

  // En çok favorilenen ürünleri getir
  const getMostFavoritedProducts = () => {
    const favorites = products.filter(p => 
      p.homepageSections && p.homepageSections.includes('favorites')
    );
    // Sıralamaya göre sırala
    return favorites.sort((a, b) => {
      const orderA = a.homepageSectionOrder?.['favorites'] ?? 999;
      const orderB = b.homepageSectionOrder?.['favorites'] ?? 999;
      return orderA - orderB;
    });
  };

  // Sizin için seçtiklerimiz ürünlerini getir
  const getSelectedForYouProducts = () => {
    const selected = products.filter(p => 
      p.homepageSections && p.homepageSections.includes('selected')
    );
    // Sıralamaya göre sırala
    return selected.sort((a, b) => {
      const orderA = a.homepageSectionOrder?.['selected'] ?? 999;
      const orderB = b.homepageSectionOrder?.['selected'] ?? 999;
      return orderA - orderB;
    });
  };

  // Belirli bir bölümdeki ürünleri getir
  const getProductsBySection = (sectionId) => {
    return products.filter(p => 
      p.homepageSections && p.homepageSections.includes(sectionId)
    );
  };

  // İndirimli ürünleri getir
  const getDiscountedProducts = (minDiscount = 10) => {
    return products
      .filter(p => p.discount && p.discount >= minDiscount)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
  };

  // Türkçe karakter normalizasyonu
  const normalizeTurkish = (str) => {
    if (!str) return '';
    return str.toLowerCase()
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u')
      .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
      .replace(/İ/g, 'i').replace(/Ö/g, 'o').replace(/Ü/g, 'u')
      .replace(/Ş/g, 's').replace(/Ç/g, 'c').replace(/Ğ/g, 'g');
  };

  // Ürün ara
  const searchProducts = (query) => {
    if (!query || query.trim().length === 0) return [];

    const normalizedQuery = normalizeTurkish(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length >= 1);
    if (queryWords.length === 0) return [];

    const categoryNameMap = {};
    categories.forEach(c => {
      categoryNameMap[c.categoryId] = c.name;
    });

    return products.filter(product => {
      const catName = categoryNameMap[product.category] || '';
      const searchableText = normalizeTurkish(
        `${product.name || ''} ${product.description || ''} ${(product.category || '').replace(/-/g, ' ')} ${catName}`
      );

      return queryWords.every(word => {
        const stem = word.length > 4 ? word.substring(0, 4) : word;
        return searchableText.includes(stem);
      });
    });
  };

  // Kategori getir - categoryId veya document id ile ara
  const getCategoryById = (categoryId) => {
    // Decode URL encoded characters
    const decodedId = decodeURIComponent(categoryId);
    
    return categories.find(c => 
      c.categoryId === decodedId || 
      c.categoryId === categoryId ||
      c.id === decodedId ||
      c.id === categoryId
    );
  };

  const value = {
    products,
    categories,
    isLoading,
    error,
    refreshData,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getSchoolShoppingProducts,
    getMostFavoritedProducts,
    getSelectedForYouProducts,
    getProductsBySection,
    getDiscountedProducts,
    searchProducts,
    getCategoryById
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
