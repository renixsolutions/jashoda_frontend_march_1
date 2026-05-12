"use client";

import React, { useState, useEffect } from "react";
import { 
    Image as ImageIcon, 
    Plus, 
    Pencil, 
    Trash2, 
    Save, 
    X, 
    Layout, 
    Link as LinkIcon, 
    Filter,
    Upload,
    Loader2,
    CheckCircle2,
    ChevronUp,
    ChevronDown,
    Layers
} from "lucide-react";
import { api, getMediaUrl } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        title: "",
        subtitle: "",
        brand_text: "",
        description: "",
        image_url: "",
        secondary_image_url: "",
        cta_text: "EXPLORE NOW",
        link_url: "",
        category_id: "",
        subcategory_id: "",
        gender_id: "",
        occasion_id: "",
        banner_type: "MAIN_HERO",
        bg_color: "",
        accent_color: "",
        is_active: true,
        order_index: 0
    });
    const [uploading, setUploading] = useState<string | null>(null);

    // Filter data
    const [categories, setCategories] = useState<any[]>([]);
    const [genders, setGenders] = useState<any[]>([]);
    const [occasions, setOccasions] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bannersRes, categoriesRes, gendersRes, occasionsRes] = await Promise.all([
                api.adminGetBanners(),
                api.getCategories({ limit: 100 }),
                api.getGenders(),
                api.getOccasions()
            ]);

            if (bannersRes.success) setBanners(bannersRes.data);
            if (categoriesRes.success) setCategories(categoriesRes.data);
            if (gendersRes.success) setGenders(gendersRes.data);
            if (occasionsRes.success) setOccasions(occasionsRes.data);
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (banner: any = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title || "",
                subtitle: banner.subtitle || "",
                brand_text: banner.brand_text || "",
                description: banner.description || "",
                image_url: banner.image_url || "",
                secondary_image_url: banner.secondary_image_url || "",
                cta_text: banner.cta_text || "EXPLORE NOW",
                link_url: banner.link_url || "",
                category_id: banner.category_id || "",
                subcategory_id: banner.subcategory_id || "",
                gender_id: banner.gender_id || "",
                occasion_id: banner.occasion_id || "",
                banner_type: banner.banner_type || "MAIN_HERO",
                bg_color: banner.bg_color || "",
                accent_color: banner.accent_color || "",
                is_active: banner.is_active,
                order_index: banner.order_index || 0
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: "",
                subtitle: "",
                brand_text: "",
                description: "",
                image_url: "",
                secondary_image_url: "",
                cta_text: "EXPLORE NOW",
                link_url: "",
                category_id: "",
                subcategory_id: "",
                gender_id: "",
                occasion_id: "",
                banner_type: "MAIN_HERO",
                bg_color: "",
                accent_color: "",
                is_active: true,
                order_index: banners.length
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(field);
        try {
            const res = await api.uploadMedia(file);
            if (res.success) {
                setFormData({ ...formData, [field]: res.data.url });
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setUploading(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.image_url) {
            toast.error("Primary image is required");
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                category_id: formData.category_id || null,
                subcategory_id: formData.subcategory_id || null,
                gender_id: formData.gender_id || null,
                occasion_id: formData.occasion_id || null,
            };

            let res;
            if (editingBanner) {
                res = await api.adminUpdateBanner(editingBanner.id, dataToSubmit);
            } else {
                res = await api.adminCreateBanner(dataToSubmit);
            }

            if (res.success) {
                toast.success(editingBanner ? "Banner updated" : "Banner created");
                setIsModalOpen(false);
                fetchData();
            }
        } catch (error) {
            toast.error("Failed to save banner");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this banner?")) return;
        try {
            const res = await api.adminDeleteBanner(id);
            if (res.success) {
                toast.success("Banner deleted");
                setBanners(banners.filter(b => b.id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E2856] tracking-tight">Hero & Promo Banners</h1>
                        <p className="text-gray-500 mt-1">Manage dynamic content for the main hero and promotional sections</p>
                    </div>
                    
                    <Button 
                        onClick={() => handleOpenModal()} 
                        className="bg-[#1E2856] text-white hover:bg-[#1E2856]/90 rounded-2xl px-6 py-6 shadow-lg shadow-[#1E2856]/20 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add New Banner
                    </Button>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#1E2856]" />
                        <p className="font-medium">Loading banners...</p>
                    </div>
                ) : banners.length > 0 ? (
                    <div className="space-y-12">
                        {/* Grouped by Type */}
                        {['MAIN_HERO', 'PROMO_CAROUSEL', 'MIDDLE_AD_BANNER'].map(type => {
                            const typeBanners = banners.filter(b => (b.banner_type || 'PROMO_CAROUSEL') === type);
                            if (typeBanners.length === 0) return null;

                            let sectionTitle = '';
                            if (type === 'MAIN_HERO') sectionTitle = 'Main Hero Banners (Top)';
                            else if (type === 'PROMO_CAROUSEL') sectionTitle = 'Promo Carousel Banners (Lower)';
                            else if (type === 'MIDDLE_AD_BANNER') sectionTitle = 'Middle Ad Banners (Curved)';

                            return (
                                <div key={type} className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 px-2">
                                        <Layers className="w-5 h-5 text-[#1E2856]" />
                                        {sectionTitle}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {typeBanners.map((banner) => (
                                            <div key={banner.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500 relative">
                                                <div className="aspect-[16/9] relative">
                                                    <img 
                                                        src={getMediaUrl(banner.image_url)} 
                                                        alt={banner.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1">{banner.brand_text || banner.subtitle}</p>
                                                        <h3 className="text-xl font-serif mb-1">{banner.title}</h3>
                                                    </div>
                                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleOpenModal(banner)}
                                                            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(banner.id)}
                                                            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {!banner.is_active && (
                                                        <div className="absolute top-4 left-4 bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                            Inactive
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex items-center justify-between">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Order: {banner.order_index}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {banner.category_id && <span title="Category Filter" className="w-2 h-2 rounded-full bg-blue-400" />}
                                                        {banner.gender_id && <span title="Gender Filter" className="w-2 h-2 rounded-full bg-pink-400" />}
                                                        {banner.occasion_id && <span title="Occasion Filter" className="w-2 h-2 rounded-full bg-yellow-400" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 py-32 flex flex-col items-center justify-center text-gray-400 gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-gray-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">No banners created yet</p>
                            <p className="mt-1">Add your first hero banner to show on the website</p>
                        </div>
                        <Button onClick={() => handleOpenModal()} variant="outline" className="rounded-full px-8 border-gray-200">
                             Get Started
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-2xl font-bold text-[#1E2856]">{editingBanner ? "Edit Banner" : "New Banner"}</h1>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Content */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Layout className="w-4 h-4 text-[#1E2856]" />
                                        <h3 className="text-sm font-bold text-[#1E2856] uppercase tracking-wider">Visual Content</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                                            <input 
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium"
                                                placeholder="e.g., Vedic Divinity"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Subtitle / Top Text</label>
                                            <input 
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium"
                                                placeholder="e.g., Temple Atelier"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Brand Label</label>
                                            <input 
                                                value={formData.brand_text}
                                                onChange={(e) => setFormData({...formData, brand_text: e.target.value})}
                                                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium"
                                                placeholder="e.g., Jashoda Originals"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Section Type</label>
                                            <select 
                                                value={formData.banner_type}
                                                onChange={(e) => setFormData({...formData, banner_type: e.target.value})}
                                                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium"
                                            >
                                                <option value="MAIN_HERO">Main Hero (Top)</option>
                                                <option value="PROMO_CAROUSEL">Promo Carousel (Lower)</option>
                                                <option value="MIDDLE_AD_BANNER">Middle Ad Banner (Curved)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                                        <textarea 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium min-h-[100px]"
                                            placeholder="Enter banner description..."
                                        />
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ImageIcon className="w-4 h-4 text-[#1E2856]" />
                                        <h3 className="text-sm font-bold text-[#1E2856] uppercase tracking-wider">Media</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Primary Image</label>
                                            <div className="relative group/upload">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleImageUpload(e, 'image_url')}
                                                    className="hidden" 
                                                    id="primary-image-upload"
                                                />
                                                <label 
                                                    htmlFor="primary-image-upload"
                                                    className="border-2 border-dashed border-gray-200 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1E2856] hover:bg-[#1E2856]/5 transition-all aspect-[16/9] overflow-hidden"
                                                >
                                                    {uploading === 'image_url' ? (
                                                        <Loader2 className="w-8 h-8 animate-spin text-[#1E2856]" />
                                                    ) : formData.image_url ? (
                                                        <img src={getMediaUrl(formData.image_url)} className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 text-gray-300" />
                                                            <div className="text-center">
                                                                <p className="text-xs font-bold text-gray-900">Upload primary image</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Secondary Image (Optional)</label>
                                            <div className="relative group/upload">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleImageUpload(e, 'secondary_image_url')}
                                                    className="hidden" 
                                                    id="secondary-image-upload"
                                                />
                                                <label 
                                                    htmlFor="secondary-image-upload"
                                                    className="border-2 border-dashed border-gray-200 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1E2856] hover:bg-[#1E2856]/5 transition-all aspect-[16/9] overflow-hidden"
                                                >
                                                    {uploading === 'secondary_image_url' ? (
                                                        <Loader2 className="w-8 h-8 animate-spin text-[#1E2856]" />
                                                    ) : formData.secondary_image_url ? (
                                                        <img src={getMediaUrl(formData.secondary_image_url)} className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 text-gray-300" />
                                                            <div className="text-center">
                                                                <p className="text-xs font-bold text-gray-900">Upload secondary image</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Routing */}
                                <div className="p-8 bg-gray-50 rounded-[40px] space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Filter className="w-4 h-4 text-[#1E2856]" />
                                        <h3 className="text-sm font-bold text-[#1E2856] uppercase tracking-wider">Routing / Filters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Category</label>
                                            <select 
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                                className="w-full bg-white border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#1E2856]/10"
                                            >
                                                <option value="">No Category Filter</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Gender</label>
                                            <select 
                                                value={formData.gender_id}
                                                onChange={(e) => setFormData({...formData, gender_id: e.target.value})}
                                                className="w-full bg-white border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#1E2856]/10"
                                            >
                                                <option value="">No Gender Filter</option>
                                                {genders.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Occasion</label>
                                            <select 
                                                value={formData.occasion_id}
                                                onChange={(e) => setFormData({...formData, occasion_id: e.target.value})}
                                                className="w-full bg-white border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#1E2856]/10"
                                            >
                                                <option value="">No Occasion Filter</option>
                                                {occasions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Custom CTA URL (Override)</label>
                                            <input 
                                                value={formData.link_url}
                                                onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                                                className="w-full bg-white border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#1E2856]/10"
                                                placeholder="/shop/new-arrivals"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">CTA Button Text</label>
                                        <input 
                                            value={formData.cta_text}
                                            onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                                            className="w-full bg-white border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium text-sm"
                                            placeholder="e.g., EXPLORE NOW"
                                        />
                                    </div>
                                </div>

                                {/* Settings */}
                                <div className="flex flex-col md:flex-row items-center gap-8 px-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                                className="sr-only"
                                            />
                                            <div className={cn(
                                                "w-14 h-7 rounded-full transition-colors duration-300",
                                                formData.is_active ? "bg-green-500" : "bg-gray-300"
                                            )} />
                                            <div className={cn(
                                                "absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-300",
                                                formData.is_active ? "translate-x-7" : "translate-x-0"
                                            )} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">Display on website</span>
                                    </label>

                                    <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-6 py-3 ml-auto">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Order Index</span>
                                        <input 
                                            type="number"
                                            value={formData.order_index}
                                            onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                                            className="w-12 bg-transparent text-center font-bold text-[#1E2856] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-gray-100">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 rounded-3xl h-16"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        className="flex-[2] bg-[#1E2856] text-white hover:bg-[#1E2856]/90 rounded-3xl h-16 shadow-lg shadow-[#1E2856]/20 font-bold"
                                    >
                                        {editingBanner ? "Update Banner" : "Save Banner"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
