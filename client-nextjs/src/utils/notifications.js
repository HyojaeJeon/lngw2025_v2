import { toast } from "@/hooks/useToast";

export const notifySuccess = (message) => {
  toast({
    title: "성공",
    description: message,
    variant: "default",
  });
};

export const notifyError = (message) => {
  toast({
    title: "오류",
    description: message,
    variant: "destructive",
  });
};

export const notifyWarning = (message) => {
  toast({
    title: "경고",
    description: message,
    variant: "warning",
  });
};

export const notifyInfo = (message) => {
  toast({
    title: "정보",
    description: message,
    variant: "default",
  });
};