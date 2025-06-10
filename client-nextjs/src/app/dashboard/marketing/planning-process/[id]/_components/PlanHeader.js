import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.js";
import { Calendar, User, Users, MessageSquare, Edit, X, Check } from "lucide-react";
import { calculateOverallProgress } from "../_utils/calculations";
import { useLanguage } from "@/contexts/languageContext";

const fetchUsers = async (offset = 0, limit = 10) => {
  const res = await fetch(`/api/users?offset=${offset}&limit=${limit}`);
  return res.json();
};

const mockUsers = [
  { id: 1, name: '김마케팅', dept: '마케팅팀', position: '팀장', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: '이기획', dept: '기획팀', position: '매니저', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: '박디자인', dept: '디자인팀', position: '사원', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: '최개발', dept: '개발팀', position: '주임', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 5, name: '정운영', dept: '운영팀', position: '대리', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
];

const PlanHeader = ({ plan, objectives, onEditClick }) => {
  const { t, language, changeLanguage } = useLanguage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({ ...plan });
  const [users, setUsers] = useState([]);
  const [userOffset, setUserOffset] = useState(0);
  const [userHasMore, setUserHasMore] = useState(true);
  const userListRef = useRef(null);

  // 담당자 드롭다운 열림 상태
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      // 최초 10명 로드
      fetchUsers(0, 10).then(data => {
        setUsers(data.users || []);
        setUserOffset(10);
        setUserHasMore(data.hasMore !== false);
      });
    }
  }, [isEditMode]);

  // 무한 스크롤 로드
  const handleUserScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && userHasMore) {
      fetchUsers(userOffset, 10).then(data => {
        setUsers(prev => [...prev, ...(data.users || [])]);
        setUserOffset(prev => prev + 10);
        setUserHasMore(data.hasMore !== false);
      });
    }
  };

  // 저장
  const handleSave = () => {
    // TODO: 저장 API 연동
    setIsEditMode(false);
  };
  // 취소
  const handleCancel = () => {
    setForm({ ...plan });
    setIsEditMode(false);
  };

  return (
    <div className="p-8 text-white shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl">

      <div className="flex items-startmb-6 ">
       
        <div className="flex-1 min-w-0">
          {/* 타이틀 */}
          {isEditMode ? (
            <input
              className="mb-3 text-3xl font-bold bg-white/20 rounded px-3 py-1 w-full text-white placeholder:text-white/60 focus:outline-none"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder={t("marketing.planTitlePlaceholder")}
            />
          ) : (
            <h1 className="mb-3 text-3xl font-bold break-words">{plan.title}</h1>
          )}
          {/* 설명 */}
          {isEditMode ? (
            <textarea
              className="mb-4 text-lg bg-white/20 rounded px-3 py-1 w-full text-white placeholder:text-white/60 focus:outline-none"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder={t("common.description")}
              rows={2}
            />
          ) : (
            <p className="mb-4 text-lg text-blue-100 break-words">{plan.description}</p>
          )}

          {/* 카드 컨테이너: flex로 변경, gap 유지 */}
          <div className="flex mb-6 w-full gap-4">
            {/* 기간 카드 */}
            <div
              className="p-4 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col"
              style={{ flexShrink: 0, flexBasis: 280, minWidth: 220, maxWidth: 340 }}
            >
              <div className="flex flex-col gap-2 w-full">
                <Calendar className="w-5 h-5 text-blue-200 flex-shrink-0 mb-1" />
                <p className="text-xs text-blue-200">{t("dashboard.period")}</p>
                {isEditMode ? (
                  <>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-xs text-blue-100 mb-1">{t("dashboard.startDate")}</label>
                      <input
                        type="date"
                        className="font-semibold bg-white/20 rounded px-2 py-1 text-white placeholder:text-white/60 focus:outline-none w-full z-50"
                        value={form.startDate}
                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                        style={{ zIndex: 50, position: 'relative' }}
                      />
                      <label className="text-xs text-blue-100 mt-2 mb-1">{t("dashboard.endDate")}</label>
                      <input
                        type="date"
                        className="font-semibold bg-white/20 rounded px-2 py-1 text-white placeholder:text-white/60 focus:outline-none w-full z-50"
                        value={form.endDate}
                        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                        style={{ zIndex: 50, position: 'relative' }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="font-semibold mt-2">
                    {plan.startDate} ~ {plan.endDate}
                  </p>
                )}
              </div>
            </div>
            {/* 오른쪽 카드 그룹 */}
            <div className="flex flex-grow min-w-0 gap-4">
              {/* 담당자 */}
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-3 w-full">
                  <User className="w-5 h-5 text-green-200 flex-shrink-0" />
                  <div className="w-full">
                    <p className="text-xs text-green-200">{t("dashboard.manager")}</p>
                    {isEditMode ? (
                      <div className="relative w-full">
                        <button
                          className="w-full flex items-center gap-2 font-semibold bg-white/20 rounded px-2 py-1 text-white placeholder:text-white/60 focus:outline-none border border-white/30 hover:bg-white/30 transition"
                          onClick={() => setShowUserDropdown(v => !v)}
                          type="button"
                        >
                          {(() => {
                            const selected = mockUsers.find(u => u.name === form.manager);
                            return selected ? (
                              <>
                                <img src={selected.avatar} alt={selected.name} className="w-6 h-6 rounded-full object-cover" />
                                <span>{selected.name}</span>
                                <span className="text-xs text-blue-100 ml-1">{selected.dept} · {selected.position}</span>
                              </>
                            ) : (
                              <span className="text-white/60">{t("dashboard.managerSelect")}</span>
                            );
                          })()}
                          <svg className="w-4 h-4 ml-auto text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {showUserDropdown && (
                          <div className="absolute z-30 w-full mt-1 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto border border-gray-200">
                            {mockUsers.map(u => (
                              <div
                                key={u.id}
                                className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-blue-50 ${form.manager === u.name ? 'bg-blue-100 font-bold' : ''}`}
                                onClick={() => {
                                  setForm(f => ({ ...f, manager: u.name }));
                                  setShowUserDropdown(false);
                                }}
                              >
                                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                                <div className="flex flex-col">
                                  <span className="text-gray-900 font-medium">{u.name}</span>
                                  <span className="text-xs text-gray-500">{u.dept} · {u.position}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const selected = mockUsers.find(u => u.name === plan.manager);
                          return selected ? (
                            <>
                              <img src={selected.avatar} alt={selected.name} className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-semibold">{selected.name}</span>
                              <span className="text-xs text-blue-100 ml-1">{selected.dept} · {selected.position}</span>
                            </>
                          ) : (
                            <span className="font-semibold">{plan.manager}</span>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* 타겟 고객 */}
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-3 w-full">
                  <Users className="w-5 h-5 text-purple-200 flex-shrink-0" />
                  <div className="w-full">
                    <p className="text-xs text-purple-200">{t("dashboard.target")}</p>
                    {isEditMode ? (
                      <textarea
                        className="font-semibold bg-white/20 rounded px-2 py-1 w-full text-white placeholder:text-white/60 focus:outline-none"
                        value={form.targetPersona}
                        onChange={e => setForm(f => ({ ...f, targetPersona: e.target.value }))}
                        placeholder={t("dashboard.targetPlaceholder")}
                        rows={2}
                      />
                    ) : (
                      <p className="font-semibold">{plan.targetPersona}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* 핵심 메시지 */}
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-3 w-full">
                  <MessageSquare className="w-5 h-5 text-pink-200 flex-shrink-0" />
                  <div className="w-full">
                    <p className="text-xs text-pink-200">{t("dashboard.coreMessage")}</p>
                    {isEditMode ? (
                      <textarea
                        className="text-sm font-semibold bg-white/20 rounded px-2 py-1 w-full text-white placeholder:text-white/60 focus:outline-none"
                        value={form.coreMessage}
                        onChange={e => setForm(f => ({ ...f, coreMessage: e.target.value }))}
                        placeholder={t("dashboard.coreMessagePlaceholder")}
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm font-semibold">{plan.coreMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 진행률 표시 */}
          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/90">
                {t("dashboard.progress")}
              </span>
              <span className="text-lg font-bold">
                {calculateOverallProgress(objectives)}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/20">
              <div
                className="h-3 transition-all duration-700 rounded-full shadow-sm bg-gradient-to-r from-green-400 to-blue-400"
                style={{ width: `${calculateOverallProgress(objectives)}%` }}
              ></div>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default PlanHeader;
