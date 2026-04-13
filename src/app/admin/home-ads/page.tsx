"use client";

import React, { useState, useEffect } from "react";
import { 
    Video, 
    Plus, 
    Pencil, 
    Trash2, 
    Upload, 
    X, 
    Filter,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { api, getMediaUrl } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function AdminHomeAdsPage() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        title: "",
        subtitle: "",
        video_url: "",
        link_url: "",
        link_text: "Explore Collection",
        category_id: "",
        gender_id: "",
        occasion_id: "",
        is_active: true,
        order_index: 0
    });
    const [uploading, setUploading] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [genders, setGenders] = useState<any[]>([]);
    const [occasions, setOccasions] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [adsRes, categoriesRes, gendersRes, occasionsRes] = await Promise.all([
                api.adminGetHomeAds(),
                api.getCategories({ limit: 100 }),
                api.getGenders(),
                api.getOccasions()
            ]);

            if (adsRes.success) setAds(adsRes.data);
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

    const handleOpenModal = (ad: any = null) => {
        if (ad) {
            setEditingAd(ad);
            setFormData({
                title: ad.title || "",
                subtitle: ad.subtitle || "",
                video_url: ad.video_url || "",
                link_url: ad.link_url || "",
                link_text: ad.link_text || "Explore Collection",
                category_id: ad.category_id || "",
                gender_id: ad.gender_id || "",
                occasion_id: ad.occasion_id || "",
                is_active: ad.is_active,
                order_index: ad.order_index || 0
            });
        } else {
            setEditingAd(null);
            setFormData({
                title: "",
                subtitle: "",
                video_url: "",
                link_url: "",
                link_text: "Explore Collection",
                category_id: "",
                gender_id: "",
                occasion_id: "",
                is_active: true,
                order_index: ads.length
            });
        }
        setIsModalOpen(true);
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await api.uploadHomeAdVideo(file);
            if (res.success) {
                setFormData({ ...formData, video_url: res.data.url });
                toast.success("Video uploaded successfully");
            }
        } catch (error) {
            toast.error("Failed to upload video");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.video_url) {
            toast.error("Video is required");
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                category_id: formData.category_id || null,
                gender_id: formData.gender_id || null,
                occasion_id: formData.occasion_id || null,
            };

            let res;
            if (editingAd) {
                res = await api.adminUpdateHomeAd(editingAd.id, dataToSubmit);
            } else {
                res = await api.adminCreateHomeAd(dataToSubmit);
            }

            if (res.success) {
                toast.success(editingAd ? "Ad Card updated" : "Ad Card created");
                setIsModalOpen(false);
                fetchData();
            }
        } catch (error) {
            toast.error("Failed to save ad card");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this video ad card?")) return;
        try {
            const res = await api.adminDeleteHomeAd(id);
            if (res.success) {
                toast.success("Ad Card deleted");
                setAds(ads.filter(a => a.id !== id));
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
                        <h1 className="text-3xl font-bold text-[#1E2856] tracking-tight">Home Video Ad Cards</h1>
                        <p className="text-gray-500 mt-1">Manage premium video cards for the homepage ad section</p>
                    </div>
                    
                    <Button 
                        onClick={() => handleOpenModal()} 
                        className="bg-[#1E2856] text-white hover:bg-[#1E2856]/90 rounded-2xl px-6 py-6 shadow-lg shadow-[#1E2856]/20 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add New Card
                    </Button>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#1E2856]" />
                        <p className="font-medium">Loading ad cards...</p>
                    </div>
                ) : ads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ads.map((ad) => (
                            <div key={ad.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500 relative">
                                <div className="aspect-[4/5] relative">
                                    <video 
                                        src={getMediaUrl(ad.video_url)} 
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        onMouseOver={(e) => e.currentTarget.play()}
                                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-1">{ad.subtitle}</p>
                                        <h3 className="text-2xl font-serif mb-2">{ad.title}</h3>
                                        <div className="text-xs font-semibold uppercase border-b border-white/40 pb-1 w-fit">
                                            {ad.link_text}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenModal(ad)}
                                            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(ad.id)}
                                            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {!ad.is_active && (
                                        <div className="absolute top-4 left-4 bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            Inactive
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 py-32 flex flex-col items-center justify-center text-gray-400 gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <Video className="w-10 h-10 text-gray-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">No ad cards created yet</p>
                            <p className="mt-1">Add your first dynamic video ad card to show on the homepage</p>
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
                    <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-2xl font-bold text-[#1E2856]">{editingAd ? "Edit Ad Card" : "New Ad Card"}</h1>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                                        <input 
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium"
                                            placeholder="e.g., Signature Collection"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Subtitle</label>
                                        <input 
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium"
                                            placeholder="e.g., Brilliance in Motion"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Video Source</label>
                                    <div className="relative group/upload">
                                        <input 
                                            type="file" 
                                            accept="video/*" 
                                            onChange={handleVideoUpload}
                                            className="hidden" 
                                            id="video-upload"
                                        />
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <label 
                                                htmlFor="video-upload"
                                                className="flex-1 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1E2856] hover:bg-[#1E2856]/5 transition-all group"
                                            >
                                                {uploading ? (
                                                    <Loader2 className="w-8 h-8 animate-spin text-[#1E2856]" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#1E2856]" />
                                                )}
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-gray-900">Click to upload video</p>
                                                    <p className="text-xs text-gray-400 mt-1">MP4, WebM (Max 20MB recommended)</p>
                                                </div>
                                            </label>
                                            
                                            {formData.video_url && (
                                                <div className="w-full md:w-48 aspect-square rounded-3xl overflow-hidden bg-black relative">
                                                    <video src={getMediaUrl(formData.video_url)} className="w-full h-full object-cover" muted loop autoPlay />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                                                        <CheckCircle2 className="text-white w-8 h-8" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-[32px] space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Filter className="w-4 h-4 text-[#1E2856]" />
                                        <h3 className="text-sm font-bold text-[#1E2856] uppercase tracking-wider">Routing / Filters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Category</label>
                                            <select 
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                                className="w-full bg-white border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#1E2856]/10"
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
                                                className="w-full bg-white border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#1E2856]/10"
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
                                                className="w-full bg-white border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#1E2856]/10"
                                            >
                                                <option value="">No Occasion Filter</option>
                                                {occasions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Custom Link URL (Optional Override)</label>
                                        <input 
                                            value={formData.link_url}
                                            onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                                            className="w-full bg-white border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium text-sm"
                                            placeholder="e.g., /shop/new-arrivals"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Link Button Text</label>
                                        <input 
                                            value={formData.link_text}
                                            onChange={(e) => setFormData({...formData, link_text: e.target.value})}
                                            className="w-full bg-white border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#1E2856]/10 transition-all font-medium text-sm"
                                            placeholder="e.g., Explore Collection"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                                className="sr-only"
                                            />
                                            <div className={cn(
                                                "w-12 h-6 rounded-full transition-colors duration-300",
                                                formData.is_active ? "bg-green-500" : "bg-gray-300"
                                            )} />
                                            <div className={cn(
                                                "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300",
                                                formData.is_active ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">Display on website</span>
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 rounded-2xl h-14"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        className="flex-hard bg-[#1E2856] text-white hover:bg-[#1E2856]/90 rounded-2xl h-14 min-w-[200px] shadow-lg shadow-[#1E2856]/20 font-bold"
                                    >
                                        {editingAd ? "Update Card" : "Save Card"}
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
