import React from "react";
import { Button } from "@/components/ui/button.js";
import { 
  Calendar, 
  User, 
  Users, 
  MessageSquare, 
  Edit 
} from "lucide-react";
import { calculateOverallProgress } from "../utils/calculations";

const PlanHeader = ({ plan, objectives, onEditClick }) => {
  return (
    <div className="p-8 text-white shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="mb-3 text-3xl font-bold">{plan.title}</h1>
          <p className="mb-4 text-lg text-blue-100">{plan.description}</p>

          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-xs text-blue-200">기간</p>
                  <p className="font-semibold">
                    {plan.startDate} ~ {plan.endDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-200" />
                <div>
                  <p className="text-xs text-green-200">담당자</p>
                  <p className="font-semibold">{plan.manager}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-200" />
                <div>
                  <p className="text-xs text-purple-200">타겟 고객</p>
                  <p className="font-semibold">{plan.targetPersona}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-pink-200" />
                <div>
                  <p className="text-xs text-pink-200">핵심 메시지</p>
                  <p className="text-sm font-semibold">{plan.coreMessage}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 진행률 표시 */}
          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/90">
                전체 진행률
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

        <Button
          onClick={onEditClick}
          className="text-white transition-all duration-200 border bg-white/10 border-white/30 hover:bg-white/20 backdrop-blur-sm"
        >
          <Edit className="w-4 h-4 mr-2" />
          수정
        </Button>
      </div>
    </div>
  );
};

export default PlanHeader;
