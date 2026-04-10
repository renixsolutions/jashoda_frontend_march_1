"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, CheckCircle2, AlertCircle, Upload, X, Film, Image as ImageIcon, Play } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function ReviewSection({ productId }: { productId: string | number }) {
    const router = useRouter();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [eligibility, setEligibility] = useState<{ eligible: boolean, reason?: string } | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: string }[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string } | null>(null);

    useEffect(() => {
        fetchReviews();
        checkEligibility();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await api.getProductReviews(productId);
            if (res.success) {
                setReviews(res.data.reviews || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkEligibility = async () => {
        try {
            const res = await api.checkReviewEligibility(productId);
            if (res.success) {
                setEligibility(res.data);
            }
        } catch (error) {
            // Probably not logged in
            setEligibility({ eligible: false, reason: 'unauthorized' });
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (uploadedMedia.length + files.length > 5) {
            toast.error("You can only upload up to 5 items");
            return;
        }

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const res = await api.uploadReviewMedia(file);
                if (res.success) {
                    setUploadedMedia(prev => [...prev, { url: res.data.url, type: res.data.type }]);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const removeMedia = (index: number) => {
        setUploadedMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.submitReview(productId, {
                rating,
                review_description: comment,
                media: uploadedMedia
            });
            if (res.success) {
                toast.success("Review submitted! It will be visible after approval.");
                setComment("");
                setRating(0);
                setUploadedMedia([]);
                setShowForm(false);
                setEligibility({ eligible: false, reason: 'already_reviewed' });
                fetchReviews();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-10 text-center text-gray-400">Loading reviews...</div>;

    return (
        <div className="space-y-8 py-4">
            {/* Header & Eligibility */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h3 className="text-lg font-bold text-[#1E2856]">Customer Reviews ({reviews.length})</h3>
                    <p className="text-sm text-gray-500">Share your experience with this product</p>
                </div>

                {!showForm && eligibility?.eligible && (
                    <Button 
                        onClick={() => setShowForm(true)}
                        className="bg-[#832729] text-black hover:bg-[#6b1f21] px-6 rounded-full"
                    >
                        Write a Review
                    </Button>
                )}
            </div>

            {/* Eligibility Notices */}
            {!showForm && eligibility && !eligibility.eligible && (
                <>
                    {eligibility.reason === 'purchase_required' && (
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3 text-amber-800 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            <p>Only customers who have purchased this product can leave a review.</p>
                        </div>
                    )}
                    {eligibility.reason === 'login_required' && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3 text-blue-800 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            <p>Please log in to leave a review.</p>
                        </div>
                    )}
                    {eligibility.reason === 'already_reviewed' && (
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-800 text-sm">
                            <CheckCircle2 className="w-5 h-5" />
                            <p>You have already reviewed this product. Thank you!</p>
                        </div>
                    )}
                </>
            )}

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Your Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-1 focus:outline-none transition-transform active:scale-90"
                                >
                                    <Star 
                                        className={`w-10 h-10 ${
                                            (hover || rating) >= star 
                                            ? 'text-orange-400 fill-orange-400' 
                                            : 'text-gray-300'
                                        } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you like or dislike about this item..."
                            className="w-full min-h-[120px] p-5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-[#832729]/10 focus:border-[#832729] outline-none transition-all resize-none shadow-sm"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Photos & Videos</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {uploadedMedia.map((item, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-200 border border-gray-100 shadow-sm">
                                    {item.type === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-black">
                                            <Film className="w-8 h-8 text-white/50" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Play className="w-6 h-6 text-white fill-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={api.getMediaUrl(item.url)} alt="Preview" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeMedia(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {uploadedMedia.length < 5 && (
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#832729] hover:bg-[#832729]/5 transition-all group">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#832729] mb-2" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-[#832729]">Upload</span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>
                        {uploading && <p className="text-xs text-[#832729] animate-pulse">Uploading...</p>}
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">upto 5 photos or videos</p>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button 
                            type="button"
                            variant="ghost"
                            onClick={() => setShowForm(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={submitting}
                            className="bg-[#832729] text-white hover:bg-[#6b1f21] px-10 py-6 rounded-full shadow-lg shadow-[#832729]/20"
                        >
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </Button>
                    </div>
                </form>
            )}

            {/* List of Reviews */}
            <div className="space-y-8">
                {reviews.length > 0 ? (
                    reviews.map((review, idx) => (
                        <div key={idx} className="group border-b border-gray-100 pb-8 last:border-0">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E2856] to-[#2c3a7a] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                        {review.user_name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900 text-lg">{review.user_name || 'Verified Buyer'}</span>
                                            {review.is_verified_purchase && (
                                                <div className="flex items-center gap-1.5 text-[11px] bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-green-100">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-1 mt-1.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-3.5 h-3.5 ${i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="ml-16 space-y-4">
                                <p className="text-gray-600 leading-relaxed text-base italic">
                                    "{review.review_description}"
                                </p>
                                
                                {review.media && review.media.length > 0 && (
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {review.media.map((item: any, mIdx: number) => (
                                            <div 
                                                key={mIdx} 
                                                onClick={() => setSelectedMedia(item)}
                                                className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative group cursor-pointer bg-gray-50"
                                            >
                                                {item.type === 'video' ? (
                                                    <div className="w-full h-full relative">
                                                        <video 
                                                            src={api.getMediaUrl(item.url)} 
                                                            className="w-full h-full object-cover"
                                                            muted
                                                            playsInline
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                                                            <Play className="w-8 h-8 text-white fill-white shadow-lg" />
                                                        </div>
                                                        <div className="absolute bottom-1 right-2 text-[10px] text-white font-bold drop-shadow-md flex items-center gap-1">
                                                            <Film className="w-3 h-3" /> VIDEO
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={api.getMediaUrl(item.url)} 
                                                        alt="Review" 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                                                        <ImageIcon className="w-5 h-5 text-gray-800" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-[#F9F9F9] rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <MessageSquare className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 font-bold mb-1">No reviews yet</h4>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            There are currently no reviews for this product. 
                            {eligibility?.eligible ? "Be the first to share your experience!" : "Purchase this product to share your thoughts."}
                        </p>
                    </div>
                )}
            </div>

            {/* Media Lightbox */}
            {selectedMedia && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedMedia(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                        onClick={() => setSelectedMedia(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    
                    <div 
                        className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedMedia.type === 'video' ? (
                            <video 
                                src={api.getMediaUrl(selectedMedia.url)} 
                                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                                controls
                                autoPlay
                            />
                        ) : (
                            <img 
                                src={api.getMediaUrl(selectedMedia.url)} 
                                alt="Review Full" 
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
