"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, CheckCircle2, AlertCircle, Upload, X, Film, Image as ImageIcon, Play } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ReviewSection({ productId, horizontal = false }: { productId: string | number, horizontal?: boolean }) {
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
    const [currentPage, setCurrentPage] = useState(1);

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
                setCurrentPage(1); // Reset page to view latest review
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    // Dynamic stats computation
    const totalReviews = reviews.length;
    const avgRatingNum = totalReviews > 0 
        ? reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / totalReviews
        : 0;
    const avgRatingFormatted = avgRatingNum.toFixed(1);

    const ratingCounts = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => Number(r.rating) === stars).length;
        return {
            stars,
            count,
            percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
        };
    });

    // Pagination setup
    const pageSize = 4;
    const totalPages = Math.ceil(totalReviews / pageSize);
    const displayedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (loading) return (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#832729] rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Loading customer feedback...</p>
        </div>
    );

    return (
        <div className="space-y-12 py-4 font-sans">
            {/* Section Header */}
            <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-[#1E2856] uppercase tracking-wider">
                    Customer Reviews
                </h2>
                <div className="w-16 h-1 bg-[#832729] mx-auto rounded-full"></div>
                <p className="text-sm text-gray-500 font-medium">
                    Real photos and verified experiences from our clients
                </p>
            </div>

            {/* Premium Summary & Rating Dashboard Card */}
            <div className="bg-[#FDFBF7] border border-[#E5D3B3]/40 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left: Overall Big Score */}
                <div className="md:col-span-3 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#E5D3B3]/30 pb-6 md:pb-0 md:pr-6">
                    <span className="text-5xl md:text-6xl font-black text-[#1E2856] tracking-tight">
                        {avgRatingFormatted}
                    </span>
                    <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star} 
                                className={cn(
                                    "w-4 h-4",
                                    star <= Math.round(avgRatingNum) 
                                        ? "text-orange-400 fill-orange-400" 
                                        : "text-gray-300"
                                )} 
                            />
                        ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                        {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                    </span>
                </div>

                {/* Center: Rating Distribution Bars (Informational Display) */}
                <div className="md:col-span-6 space-y-2.5">
                    {ratingCounts.map((item) => (
                        <div
                            key={item.stars}
                            className="w-full flex items-center gap-3 text-left"
                        >
                            <span className="w-8 text-xs font-bold text-gray-600 flex items-center gap-1 shrink-0">
                                {item.stars} <Star className="w-3 h-3 fill-current text-gray-400" />
                            </span>
                            <div className="flex-1 h-2 bg-gray-200/80 rounded-full overflow-hidden relative">
                                <div 
                                    className="h-full bg-[#832729] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>
                            <span className="w-10 text-right text-xs font-semibold text-gray-400 shrink-0">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right: Actions Prompt */}
                <div className="md:col-span-3 flex flex-col items-center justify-center text-center bg-white/80 p-5 rounded-2xl border border-[#E5D3B3]/20 shadow-xs">
                    <span className="text-xs font-bold text-gray-700 mb-1">Purchased this item?</span>
                    <p className="text-[11px] text-gray-400 mb-3">Your feedback guides our artisans</p>
                    
                    {!showForm && eligibility?.eligible ? (
                        <Button 
                            onClick={() => setShowForm(true)}
                            className="w-full bg-[#832729] text-white hover:bg-[#6b1f21] py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                            Write a Review
                        </Button>
                    ) : (
                        <div className="w-full">
                            {!showForm && (
                                <Button 
                                    onClick={() => setShowForm(true)}
                                    className="w-full bg-[#832729] text-white hover:bg-[#6b1f21] py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                    Write Review
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Eligibility Context Notices */}
            {!showForm && eligibility && !eligibility.eligible && (
                <div className="animate-in fade-in duration-300">
                    {eligibility.reason === 'purchase_required' && (
                        <div className="bg-amber-50/80 border border-amber-200/60 p-4 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-medium max-w-xl mx-auto shadow-xs">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <p>Exclusive access: Only verified purchasers of this item can submit a public review.</p>
                        </div>
                    )}
                    {eligibility.reason === 'login_required' && (
                        <div className="bg-blue-50/80 border border-blue-200/60 p-4 rounded-2xl flex items-center gap-3 text-blue-900 text-xs font-medium max-w-xl mx-auto shadow-xs">
                            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                            <p>Please sign in to your Jashoda account to post a certified customer review.</p>
                        </div>
                    )}
                    {eligibility.reason === 'already_reviewed' && (
                        <div className="bg-green-50/80 border border-green-200/60 p-4 rounded-2xl flex items-center gap-3 text-green-900 text-xs font-medium max-w-xl mx-auto shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            <p>You have successfully submitted your review for this masterpiece. Thank you!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Expansible Write Review Form Container */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white border-2 border-[#832729]/10 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl shadow-[#832729]/5 animate-in fade-in slide-in-from-top-4 duration-400 max-w-3xl mx-auto">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h4 className="font-bold text-[#1E2856] text-base uppercase tracking-wider">Craft Your Experience</h4>
                        <button 
                            type="button" 
                            onClick={() => setShowForm(false)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Star Selector */}
                    <div className="space-y-2 text-center">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Select Overall Rating</label>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-2 focus:outline-none transition-all duration-150 hover:scale-110 active:scale-95"
                                >
                                    <Star 
                                        className={cn(
                                            "w-10 h-10 transition-colors duration-200",
                                            (hover || rating) >= star 
                                                ? "text-orange-400 fill-orange-400 drop-shadow-sm" 
                                                : "text-gray-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-[11px] font-bold rounded-full border border-orange-100 animate-in zoom-in-95 duration-200">
                                {rating} out of 5 Stars
                            </span>
                        )}
                    </div>

                    {/* Review Description Textarea */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Detailed Description</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share specific details on craftsmanship, comfort, finishing, and packaging..."
                            className="w-full min-h-[130px] p-4 rounded-2xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-[#832729]/10 focus:border-[#832729] outline-none transition-all resize-none shadow-xs bg-gray-50/50 focus:bg-white"
                            required
                        />
                    </div>

                    {/* Multi-Media Uploader Grid */}
                    <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-[#832729]" />
                                Attach Media
                            </label>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-gray-200/60">
                                {uploadedMedia.length} / 5 items
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                            {uploadedMedia.map((item, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group bg-white border border-gray-200 shadow-xs">
                                    {item.type === 'video' ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 relative">
                                            <Film className="w-6 h-6 text-white/40 absolute top-2 left-2" />
                                            <Play className="w-8 h-8 text-white fill-white shadow-md z-10" />
                                            <span className="absolute bottom-1 text-[9px] font-bold text-white tracking-widest bg-black/60 px-1.5 py-0.5 rounded">VIDEO</span>
                                        </div>
                                    ) : (
                                        <img src={api.getMediaUrl(item.url)} alt="Uploaded preview" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeMedia(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-all scale-90 hover:scale-100 shadow-md"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {uploadedMedia.length < 5 && (
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#832729] hover:bg-[#832729]/5 transition-all group bg-white">
                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#832729] transition-colors mb-1" />
                                    <span className="text-[9px] font-bold text-gray-500 uppercase group-hover:text-[#832729] transition-colors">Select File</span>
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

                        {uploading && (
                            <div className="flex items-center gap-2 pt-2 animate-pulse">
                                <div className="w-3 h-3 bg-[#832729] rounded-full animate-ping"></div>
                                <p className="text-xs text-[#832729] font-bold">Uploading files securely...</p>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-400 leading-tight">
                            Support images (JPG, PNG) or short review videos up to 20MB. Highlight closeups of jewelry setting and polish.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="rounded-xl px-6 font-bold text-xs"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={submitting || rating === 0}
                            className="bg-[#832729] text-white hover:bg-[#6b1f21] px-8 py-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#832729]/20 transition-all duration-300"
                        >
                            {submitting ? 'Submitting Review...' : 'Post Authenticated Review'}
                        </Button>
                    </div>
                </form>
            )}

            {/* High-End Review Cards Grid/List */}
            <div className={cn(
                horizontal 
                    ? "flex overflow-x-auto gap-6 no-scrollbar pb-6 -mx-4 px-4" 
                    : "grid grid-cols-1 md:grid-cols-2 gap-6"
            )}>
                {displayedReviews.length > 0 ? (
                    displayedReviews.map((review, idx) => (
                        <div 
                            key={idx} 
                            className={cn(
                                "bg-white border border-gray-100/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden",
                                horizontal ? "min-w-[320px] md:min-w-[400px] max-w-[420px]" : "w-full"
                            )}
                        >
                            {/* Accent line top border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5D3B3]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="space-y-4">
                                {/* Card Header */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E2856] to-[#2c3a7a] flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                                            {review.user_name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-gray-900 text-sm tracking-tight">
                                                    {review.user_name || 'Verified Customer'}
                                                </span>
                                                {review.is_verified_purchase && (
                                                    <span className="flex items-center gap-1 text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-green-100">
                                                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                                    </span>
                                                )}
                                            </div>
                                            {/* Stars */}
                                            <div className="flex gap-0.5 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={cn(
                                                            "w-3 h-3",
                                                            i < review.rating ? "text-orange-400 fill-orange-400" : "text-gray-200"
                                                        )} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <span className="text-[11px] font-medium text-gray-400 shrink-0 pt-0.5">
                                        {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                {/* Review Quote Content */}
                                <p className="text-gray-600 leading-relaxed text-sm italic font-serif">
                                    "{review.review_description}"
                                </p>
                            </div>

                            {/* Attached Media Grid inside Review Card */}
                            {review.media && review.media.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4 mt-3 border-t border-gray-50">
                                    {review.media.map((item: any, mIdx: number) => (
                                        <div 
                                            key={mIdx} 
                                            onClick={() => setSelectedMedia(item)}
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-100 shadow-xs relative group/media cursor-pointer bg-gray-50 shrink-0"
                                        >
                                            {item.type === 'video' ? (
                                                <div className="w-full h-full relative bg-gray-900">
                                                    <video 
                                                        src={api.getMediaUrl(item.url)} 
                                                        className="w-full h-full object-cover opacity-80 group-hover/media:opacity-100 transition-opacity"
                                                        muted
                                                        playsInline
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover/media:bg-black/40 transition-all">
                                                        <Play className="w-6 h-6 text-white fill-white shadow-md transform group-hover/media:scale-110 transition-transform" />
                                                    </div>
                                                    <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white bg-black/60 px-1 rounded">
                                                        VIDEO
                                                    </span>
                                                </div>
                                            ) : (
                                                <img 
                                                    src={api.getMediaUrl(item.url)} 
                                                    alt="Review photo thumbnail" 
                                                    className="w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-500" 
                                                />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity bg-black/10 backdrop-blur-xs">
                                                <ImageIcon className="w-4 h-4 text-white drop-shadow-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                            <MessageSquare className="w-5 h-5 text-gray-300" />
                        </div>
                        <h5 className="text-sm font-bold text-gray-700">No reviews yet</h5>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                            Be the first verified buyer to upload photos and leave feedback!
                        </p>
                    </div>
                )}
            </div>

            {/* Premium Pagination Controls (Displayed automatically when reviews > 5) */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-100/80 animate-in fade-in duration-300">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all cursor-pointer disabled:cursor-default"
                    >
                        Previous
                    </button>
                    
                    <div className="flex gap-1.5 items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer",
                                    currentPage === i + 1
                                        ? "bg-[#1E2856] text-white shadow-xs"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all cursor-pointer disabled:cursor-default"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Elite Media Lightbox Overlay */}
            {selectedMedia && (
                <div 
                    className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedMedia(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
                        onClick={() => setSelectedMedia(null)}
                        aria-label="Close Lightbox"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div 
                        className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedMedia.type === 'video' ? (
                            <video 
                                src={api.getMediaUrl(selectedMedia.url)} 
                                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10"
                                controls
                                autoPlay
                                playsInline
                            />
                        ) : (
                            <img 
                                src={api.getMediaUrl(selectedMedia.url)} 
                                alt="Expanded view" 
                                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
