###############################################
# nginx/Dockerfile (변경 후)
###############################################
FROM nginx:stable-alpine

WORKDIR /etc/nginx

# 1) nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 2) SSL 인증서는 런타임 볼륨 마운트로 처리하므로 COPY 하지 않음

# 3) HTTP(80), HTTPS(443) 포트 노출
EXPOSE 80
EXPOSE 443

# 4) 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]
