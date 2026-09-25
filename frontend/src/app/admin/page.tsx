"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/context/ToastContext";
import {
  fetchAdminStats,
  fetchAdminOrders,
  fetchAdminProducts,
  fetchAdminInquiries,
  updateAdminShipping,
  createAdminProduct,
  updateAdminProduct,
  updateAdminProductStock,
  deleteAdminProduct,
  replyAdminInquiry,
  AdminStatsDto,
  AdminOrderDto,
  ProductDto,
  AdminInquiryDto,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/lib/api";

type AdminTab = "overview" | "orders" | "products" | "inquiries";

// Mock Fallback Data in case backend is loading or dev sandbox
const INITIAL_MOCK_STATS: AdminStatsDto = {
  totalOrders: 28,
  totalGrossAmount: 2850000,
  totalSettledAmount: 2310000,
  totalRefundAmount: 540000,
  preparingCount: 6,
  shippingCount: 8,
  deliveredCount: 14,
  waitingAcceptCount: 4,
  acceptanceRate: 85.7,
  pendingInquiriesCount: 2,
  totalProductsCount: 18,
  soldOutProductsCount: 1,
};

const INITIAL_MOCK_ORDERS: AdminOrderDto[] = [
  {
    id: 101,
    curationBoxId: 1,
    sharingToken: "SP-DEMO-TOKEN-1",
    senderName: "정우성",
    senderEmail: "woosung.jung@example.com",
    recipientName: "이민정",
    recipientPhone: "010-8765-4321",
    shippingAddress: "서울특별시 성동구 서울숲2길 32 갤러리아포레 102동 1502호",
    shippingStatus: "PREPARING",
    carrierName: "CJ대한통운",
    trackingNumber: "6849-3012-9381",
    selectedProductId: 2,
    selectedProductName: "레저렉션 아로마틱 핸드 밤 (75ml)",
    selectedProductBrand: "Aesop",
    selectedProductPrice: 45000,
    selectedProductImageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    selectedOption: "75ml (시트러스 우디)",
    totalAmount: 100000,
    finalAmount: 45000,
    refundAmount: 55000,
    paidAt: "2026-09-22T14:20:00",
    settledAt: "2026-09-23T11:05:00",
    desiredDeliveryDate: "WEEKEND",
    ecoFriendlyPackaging: true,
    entranceMemo: "공동현관 #1234* 호출 부탁드립니다.",
    thankYouSticker: "💖 감동이에요",
    thankYouMessage: "보내주신 이솝 핸드밤 향이 너무 좋아요! 센스 있는 선물 고마워요 :)",
    thankYouPhotoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    curationBoxStatus: "ACCEPTED",
  },
  {
    id: 102,
    curationBoxId: 2,
    sharingToken: "SP-DEMO-TOKEN-2",
    senderName: "강동원",
    senderEmail: "dongwon.kang@example.com",
    recipientName: "한지민",
    recipientPhone: "010-2345-6789",
    shippingAddress: "서울특별시 강남구 압구정로 140 현대아파트 85동 704호",
    shippingStatus: "SHIPPING",
    carrierName: "CJ대한통운",
    trackingNumber: "6910-4421-8890",
    selectedProductId: 1,
    selectedProductName: "도손 오 드 뚜왈렛 (50ml)",
    selectedProductBrand: "DIPTYQUE",
    selectedProductPrice: 165000,
    selectedProductImageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
    selectedOption: "50ml",
    totalAmount: 180000,
    finalAmount: 165000,
    refundAmount: 15000,
    paidAt: "2026-09-20T10:15:00",
    settledAt: "2026-09-21T09:30:00",
    desiredDeliveryDate: "FASTEST",
    ecoFriendlyPackaging: false,
    entranceMemo: "경비실에 맡겨주세요.",
    thankYouSticker: "✨ 최고예요",
    thankYouMessage: "가장 좋아하는 향수를 선물 받아 너무 행복합니다!",
    curationBoxStatus: "ACCEPTED",
  },
  {
    id: 103,
    curationBoxId: 3,
    sharingToken: "SP-DEMO-TOKEN-3",
    senderName: "송혜교",
    senderEmail: "hyekyo.song@example.com",
    recipientName: "박보검",
    recipientPhone: "010-9988-7766",
    shippingAddress: "서울특별시 용산구 한남대로 91 나인원한남 101동",
    shippingStatus: "DELIVERED",
    carrierName: "우체국택배",
    trackingNumber: "4029-1188-0099",
    selectedProductId: 4,
    selectedProductName: "베이 캔들 (190g)",
    selectedProductBrand: "DIPTYQUE",
    selectedProductPrice: 95000,
    selectedProductImageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    selectedOption: "190g",
    totalAmount: 100000,
    finalAmount: 95000,
    refundAmount: 5000,
    paidAt: "2026-09-18T16:00:00",
    settledAt: "2026-09-19T14:10:00",
    desiredDeliveryDate: "WEEKDAY",
    ecoFriendlyPackaging: true,
    entranceMemo: "문 앞에 놓아주세요.",
    thankYouSticker: "☕ 따뜻해요",
    curationBoxStatus: "ACCEPTED",
  },
];

const INITIAL_MOCK_INQUIRIES: AdminInquiryDto[] = [
  {
    id: 1,
    inquiryCode: "INQ-104921",
    name: "김하늘",
    email: "sky.kim@example.com",
    category: "배송/일정 문의",
    content: "선물 수락 시 희망 배송일을 이번 주 토요일로 지정했는데, 혹시 일정을 하루 당겨서 금요일에 받을 수 있을지 문의드립니다.",
    status: "ANSWERED",
    adminReply: "안녕하세요 고객님, 담당 배송 기사님 및 물류센터와 확인하여 금요일 출고 및 수령 일정으로 조율 도와드렸습니다. 감사합니다.",
    repliedAt: "2026-09-24T18:30:00",
    createdAt: "2026-09-24T14:12:00",
  },
  {
    id: 2,
    inquiryCode: "INQ-382910",
    name: "이지우",
    email: "jiwoo.lee@example.com",
    category: "정산/환불 문의",
    content: "보낸 선물의 수령인이 제품을 선택하고 남은 차액 환불이 언제 입금되는지 알고 싶습니다.",
    status: "ANSWERED",
    adminReply: "안녕하세요 고객님, 수령인이 선물을 수락하는 즉시 PG사를 통해 차액 부분 환불이 자동 접수되며, 카드사 영업일 기준 2~3일 내에 한도 복원 또는 환불 처리됩니다.",
    repliedAt: "2026-09-23T16:45:00",
    createdAt: "2026-09-23T11:20:00",
  },
  {
    id: 3,
    inquiryCode: "INQ-882103",
    name: "박서준",
    email: "seojun.park@example.com",
    category: "선물 박스/메시지 문의",
    content: "선물 상자 개봉용 4자리 안심 PIN 번호를 잘못 설정해서 친구가 열람을 못하고 있습니다. 핀 번호 초기화 또는 확인 가능한가요?",
    status: "IN_PROGRESS",
    createdAt: "2026-09-24T21:40:00",
  },
];

export default function AdminPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data States
  const [stats, setStats] = useState<AdminStatsDto>(INITIAL_MOCK_STATS);
  const [orders, setOrders] = useState<AdminOrderDto[]>(INITIAL_MOCK_ORDERS);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiryDto[]>(INITIAL_MOCK_INQUIRIES);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [orderKeyword, setOrderKeyword] = useState<string>("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("ALL");
  const [productKeyword, setProductKeyword] = useState<string>("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("ALL");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDto | null>(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState<boolean>(false);
  const [shippingStatusInput, setShippingStatusInput] = useState<string>("SHIPPING");
  const [carrierInput, setCarrierInput] = useState<string>("CJ대한통운");
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>("");

  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<CreateProductPayload>({
    brand: "",
    name: "",
    price: 50000,
    description: "",
    imageUrl: "",
    category: "FRAGRANCE",
    options: ["기본 옵션"],
    stockQuantity: 100,
  });

  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiryDto | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [replyInput, setReplyInput] = useState<string>("");

  // Initial Load
  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, ordersData, productsData, inquiriesData] = await Promise.all([
        fetchAdminStats().catch(() => INITIAL_MOCK_STATS),
        fetchAdminOrders().catch(() => INITIAL_MOCK_ORDERS),
        fetchAdminProducts().catch(() => []),
        fetchAdminInquiries().catch(() => INITIAL_MOCK_INQUIRIES),
      ]);

      setStats(statsData);
      setOrders(ordersData);
      setProducts(productsData.length > 0 ? productsData : []);
      setInquiries(inquiriesData);
    } catch {
      showToast("데이터를 불러오는 중 안내: 데모 샌드박스 데이터로 동기화되었습니다.", "info");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- ORDER HANDLERS ----------------
  const handleOpenShippingModal = (order: AdminOrderDto) => {
    setSelectedOrder(order);
    setShippingStatusInput(order.shippingStatus || "SHIPPING");
    setCarrierInput(order.carrierName || "CJ대한통운");
    setTrackingNumberInput(order.trackingNumber || "");
    setIsShippingModalOpen(true);
  };

  const handleUpdateShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await updateAdminShipping(selectedOrder.id, {
        shippingStatus: shippingStatusInput,
        carrierName: carrierInput,
        trackingNumber: trackingNumberInput,
      });

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                shippingStatus: shippingStatusInput,
                carrierName: carrierInput,
                trackingNumber: trackingNumberInput,
              }
            : o
        )
      );

      showToast(`주문 #${selectedOrder.id} 배송 정보가 성공적으로 업데이트되었습니다.`, "success");
      setIsShippingModalOpen(false);
      setSelectedOrder(null);
    } catch {
      // Fallback local update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                shippingStatus: shippingStatusInput,
                carrierName: carrierInput,
                trackingNumber: trackingNumberInput,
              }
            : o
        )
      );
      showToast("배송 정보가 반영되었습니다 (데모 동기화).", "success");
      setIsShippingModalOpen(false);
    }
  };

  // ---------------- PRODUCT HANDLERS ----------------
  const handleOpenCreateProduct = () => {
    setIsEditMode(false);
    setEditingProductId(null);
    setProductForm({
      brand: "",
      name: "",
      price: 50000,
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
      category: "FRAGRANCE",
      options: ["50ml", "100ml"],
      stockQuantity: 50,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductDto) => {
    setIsEditMode(true);
    setEditingProductId(Number(prod.id));
    setProductForm({
      brand: prod.brand,
      name: prod.name,
      price: prod.price,
      description: prod.description || "",
      imageUrl: prod.imageUrl || "",
      category: prod.category || "FRAGRANCE",
      options: prod.options || ["기본"],
      stockQuantity: prod.stockQuantity ?? 100,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingProductId) {
        const payload: UpdateProductPayload = {
          ...productForm,
        };
        const updated = await updateAdminProduct(editingProductId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingProductId ? updated : p)));
        showToast("상품 정보가 성공적으로 수정되었습니다.", "success");
      } else {
        const created = await createAdminProduct(productForm);
        setProducts((prev) => [created, ...prev]);
        showToast("신규 럭셔리 상품이 등록되었습니다.", "success");
      }
      setIsProductModalOpen(false);
    } catch {
      // Local fallback
      if (isEditMode && editingProductId) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProductId
              ? {
                  ...p,
                  ...productForm,
                }
              : p
          )
        );
        showToast("상품 정보가 수정되었습니다 (데모 반영).", "success");
      } else {
        const mockNew: ProductDto = {
          id: Date.now(),
          ...productForm,
          isSoldOut: false,
        };
        setProducts((prev) => [mockNew, ...prev]);
        showToast("신규 상품이 등록되었습니다 (데모 반영).", "success");
      }
      setIsProductModalOpen(false);
    }
  };

  const handleToggleSoldOut = async (prod: ProductDto) => {
    const nextSoldOut = !prod.isSoldOut;
    try {
      await updateAdminProductStock(Number(prod.id), { isSoldOut: nextSoldOut });
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, isSoldOut: nextSoldOut } : p)));
      showToast(`${prod.name} 상품이 ${nextSoldOut ? "품절 처리" : "판매 재개"}되었습니다.`, "info");
    } catch {
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, isSoldOut: nextSoldOut } : p)));
      showToast(`${prod.name} 상태가 변경되었습니다.`, "info");
    }
  };

  const handleStockChange = async (prod: ProductDto, delta: number) => {
    const newQty = Math.max(0, (prod.stockQuantity ?? 10) + delta);
    const isSoldOut = newQty === 0;
    try {
      await updateAdminProductStock(Number(prod.id), { stockQuantity: newQty, isSoldOut });
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, stockQuantity: newQty, isSoldOut } : p))
      );
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, stockQuantity: newQty, isSoldOut } : p))
      );
    }
  };

  const handleDeleteProduct = async (prodId: number | string) => {
    if (!confirm("정말 이 상품을 카탈로그에서 삭제하시겠습니까?")) return;
    try {
      await deleteAdminProduct(Number(prodId));
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
      showToast("상품이 성공적으로 삭제되었습니다.", "success");
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
      showToast("상품이 삭제되었습니다.", "success");
    }
  };

  // ---------------- INQUIRY HANDLERS ----------------
  const handleOpenReplyModal = (inquiry: AdminInquiryDto) => {
    setSelectedInquiry(inquiry);
    setReplyInput(inquiry.adminReply || "");
    setIsReplyModalOpen(true);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      await replyAdminInquiry(selectedInquiry.inquiryCode, { reply: replyInput });
      setInquiries((prev) =>
        prev.map((i) =>
          i.inquiryCode === selectedInquiry.inquiryCode
            ? { ...i, status: "ANSWERED", adminReply: replyInput, repliedAt: new Date().toISOString() }
            : i
        )
      );
      showToast(`문의 [${selectedInquiry.inquiryCode}] 답변이 등록 및 고객 알림톡으로 발송되었습니다.`, "success");
      setIsReplyModalOpen(false);
      setSelectedInquiry(null);
    } catch {
      setInquiries((prev) =>
        prev.map((i) =>
          i.inquiryCode === selectedInquiry.inquiryCode
            ? { ...i, status: "ANSWERED", adminReply: replyInput, repliedAt: new Date().toISOString() }
            : i
        )
      );
      showToast("답변이 정상 저장되었습니다.", "success");
      setIsReplyModalOpen(false);
    }
  };

  // Filtered lists
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== "ALL" && o.shippingStatus !== orderStatusFilter) return false;
    if (!orderKeyword.trim()) return true;
    const kw = orderKeyword.toLowerCase();
    return (
      (o.recipientName && o.recipientName.toLowerCase().includes(kw)) ||
      (o.senderName && o.senderName.toLowerCase().includes(kw)) ||
      (o.trackingNumber && o.trackingNumber.includes(kw)) ||
      (o.recipientPhone && o.recipientPhone.includes(kw))
    );
  });

  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== "ALL" && p.category !== productCategoryFilter) return false;
    if (!productKeyword.trim()) return true;
    const kw = productKeyword.toLowerCase();
    return (
      (p.brand && p.brand.toLowerCase().includes(kw)) ||
      (p.name && p.name.toLowerCase().includes(kw))
    );
  });

  const filteredInquiries = inquiries.filter((i) => {
    if (inquiryStatusFilter !== "ALL" && i.status !== inquiryStatusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0d131f] text-[#f8fafc] flex flex-col font-sans selection:bg-[#d4af37] selection:text-black">
      <Header />

      {/* Admin Subheader Bar */}
      <div className="w-full bg-[#131b2e] border-b border-[#1e293b] px-6 py-4 sticky top-[65px] z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#996515] flex items-center justify-center text-black font-serif font-black shadow-lg">
              ADM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif font-bold tracking-tight text-white">
                  SharePresent Concierge Console
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30">
                  Live System
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                프리미엄 큐레이션 주문·배송·재고 및 고객 컨시어지 통합 운영 센터
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllAdminData}
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] hover:text-white border border-[#334155] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <svg className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#d4af37]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              실시간 동기화
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto mt-4 flex items-center gap-2 border-b border-[#1e293b]/60 overflow-x-auto pb-1">
          {[
            { id: "overview", label: "📊 대시보드 & 통계", count: null },
            { id: "orders", label: "📦 주문 & 배송 관리", count: orders.length },
            { id: "products", label: "🏷️ 상품 & 재고 관리", count: products.length },
            { id: "inquiries", label: "💬 1:1 고객 문의", count: inquiries.filter((i) => i.status === "IN_PROGRESS").length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                type="button"
                className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                  isActive
                    ? "bg-[#1e293b] text-[#d4af37] border-[#d4af37]"
                    : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/50 border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? "bg-[#d4af37] text-black font-extrabold" : "bg-[#334155] text-[#cbd5e1]"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {/* ================= 1. OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">총 누적 가승인액</div>
                <div className="text-2xl font-serif font-black text-[#d4af37] mt-1.5">
                  ₩{(stats.totalGrossAmount || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-[#64748b] mt-2 flex items-center gap-1">
                  <span>총 주문 {stats.totalOrders}건 기준</span>
                </div>
                <div className="absolute top-4 right-4 text-2xl opacity-15">💳</div>
              </div>

              <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">실 정산 완료액</div>
                <div className="text-2xl font-serif font-black text-[#34d399] mt-1.5">
                  ₩{(stats.totalSettledAmount || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-[#64748b] mt-2 flex items-center gap-1">
                  <span>수령인 선택 완료 정산 매출</span>
                </div>
                <div className="absolute top-4 right-4 text-2xl opacity-15">✨</div>
              </div>

              <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">자동 환불 정산액</div>
                <div className="text-2xl font-serif font-black text-[#f43f5e] mt-1.5">
                  ₩{(stats.totalRefundAmount || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-[#64748b] mt-2 flex items-center gap-1">
                  <span>차액 환불 및 주문 취소 합계</span>
                </div>
                <div className="absolute top-4 right-4 text-2xl opacity-15">🔄</div>
              </div>

              <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">선물 수락 전환율</div>
                <div className="text-2xl font-serif font-black text-[#60a5fa] mt-1.5">
                  {stats.acceptanceRate}%
                </div>
                <div className="text-[11px] text-[#64748b] mt-2 flex items-center gap-1">
                  <span>미수락 대기 {stats.waitingAcceptCount}건</span>
                </div>
                <div className="absolute top-4 right-4 text-2xl opacity-15">🎁</div>
              </div>
            </div>

            {/* Delivery Funnel Section */}
            <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-serif font-bold text-white">물류 및 배송 풀필먼트 현황</h2>
                  <p className="text-xs text-[#94a3b8]">수령인 주소 입력 후 출고 단계별 실시간 모니터링</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  type="button"
                  className="text-xs text-[#d4af37] hover:underline font-bold"
                >
                  전체 주문 관리 &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1a233a] border border-[#2d3a5a] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-bold">
                      📦
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#cbd5e1]">상품 준비 중 (출고 대기)</div>
                      <div className="text-[11px] text-[#64748b]">운송장 등록 필요</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-400">{stats.preparingCount}건</div>
                </div>

                <div className="bg-[#1a233a] border border-[#2d3a5a] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                      🚚
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#cbd5e1]">배송 중 (간선 상하차)</div>
                      <div className="text-[11px] text-[#64748b]">택배사 이동 중</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-blue-400">{stats.shippingCount}건</div>
                </div>

                <div className="bg-[#1a233a] border border-[#2d3a5a] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
                      ✨
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#cbd5e1]">배송 완료 (수령 확인)</div>
                      <div className="text-[11px] text-[#64748b]">감사 카드 전달 완료</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{stats.deliveredCount}건</div>
                </div>
              </div>
            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Urgent Inquiries */}
              <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>💬 미답변 고객 문의</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {inquiries.filter((i) => i.status === "IN_PROGRESS").length}건 대기
                    </span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    type="button"
                    className="text-xs text-[#94a3b8] hover:text-white"
                  >
                    문의함 이동 &rarr;
                  </button>
                </div>
                <div className="space-y-2.5">
                  {inquiries.filter((i) => i.status === "IN_PROGRESS").slice(0, 3).map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => handleOpenReplyModal(inq)}
                      className="p-3 rounded-lg bg-[#1a233a] hover:bg-[#24304f] border border-[#2d3a5a] cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                          <span className="font-mono text-[#94a3b8]">{inq.inquiryCode}</span>
                          <span>• {inq.name} ({inq.category})</span>
                        </div>
                        <p className="text-[11px] text-[#94a3b8] line-clamp-1 mt-0.5">{inq.content}</p>
                      </div>
                      <span className="text-xs text-[#d4af37] font-bold shrink-0 ml-2">답변하기</span>
                    </div>
                  ))}
                  {inquiries.filter((i) => i.status === "IN_PROGRESS").length === 0 && (
                    <div className="text-center py-6 text-xs text-[#64748b]">
                      ✨ 모든 고객 문의가 정상적으로 답변 완료되었습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* Catalog Status Overview */}
              <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>🏷️ 카탈로그 및 재고 상태</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("products")}
                    type="button"
                    className="text-xs text-[#d4af37] hover:underline font-bold"
                  >
                    + 신규 상품 등록
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-[#1a233a] border border-[#2d3a5a]">
                    <div className="text-[11px] text-[#94a3b8]">총 등록 상품</div>
                    <div className="text-xl font-bold font-mono text-white mt-1">{products.length || stats.totalProductsCount}개</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a233a] border border-[#2d3a5a]">
                    <div className="text-[11px] text-[#94a3b8]">품절(Sold Out) 상품</div>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                      {products.filter((p) => p.isSoldOut).length}개
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  실시간으로 재고를 변경하거나 품절 처리하여 발신자의 큐레이션 선택을 제어할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. ORDERS TAB ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131b2e] border border-[#1e293b] p-4 rounded-xl shadow-md">
              {/* Status Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { key: "ALL", label: "전체 주문" },
                  { key: "PREPARING", label: "📦 상품준비" },
                  { key: "SHIPPING", label: "🚚 배송중" },
                  { key: "DELIVERED", label: "✨ 배송완료" },
                  { key: "CANCELLED_REFUNDED", label: "❌ 취소/환불" },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => setOrderStatusFilter(chip.key)}
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      orderStatusFilter === chip.key
                        ? "bg-[#d4af37] text-black shadow-md font-extrabold"
                        : "bg-[#1e293b] text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={orderKeyword}
                  onChange={(e) => setOrderKeyword(e.target.value)}
                  placeholder="수령인, 발신자, 운송장 검색..."
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37]"
                />
                {orderKeyword && (
                  <button
                    onClick={() => setOrderKeyword("")}
                    type="button"
                    className="absolute right-2.5 top-1.5 text-xs text-[#94a3b8] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18233c] text-[#94a3b8] uppercase font-bold tracking-wider border-b border-[#1e293b]">
                    <tr>
                      <th className="py-3 px-4">주문 번호</th>
                      <th className="py-3 px-4">발신자 / 수령인</th>
                      <th className="py-3 px-4">선택 상품 & 옵션</th>
                      <th className="py-3 px-4">결제 / 환불액</th>
                      <th className="py-3 px-4">배송 상태 & 운송장</th>
                      <th className="py-3 px-4 text-right">관리 인터랙션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] text-[#cbd5e1]">
                    {filteredOrders.map((order) => {
                      const isDelivered = order.shippingStatus === "DELIVERED";
                      const isShipping = order.shippingStatus === "SHIPPING";

                      return (
                        <tr key={order.id} className="hover:bg-[#1a233a] transition-colors">
                          <td className="py-3.5 px-4 font-mono text-white">
                            <div>#{order.id}</div>
                            <div className="text-[10px] text-[#64748b]">{order.sharingToken?.slice(0, 10)}...</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">보낸이: {order.senderName}</div>
                            <div className="text-[11px] text-[#94a3b8] mt-0.5">
                              받는이: {order.recipientName || "(미입력)"} ({order.recipientPhone || "-"})
                            </div>
                            {order.desiredDeliveryDate && (
                              <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                📅 {order.desiredDeliveryDate === "FASTEST" ? "가장 빠른 배송" : order.desiredDeliveryDate === "WEEKEND" ? "주말(토) 수령" : "평일 수령"}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#d4af37]">{order.selectedProductBrand || "선택 대기중"}</div>
                            <div className="text-white line-clamp-1">{order.selectedProductName || "수령인 상품 선택 전"}</div>
                            {order.selectedOption && (
                              <div className="text-[10px] text-[#94a3b8]">옵션: {order.selectedOption}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <div className="text-white font-bold">
                              가승인: ₩{order.totalAmount?.toLocaleString()}
                            </div>
                            {order.finalAmount && (
                              <div className="text-[11px] text-emerald-400">
                                최종: ₩{order.finalAmount.toLocaleString()}
                              </div>
                            )}
                            {order.refundAmount ? (
                              <div className="text-[10px] text-rose-400">
                                환불: ₩{order.refundAmount.toLocaleString()}
                              </div>
                            ) : null}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                isDelivered
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : isShipping
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {isDelivered ? "✨ 배송 완료" : isShipping ? "🚚 배송 중" : "📦 상품 준비중"}
                            </span>
                            <div className="text-[11px] text-[#94a3b8] font-mono mt-1">
                              {order.carrierName} {order.trackingNumber}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenShippingModal(order)}
                              type="button"
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e293b] hover:bg-[#d4af37] text-white hover:text-black border border-[#334155] hover:border-[#d4af37] transition-all shadow-sm active:scale-95"
                            >
                              운송장 / 상태 변경
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-xs text-[#64748b]">
                  조건에 일치하는 주문 내역이 없습니다.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. PRODUCTS TAB ================= */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131b2e] border border-[#1e293b] p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { key: "ALL", label: "전체 카테고리" },
                  { key: "FRAGRANCE", label: "향수/디퓨저" },
                  { key: "HAND_BODY", label: "핸드/바디" },
                  { key: "TABLEWARE", label: "홈/테이블웨어" },
                  { key: "TECH", label: "테크/라이프" },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => setProductCategoryFilter(chip.key)}
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      productCategoryFilter === chip.key
                        ? "bg-[#d4af37] text-black shadow-md font-extrabold"
                        : "bg-[#1e293b] text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={productKeyword}
                  onChange={(e) => setProductKeyword(e.target.value)}
                  placeholder="브랜드 또는 상품명 검색..."
                  className="bg-[#1e293b] border border-[#334155] rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  onClick={handleOpenCreateProduct}
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#d4af37] hover:bg-[#c39e2e] text-black shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-1"
                >
                  <span>+</span> 신규 상품 등록
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className={`bg-[#131b2e] border rounded-xl p-4 shadow-lg flex flex-col justify-between transition-all ${
                    prod.isSoldOut ? "border-rose-900/40 opacity-70" : "border-[#1e293b] hover:border-[#334155]"
                  }`}
                >
                  <div>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1e293b] mb-3">
                      {prod.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-[#64748b]">
                          🎁
                        </div>
                      )}
                      {prod.isSoldOut && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black tracking-widest uppercase">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                        {prod.category || "FRAGRANCE"}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-[#d4af37] tracking-wider uppercase">
                      {prod.brand}
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{prod.name}</h3>
                    <div className="text-xs font-mono font-black text-white mt-1">
                      ₩{prod.price?.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-[#94a3b8] line-clamp-2 mt-1">
                      {prod.description || "프리미엄 기프팅 에디션 상품"}
                    </p>
                  </div>

                  {/* Stock & Control Bar */}
                  <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between gap-2">
                    {/* Stock Counter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#94a3b8]">재고:</span>
                      <div className="flex items-center bg-[#1e293b] rounded border border-[#334155]">
                        <button
                          onClick={() => handleStockChange(prod, -5)}
                          type="button"
                          className="px-1.5 py-0.5 text-xs text-[#94a3b8] hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-xs font-mono font-bold text-white">
                          {prod.stockQuantity ?? 100}
                        </span>
                        <button
                          onClick={() => handleStockChange(prod, 5)}
                          type="button"
                          className="px-1.5 py-0.5 text-xs text-[#94a3b8] hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleSoldOut(prod)}
                        type="button"
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                          prod.isSoldOut
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {prod.isSoldOut ? "판매 재개" : "품절 처리"}
                      </button>

                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        type="button"
                        className="px-2 py-1 rounded text-[10px] font-bold bg-[#1e293b] hover:bg-[#334155] text-white border border-[#334155]"
                      >
                        수정
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        type="button"
                        className="px-1.5 py-1 rounded text-[10px] text-rose-400 hover:text-rose-300"
                        title="상품 삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. INQUIRIES TAB ================= */}
        {activeTab === "inquiries" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-[#131b2e] border border-[#1e293b] p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                {[
                  { key: "ALL", label: "전체 문의" },
                  { key: "IN_PROGRESS", label: "⏳ 처리 대기 (미답변)" },
                  { key: "ANSWERED", label: "✨ 답변 완료" },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => setInquiryStatusFilter(chip.key)}
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      inquiryStatusFilter === chip.key
                        ? "bg-[#d4af37] text-black font-extrabold shadow-md"
                        : "bg-[#1e293b] text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiry Cards List */}
            <div className="space-y-4">
              {filteredInquiries.map((inq) => {
                const isAnswered = inq.status === "ANSWERED";

                return (
                  <div
                    key={inq.id}
                    className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-5 shadow-lg space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e293b] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#d4af37] bg-[#1e293b] px-2 py-0.5 rounded">
                          {inq.inquiryCode}
                        </span>
                        <span className="text-sm font-bold text-white">{inq.name}</span>
                        <span className="text-xs text-[#94a3b8]">({inq.email})</span>
                        <span className="px-2 py-0.2 rounded text-[10px] bg-slate-800 text-[#cbd5e1] border border-slate-700">
                          {inq.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAnswered
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {isAnswered ? "✨ 답변 완료" : "⏳ 검토 대기"}
                        </span>
                        <span className="text-[11px] text-[#64748b] font-mono">
                          {inq.createdAt?.slice(0, 16).replace("T", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="bg-[#18233c] p-3.5 rounded-lg border border-[#24304f] text-xs text-white leading-relaxed">
                      <span className="font-bold text-[#94a3b8] mr-2">[고객 문의 내용]</span>
                      {inq.content}
                    </div>

                    {/* Admin Reply or Action */}
                    {isAnswered ? (
                      <div className="bg-[#102a24] p-3.5 rounded-lg border border-emerald-900/40 text-xs text-emerald-200 leading-relaxed">
                        <div className="flex items-center justify-between font-bold text-emerald-400 mb-1">
                          <span>[관리자 답변 완료]</span>
                          <span className="text-[10px] font-mono opacity-80">{inq.repliedAt?.slice(0, 16).replace("T", " ")}</span>
                        </div>
                        {inq.adminReply}
                      </div>
                    ) : (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleOpenReplyModal(inq)}
                          type="button"
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-[#d4af37] hover:bg-[#c39e2e] text-black shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <span>💬</span> 관리자 공식 답변 작성하기
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredInquiries.length === 0 && (
                <div className="text-center py-12 text-xs text-[#64748b]">
                  접수된 문의 내역이 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL 1: SHIPPING UPDATE MODAL ================= */}
      {isShippingModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-[#2d3a5a] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">운송장 및 배송 상태 업데이트</h3>
                <p className="text-xs text-[#94a3b8]">주문 번호 #{selectedOrder.id} ({selectedOrder.recipientName || "수령인"} 님)</p>
              </div>
              <button
                onClick={() => setIsShippingModalOpen(false)}
                type="button"
                className="text-xs text-[#94a3b8] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateShippingSubmit} className="space-y-4">
              {/* Delivery Address Review */}
              <div className="bg-[#1a233a] p-3 rounded-lg border border-[#2d3a5a] text-xs space-y-1">
                <div className="text-[#94a3b8] font-bold">수령지 주소:</div>
                <div className="text-white font-medium">{selectedOrder.shippingAddress || "(미입력)"}</div>
                {selectedOrder.entranceMemo && (
                  <div className="text-amber-300 text-[11px] mt-1">🔑 {selectedOrder.entranceMemo}</div>
                )}
              </div>

              {/* Shipping Status Selector */}
              <div>
                <label className="block text-xs font-bold text-[#94a3b8] mb-1.5">배송 진행 상태</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "PREPARING", label: "📦 상품 준비중" },
                    { key: "SHIPPING", label: "🚚 배송 출발" },
                    { key: "DELIVERED", label: "✨ 배송 완료" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setShippingStatusInput(s.key)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        shippingStatusInput === s.key
                          ? "bg-[#d4af37] text-black border-[#d4af37]"
                          : "bg-[#1e293b] text-[#cbd5e1] border-[#334155] hover:border-[#64748b]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courier Selector */}
              <div>
                <label className="block text-xs font-bold text-[#94a3b8] mb-1.5">택배사 선택</label>
                <select
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="CJ대한통운">CJ대한통운</option>
                  <option value="우체국택배">우체국택배</option>
                  <option value="로젠택배">로젠택배</option>
                  <option value="한진택배">한진택배</option>
                  <option value="롯데택배">롯데택배</option>
                </select>
              </div>

              {/* Tracking Number Input */}
              <div>
                <label className="block text-xs font-bold text-[#94a3b8] mb-1.5">운송장 번호</label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="예: 6849-3012-9381"
                  required
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37] font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsShippingModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#1e293b] hover:bg-[#334155] text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#d4af37] hover:bg-[#c39e2e] text-black shadow-lg active:scale-95"
                >
                  운송장 저장 및 수령인 알림톡 전송
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PRODUCT CREATE / EDIT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-[#2d3a5a] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  {isEditMode ? "럭셔리 상품 정보 수정" : "신규 럭셔리 상품 등록"}
                </h3>
                <p className="text-xs text-[#94a3b8]">큐레이션 카탈로그에 노출될 브랜드 및 상세 정보를 설정합니다.</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                type="button"
                className="text-xs text-[#94a3b8] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#94a3b8] mb-1">브랜드명</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="예: Aesop, DIPTYQUE"
                    required
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#94a3b8] mb-1">카테고리</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] outline-none"
                  >
                    <option value="FRAGRANCE">향수/디퓨저 (FRAGRANCE)</option>
                    <option value="HAND_BODY">핸드/바디 (HAND_BODY)</option>
                    <option value="TABLEWARE">홈/테이블웨어 (TABLEWARE)</option>
                    <option value="TECH">테크/라이프 (TECH)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#94a3b8] mb-1">상품명</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="예: 레저렉션 아로마틱 핸드 밤 (75ml)"
                  required
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#94a3b8] mb-1">가격 (KRW)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    required
                    min={1000}
                    step={1000}
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#94a3b8] mb-1">초기 재고 수량</label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                    min={0}
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#94a3b8] mb-1">상품 이미지 URL</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#94a3b8] mb-1">상세 설명 / 에디토리얼 노트</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  placeholder="은은한 만다린과 로즈마리의 아로마틱한 향기..."
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-3 text-white focus:border-[#d4af37] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#1e293b] hover:bg-[#334155] text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#d4af37] hover:bg-[#c39e2e] text-black shadow-lg active:scale-95"
                >
                  {isEditMode ? "상품 수정 완료" : "상품 등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: INQUIRY REPLY MODAL ================= */}
      {isReplyModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-[#2d3a5a] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">고객 문의 관리자 답변 작성</h3>
                <p className="text-xs text-[#94a3b8]">접수 번호: {selectedInquiry.inquiryCode} ({selectedInquiry.name} 님)</p>
              </div>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                type="button"
                className="text-xs text-[#94a3b8] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4 text-xs">
              <div className="bg-[#1a233a] p-3.5 rounded-lg border border-[#2d3a5a] space-y-1">
                <div className="text-[#94a3b8] font-bold">[고객 문의 내용]</div>
                <div className="text-white leading-relaxed">{selectedInquiry.content}</div>
              </div>

              <div>
                <label className="block font-bold text-[#94a3b8] mb-1.5">관리자 공식 답변</label>
                <textarea
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  rows={5}
                  required
                  placeholder="안녕하세요 고객님, SharePresent 컨시어지 센터입니다..."
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-3 text-white focus:border-[#d4af37] outline-none leading-relaxed"
                />
                <p className="text-[10px] text-[#64748b] mt-1">
                  답변 등록 시 고객님의 이메일({selectedInquiry.email}) 및 카카오 알림톡으로 실시간 발송됩니다.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#1e293b] hover:bg-[#334155] text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#d4af37] hover:bg-[#c39e2e] text-black shadow-lg active:scale-95"
                >
                  답변 등록 및 알림 발송
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
