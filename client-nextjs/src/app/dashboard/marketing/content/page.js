"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useLanguage } from "@/hooks/useLanguage.js";
import {
  FileText,
  Heart,
  Image,
  Video,
  Bot,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Wand2,
  Zap,
  Calendar,
  Target,
  Upload,
  X,
  Save,
  Hash,
  Settings,
  ChevronDown,
  MessageSquare,
  ChevronUp,
  Globe,
  Play,
  Pause,
  Copy,
  Share2,
  TrendingUp,
  Star,
} from "lucide-react";

import {
  GET_CONTENT_LIST,
  GET_CONTENT_BY_ID,
  GET_CONTENT_STATS,
  GET_TOP_PERFORMING_CONTENT,
  GET_TRENDING_KEYWORDS,
} from "@/lib/graphql/marketingQueries.js";

import {
  CREATE_CONTENT,
  UPDATE_CONTENT,
  APPROVE_CONTENT,
  REJECT_CONTENT,
  DELETE_CONTENT,
  GENERATE_CONTENT,
  BULK_CONTENT_ACTION,
  SCHEDULE_CONTENT,
  PUBLISH_CONTENT,
} from "@/lib/graphql/marketingMutations.js";

// 다국어 지원
const translations = {
  ko: {
    marketing: {
      content: "콘텐츠 관리",
      aiGenerate: "AI 생성",
      newContent: "새 콘텐츠",
      refresh: "새로고침",
      searchPlaceholder: "콘텐츠 제목으로 검색...",
      allStatus: "모든 상태",
      pending: "승인 대기",
      approved: "승인됨",
      rejected: "거절됨",
      scheduled: "예약됨",
      published: "게시됨",
      aiContentGeneration: "AI 콘텐츠 생성",
      settings: "설정",
      generation: "생성",
      preview: "미리보기",
      basicInfo: "기본 정보 입력",
      aiContentGen: "AI 콘텐츠 생성",
      finalCheck: "최종 확인",
      channelSelection: "SNS 채널 선택",
      selectChannel: "채널을 선택하세요",
      contentKeywords: "콘텐츠 키워드",
      keywordPlaceholder: "키워드를 입력하세요 (쉼표로 구분)",
      marketingTopic: "마케팅 주제",
      aiRecommend: "AI 추천",
      directInput: "직접 입력",
      contentType: "콘텐츠 유형",
      uploadSchedule: "업로드 예약 설정",
      immediate: "즉시",
      uploadOption: "업로드 옵션",
      auto: "전자동",
      review: "확인 후 편집",
      cancel: "취소",
      nextStep: "다음 단계",
      previous: "이전",
      generateStart: "생성 시작",
      generating: "생성 중...",
      uploading: "업로드 콘텐츠",
      aiRecommendHashtags: "AI 추천 해시태그",
      contentSummary: "설정 요약",
      selectedChannel: "선택된 채널",
      keywords: "키워드",
      topic: "마케팅 주제",
      type: "콘텐츠 유형",
      schedule: "예약 설정",
      upload: "업로드 옵션",
      date: "날짜",
      time: "시간",
      frequency: "주기",
      interval: "간격",
      endDate: "종료 날짜",
    },
    contentTypes: {
      text: "텍스트",
      caption: "캡션",
      image: "이미지",
      hashtag: "해시태그",
      video: "비디오",
    },
    platforms: {
      tiktok: "TikTok",
      facebook_page: "Facebook 페이지",
      facebook_reels: "Facebook 릴스",
      instagram_post: "Instagram 포스트",
      instagram_reels: "Instagram 릴스",
      youtube_shorts: "YouTube Shorts",
    },
    dateFormat: "YYYY-MM-DD",
  },
  en: {
    marketing: {
      content: "Content Management",
      aiGenerate: "AI Generate",
      newContent: "New Content",
      refresh: "Refresh",
      searchPlaceholder: "Search by content title...",
      allStatus: "All Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      scheduled: "Scheduled",
      published: "Published",
      aiContentGeneration: "AI Content Generation",
      settings: "Settings",
      generation: "Generation",
      preview: "Preview",
      basicInfo: "Basic Information",
      aiContentGen: "AI Content Generation",
      finalCheck: "Final Check",
      channelSelection: "SNS Channel Selection",
      selectChannel: "Select a channel",
      contentKeywords: "Content Keywords",
      keywordPlaceholder: "Enter keywords (comma separated)",
      marketingTopic: "Marketing Topic",
      aiRecommend: "AI Recommend",
      directInput: "Direct Input",
      contentType: "Content Type",
      uploadSchedule: "Upload Schedule Settings",
      immediate: "Immediate",
      uploadOption: "Upload Option",
      auto: "Auto",
      review: "Review & Edit",
      cancel: "Cancel",
      nextStep: "Next Step",
      previous: "Previous",
      generateStart: "Start Generation",
      generating: "Generating...",
      uploading: "Upload Content",
      aiRecommendHashtags: "AI Recommended Hashtags",
      contentSummary: "Settings Summary",
      selectedChannel: "Selected Channel",
      keywords: "Keywords",
      topic: "Marketing Topic",
      type: "Content Type",
      schedule: "Schedule",
      upload: "Upload Option",
      date: "Date",
      time: "Time",
      frequency: "Frequency",
      interval: "Interval",
      endDate: "End Date",
    },
    contentTypes: {
      text: "Text",
      caption: "Caption",
      image: "Image",
      hashtag: "Hashtag",
      video: "Video",
    },
    platforms: {
      tiktok: "TikTok",
      facebook_page: "Facebook Page",
      facebook_reels: "Facebook Reels",
      instagram_post: "Instagram Post",
      instagram_reels: "Instagram Reels",
      youtube_shorts: "YouTube Shorts",
    },
    dateFormat: "MM/DD/YYYY",
  },
  vi: {
    marketing: {
      content: "Quản lý Nội dung",
      aiGenerate: "Tạo AI",
      newContent: "Nội dung Mới",
      refresh: "Làm mới",
      searchPlaceholder: "Tìm kiếm theo tiêu đề nội dung...",
      allStatus: "Tất cả Trạng thái",
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Bị từ chối",
      scheduled: "Đã lên lịch",
      published: "Đã xuất bản",
      aiContentGeneration: "Tạo Nội dung AI",
      settings: "Cài đặt",
      generation: "Tạo",
      preview: "Xem trước",
      basicInfo: "Thông tin Cơ bản",
      aiContentGen: "Tạo Nội dung AI",
      finalCheck: "Kiểm tra Cuối",
      channelSelection: "Chọn Kênh SNS",
      selectChannel: "Chọn một kênh",
      contentKeywords: "Từ khóa Nội dung",
      keywordPlaceholder: "Nhập từ khóa (phân cách bằng dấu phẩy)",
      marketingTopic: "Chủ đề Marketing",
      aiRecommend: "AI Đề xuất",
      directInput: "Nhập Trực tiếp",
      contentType: "Loại Nội dung",
      uploadSchedule: "Cài đặt Lịch Tải lên",
      immediate: "Ngay lập tức",
      uploadOption: "Tùy chọn Tải lên",
      auto: "Tự động",
      review: "Xem & Chỉnh sửa",
      cancel: "Hủy",
      nextStep: "Bước tiếp theo",
      previous: "Trước",
      generateStart: "Bắt đầu Tạo",
      generating: "Đang tạo...",
      uploading: "Tải lên Nội dung",
      aiRecommendHashtags: "Hashtag Đề xuất AI",
      contentSummary: "Tóm tắt Cài đặt",
      selectedChannel: "Kênh Đã chọn",
      keywords: "Từ khóa",
      topic: "Chủ đề Marketing",
      type: "Loại Nội dung",
      schedule: "Lịch trình",
      upload: "Tải lên",
      date: "Ngày",
      time: "Giờ",
      frequency: "Tần suất",
      interval: "Khoảng cách",
      endDate: "Ngày Kết thúc",
    },
    contentTypes: {
      text: "Văn bản",
      caption: "Chú thích",
      image: "Hình ảnh",
      hashtag: "Hashtag",
      video: "Video",
    },
    platforms: {
      tiktok: "TikTok",
      facebook_page: "Trang Facebook",
      facebook_reels: "Facebook Reels",
      instagram_post: "Bài đăng Instagram",
      instagram_reels: "Instagram Reels",
      youtube_shorts: "YouTube Shorts",
    },
    dateFormat: "DD/MM/YYYY",
  },
};

// 플랫폼별 미리보기 컴포넌트
const TikTokPreview = ({ content, title, hashtags }) => (
  <div className="bg-black text-white rounded-lg p-4 max-w-sm">
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
        <span className="text-sm font-bold">U</span>
      </div>
      <div>
        <div className="font-semibold">@yourbrand</div>
        <div className="text-xs text-gray-400">방금 전</div>
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center mb-3">
      <Video className="w-16 h-16 text-gray-400" />
      <span className="ml-2">TikTok 비디오</span>
    </div>
    <div className="text-sm mb-2">{content}</div>
    <div className="text-blue-400 text-sm">{hashtags.join(" ")}</div>
  </div>
);

const FacebookPreview = ({ content, title, hashtags, isReels = false }) => (
  <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 max-w-md">
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
        <span className="text-white font-bold">Y</span>
      </div>
      <div>
        <div className="font-semibold">Your Brand</div>
        <div className="text-xs text-gray-500">5분 전 · 🌍</div>
      </div>
    </div>
    <div className="mb-3">
      <p className="text-gray-800 dark:text-gray-200">{content}</p>
    </div>
    {isReels ? (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center mb-3">
        <Video className="w-16 h-16 text-gray-400" />
        <span className="ml-2">Reels 비디오</span>
      </div>
    ) : (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center mb-3">
        <Image className="w-16 h-16 text-gray-400" />
        <span className="ml-2">이미지</span>
      </div>
    )}
    <div className="text-blue-600 text-sm mb-3">{hashtags.join(" ")}</div>
    <div className="flex items-center justify-between pt-2 border-t">
      <button className="flex items-center text-gray-500 hover:text-blue-600">
        <Heart className="w-5 h-5 mr-1" />
        좋아요
      </button>
      <button className="flex items-center text-gray-500 hover:text-blue-600">
        <MessageSquare className="w-5 h-5 mr-1" />
        댓글
      </button>
      <button className="flex items-center text-gray-500 hover:text-blue-600">
        <Share2 className="w-5 h-5 mr-1" />
        공유
      </button>
    </div>
  </div>
);

const InstagramPreview = ({ content, title, hashtags, isReels = false }) => (
  <div className="bg-white dark:bg-gray-800 border rounded-lg max-w-sm">
    <div className="flex items-center p-3 border-b">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
        <span className="text-white text-sm font-bold">Y</span>
      </div>
      <div>
        <div className="font-semibold text-sm">yourbrand</div>
      </div>
    </div>
    {isReels ? (
      <div className="bg-black h-96 flex items-center justify-center">
        <Video className="w-16 h-16 text-white" />
        <span className="ml-2 text-white">Reels 비디오</span>
      </div>
    ) : (
      <div className="bg-gray-200 dark:bg-gray-700 h-80 flex items-center justify-center">
        <Image className="w-16 h-16 text-gray-400" />
        <span className="ml-2">Instagram 이미지</span>
      </div>
    )}
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-4">
          <Heart className="w-6 h-6" />
          <MessageSquare className="w-6 h-6" />
          <Share2 className="w-6 h-6" />
        </div>
      </div>
      <div className="text-sm">
        <span className="font-semibold">yourbrand</span> {content}
      </div>
      <div className="text-blue-600 text-sm mt-1">{hashtags.join(" ")}</div>
    </div>
  </div>
);

const YouTubePreview = ({ content, title, hashtags }) => (
  <div className="bg-white dark:bg-gray-800 border rounded-lg max-w-sm">
    <div className="bg-black h-48 rounded-t-lg flex items-center justify-center relative">
      <Video className="w-16 h-16 text-white" />
      <span className="ml-2 text-white">YouTube Shorts</span>
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        0:15
      </div>
    </div>
    <div className="p-3">
      <div className="font-medium text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-500 mb-2">
        Your Brand · 조회수 1회 · 방금 전
      </div>
      <div className="text-sm">{content}</div>
      <div className="text-blue-600 text-sm mt-1">{hashtags.join(" ")}</div>
    </div>
  </div>
);

export default function MarketingContentPage() {
  const { t, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [bulkAction, setBulkAction] = useState("approve");
  const [bulkReason, setBulkReason] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // AI 생성 모달 관련 상태
  const [aiGenerateStep, setAiGenerateStep] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [contentKeywords, setContentKeywords] = useState("");
  const [marketingTopicMode, setMarketingTopicMode] = useState("ai");
  const [marketingTopic, setMarketingTopic] = useState("");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [contentType, setContentType] = useState([]);
  const [imageCount, setImageCount] = useState(1);
  const [scheduleMode, setScheduleMode] = useState("immediate");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [recurringSettings, setRecurringSettings] = useState({
    frequency: "daily",
    customDays: 1,
    endDate: "",
  });
  const [uploadOption, setUploadOption] = useState("auto");
  const [currentPreviewChannel, setCurrentPreviewChannel] = useState("");
  const [recommendedHashtags, setRecommendedHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [generatedContent, setGeneratedContent] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showRecurringDropdown, setShowRecurringDropdown] = useState(false);

  // 현재 언어에 따른 번역 가져오기
  const currentLang = language || "ko";
  const tr = translations[currentLang] || translations.ko;

  // GraphQL 쿼리
  const {
    data: contentData,
    loading: contentLoading,
    refetch,
  } = useQuery(GET_CONTENT_LIST, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      status: selectedFilter === "all" ? null : selectedFilter,
    },
    pollInterval: 30000,
  });

  const { data: statsData } = useQuery(GET_CONTENT_STATS);
  const { data: topContentData } = useQuery(GET_TOP_PERFORMING_CONTENT, {
    variables: { limit: 5 },
  });

  const { data: trendingData } = useQuery(GET_TRENDING_KEYWORDS, {
    variables: { period: "24h" },
  });

  // Mutations
  const [createContent] = useMutation(CREATE_CONTENT, {
    refetchQueries: [{ query: GET_CONTENT_LIST }, { query: GET_CONTENT_STATS }],
  });
  const [updateContent] = useMutation(UPDATE_CONTENT);
  const [approveContent] = useMutation(APPROVE_CONTENT, {
    refetchQueries: [{ query: GET_CONTENT_LIST }, { query: GET_CONTENT_STATS }],
  });
  const [rejectContent] = useMutation(REJECT_CONTENT, {
    refetchQueries: [{ query: GET_CONTENT_LIST }, { query: GET_CONTENT_STATS }],
  });
  const [deleteContent] = useMutation(DELETE_CONTENT, {
    refetchQueries: [{ query: GET_CONTENT_LIST }, { query: GET_CONTENT_STATS }],
  });
  const [generateContent] = useMutation(GENERATE_CONTENT, {
    refetchQueries: [{ query: GET_CONTENT_LIST }, { query: GET_CONTENT_STATS }],
  });
  const [bulkContentAction] = useMutation(BULK_CONTENT_ACTION, {
    refetchQueries: [{ query: GET_CONTENT_LIST }, { query: GET_CONTENT_STATS }],
  });
  const [scheduleContent] = useMutation(SCHEDULE_CONTENT);
  const [publishContent] = useMutation(PUBLISH_CONTENT);

  const contents = contentData?.contents?.contents || [];
  const contentStats = statsData?.contentStats || {};
  const topContent = topContentData?.topPerformingContent || [];
  const trendingKeywords = trendingData?.trendingKeywords || [];

  // SNS 채널 옵션
  const channelOptions = [
    {
      id: "tiktok",
      name: tr.platforms.tiktok,
      icon: "🎵",
      types: ["video", "text"],
    },
    {
      id: "facebook_page",
      name: tr.platforms.facebook_page,
      icon: "📘",
      types: ["image", "text", "video"],
    },
    {
      id: "facebook_reels",
      name: tr.platforms.facebook_reels,
      icon: "🎬",
      types: ["video"],
    },
    {
      id: "instagram_post",
      name: tr.platforms.instagram_post,
      icon: "📸",
      types: ["image", "text"],
    },
    {
      id: "instagram_reels",
      name: tr.platforms.instagram_reels,
      icon: "🎥",
      types: ["video"],
    },
    {
      id: "youtube_shorts",
      name: tr.platforms.youtube_shorts,
      icon: "📺",
      types: ["video"],
    },
  ];

  // AI 추천 마케팅 주제
  const aiMarketingTopics = [
    "신제품 런칭 이벤트",
    "계절별 프로모션",
    "고객 후기 스토리",
    "브랜드 스토리텔링",
    "할인 혜택 안내",
    "트렌드 연계 캠페인",
    "인플루언서 협업",
    "사용법 가이드",
    "기업 사회공헌 활동",
    "라이프스타일 제안",
  ];

  // Mock 해시태그 데이터
  const mockHashtagData = [
    {
      keyword: "#마케팅",
      source: "Google Trends",
      rank: 1,
      popularity: 95,
      change: "+5%",
      selected: false,
    },
    {
      keyword: "#소셜미디어",
      source: "TikTok",
      rank: 2,
      popularity: 88,
      change: "+12%",
      selected: false,
    },
    {
      keyword: "#브랜딩",
      source: "Instagram",
      rank: 3,
      popularity: 82,
      change: "-2%",
      selected: false,
    },
    {
      keyword: "#트렌드",
      source: "YouTube",
      rank: 4,
      popularity: 79,
      change: "+8%",
      selected: false,
    },
    {
      keyword: "#콘텐츠",
      source: "Google Trends",
      rank: 5,
      popularity: 75,
      change: "+3%",
      selected: false,
    },
    {
      keyword: "#인플루언서",
      source: "TikTok",
      rank: 6,
      popularity: 71,
      change: "+15%",
      selected: false,
    },
    {
      keyword: "#디지털마케팅",
      source: "LinkedIn",
      rank: 7,
      popularity: 68,
      change: "+6%",
      selected: false,
    },
    {
      keyword: "#광고",
      source: "Facebook",
      rank: 8,
      popularity: 65,
      change: "-1%",
      selected: false,
    },
  ];

  const [hashtagData, setHashtagData] = useState(mockHashtagData);

  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content: "",
    mediaType: "text",
    mode: "Manual",
    keywords: "",
    platforms: [],
  });

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    switch (currentLang) {
      case "en":
        return d.toLocaleDateString("en-US");
      case "vi":
        return d.toLocaleDateString("vi-VN");
      default:
        return d.toLocaleDateString("ko-KR");
    }
  };

  // 해시태그 추천 함수
  const generateHashtags = (keywords, topic) => {
    const baseKeywords = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);
    const topicWords = topic.split(" ").filter((w) => w.length > 2);

    const trendingTags = trendingKeywords.slice(0, 5).map((t) => t.keyword);
    const generalTags = [
      "#마케팅",
      "#브랜드",
      "#소셜미디어",
      "#트렌드",
      "#이벤트",
    ];

    const allTags = [
      ...baseKeywords.map((k) => `#${k}`),
      ...topicWords.map((w) => `#${w}`),
      ...trendingTags,
      ...generalTags,
    ];

    return [...new Set(allTags)].slice(0, 15);
  };

  // 채널별 콘텐츠 생성
  const generateChannelContent = (channel, type, keywords, topic) => {
    const baseContent = `${topic}에 대한 ${type} 콘텐츠입니다. 키워드: ${keywords}`;

    switch (channel) {
      case "tiktok":
        return {
          title: `🎵 ${topic} - TikTok`,
          content: `${baseContent}\n\n#TikTok #Viral #Trending`,
          duration: type === "video" ? "15-60초" : null,
        };
      case "facebook_page":
        return {
          title: `📘 ${topic} - Facebook`,
          content: `${baseContent}\n\n페이스북 커뮤니티와 함께 나누고 싶은 이야기입니다.`,
          format: type === "image" ? "1080x1080" : null,
        };
      case "instagram_post":
        return {
          title: `📸 ${topic} - Instagram`,
          content: `${baseContent}\n\n인스타그램 피드용 콘텐츠입니다.`,
          format: "1080x1080 정사각형",
        };
      case "youtube_shorts":
        return {
          title: `📺 ${topic} - YouTube Shorts`,
          content: `${baseContent}\n\nYouTube Shorts용 세로형 영상입니다.`,
          duration: "60초 이내",
          format: "9:16 세로",
        };
      default:
        return {
          title: topic,
          content: baseContent,
        };
    }
  };

  const handleCreateContent = async () => {
    try {
      await createContent({
        variables: { input: newContent },
      });
      setShowCreateModal(false);
      resetNewContent();
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  const handleAIGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);

      // 프로그레스 시뮬레이션
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      // 해시태그 생성
      const hashtags = generateHashtags(contentKeywords, marketingTopic);
      setRecommendedHashtags(hashtags);

      // 선택된 채널별 콘텐츠 생성
      const channelContents = {};
      if (selectedChannel) {
        const channel = channelOptions.find((c) => c.id === selectedChannel);
        if (channel) {
          channelContents[selectedChannel] = generateChannelContent(
            selectedChannel,
            contentType.join(","),
            contentKeywords,
            marketingTopic,
          );
        }
      }

      // 시뮬레이션 딜레이
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setGenerationProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setGeneratedContent(channelContents);
      setCurrentPreviewChannel(selectedChannel || "");
      setIsGenerating(false);
      setAiGenerateStep(3); // 미리보기 단계로 이동
    } catch (error) {
      console.error("Error generating AI content:", error);
      setIsGenerating(false);
    }
  };

  const handleFinalGenerate = async () => {
    try {
      // 선택된 채널의 콘텐츠 생성
      if (selectedChannel) {
        const channelContent = generatedContent[selectedChannel];
        if (channelContent) {
          const contentInput = {
            title: channelContent.title,
            content: channelContent.content,
            description: `${marketingTopic} - ${selectedChannel} 콘텐츠`,
            mediaType: contentType.join(","),
            mode: "Auto",
            keywords: contentKeywords + "," + selectedHashtags.join(","),
            platforms: [selectedChannel],
            aiGenerated: true,
          };

          await createContent({ variables: { input: contentInput } });
        }
      }

      setShowGenerateModal(false);
      resetGenerateForm();
    } catch (error) {
      console.error("Error creating AI generated content:", error);
    }
  };

  const handleBulkAction = async () => {
    try {
      await bulkContentAction({
        variables: {
          input: {
            contentIds: selectedContentIds,
            action: bulkAction,
            reason: bulkReason,
          },
        },
      });
      setShowBulkActionsModal(false);
      setSelectedContentIds([]);
      setBulkReason("");
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveContent({ variables: { id } });
    } catch (error) {
      console.error("Error approving content:", error);
    }
  };

  const handleReject = async (id, reason = "Quality standards not met") => {
    try {
      await rejectContent({ variables: { id, reason } });
    } catch (error) {
      console.error("Error rejecting content:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("정말로 이 콘텐츠를 삭제하시겠습니까?")) {
      try {
        await deleteContent({ variables: { id } });
      } catch (error) {
        console.error("Error deleting content:", error);
      }
    }
  };

  const handleSchedule = async (contentId, scheduledAt) => {
    try {
      await scheduleContent({
        variables: { id: contentId, scheduledAt: new Date(scheduledAt) },
      });
    } catch (error) {
      console.error("Error scheduling content:", error);
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishContent({ variables: { id } });
    } catch (error) {
      console.error("Error publishing content:", error);
    }
  };

  const handlePreview = (content) => {
    setPreviewContent(content);
    setShowPreviewModal(true);
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setShowEditModal(true);
  };

  const handleSelectContent = (contentId) => {
    setSelectedContentIds((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId],
    );
  };

  const handleSelectAll = () => {
    if (selectedContentIds.length === contents.length) {
      setSelectedContentIds([]);
    } else {
      setSelectedContentIds(contents.map((c) => c.id));
    }
  };

  const resetNewContent = () => {
    setNewContent({
      title: "",
      description: "",
      content: "",
      mediaType: "text",
      mode: "Manual",
      keywords: "",
      platforms: [],
    });
  };

  const resetGenerateForm = () => {
    setAiGenerateStep(1);
    setSelectedChannel("");
    setContentKeywords("");
    setMarketingTopicMode("ai");
    setMarketingTopic("");
    setShowTopicDropdown(false);
    setShowChannelDropdown(false);
    setShowRecurringDropdown(false);
    setContentType([]);
    setImageCount(1);
    setScheduleMode("immediate");
    setScheduleDate("");
    setScheduleTime("");
    setUploadOption("auto");
    setRecommendedHashtags([]);
    setSelectedHashtags([]);
    setGeneratedContent({});
    setCurrentPreviewChannel("");
    setIsGenerating(false);
    setGenerationProgress(0);
    setHashtagData(mockHashtagData);
    setRecurringSettings({
      frequency: "daily",
      customDays: 1,
      endDate: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "published":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 통합 드롭다운 컴포넌트
  const UnifiedDropdown = ({
    value,
    onChange,
    options,
    placeholder,
    className = "",
  }) => (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full h-14 px-4 text-left border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 flex items-center justify-between"
        onClick={() => {
          // Toggle dropdown logic here
        }}
      >
        <span
          className={value ? "text-gray-900 dark:text-white" : "text-gray-500"}
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );

  // 플랫폼별 미리보기 렌더링
  const renderPreview = () => {
    const content =
      generatedContent[currentPreviewChannel]?.content ||
      `🌟 ${marketingTopic}에 대한 흥미로운 이야기를 소개합니다!`;
    const title =
      generatedContent[currentPreviewChannel]?.title || marketingTopic;

    switch (currentPreviewChannel) {
      case "tiktok":
        return (
          <TikTokPreview
            content={content}
            title={title}
            hashtags={selectedHashtags}
          />
        );
      case "facebook_page":
        return (
          <FacebookPreview
            content={content}
            title={title}
            hashtags={selectedHashtags}
          />
        );
      case "facebook_reels":
        return (
          <FacebookPreview
            content={content}
            title={title}
            hashtags={selectedHashtags}
            isReels={true}
          />
        );
      case "instagram_post":
        return (
          <InstagramPreview
            content={content}
            title={title}
            hashtags={selectedHashtags}
          />
        );
      case "instagram_reels":
        return (
          <InstagramPreview
            content={content}
            title={title}
            hashtags={selectedHashtags}
            isReels={true}
          />
        );
      case "youtube_shorts":
        return (
          <YouTubePreview
            content={content}
            title={title}
            hashtags={selectedHashtags}
          />
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              미리보기를 사용할 수 없습니다
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500  shadow-lg"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                         bg-clip-text text-transparent"
        >
          {tr.marketing.content}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          AI 기반 콘텐츠 생성 및 승인 관리
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-md transition-all duration-300 transform "
          >
            <Plus className="w-4 h-4 mr-2" />
            {tr.marketing.newContent}
          </Button>
          <Button
            onClick={() => setShowGenerateModal(true)}
            variant="outline"
            className="hover:shadow-md transition-all duration-300 transform "
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {tr.marketing.aiGenerate}
          </Button>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="hover:shadow-md transition-all duration-300 transform "
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {tr.marketing.refresh}
          </Button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={tr.marketing.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-sm h-14"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-14 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500"
              >
                <option value="all">{tr.marketing.allStatus}</option>
                <option value="pending">{tr.marketing.pending}</option>
                <option value="approved">{tr.marketing.approved}</option>
                <option value="rejected">{tr.marketing.rejected}</option>
                <option value="scheduled">{tr.marketing.scheduled}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {tr.marketing.approved}
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {contentStats.approved || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {tr.marketing.pending}
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {contentStats.pending || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {tr.marketing.rejected}
                </p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {contentStats.rejected || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {tr.marketing.scheduled}
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {contentStats.scheduled || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 콘텐츠 목록 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            콘텐츠 목록 ({filteredContents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contentLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              조건에 맞는 콘텐츠가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContents.map((content) => {
                const statusConfig = getStatusColor(content.status);
                return (
                  <div
                    key={content.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getMediaIcon(content.mediaType)}
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {content.title}
                          </h4>
                          <Badge className={statusConfig}>
                            {content.status}
                          </Badge>
                          <Badge
                            variant={
                              content.mode === "Auto" ? "default" : "secondary"
                            }
                            className={
                              content.mode === "Auto"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                : ""
                            }
                          >
                            {content.mode}
                          </Badge>
                          {content.aiGenerated && (
                            <Badge
                              variant="outline"
                              className="border-purple-300 text-purple-700 dark:border-purple-500 dark:text-purple-300"
                            >
                              <Bot className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {content.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{content.keywords}</span>
                          <span>•</span>
                          <span>{formatDate(content.createdAt)}</span>
                          <span>•</span>
                          <span>
                            플랫폼: {content.platforms?.join(", ") || "없음"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(content)}
                          className="hover:shadow-md transition-all duration-300 transform "
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {content.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(content.id)}
                              className="bg-green-600 hover:bg-green-700 hover:shadow-md transition-all duration-300 transform "
                            >
                              승인
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(content.id)}
                              className="hover:shadow-md transition-all duration-300 transform "
                            >
                              거절
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(content.id)}
                          className="text-red-600 hover:text-red-700 hover:shadow-md transition-all duration-300 transform "
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI 콘텐츠 생성 모달 */}
      {showGenerateModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center z-[9999] p-2 sm:p-4 overflow-hidden mt-0"
          style={{ marginTop: "0px", marginBottom: "0px" }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[95vw] lg:max-w-[90vw] xl:max-w-7xl min-h-[95vh] max-h-[95vh] my-4 shadow-2xl overflow-hidden flex flex-col relative">
            {/* 고정 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-[10000] border-b border-gray-200 dark:border-gray-700 flex-shrink-0 rounded-t-2xl">
              <div className="flex justify-between items-center p-4 lg:p-6">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg mr-3">
                    <Wand2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="whitespace-nowrap">
                    {tr.marketing.aiContentGeneration}
                  </span>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowGenerateModal(false);
                    resetGenerateForm();
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* 개선된 단계 표시 */}
              <div className="px-4 lg:px-6 pb-4">
                <div className="flex items-center justify-center space-x-4 lg:space-x-8">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        aiGenerateStep >= 1
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {aiGenerateStep > 1 ? (
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      ) : (
                        "1"
                      )}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xs lg:text-sm font-semibold whitespace-nowrap ${aiGenerateStep >= 1 ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`}
                      >
                        {tr.marketing.settings}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block whitespace-nowrap">
                        {tr.marketing.basicInfo}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      aiGenerateStep >= 2
                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>

                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        aiGenerateStep >= 2
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {aiGenerateStep > 2 ? (
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      ) : (
                        "2"
                      )}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xs lg:text-sm font-semibold whitespace-nowrap ${aiGenerateStep >= 2 ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`}
                      >
                        {tr.marketing.generation}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block whitespace-nowrap">
                        {tr.marketing.aiContentGen}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      aiGenerateStep >= 3
                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>

                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        aiGenerateStep >= 3
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {aiGenerateStep > 3 ? (
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      ) : (
                        "3"
                      )}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xs lg:text-sm font-semibold whitespace-nowrap ${aiGenerateStep >= 3 ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`}
                      >
                        {tr.marketing.preview}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block whitespace-nowrap">
                        {tr.marketing.finalCheck}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {/* 1단계: 기본 설정 */}
              {aiGenerateStep === 1 && (
                <div className="space-y-6 lg:space-y-8">
                  {/* SNS 채널 선택 - 통일된 드롭다운 */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
                    <label className="block text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      🗂️{" "}
                      <span className="whitespace-nowrap ml-2">
                        {tr.marketing.channelSelection}
                      </span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className={`w-full h-14 px-4 text-left border-2 rounded-xl flex items-center justify-between transition-all duration-300 ${
                          selectedChannel
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-white shadow-lg"
                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 hover:border-purple-300"
                        } focus:border-purple-500 focus:ring-2 focus:ring-purple-200`}
                        onClick={() =>
                          setShowChannelDropdown(!showChannelDropdown)
                        }
                      >
                        <span className="flex items-center">
                          {selectedChannel ? (
                            <>
                              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </span>
                              <span className="font-medium">
                                {
                                  channelOptions.find(
                                    (c) => c.id === selectedChannel,
                                  )?.icon
                                }{" "}
                                {
                                  channelOptions.find(
                                    (c) => c.id === selectedChannel,
                                  )?.name
                                }
                              </span>
                            </>
                          ) : (
                            <span>{tr.marketing.selectChannel}</span>
                          )}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${showChannelDropdown ? "rotate-180" : ""} ${selectedChannel ? "text-purple-600" : "text-gray-400"}`}
                        />
                      </button>
                      {showChannelDropdown && (
                        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-600 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {channelOptions.map((channel) => (
                            <button
                              key={channel.id}
                              type="button"
                              className={`w-full p-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-between first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                                selectedChannel === channel.id
                                  ? "bg-purple-100 dark:bg-purple-900/30"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedChannel(channel.id);
                                setShowChannelDropdown(false);
                              }}
                            >
                              <div className="flex items-center">
                                <span className="text-lg mr-3">
                                  {channel.icon}
                                </span>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {channel.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {channel.types.join(", ")}
                                  </div>
                                </div>
                              </div>
                              {selectedChannel === channel.id && (
                                <CheckCircle className="w-5 h-5 text-purple-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 키워드 입력 */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
                    <label className="block text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🔍{" "}
                      <span className="whitespace-nowrap">
                        {tr.marketing.contentKeywords}
                      </span>
                    </label>
                    <Input
                      value={contentKeywords}
                      onChange={(e) => setContentKeywords(e.target.value)}
                      placeholder={tr.marketing.keywordPlaceholder}
                      className="w-full text-base lg:text-lg h-14 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>예시:</strong>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm whitespace-nowrap">
                          커피, 카페, 원두
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm whitespace-nowrap">
                          패션, 스타일, 트렌드
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md text-sm whitespace-nowrap">
                          여행, 맛집, 힐링
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 마케팅 주제 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
                    <label className="block text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🎯{" "}
                      <span className="whitespace-nowrap">
                        {tr.marketing.marketingTopic}
                      </span>
                    </label>
                    <div className="flex space-x-3 mb-4">
                      <button
                        type="button"
                        className={`flex-1 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform  ${
                          marketingTopicMode === "ai"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300"
                        }`}
                        onClick={() => setMarketingTopicMode("ai")}
                      >
                        <Bot className="w-4 h-4 lg:w-5 lg:h-5 inline mr-2" />
                        <span className="whitespace-nowrap">
                          {tr.marketing.aiRecommend}
                        </span>
                      </button>
                      <button
                        type="button"
                        className={`flex-1 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform  ${
                          marketingTopicMode === "manual"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300"
                        }`}
                        onClick={() => setMarketingTopicMode("manual")}
                      >
                        <Edit className="w-4 h-4 lg:w-5 lg:h-5 inline mr-2" />
                        <span className="whitespace-nowrap">
                          {tr.marketing.directInput}
                        </span>
                      </button>
                    </div>

                    {marketingTopicMode === "ai" ? (
                      <div className="relative">
                        <button
                          type="button"
                          disabled={!contentKeywords.trim()}
                          className={`w-full h-14 px-4 text-left border-2 rounded-xl flex items-center justify-between transition-all duration-300 ${
                            marketingTopic && contentKeywords.trim()
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-white shadow-lg"
                              : contentKeywords.trim()
                                ? "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 cursor-pointer"
                                : "border-gray-200 dark:border-gray-gray-600 bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60"
                          }`}
                          onClick={() => {
                            if (contentKeywords.trim()) {
                              setShowTopicDropdown(!showTopicDropdown);
                            }
                          }}
                        >
                          <span className="flex items-center">
                            {marketingTopic && contentKeywords.trim() ? (
                              <>
                                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </span>
                                <span className="font-medium">
                                  {marketingTopic}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-500">
                                {contentKeywords.trim()
                                  ? currentLang === "ko"
                                    ? "AI 추천 주제를 선택하세요"
                                    : currentLang === "en"
                                      ? "Select AI recommended topic"
                                      : "Chọn chủ đề AI đề xuất"
                                  : currentLang === "ko"
                                    ? "키워드를 먼저 입력하세요"
                                    : currentLang === "en"
                                      ? "Please enter keywords first"
                                      : "Vui lòng nhập từ khóa trước"}
                              </span>
                            )}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${showTopicDropdown ? "rotate-180" : ""} ${marketingTopic && contentKeywords.trim() ? "text-purple-600" : "text-gray-400"}`}
                          />
                        </button>
                        {showTopicDropdown && contentKeywords.trim() && (
                          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-600 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                            {aiMarketingTopics.map((topic, index) => (
                              <button
                                key={index}
                                type="button"
                                className={`w-full p-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 dark:border-gray-600 last:border-b-0 flex items-center justify-between ${
                                  marketingTopic === topic
                                    ? "bg-purple-100 dark:bg-purple-900/30"
                                    : ""
                                }`}
                                onClick={() => {
                                  setMarketingTopic(topic);
                                  setShowTopicDropdown(false);
                                }}
                              >
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {topic}
                                </span>
                                {marketingTopic === topic && (
                                  <CheckCircle className="w-5 h-5 text-purple-600" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        value={marketingTopic}
                        onChange={(e) => setMarketingTopic(e.target.value)}
                        placeholder="마케팅 주제를 직접 입력하세요"
                        className="w-full text-base lg:text-lg h-14 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    )}
                  </div>

                  {/* 콘텐츠 유형 - 다중선택 */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
                    <label className="block text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🎨{" "}
                      <span className="whitespace-nowrap">
                        {tr.marketing.contentType}
                      </span>
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        (다중 선택 가능)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                      {[
                        {
                          value: "text",
                          label: tr.contentTypes.text,
                          icon: "📝",
                          desc: "글 위주의 콘텐츠",
                        },
                        {
                          value: "caption",
                          label: tr.contentTypes.caption,
                          icon: "💬",
                          desc: "짧은 설명 텍스트",
                        },
                        {
                          value: "image",
                          label: tr.contentTypes.image,
                          icon: "🖼️",
                          desc: "시각적 콘텐츠",
                        },
                        {
                          value: "hashtag",
                          label: tr.contentTypes.hashtag,
                          icon: "#️⃣",
                          desc: "태그 기반 콘텐츠",
                        },
                        {
                          value: "video",
                          label: tr.contentTypes.video,
                          icon: "🎬",
                          desc: "동영상 콘텐츠",
                        },
                      ].map((type) => {
                        const isSelected = contentType.includes(type.value);
                        const hasImageAndVideo =
                          contentType.includes("image") &&
                          contentType.includes("video");
                        const isDisabled =
                          (type.value === "image" &&
                            contentType.includes("video")) ||
                          (type.value === "video" &&
                            contentType.includes("image"));

                        return (
                          <div
                            key={type.value}
                            className={`p-3 lg:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform  relative ${
                              isDisabled
                                ? "border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 opacity-50 cursor-not-allowed"
                                : isSelected
                                  ? "border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg"
                                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300"
                            }`}
                            onClick={() => {
                              if (isDisabled) return;

                              if (isSelected) {
                                // 선택 해제
                                setContentType((prev) =>
                                  prev.filter((t) => t !== type.value),
                                );
                              } else {
                                // 선택 추가
                                setContentType((prev) => [...prev, type.value]);
                              }
                            }}
                          >
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1">
                                <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                              </div>
                            )}
                            <div className="text-center">
                              <div className="text-2xl lg:text-3xl mb-2">
                                {type.icon}
                              </div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base whitespace-nowrap">
                                {type.label}
                              </div>
                              <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                {type.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 이미지 개수 설정 */}
                    {contentType.includes("image") && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <label className="block text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          이미지 개수 설정
                        </label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                imageCount === num
                                  ? "bg-blue-600 text-white shadow-lg"
                                  : "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 border border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                              }`}
                              onClick={() => setImageCount(num)}
                            >
                              {num}개
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 업로드 예약 설정 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
                    <label className="block text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🕒{" "}
                      <span className="whitespace-nowrap">
                        {tr.marketing.uploadSchedule}
                      </span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4">
                      <button
                        type="button"
                        className={`px-3 lg:px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform  ${
                          scheduleMode === "immediate"
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-green-300"
                        }`}
                        onClick={() => setScheduleMode("immediate")}
                      >
                        <Clock className="w-4 h-4 lg:w-5 lg:h-5 mx-auto mb-1" />
                        <div className="text-xs lg:text-sm whitespace-nowrap">
                          {tr.marketing.immediate}
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`px-3 lg:px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform  ${
                          scheduleMode === "scheduled"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300"
                        }`}
                        onClick={() => setScheduleMode("scheduled")}
                      >
                        <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mx-auto mb-1" />
                        <div className="text-xs lg:text-sm whitespace-nowrap">
                          {currentLang === "ko"
                            ? "예약"
                            : currentLang === "en"
                              ? "Schedule"
                              : "Lịch trình"}
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`px-3 lg:px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform  ${
                          scheduleMode === "recurring"
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300"
                        }`}
                        onClick={() => setScheduleMode("recurring")}
                      >
                        <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mx-auto mb-1" />
                        <div className="text-xs lg:text-sm whitespace-nowrap">
                          {currentLang === "ko"
                            ? "반복"
                            : currentLang === "en"
                              ? "Repeat"
                              : "Lặp lại"}
                        </div>
                      </button>
                    </div>

                    {scheduleMode === "scheduled" && (
                      <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-inner">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                <Calendar className="w-4 h-4 text-white" />
                              </div>
                              {tr.marketing.date}
                            </label>
                            <div className="relative group">
                              <Input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) =>
                                  setScheduleDate(e.target.value)
                                }
                                className="w-full h-14 pl-6 pr-12 border-3 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-lg shadow-lg transition-all duration-300 group-hover:shadow-xl"
                                style={{
                                  WebkitAppearance: "none",
                                  MozAppearance: "textfield",
                                }}
                              />
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                <Clock className="w-4 h-4 text-white" />
                              </div>
                              {tr.marketing.time}
                            </label>
                            <div className="relative group">
                              <Input
                                type="time"
                                value={scheduleTime}
                                onChange={(e) =>
                                  setScheduleTime(e.target.value)
                                }
                                className="w-full h-14 pl-6 pr-12 border-3 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-lg shadow-lg transition-all duration-300 group-hover:shadow-xl"
                                style={{
                                  WebkitAppearance: "none",
                                  MozAppearance: "textfield",
                                }}
                              />
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl border border-blue-300 dark:border-blue-600">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {scheduleDate && scheduleTime
                              ? `${currentLang === "ko" ? "예약됨" : currentLang === "en" ? "Scheduled" : "Đã lên lịch"}: ${new Date(scheduleDate + "T" + scheduleTime).toLocaleString(currentLang === "ko" ? "ko-KR" : currentLang === "en" ? "en-US" : "vi-VN")}`
                              : `${currentLang === "ko" ? "날짜와 시간을 선택해주세요" : currentLang === "en" ? "Please select date and time" : "Vui lòng chọn ngày và giờ"}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {scheduleMode === "recurring" && (
                      <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-gradient-to-br dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-inner">
                        <div>
                          <label className="block text-sm font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                              <RefreshCw className="w-4 h-4 text-white" />
                            </div>
                            {currentLang === "ko"
                              ? "주기 설정"
                              : currentLang === "en"
                                ? "Frequency Settings"
                                : "Cài đặt tần suất"}
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              className={`w-full h-14 px-6 text-left border-3 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-lg ${
                                recurringSettings.frequency
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-white shadow-xl"
                                  : "border-purple-300 bg-white dark:bg-gray-700 hover:border-purple-400"
                              }`}
                              onClick={() =>
                                setShowRecurringDropdown(!showRecurringDropdown)
                              }
                            >
                              <span className="flex items-center">
                                {recurringSettings.frequency ? (
                                  <>
                                    <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                                      <CheckCircle className="w-5 h-5 text-white" />
                                    </span>
                                    <span className="font-semibold text-lg">
                                      {recurringSettings.frequency === "daily"
                                        ? currentLang === "ko"
                                          ? "매일 1회"
                                          : currentLang === "en"
                                            ? "Daily"
                                            : "Hàng ngày"
                                        : recurringSettings.frequency ===
                                            "weekly"
                                          ? currentLang === "ko"
                                            ? "매주 1회"
                                            : currentLang === "en"
                                              ? "Weekly"
                                              : "Hàng tuần"
                                          : recurringSettings.frequency ===
                                              "monthly"
                                            ? currentLang === "ko"
                                              ? "매월 1회"
                                              : currentLang === "en"
                                                ? "Monthly"
                                                : "Hàng tháng"
                                            : recurringSettings.frequency ===
                                                "custom"
                                              ? `${recurringSettings.customDays || 1}${currentLang === "ko" ? "일마다 1회" : currentLang === "en" ? " days interval" : " ngày một lần"}`
                                              : ""}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-gray-500 font-medium">
                                    {currentLang === "ko"
                                      ? "주기를 선택하세요"
                                      : currentLang === "en"
                                        ? "Select frequency"
                                        : "Chọn tần suất"}
                                  </span>
                                )}
                              </span>
                              <ChevronDown
                                className={`w-6 h-6 transition-transform duration-300 ${showRecurringDropdown ? "rotate-180" : ""} ${recurringSettings.frequency ? "text-purple-600" : "text-gray-400"}`}
                              />
                            </button>
                            {showRecurringDropdown && (
                              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-600 rounded-xl shadow-2xl">
                                {[
                                  {
                                    value: "daily",
                                    label:
                                      currentLang === "ko"
                                        ? "매일 1회"
                                        : currentLang === "en"
                                          ? "Daily"
                                          : "Hàng ngày",
                                    icon: "📅",
                                  },
                                  {
                                    value: "weekly",
                                    label:
                                      currentLang === "ko"
                                        ? "매주 1회"
                                        : currentLang === "en"
                                          ? "Weekly"
                                          : "Hàng tuần",
                                    icon: "📆",
                                  },
                                  {
                                    value: "monthly",
                                    label:
                                      currentLang === "ko"
                                        ? "매월 1회"
                                        : currentLang === "en"
                                          ? "Monthly"
                                          : "Hàng tháng",
                                    icon: "🗓️",
                                  },
                                  {
                                    value: "custom",
                                    label:
                                      currentLang === "ko"
                                        ? "직접 입력"
                                        : currentLang === "en"
                                          ? "Custom"
                                          : "Tùy chỉnh",
                                    icon: "⚙️",
                                  },
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    className={`w-full p-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-between first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                                      recurringSettings.frequency ===
                                      option.value
                                        ? "bg-purple-100 dark:bg-purple-900/30"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      setRecurringSettings((prev) => ({
                                        ...prev,
                                        frequency: option.value,
                                      }));
                                      setShowRecurringDropdown(false);
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <span className="text-xl mr-3">
                                        {option.icon}
                                      </span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {option.label}
                                      </span>
                                    </div>
                                    {recurringSettings.frequency ===
                                      option.value && (
                                      <CheckCircle className="w-5 h-5 text-purple-600" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {recurringSettings.frequency === "custom" && (
                          <div>
                            <label className="block text-sm font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                                <Hash className="w-4 h-4 text-white" />
                              </div>
                              {currentLang === "ko"
                                ? "간격 (일)"
                                : currentLang === "en"
                                  ? "Interval (days)"
                                  : "Khoảng cách (ngày)"}
                            </label>
                            <Input
                              type="number"
                              min="1"
                              max="365"
                              value={recurringSettings.customDays || ""}
                              onChange={(e) =>
                                setRecurringSettings((prev) => ({
                                  ...prev,
                                  customDays: parseInt(e.target.value) || 1,
                                }))
                              }
                              placeholder={
                                currentLang === "ko"
                                  ? "일수를 입력하세요"
                                  : currentLang === "en"
                                    ? "Enter number of days"
                                    : "Nhập số ngày"
                              }
                              className="w-full h-14 px-6 border-3 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 rounded-2xl font-medium text-lg shadow-lg"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            {tr.marketing.endDate}
                          </label>
                          <div className="relative group">
                            <Input
                              type="date"
                              value={recurringSettings.endDate}
                              onChange={(e) =>
                                setRecurringSettings((prev) => ({
                                  ...prev,
                                  endDate: e.target.value,
                                }))
                              }
                              className="w-full h-14 pl-6 pr-12 border-3 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-lg shadow-lg transition-all duration-300 group-hover:shadow-xl cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-8 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-datetime-edit]:text-lg [&::-webkit-datetime-edit]:font-medium [&::-webkit-datetime-edit-fields-wrapper]:justify-start"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl border border-purple-300 dark:border-purple-600">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                            <RefreshCw className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                            {recurringSettings.frequency
                              ? `${currentLang === "ko" ? "반복 설정" : currentLang === "en" ? "Repeat settings" : "Cài đặt lặp lại"}: ${
                                  recurringSettings.frequency === "daily"
                                    ? currentLang === "ko"
                                      ? "매일"
                                      : currentLang === "en"
                                        ? "daily"
                                        : "hàng ngày"
                                    : recurringSettings.frequency === "weekly"
                                      ? currentLang === "ko"
                                        ? "매주"
                                        : currentLang === "en"
                                          ? "weekly"
                                          : "hàng tuần"
                                      : recurringSettings.frequency ===
                                          "monthly"
                                        ? currentLang === "ko"
                                          ? "매월"
                                          : currentLang === "en"
                                            ? "monthly"
                                            : "hàng tháng"
                                        : `${recurringSettings.customDays || 1}${currentLang === "ko" ? "일마다" : currentLang === "en" ? " days" : " ngày"}`
                                } ${currentLang === "ko" ? "1회 실행" : currentLang === "en" ? "execution" : "thực hiện"}` +
                                (recurringSettings.endDate
                                  ? ` (${new Date(recurringSettings.endDate).toLocaleDateString(currentLang === "ko" ? "ko-KR" : currentLang === "en" ? "en-US" : "vi-VN")}${currentLang === "ko" ? "까지" : currentLang === "en" ? " until" : " đến"})`
                                  : "")
                              : currentLang === "ko"
                                ? "주기를 설정해주세요"
                                : currentLang === "en"
                                  ? "Please set frequency"
                                  : "Vui lòng thiết lập tần suất"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 업로드 옵션 */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
                    <label className="block text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🚀{" "}
                      <span className="whitespace-nowrap">
                        {tr.marketing.uploadOption}
                      </span>
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <button
                        type="button"
                        className={`p-4 rounded-xl font-semibold transition-all duration-300 transform  ${
                          uploadOption === "auto"
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-green-300"
                        }`}
                        onClick={() => setUploadOption("auto")}
                      >
                        <Zap className="w-6 h-6 mx-auto mb-2" />
                        <div className="whitespace-nowrap">
                          {tr.marketing.auto}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {currentLang === "ko"
                            ? "생성 후 바로 업로드"
                            : currentLang === "en"
                              ? "Upload immediately after generation"
                              : "Tải lên ngay sau khi tạo"}
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`p-4 rounded-xl font-semibold transition-all duration-300 transform  ${
                          uploadOption === "review"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300"
                        }`}
                        onClick={() => setUploadOption("review")}
                      >
                        <Eye className="w-6 h-6 mx-auto mb-2" />
                        <div className="whitespace-nowrap">
                          {tr.marketing.review}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {currentLang === "ko"
                            ? "검토 후 수정 가능"
                            : currentLang === "en"
                              ? "Editable after review"
                              : "Có thể chỉnh sửa sau khi xem xét"}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowGenerateModal(false);
                        resetGenerateForm();
                      }}
                      className="w-full sm:w-auto"
                    >
                      {tr.marketing.cancel}
                    </Button>
                    <Button
                      onClick={() => setAiGenerateStep(2)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
                      disabled={
                        !selectedChannel ||
                        !contentKeywords.trim() ||
                        !marketingTopic.trim() ||
                        !contentType.length
                      }
                    >
                      <span className="whitespace-nowrap">
                        {tr.marketing.nextStep}
                      </span>
                    </Button>
                  </div>
                </div>
              )}

              {/* 2단계: 생성 화면 */}
              {aiGenerateStep === 2 && (
                <div className="space-y-6 lg:space-y-8">
                  {/* 설정 요약 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Settings className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-purple-600" />
                      <span className="whitespace-nowrap">
                        {tr.marketing.contentSummary}
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Globe className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {tr.marketing.selectedChannel}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedChannel && (
                              <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                                <span className="text-sm">
                                  {
                                    channelOptions.find(
                                      (c) => c.id === selectedChannel,
                                    )?.icon
                                  }
                                </span>
                                <span className="text-xs font-medium text-blue-800 dark:text-blue-200 whitespace-nowrap">
                                  {
                                    channelOptions.find(
                                      (c) => c.id === selectedChannel,
                                    )?.name
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Hash className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {tr.marketing.keywords}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                            {contentKeywords}
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Target className="w-4 h-4 text-orange-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {tr.marketing.topic}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                            {marketingTopic}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <FileText className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {tr.marketing.type}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {contentType.map((type) => (
                              <span
                                key={type}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs font-medium whitespace-nowrap"
                              >
                                {type === "text"
                                  ? "📝 텍스트"
                                  : type === "caption"
                                    ? "💬 캡션"
                                    : type === "image"
                                      ? `🖼️ 이미지(${imageCount}개)`
                                      : type === "hashtag"
                                        ? "#️⃣ 해시태그"
                                        : type === "video"
                                          ? "🎬 비디오"
                                          : type}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Calendar className="w-4 h-4 text-indigo-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {tr.marketing.schedule}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {scheduleMode === "immediate"
                              ? "즉시 업로드"
                              : scheduleMode === "scheduled"
                                ? `예약: ${formatDate(scheduleDate)} ${scheduleTime}`
                                : `반복: ${recurringSettings.frequency} (${recurringSettings.interval})`}
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Upload className="w-4 h-4 text-pink-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {tr.marketing.upload}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {uploadOption === "auto"
                              ? "🚀 전자동"
                              : "👁️ 확인 후 편집"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 생성 상태 - 버튼 클릭 후에만 표시 */}
                  {isGenerating && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 lg:p-8 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        {/* 로딩 애니메이션 */}
                        <div className="relative">
                          <div className="animate-spin rounded-full h-16 w-16 lg:h-20 lg:w-20 border-4 border-purple-200 border-t-purple-600"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Wand2 className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
                          </div>
                        </div>

                        {/* 진행 상태 */}
                        <div className="space-y-4">
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                            <span className="whitespace-nowrap">
                              {currentLang === "ko"
                                ? "AI가 마법을 부리고 있어요! ✨"
                                : currentLang === "en"
                                  ? "AI is working its magic! ✨"
                                  : "AI đang tạo ra phép thuật! ✨"}
                            </span>
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">
                            <span className="whitespace-nowrap">
                              {currentLang === "ko"
                                ? "선택하신 "
                                : currentLang === "en"
                                  ? "Creating "
                                  : "Đang tạo "}
                            </span>
                            <span className="font-semibold text-purple-600 whitespace-nowrap">
                              {contentType.join(", ")}{" "}
                              {currentLang === "ko"
                                ? "콘텐츠"
                                : currentLang === "en"
                                  ? "content"
                                  : "nội dung"}
                            </span>
                            <span className="whitespace-nowrap">
                              {currentLang === "ko" ? "를 " : " "}
                            </span>
                            <span className="font-semibold text-purple-600 whitespace-nowrap">
                              {
                                channelOptions.find(
                                  (c) => c.id === selectedChannel,
                                )?.name
                              }{" "}
                              {currentLang === "ko"
                                ? "채널"
                                : currentLang === "en"
                                  ? "channel"
                                  : "kênh"}
                            </span>
                            <span className="whitespace-nowrap">
                              {currentLang === "ko"
                                ? "에 맞게 생성 중입니다."
                                : currentLang === "en"
                                  ? " for your platform."
                                  : " cho nền tảng của bạn."}
                            </span>
                          </p>
                        </div>

                        {/* 진행 바 */}
                        <div className="w-full max-w-md">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full animate-pulse"
                              style={{ width: `${generationProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">
                            {currentLang === "ko"
                              ? "콘텐츠 생성 중..."
                              : currentLang === "en"
                                ? "Generating content..."
                                : "Đang tạo nội dung..."}{" "}
                            {generationProgress}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setAiGenerateStep(1)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl"
                      disabled={isGenerating}
                    >
                      <ChevronUp className="w-4 h-4 mr-2" />
                      <span className="whitespace-nowrap">
                        {tr.marketing.previous}
                      </span>
                    </Button>
                    <Button
                      onClick={handleAIGenerate}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          <span className="whitespace-nowrap">
                            {tr.marketing.generating}
                          </span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          <span className="whitespace-nowrap">
                            {tr.marketing.generateStart}
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* 3단계: 미리보기 및 편집 */}
              {aiGenerateStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      👁️{" "}
                      {currentLang === "ko"
                        ? "콘텐츠 미리보기"
                        : currentLang === "en"
                          ? "Content Preview"
                          : "Xem trước nội dung"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentLang === "ko"
                        ? "생성된 콘텐츠를 확인하고 편집하세요"
                        : currentLang === "en"
                          ? "Review and edit the generated content"
                          : "Xem xét và chỉnh sửa nội dung đã tạo"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 콘텐츠 편집 영역 */}
                    <div className="lg:col-span-7 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <Edit className="w-4 h-4 mr-2" />
                          제목
                        </label>
                        <Input
                          value={`${marketingTopic} - ${channelOptions.find((c) => c.id === selectedChannel)?.name} 콘텐츠`}
                          className="w-full text-lg p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          콘텐츠
                        </label>
                        <textarea
                          defaultValue={`🌟 ${marketingTopic}에 대한 흥미로운 이야기를 소개합니다!

${contentKeywords}와 관련된 최신 트렌드와 유용한 정보를 공유드려요. 

✨ 주요 포인트:
• 실용적이고 유익한 내용
• 사용자 친화적인 접근
• 트렌드에 맞는 스타일

💡 더 자세한 내용이 궁금하시다면 댓글로 문의해주세요!

#${contentKeywords.split(",")[0]?.trim() || "트렌드"} #마케팅 #${marketingTopic.replace(/\s+/g, "")} #소셜미디어`}
                          className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500"
                          rows={10}
                        />
                      </div>

                      {/* 콘텐츠 정보 */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          콘텐츠 정보
                        </h4>
                        <div className="space-y-2 text-sm">
                          {contentType.includes("video") && (
                            <div className="flex items-center text-blue-600 dark:text-blue-400">
                              <Video className="w-4 h-4 mr-2" />
                              권장 길이: 15-60초
                            </div>
                          )}
                          <div className="flex items-center text-blue-600 dark:text-blue-400">
                            <Target className="w-4 h-4 mr-2" />
                            타겟:{" "}
                            {
                              channelOptions.find(
                                (c) => c.id === selectedChannel,
                              )?.name
                            }{" "}
                            사용자
                          </div>
                          <div className="flex items-center text-blue-600 dark:text-blue-400">
                            <Globe className="w-4 h-4 mr-2" />
                            플랫폼:{" "}
                            {
                              channelOptions.find(
                                (c) => c.id === selectedChannel,
                              )?.name
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI 추천 해시태그 영역 */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* AI 추천 해시태그 헤더 */}
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 text-white">
                        <h4 className="text-lg font-bold flex items-center">
                          <Hash className="w-5 h-5 mr-2" />
                          {tr.marketing.aiRecommendHashtags}
                        </h4>
                      </div>

                      {/* 해시태그 리스트 */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm max-h-96 overflow-y-auto">
                        <div className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b text-xs font-semibold text-gray-600 dark:text-gray-300">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-1">선택</div>
                            <div className="col-span-2">순위</div>
                            <div className="col-span-5">키워드</div>
                            <div className="col-span-2">인기도</div>
                            <div className="col-span-2">변화</div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {hashtagData.map((item, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="grid grid-cols-12 gap-2 items-center text-sm">
                                <div className="col-span-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedHashtags.includes(
                                      item.keyword,
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedHashtags((prev) => [
                                          ...prev,
                                          item.keyword,
                                        ]);
                                      } else {
                                        setSelectedHashtags((prev) =>
                                          prev.filter(
                                            (tag) => tag !== item.keyword,
                                          ),
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                  />
                                </div>
                                <div className="col-span-2 flex items-center">
                                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">
                                    {item.rank}
                                  </div>
                                </div>
                                <div className="col-span-5">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {item.keyword}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.source}
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <div className="flex items-center">
                                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                      <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                        style={{ width: `${item.popularity}%` }}
                                      ></div>
                                    </div>
                                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                      {item.popularity}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <span
                                    className={`text-xs font-medium ${
                                      item.change.startsWith("+")
                                        ? "text-green-600"
                                        : item.change.startsWith("-")
                                          ? "text-red-600"
                                          : "text-gray-600"
                                    }`}
                                  >
                                    {item.change}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 rounded-lg p-3">
                        💡 <strong>선택된 해시태그:</strong>{" "}
                        {selectedHashtags.length}개
                      </div>
                    </div>
                  </div>

                  {/* 미리보기 영역 */}
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      {
                        channelOptions.find((c) => c.id === selectedChannel)
                          ?.name
                      }{" "}
                      미리보기
                    </h4>

                    <div className="flex justify-center">{renderPreview()}</div>
                  </div>

                  <div className="flex justify-center space-x-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setAiGenerateStep(2)}
                      className="px-6 py-3 rounded-xl"
                    >
                      <ChevronUp className="w-4 h-4 mr-2" />
                      {tr.marketing.previous}
                    </Button>
                    <Button
                      onClick={handleFinalGenerate}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {tr.marketing.uploading}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 기존 모달들 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                새 콘텐츠 생성
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제목
                </label>
                <Input
                  value={newContent.title}
                  onChange={(e) =>
                    setNewContent({ ...newContent, title: e.target.value })
                  }
                  placeholder="콘텐츠 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  설명
                </label>
                <Input
                  value={newContent.description}
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      description: e.target.value,
                    })
                  }
                  placeholder="콘텐츠 설명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  내용
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                  value={newContent.content}
                  onChange={(e) =>
                    setNewContent({ ...newContent, content: e.target.value })
                  }
                  placeholder="콘텐츠 내용을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  미디어 유형
                </label>
                <select
                  value={newContent.mediaType}
                  onChange={(e) =>
                    setNewContent({ ...newContent, mediaType: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="text">텍스트</option>
                  <option value="image">이미지</option>
                  <option value="video">비디오</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  키워드
                </label>
                <Input
                  value={newContent.keywords}
                  onChange={(e) =>
                    setNewContent({ ...newContent, keywords: e.target.value })
                  }
                  placeholder="키워드를 입력하세요 (쉼표로 구분)"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateContent}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  생성
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 콘텐츠 미리보기 모달 */}
      {showPreviewModal && previewContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                콘텐츠 미리보기
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreviewModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {previewContent.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {previewContent.description}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {previewContent.content}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>키워드: {previewContent.keywords}</p>
                <p>플랫폼: {previewContent.platforms?.join(", ") || "없음"}</p>
                <p>생성일: {formatDate(previewContent.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
