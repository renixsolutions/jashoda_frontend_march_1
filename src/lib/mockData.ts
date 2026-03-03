
export interface Product {
    id: string; // or number, but keeping string for flexibility as per prompt "idOrSlug"
    slug: string;
    name: string;
    price: number;
    price_label?: string;
    originalPrice?: number;
    category: string;
    categoryId: number;
    subcategory?: string;
    subcategoryId?: number;
    images: string[];
    discount_price?: string | number;
    badge?: string;
    rating: number;
    reviewCount: number;
    description: string;
    metalType: string;
    stoneType?: string;
    inStock: boolean;
    createdAt: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    image?: string;
    image_url?: string;
    status: "active" | "inactive";
    createdAt: string;
}

export interface Gender {
    id: number;
    name: string;
}

export const GENDERS: Gender[] = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Unisex" },
    { id: 4, name: "Kids" },
    { id: 5, name: "Couple" },
    { id: 6, name: "Other" },
];

export const CATEGORIES: Category[] = [
    { id: 1, name: "Rings", slug: "rings", parentId: null, status: "active", createdAt: "2023-01-01T00:00:00Z" },
    { id: 2, name: "Earrings", slug: "earrings", parentId: null, status: "active", createdAt: "2023-01-01T00:00:00Z" },
    { id: 3, name: "Necklaces", slug: "necklaces", parentId: null, status: "active", createdAt: "2023-01-01T00:00:00Z" },
    { id: 4, name: "Bracelets", slug: "bracelets", parentId: null, status: "active", createdAt: "2023-01-01T00:00:00Z" },
    { id: 5, name: "Solitaire Rings", slug: "solitaire-rings", parentId: 1, status: "active", createdAt: "2023-01-01T00:00:00Z" },
    { id: 6, name: "Stud Earrings", slug: "stud-earrings", parentId: 2, status: "active", createdAt: "2023-01-01T00:00:00Z" },
];

export const PRODUCTS: Product[] = [
    // Rings
    {
        id: "1",
        slug: "ethereal-diamond-ring",
        name: "Ethereal Diamond Ring",
        price: 15999,
        originalPrice: 18000,
        category: "Rings",
        categoryId: 1,
        subcategory: "Solitaire Rings",
        subcategoryId: 5,
        images: ["/luxury-product-thumb.png", "/sil1.png"],
        badge: "Best Seller",
        rating: 4.9,
        reviewCount: 120,
        description: "A stunning ethereal diamond ring that captures the essence of luxury.",
        metalType: "Gold",
        stoneType: "Diamond",
        inStock: true,
        createdAt: "2023-05-15T10:00:00Z",
    },
    {
        id: "6",
        slug: "pearl-stacking-ring",
        name: "Pearl Stacking Ring",
        price: 3500,
        category: "Rings",
        categoryId: 1,
        images: ["/sil1.png", "/luxury-product-thumb.png"],
        rating: 4.2,
        reviewCount: 45,
        description: "Elegant pearl stacking ring for a subtle yet sophisticated look.",
        metalType: "Silver",
        stoneType: "Pearl",
        inStock: true,
        createdAt: "2023-06-20T14:30:00Z",
    },
    {
        id: "9",
        slug: "solitaire-engagement-ring",
        name: "Solitaire Engagement Ring",
        price: 25000,
        originalPrice: 28000,
        category: "Rings",
        categoryId: 1,
        subcategory: "Solitaire Rings",
        subcategoryId: 5,
        images: ["/luxury-product-thumb.png", "/sil1.png"],
        badge: "Limited Stock",
        rating: 5.0,
        reviewCount: 89,
        description: "The perfect symbol of love, this solitaire engagement ring shines bright.",
        metalType: "Platinum",
        stoneType: "Diamond",
        inStock: true,
        createdAt: "2023-07-01T09:00:00Z",
    },

    // Earrings
    {
        id: "2",
        slug: "moonstone-drop-earrings",
        name: "Moonstone Drop Earrings",
        price: 8499,
        originalPrice: 9500,
        category: "Earrings",
        categoryId: 2,
        images: ["/sil1.png", "/luxury-product-thumb.png"],
        badge: "Best Seller",
        rating: 4.7,
        reviewCount: 200,
        description: "Mystical moonstone drop earrings that add a touch of magic to your outfit.",
        metalType: "Silver",
        stoneType: "Moonstone",
        inStock: true,
        createdAt: "2023-05-10T11:20:00Z",
    },
    {
        id: "7",
        slug: "geometric-studs",
        name: "Geometric Studs",
        price: 2800,
        category: "Earrings",
        categoryId: 2,
        subcategory: "Stud Earrings",
        subcategoryId: 6,
        images: ["/sil1.png"],
        rating: 4.0,
        reviewCount: 30,
        description: "Modern geometric studs for the contemporary minimalist.",
        metalType: "Silver",
        inStock: true,
        createdAt: "2023-08-05T16:45:00Z",
    },
    {
        id: "10",
        slug: "crystal-hoops",
        name: "Crystal Hoops",
        price: 5600,
        category: "Earrings",
        categoryId: 2,
        images: ["/luxury-product-thumb.png"],
        rating: 4.5,
        reviewCount: 65,
        description: "Sparkling crystal hoops that catch the light from every angle.",
        metalType: "Silver",
        stoneType: "Crystal",
        inStock: true,
        createdAt: "2023-09-12T13:15:00Z",
    },

    // Necklaces
    {
        id: "4",
        slug: "silver-pendant",
        name: "Silver Pendant",
        price: 9999,
        originalPrice: 12000,
        category: "Necklaces",
        categoryId: 3,
        images: ["/diamond-pendant.png", "/luxury-product-thumb.png"],
        badge: "Limited Stock",
        rating: 4.8,
        reviewCount: 95,
        description: "A classic silver pendant that never goes out of style.",
        metalType: "Silver",
        inStock: true,
        createdAt: "2023-04-25T10:30:00Z",
    },
    {
        id: "8",
        slug: "layered-chain-necklace",
        name: "Layered Chain Necklace",
        price: 11000,
        category: "Necklaces",
        categoryId: 3,
        images: ["/diamond-pendant.png"],
        rating: 4.3,
        reviewCount: 40,
        description: "Trendy layered chain necklace for a chic, textured look.",
        metalType: "Gold",
        inStock: true,
        createdAt: "2023-07-20T15:50:00Z",
    },

    // Bracelets
    {
        id: "3",
        slug: "silver-charm-bracelet",
        name: "Silver Charm Bracelet",
        price: 12500,
        originalPrice: 14000,
        category: "Bracelets",
        categoryId: 4,
        images: ["/diamond-bangle.png", "/sil1.png"],
        rating: 4.6,
        reviewCount: 150,
        description: "Charming silver bracelet with delicate details.",
        metalType: "Silver",
        inStock: true,
        createdAt: "2023-03-30T12:00:00Z",
    },
];
