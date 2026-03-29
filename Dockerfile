# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# copy package ก่อนเพื่อ cache
COPY package*.json ./

RUN npm install

# copy source ทั้งหมด
COPY . .

# build nest
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# copyเฉพาะไฟล์ที่จำเป็น
COPY package*.json ./
RUN npm install --omit=dev

# copy build จาก stage แรก
COPY --from=builder /app/dist ./dist



EXPOSE 4000

CMD ["node", "dist/src/main.js"]