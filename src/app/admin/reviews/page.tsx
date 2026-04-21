"use client";

import React, { useState, useEffect } from "react";
import { 
    Star, 
    CheckCircle2, 
    XCircle, 
    Trash2, 
    MessageSquare, 
    Filter, 
    Search, 
    ExternalLink,
    AlertCircle,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [pagination, setPagination] = useState<any>({ page: 1, totalPages: 1 });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchReviews(1);
    }, [statusFilter]);

    const fetchReviews = async (page: number = 1) => {
        setLoading(true);
        try {
            const params: any = { 
                page, 
                limit: 10,
                status: statusFilter === "all" ? undefined : statusFilter
            };
            const res = await api.adminGetAllReviews(params);
            if (res.success) {
                setReviews(res.data || []);
                if (res.meta?.pagination) {
                    setPagination(res.meta.pagination);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (reviewId: number, status: 'approved' | 'rejected') => {
        try {
            const res = await api.adminUpdateReview(reviewId, { status });
            if (res.success) {
                toast.success(`Review ${status} successfully`);
                // Update local state instead of refetching everything
                setReviews(reviews.map(r => r.review_id === reviewId ? { ...r, status } : r));
            }
        } catch (error) {
            toast.error(`Failed to update review status`);
        }
    };

    const handleDelete = async (reviewId: number) => {
        if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
        
        try {
            const res = await api.adminDeleteReview(reviewId);
            if (res.success) {
                toast.success("Review deleted successfully");
                setReviews(reviews.filter(r => r.review_id !== reviewId));
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                        <CheckCircle2 className="w-3 h-3" /> APPROVED
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                        <XCircle className="w-3 h-3" /> REJECTED
                    </span>
                );
            case 'pending':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <AlertCircle className="w-3 h-3" /> PENDING
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E2856] tracking-tight">Review Management</h1>
                        <p className="text-gray-500 mt-1">Moderate and manage customer product reviews</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        {['all', 'pending', 'approved', 'rejected'].map((stat) => (
                            <button
                                key={stat}
                                onClick={() => setStatusFilter(stat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize",
                                    statusFilter === stat 
                                        ? "bg-[#1E2856] text-white shadow-md shadow-[#1E2856]/20" 
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                {stat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by description or user..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-[#1E2856]/5 focus:border-[#1E2856] outline-none transition-all shadow-sm"
                            />
                        </div>
                        
                        <div className="text-sm text-gray-500 font-medium">
                            Showing <span className="text-gray-900">{reviews.length}</span> reviews
                        </div>
                    </div>

                    {/* Table / List */}
                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-[#1E2856]" />
                                <p className="font-medium">Loading reviews...</p>
                            </div>
                        ) : reviews.length > 0 ? (
                            reviews.filter(r => 
                                r.review_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                r.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((review) => (
                                <div key={review.review_id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Review Meta */}
                                        <div className="w-full lg:w-1/4 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E2856] to-[#2c3a7a] flex items-center justify-center text-white font-bold shadow-sm">
                                                    {review.user_name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-none">{review.user_name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{review.user_email || 'No email'}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </div>
                                                <StatusBadge status={review.status} />
                                            </div>
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex gap-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    i < review.rating ? "text-orange-400 fill-orange-400" : "text-gray-200"
                                                                )} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-900 font-semibold mb-1">{review.review_title || 'No Title'}</p>
                                                    <p className="text-gray-600 italic text-sm leading-relaxed">"{review.review_description}"</p>
                                                </div>
                                                
                                                <Link 
                                                    href={`/product/${review.product_id}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#832729] hover:underline"
                                                    target="_blank"
                                                >
                                                    View Product <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </div>
                                            
                                            {/* Images if any */}
                                            {review.images?.length > 0 && (
                                                <div className="flex gap-3">
                                                    {review.images.map((img: any, i: number) => (
                                                        <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                            <img src={img.url || img} alt="Review" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="w-full lg:w-auto flex lg:flex-col gap-2 justify-end">
                                            {review.status !== 'approved' && (
                                                <Button 
                                                    onClick={() => handleUpdateStatus(review.review_id, 'approved')}
                                                    className="bg-green-600 text-white hover:bg-green-700 flex-1 px-4 rounded-xl shadow-sm"
                                                    size="sm"
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            {review.status !== 'rejected' && (
                                                <Button 
                                                    variant="outline"
                                                    onClick={() => handleUpdateStatus(review.review_id, 'rejected')}
                                                    className="text-red-600 border-red-100 hover:bg-red-50 flex-1 px-4 rounded-xl"
                                                    size="sm"
                                                >
                                                    Reject
                                                </Button>
                                            )}
                                            <Button 
                                                variant="ghost"
                                                onClick={() => handleDelete(review.review_id)}
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 px-3 rounded-xl"
                                                size="sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                                <MessageSquare className="w-12 h-12 text-gray-200" />
                                <div className="text-center">
                                    <p className="font-bold text-gray-900">No reviews found</p>
                                    <p className="text-sm">Try adjusting your filters or search query</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm text-gray-500 font-medium">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline"
                                    disabled={pagination.page <= 1}
                                    onClick={() => fetchReviews(pagination.page - 1)}
                                    className="rounded-xl p-2 h-auto"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="outline"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => fetchReviews(pagination.page + 1)}
                                    className="rounded-xl p-2 h-auto"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
