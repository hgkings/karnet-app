#!/usr/bin/env bash
# ============================================================================
# KÂRNET CODE GUARD v3.0 — PostToolUse Hook
# ============================================================================
# 9 Katmanlı mimari kurallarını her dosya yazımında denetler.
# CLAUDE.md'deki değişmez kuralların otomatik bekçisi.
#
# v3.0 Güncellemeler (2026-03-31):
#   Kullanıcı deneyimi denetiminden (39 bulgu) çıkan kurallar eklendi:
#   - K21: Marketing/blog sayfalarında layout wrapper zorunluluğu
#   - K22: page.tsx'te SEO metadata export zorunluluğu
#   - K23: Auth route'larda user enumeration koruması
#   - K24: Yanlış marka referansı tespiti (Stripe vs PayTR)
#   - K25: localStorage kullanımında cleanup uyarısı
#   - K26: Component'te return null yerine empty state mesajı
#
# Denetimler:
#   [K1]  UI katmanında DB/Service/Repository import yasağı
#   [K2]  any tipi yasağı
#   [K3]  console.log yasağı (console.error/warn izinli)
#   [K4]  eval() / new Function() yasağı
#   [K5]  Hardcoded secret/key yasağı
#   [K6]  Hata yutma yasağı (catch without throw/return)
#   [K7]  Server/Client Component uyumsuzluğu
#   [K8]  Korunan dosya uyarısı
#   [K9]  App Router yapı kuralları
#   [K10] Token/secret response body sızıntısı
#   [K11] SSRF koruması (request header ile URL oluşturma)
#   [K12] API route Zod validasyon zorunluluğu
#   [K13] Türkçe karakter hataları
#   [K14] Büyük dosya uyarısı
#   [K15] Kullanılmayan import tespiti
#   [K16] TODO/FIXME/HACK takibi
#   [K17] <img> yerine Next.js <Image> kontrolü
#   [K18] fetch() timeout kontrolü
#   [K19] Hardcoded localhost URL tespiti
#   [K20] .map() içinde key prop kontrolü
#   [K21] Marketing/blog sayfalarında layout wrapper zorunluluğu
#   [K22] page.tsx'te SEO metadata export zorunluluğu
#   [K23] Auth route'larda user enumeration koruması
#   [K24] Yanlış marka referansı tespiti (Stripe vs PayTR)
#   [K25] localStorage kullanımında cleanup uyarısı
#   [K26] Component'te return null — empty state mesajı gerekli
#   [K27] Pagination kontrolü — büyük veri listelerinde zorunlu
#   [K28] Erişilebilirlik — button/link'te aria-label veya metin zorunlu
#   [K29] Şifre validasyonu tutarlılığı (min 8 karakter)
#   [K30] API route'larda Türkçe hata mesajı zorunluluğu
# ============================================================================

set -uo pipefail

# --- stdin'den tool bilgisini al ---
INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | sed -n 's/.*"file_path"\s*:\s*"\([^"]*\)".*/\1/p' | head -1)
SUCCESS=$(echo "$INPUT" | sed -n 's/.*"success"\s*:\s*\(true\|false\).*/\1/p' | head -1)
SUCCESS=${SUCCESS:-false}

# --- Erken çıkış kontrolleri ---
[[ "$SUCCESS" != "true" ]] && exit 0
[[ -z "$FILE_PATH" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]] && exit 0
[[ "$FILE_PATH" =~ node_modules ]] && exit 0
[[ ! -f "$FILE_PATH" ]] && exit 0

# --- Değişkenler ---
ERRORS=0
WARNS=0
FILE_CONTENT=$(cat "$FILE_PATH")
FILE_NAME=$(basename "$FILE_PATH")
REL_PATH=${FILE_PATH##*/Trendyol-1/}
LINE_COUNT=$(echo "$FILE_CONTENT" | wc -l)

# Dosyanın hangi katmanda olduğunu belirle
IS_UI=false
IS_API=false
IS_SERVICE=false
IS_REPO=false

if [[ "$FILE_PATH" =~ (app/|components/) ]] && [[ ! "$FILE_PATH" =~ app/api/ ]]; then
  IS_UI=true
fi
if [[ "$FILE_PATH" =~ app/api/ ]]; then
  IS_API=true
fi
if [[ "$FILE_PATH" =~ services/ ]]; then
  IS_SERVICE=true
fi
if [[ "$FILE_PATH" =~ repositories/ ]]; then
  IS_REPO=true
fi

echo "━━━ KÂRNET GUARD v2 ━━━ $REL_PATH ($LINE_COUNT satır)"

# ============================================================================
# [K1] UI KATMANINDA DB/SERVICE/REPOSITORY IMPORT YASAĞI
# CLAUDE.md: "BU KURAL DÜNYA YANSA DEĞİŞMEZ"
# ============================================================================
if [[ "$IS_UI" == "true" ]]; then

  # Supabase importları (client hariç — UI'da createClient izinli)
  if echo "$FILE_CONTENT" | grep -qE "from ['\"].*supabase/(server|admin|middleware)"; then
    echo "❌ [K1] YASAK: UI katmanında Supabase server/admin importu — $REL_PATH" >&2
    ((ERRORS++))
  fi

  # Service importları
  if echo "$FILE_CONTENT" | grep -qE "from ['\"].*(services/|\.logic)"; then
    echo "❌ [K1] YASAK: UI katmanında Service importu — $REL_PATH" >&2
    ((ERRORS++))
  fi

  # Repository importları
  if echo "$FILE_CONTENT" | grep -qE "from ['\"].*(repositories/|\.repository)"; then
    echo "❌ [K1] YASAK: UI katmanında Repository importu — $REL_PATH" >&2
    ((ERRORS++))
  fi

  # DB helper importları
  if echo "$FILE_CONTENT" | grep -qE "from ['\"].*lib/db/"; then
    echo "❌ [K1] YASAK: UI katmanında DB helper importu — $REL_PATH" >&2
    ((ERRORS++))
  fi

  # Gateway importları
  if echo "$FILE_CONTENT" | grep -qE "from ['\"].*lib/gateway/"; then
    echo "❌ [K1] YASAK: UI katmanında Gateway importu — $REL_PATH" >&2
    ((ERRORS++))
  fi

  # SQL / tablo adı referansı
  if echo "$FILE_CONTENT" | grep -qE "(SELECT |INSERT |UPDATE |DELETE |CREATE TABLE|DROP TABLE)" | grep -vq "//"; then
    echo "❌ [K1] YASAK: UI katmanında SQL referansı — $REL_PATH" >&2
    ((ERRORS++))
  fi
fi

# createAdminClient app/ içinde yasak (API route'lar dahil — sadece repositories/ ve cron kullanabilir)
if [[ "$FILE_PATH" =~ app/ ]]; then
  if echo "$FILE_CONTENT" | grep -qE "createAdminClient|from ['\"].*supabase/admin"; then
    # helpers.ts'deki requireAdmin hariç
    if [[ "$FILE_NAME" != "helpers.ts" ]] && [[ "$FILE_NAME" != "audit.ts" ]]; then
      echo "❌ [K1] YASAK: app/ içinde createAdminClient kullanımı — sadece repositories/ kullanabilir — $REL_PATH" >&2
      ((ERRORS++))
    fi
  fi
fi

# ============================================================================
# [K2] any TİPİ YASAĞI
# ============================================================================
ANY_MATCHES=$(echo "$FILE_CONTENT" | grep -nE ":\s*any\b|<any>|as any" | grep -v "^\s*//" | grep -v "eslint-disable" || true)
if [[ -n "$ANY_MATCHES" ]]; then
  ANY_COUNT=$(echo "$ANY_MATCHES" | wc -l)
  echo "❌ [K2] YASAK: 'any' tipi kullanımı ($ANY_COUNT satır) — $REL_PATH" >&2
  echo "$ANY_MATCHES" | head -3 | while read -r line; do
    echo "   → $line" >&2
  done
  ((ERRORS++))
fi

# ============================================================================
# [K3] console.log YASAĞI (console.error/warn İZİNLİ)
# ============================================================================
LOG_MATCHES=$(echo "$FILE_CONTENT" | grep -nE "console\.(log|debug|info)\(" | grep -v "^\s*//" | grep -v "eslint-disable" || true)
if [[ -n "$LOG_MATCHES" ]]; then
  LOG_COUNT=$(echo "$LOG_MATCHES" | wc -l)
  echo "⚠️  [K3] console.log tespit ($LOG_COUNT satır) — production'da yasak — $REL_PATH"
  echo "$LOG_MATCHES" | head -3 | while read -r line; do
    echo "   → $line"
  done
  ((WARNS++))
fi

# ============================================================================
# [K4] eval() / new Function() YASAĞI
# ============================================================================
if echo "$FILE_CONTENT" | grep -qE "(^|[^a-zA-Z])eval\s*\(|new\s+Function\s*\("; then
  echo "❌ [K4] YASAK: eval() veya new Function() kullanımı — $REL_PATH" >&2
  ((ERRORS++))
fi

# ============================================================================
# [K5] HARDCODED SECRET/KEY YASAĞI
# ============================================================================
SECRET_MATCHES=$(echo "$FILE_CONTENT" | grep -nEi "(api_key|apikey|secret|password|token)\s*[:=]\s*['\"][^'\"]{8,}" | grep -v "process\.env" | grep -v "^\s*//" | grep -v "\.env" | grep -v "type\s" | grep -v "interface\s" | grep -v "placeholder" | grep -v "label" | grep -v "autoComplete" || true)
if [[ -n "$SECRET_MATCHES" ]]; then
  echo "❌ [K5] YASAK: Hardcoded secret/key tespit — $REL_PATH" >&2
  echo "$SECRET_MATCHES" | head -2 | while read -r line; do
    echo "   → $line" >&2
  done
  ((ERRORS++))
fi

# ============================================================================
# [K6] HATA YUTMA YASAĞI (catch without throw/return)
# İyileştirildi: fire-and-forget pattern (void + catch) tanınır
# ============================================================================
if echo "$FILE_CONTENT" | grep -qE "catch\s*[\({]"; then
  CATCH_LINES=$(echo "$FILE_CONTENT" | grep -nE "catch\s*[\({]" || true)
  if [[ -n "$CATCH_LINES" ]]; then
    while IFS= read -r catch_line; do
      LINE_NUM=$(echo "$catch_line" | cut -d: -f1)
      AFTER=$(echo "$FILE_CONTENT" | tail -n +"$LINE_NUM" | head -8)
      # throw veya return varsa OK
      if echo "$AFTER" | grep -qE "(throw |return )"; then
        continue
      fi
      # Boş catch {} OK — fire-and-forget pattern
      CATCH_BODY=$(echo "$AFTER" | tr -d '[:space:]')
      if echo "$CATCH_BODY" | grep -qE "catch\{?\}|catch\(\)\{?\}|catch\{//"; then
        continue
      fi
      # Yorum ile açıklanan boş catch OK (// silent, // fire-and-forget, vb.)
      if echo "$AFTER" | grep -qE "//\s*(silent|fire|ignore|intentional)"; then
        continue
      fi
      # Sadece console.log/error varsa — uyarı
      if echo "$AFTER" | grep -qE "console\.(log|error|warn)"; then
        echo "⚠️  [K6] Hata yutma riski: catch bloğu (satır $LINE_NUM) — throw/return eksik — $REL_PATH"
        ((WARNS++))
        break
      fi
    done <<< "$CATCH_LINES"
  fi
fi

# ============================================================================
# [K7] SERVER/CLIENT COMPONENT UYUMSUZLUĞU
# ============================================================================
if [[ "$IS_UI" == "true" ]] && [[ "$FILE_NAME" =~ \.(tsx)$ ]]; then
  HAS_USE_CLIENT=$(echo "$FILE_CONTENT" | grep -c "^['\"]use client['\"]" || true)

  if [[ "$HAS_USE_CLIENT" -eq 0 ]]; then
    if echo "$FILE_CONTENT" | grep -qE "(useState|useEffect|useRef|useCallback|useMemo|useReducer)\s*\("; then
      echo "❌ [K7] Server Component'te React hook kullanımı — 'use client' direktifi ekle — $REL_PATH" >&2
      ((ERRORS++))
    fi
    if echo "$FILE_CONTENT" | grep -qE "(onClick|onChange|onSubmit|onBlur|onFocus|onKeyDown)\s*="; then
      echo "❌ [K7] Server Component'te event handler — 'use client' direktifi ekle — $REL_PATH" >&2
      ((ERRORS++))
    fi
  fi
fi

# ============================================================================
# [K8] KORUNAN DOSYA UYARISI
# ============================================================================
PROTECTED_FILES=(
  "app/api/paytr/callback/route.ts"
  "app/api/paytr/create-payment/route.ts"
  "app/api/verify-payment/route.ts"
  "app/auth/callback/route.ts"
  "middleware.ts"
  "services/payment.logic.ts"
  "repositories/payment.repository.ts"
  "lib/supabase/admin.ts"
)

for pf in "${PROTECTED_FILES[@]}"; do
  if [[ "$FILE_PATH" == *"$pf" ]]; then
    echo "🔒 [K8] KORUNAN DOSYA değiştirildi — Hilmi onayı gerekli — $REL_PATH" >&2
    ((WARNS++))
    break
  fi
done

# ============================================================================
# [K9] APP ROUTER YAPI KURALLARI
# ============================================================================
if [[ "$FILE_PATH" =~ app/ ]]; then
  if [[ "$FILE_NAME" == "page.tsx" ]]; then
    if ! echo "$FILE_CONTENT" | grep -qE "export default (async )?function"; then
      echo "⚠️  [K9] page.tsx — export default function eksik — $REL_PATH"
      ((WARNS++))
    fi
  fi
  if [[ "$FILE_NAME" == "layout.tsx" ]]; then
    if ! echo "$FILE_CONTENT" | grep -q "children"; then
      echo "❌ [K9] layout.tsx — children prop eksik — $REL_PATH" >&2
      ((ERRORS++))
    fi
  fi
fi

# ============================================================================
# [K10] TOKEN/SECRET RESPONSE BODY SIZINTISI
# API route'larda session, access_token, refresh_token response'ta dönmemeli
# ============================================================================
if [[ "$IS_API" == "true" ]]; then
  TOKEN_LEAK=$(echo "$FILE_CONTENT" | grep -nEi "(data\.session|access_token|refresh_token|service_role)" | grep -v "^\s*//" | grep -v "cookie" || true)
  if [[ -n "$TOKEN_LEAK" ]]; then
    echo "❌ [K10] GÜVENLİK: API response'ta token/session sızıntısı riski — $REL_PATH" >&2
    echo "$TOKEN_LEAK" | head -2 | while read -r line; do
      echo "   → $line" >&2
    done
    ((ERRORS++))
  fi
fi

# ============================================================================
# [K11] SSRF KORUMASI
# request.headers.get('origin') veya request.headers.get('host') ile URL oluşturma yasak
# ============================================================================
if [[ "$IS_API" == "true" ]]; then
  SSRF_PATTERN=$(echo "$FILE_CONTENT" | grep -nE "request\.headers\.get\(['\"]origin['\"]|request\.headers\.get\(['\"]host['\"]" | grep -v "^\s*//" || true)
  if [[ -n "$SSRF_PATTERN" ]]; then
    # URL oluşturmada kullanılıyor mu kontrol et
    if echo "$FILE_CONTENT" | grep -qE "fetch\(.*origin|fetch\(.*host|\`\$\{.*origin"; then
      echo "❌ [K11] GÜVENLİK: SSRF riski — request header ile URL oluşturma yasak, env var kullan — $REL_PATH" >&2
      ((ERRORS++))
    else
      echo "⚠️  [K11] SSRF dikkat: request origin/host header kullanımı — $REL_PATH"
      ((WARNS++))
    fi
  fi
fi

# ============================================================================
# [K12] API ROUTE ZOD VALİDASYON ZORUNLULUĞU
# POST/PATCH/PUT endpoint'lerinde Zod schema kullanılmalı
# ============================================================================
if [[ "$IS_API" == "true" ]] && [[ "$FILE_NAME" == "route.ts" ]]; then
  HAS_MUTATING=$(echo "$FILE_CONTENT" | grep -qE "export async function (POST|PATCH|PUT)" && echo "true" || echo "false")
  if [[ "$HAS_MUTATING" == "true" ]]; then
    HAS_ZOD=$(echo "$FILE_CONTENT" | grep -qE "(safeParse|\.parse\(|Schema)" && echo "true" || echo "false")
    if [[ "$HAS_ZOD" == "false" ]]; then
      echo "⚠️  [K12] API route'ta POST/PATCH/PUT var ama Zod validasyon yok — $REL_PATH"
      ((WARNS++))
    fi
  fi
fi

# ============================================================================
# [K13] TÜRKÇE KARAKTER HATALARI (yaygın yanlışlar)
# String literal'larda Türkçe karakter kullanılmamış olabilir
# ============================================================================
if [[ "$IS_UI" == "true" ]] || [[ "$IS_API" == "true" ]]; then
  # Sadece string literal'larda kontrol et (tırnak içi)
  TR_ERRORS=$(echo "$FILE_CONTENT" | grep -nE "['\"].*\b(Basarili|basarili|Basarisiz|basarisiz|Guncelle|guncelle|Olustur|olustur|Duzenle|duzenle|Sifre|sifre|Urun|urun|Musteri|musteri|Odeme|odeme|Islem|islem|Dogrula|dogrula|Giris|Cikis)\b.*['\"]" | head -5 || true)
  if [[ -n "$TR_ERRORS" ]]; then
    TR_COUNT=$(echo "$TR_ERRORS" | wc -l)
    echo "⚠️  [K13] Türkçe karakter hatası olabilir ($TR_COUNT satır) — $REL_PATH"
    echo "$TR_ERRORS" | head -3 | while read -r line; do
      echo "   → $line"
    done
    ((WARNS++))
  fi
fi

# ============================================================================
# [K14] BÜYÜK DOSYA UYARISI
# 500+ satır dosyalar bölünmeyi düşünmeli
# ============================================================================
if [[ $LINE_COUNT -gt 500 ]]; then
  echo "⚠️  [K14] Büyük dosya: $LINE_COUNT satır — bölünmeyi düşün — $REL_PATH"
  ((WARNS++))
fi

# ============================================================================
# [K15] KULLANILMAYAN IMPORT TESPİTİ
# import edilen ama dosyada hiç kullanılmayan semboller
# ============================================================================
UNUSED_IMPORTS=""
while IFS= read -r import_line; do
  # import satırından sembolleri çıkar
  SYMBOLS=$(echo "$import_line" | sed -n "s/.*import\s*{\s*\([^}]*\)\s*}.*/\1/p" | tr ',' '\n' | sed 's/^\s*//;s/\s*$//' | sed 's/\s*as\s*.*$//')
  for sym in $SYMBOLS; do
    [[ -z "$sym" ]] && continue
    [[ "$sym" == "type" ]] && continue
    # İlk satır (import) hariç dosyada geçiyor mu?
    LINE_NUM=$(echo "$import_line" | cut -d: -f1)
    REST=$(echo "$FILE_CONTENT" | tail -n +"$((LINE_NUM + 1))")
    if ! echo "$REST" | grep -qw "$sym"; then
      UNUSED_IMPORTS="$UNUSED_IMPORTS $sym"
    fi
  done
done <<< "$(echo "$FILE_CONTENT" | grep -nE "^import\s*\{" || true)"

if [[ -n "$UNUSED_IMPORTS" ]]; then
  echo "⚠️  [K15] Kullanılmayan import:$UNUSED_IMPORTS — $REL_PATH"
  ((WARNS++))
fi

# ============================================================================
# [K16] TODO/FIXME/HACK TAKİBİ
# Unutulan geçici çözümler ve eksik işler görünür olmalı
# ============================================================================
TODO_MATCHES=$(echo "$FILE_CONTENT" | grep -nEi "(TODO|FIXME|HACK|XXX|TEMP|WORKAROUND|GECICI|gecici olarak)" | grep -v "node_modules" | head -5 || true)
if [[ -n "$TODO_MATCHES" ]]; then
  TODO_COUNT=$(echo "$TODO_MATCHES" | wc -l)
  echo "📝 [K16] TODO/FIXME tespit ($TODO_COUNT satır) — $REL_PATH"
  echo "$TODO_MATCHES" | head -3 | while read -r line; do
    echo "   → $line"
  done
  ((WARNS++))
fi

# ============================================================================
# [K17] <img> YERİNE NEXT.JS <Image> KONTROLÜ
# Next.js Image bileşeni kullanılmalı — performans ve SEO
# ============================================================================
if [[ "$IS_UI" == "true" ]]; then
  IMG_MATCHES=$(echo "$FILE_CONTENT" | grep -nE "<img\s" | grep -v "^\s*//" || true)
  if [[ -n "$IMG_MATCHES" ]]; then
    IMG_COUNT=$(echo "$IMG_MATCHES" | wc -l)
    echo "⚠️  [K17] <img> yerine next/image <Image> kullan ($IMG_COUNT satır) — $REL_PATH"
    echo "$IMG_MATCHES" | head -2 | while read -r line; do
      echo "   → $line"
    done
    ((WARNS++))
  fi
fi

# ============================================================================
# [K18] fetch() TIMEOUT KONTROLÜ
# Timeout olmadan fetch çağrısı sonsuz bekleyebilir
# ============================================================================
if echo "$FILE_CONTENT" | grep -qE "await\s+fetch\("; then
  HAS_ABORT=$(echo "$FILE_CONTENT" | grep -qE "(AbortController|signal:|timeout)" && echo "true" || echo "false")
  FETCH_COUNT=$(echo "$FILE_CONTENT" | grep -cE "await\s+fetch\(" || true)
  if [[ "$HAS_ABORT" == "false" ]] && [[ "$FETCH_COUNT" -gt 0 ]]; then
    echo "⚠️  [K18] fetch() timeout yok ($FETCH_COUNT çağrı) — AbortController veya timeout ekle — $REL_PATH"
    ((WARNS++))
  fi
fi

# ============================================================================
# [K19] HARDCODED LOCALHOST URL TESPİTİ
# Production'a giderse bozulur
# ============================================================================
LOCALHOST_MATCHES=$(echo "$FILE_CONTENT" | grep -nE "(http://localhost|http://127\.0\.0\.1|http://0\.0\.0\.0)" | grep -v "^\s*//" | grep -v "fallback" | grep -v "process\.env" || true)
if [[ -n "$LOCALHOST_MATCHES" ]]; then
  echo "⚠️  [K19] Hardcoded localhost URL — production'da bozulur — $REL_PATH"
  echo "$LOCALHOST_MATCHES" | head -2 | while read -r line; do
    echo "   → $line"
  done
  ((WARNS++))
fi

# ============================================================================
# [K20] .map() İÇİNDE key PROP KONTROLÜ
# React'ın en yaygın hatası — runtime uyarısı ve performans kaybı
# ============================================================================
if [[ "$FILE_NAME" =~ \.(tsx)$ ]]; then
  # .map( içeren satırdan sonraki 3 satırda key= var mı kontrol et
  MAP_LINES=$(echo "$FILE_CONTENT" | grep -nE "\.map\s*\(" || true)
  if [[ -n "$MAP_LINES" ]]; then
    while IFS= read -r map_line; do
      MAP_NUM=$(echo "$map_line" | cut -d: -f1)
      AFTER=$(echo "$FILE_CONTENT" | tail -n +"$MAP_NUM" | head -5)
      # JSX döndüren map — < ile başlayan satır var mı
      if echo "$AFTER" | grep -qE "(<[A-Z]|<div|<span|<li|<tr|<td|<a |<p |<button|<section|<article)"; then
        if ! echo "$AFTER" | grep -qE "key\s*="; then
          echo "⚠️  [K20] .map() içinde key prop eksik olabilir (satır $MAP_NUM) — $REL_PATH"
          ((WARNS++))
          break
        fi
      fi
    done <<< "$MAP_LINES"
  fi
fi

# ============================================================================
# [K21] MARKETING/BLOG SAYFALARINDA LAYOUT WRAPPER ZORUNLULUĞU
# Blog ve marketing sayfalarında Navbar + Footer olmalı
# Bulgu: K1 (blog'da navbar yok), Y1 (footer yok)
# ============================================================================
if [[ "$FILE_NAME" == "page.tsx" ]]; then
  # Blog sayfaları
  if [[ "$FILE_PATH" =~ app/blog/ ]] || [[ "$FILE_PATH" =~ app/pricing/ ]]; then
    HAS_NAVBAR=$(echo "$FILE_CONTENT" | grep -qE "(Navbar|Header|LegalPageLayout|MarketingLayout)" && echo "true" || echo "false")
    HAS_FOOTER=$(echo "$FILE_CONTENT" | grep -qE "(Footer|LegalPageLayout|MarketingLayout)" && echo "true" || echo "false")
    if [[ "$HAS_NAVBAR" == "false" ]]; then
      echo "❌ [K21] Marketing/blog sayfasında Navbar/Header eksik — kullanıcı sayfadan çıkamaz — $REL_PATH" >&2
      ((ERRORS++))
    fi
    if [[ "$HAS_FOOTER" == "false" ]]; then
      echo "❌ [K21] Marketing/blog sayfasında Footer eksik — legal sayfalara erişilemez — $REL_PATH" >&2
      ((ERRORS++))
    fi
  fi
  # Hakkımızda, iletişim vb. marketing sayfaları
  if [[ "$FILE_PATH" =~ app/(hakkimizda|iletisim|gizlilik|kullanim|mesafeli|iade)/ ]]; then
    if ! echo "$FILE_CONTENT" | grep -qE "(LegalPageLayout|Navbar|Header)"; then
      echo "⚠️  [K21] Marketing sayfasında layout wrapper eksik — $REL_PATH"
      ((WARNS++))
    fi
  fi
fi

# ============================================================================
# [K22] PAGE.TSX'TE SEO METADATA EXPORT ZORUNLULUĞU
# Her page.tsx'te metadata export olmalı (dashboard hariç)
# Bulgu: O6 (pricing'de metadata yok)
# ============================================================================
if [[ "$FILE_NAME" == "page.tsx" ]]; then
  # Dashboard ve auth sayfaları hariç — onlar dinamik
  if [[ ! "$FILE_PATH" =~ app/(dashboard|settings|admin|support|analysis|products|marketplace|cash-plan|break-even|billing|auth|basari|demo)/ ]]; then
    if ! echo "$FILE_CONTENT" | grep -qE "export (const|async function) (metadata|generateMetadata)"; then
      echo "⚠️  [K22] SEO: page.tsx'te metadata export eksik — $REL_PATH"
      ((WARNS++))
    fi
  fi
fi

# ============================================================================
# [K23] AUTH ROUTE'LARDA USER ENUMERATION KORUMASI
# Auth endpoint'lerinde farklı HTTP status ile email varlığı açıklanmamalı
# Bulgu: Y3 (şifre sıfırlama enumeration)
# ============================================================================
if [[ "$IS_API" == "true" ]] && [[ "$FILE_PATH" =~ app/api/auth/ ]]; then
  # "bulunamadı", "not found", "kayıtlı" gibi email varlığını açıklayan mesajlar
  ENUM_RISK=$(echo "$FILE_CONTENT" | grep -nEi "(bulunamad|not found|already registered|zaten kayitli|zaten kayıtlı)" | grep -v "^\s*//" || true)
  if [[ -n "$ENUM_RISK" ]]; then
    echo "❌ [K23] GÜVENLİK: Auth route'ta user enumeration riski — generic mesaj kullan — $REL_PATH" >&2
    echo "$ENUM_RISK" | head -2 | while read -r line; do
      echo "   → $line" >&2
    done
    ((ERRORS++))
  fi
  # Auth route'larda 409 status yasak (email var/yok ayrımı yapılmamalı)
  if echo "$FILE_CONTENT" | grep -qE "status:\s*409"; then
    echo "❌ [K23] GÜVENLİK: Auth route'ta 409 status — user enumeration riski — $REL_PATH" >&2
    ((ERRORS++))
  fi
fi

# ============================================================================
# [K24] YANLIŞ MARKA REFERANSI TESPİTİ
# Kârnet PayTR kullanıyor — Stripe referansları yanlış
# Bulgu: Y9 (settings'te "Stripe" yazıyor)
# ============================================================================
if echo "$FILE_CONTENT" | grep -qEi "stripe" | grep -vq "//"; then
  STRIPE_REFS=$(echo "$FILE_CONTENT" | grep -nEi "stripe" | grep -v "^\s*//" | grep -v "\.stripe\." || true)
  if [[ -n "$STRIPE_REFS" ]]; then
    echo "❌ [K24] Yanlış marka: 'Stripe' referansı — Kârnet PayTR kullanıyor — $REL_PATH" >&2
    echo "$STRIPE_REFS" | head -2 | while read -r line; do
      echo "   → $line" >&2
    done
    ((ERRORS++))
  fi
fi

# ============================================================================
# [K25] LOCALSTORAGE KULLANIMINDA CLEANUP UYARISI
# localStorage.setItem varsa logout'ta temizlenmeli
# Bulgu: Y10 (break-even'da localStorage temizlenmiyor)
# ============================================================================
if [[ "$IS_UI" == "true" ]]; then
  if echo "$FILE_CONTENT" | grep -qE "localStorage\.(setItem|getItem)"; then
    if ! echo "$FILE_CONTENT" | grep -qE "localStorage\.(removeItem|clear)"; then
      echo "⚠️  [K25] localStorage kullanımı var ama cleanup (removeItem/clear) yok — logout'ta temizlenmeli — $REL_PATH"
      ((WARNS++))
    fi
  fi
fi

# ============================================================================
# [K26] COMPONENT'TE RETURN NULL — EMPTY STATE MESAJI GEREKLİ
# Component null dönüyorsa kullanıcı boş ekran görür
# Bulgu: O4 (ParetoChart/SmartInsights null dönüyor)
# ============================================================================
if [[ "$IS_UI" == "true" ]] && [[ "$FILE_NAME" =~ \.(tsx)$ ]]; then
  # "return null" satırlarını bul
  NULL_RETURNS=$(echo "$FILE_CONTENT" | grep -nE "^\s*return null\s*;?\s*$" | grep -v "^\s*//" || true)
  if [[ -n "$NULL_RETURNS" ]]; then
    NULL_COUNT=$(echo "$NULL_RETURNS" | wc -l)
    echo "⚠️  [K26] Component'te 'return null' ($NULL_COUNT yer) — kullanıcı boş ekran görür, empty state mesajı ekle — $REL_PATH"
    echo "$NULL_RETURNS" | head -2 | while read -r line; do
      echo "   → $line"
    done
    ((WARNS++))
  fi
fi

# ============================================================================
# [K27] PAGİNATION KONTROLÜ
# Büyük veri listelerinde pagination zorunlu
# Bulgu: Y8 (admin yorumlarda pagination yok), O10 (destek biletlerinde yok)
# ============================================================================
if [[ "$IS_UI" == "true" ]] && [[ "$FILE_NAME" == "page.tsx" ]]; then
  # Admin sayfaları — tablo/liste varsa pagination olmalı
  if [[ "$FILE_PATH" =~ app/admin/ ]]; then
    HAS_LIST=$(echo "$FILE_CONTENT" | grep -qE "\.map\s*\(" && echo "true" || echo "false")
    HAS_PAGINATION=$(echo "$FILE_CONTENT" | grep -qEi "(pagination|sayfa|page.*size|per.*page|limit.*offset)" && echo "true" || echo "false")
    if [[ "$HAS_LIST" == "true" ]] && [[ "$HAS_PAGINATION" == "false" ]]; then
      echo "⚠️  [K27] Admin sayfasında liste var ama pagination yok — performans sorunu — $REL_PATH"
      ((WARNS++))
    fi
  fi
fi

# ============================================================================
# [K28] ERİŞİLEBİLİRLİK — BUTTON/LINK'TE ERİŞİLEBİLİRLİK
# İkon-only butonlarda aria-label zorunlu
# ============================================================================
if [[ "$IS_UI" == "true" ]] && [[ "$FILE_NAME" =~ \.(tsx)$ ]]; then
  # İkon-only butonlar (içinde sadece Icon component var, metin yok)
  ICON_BUTTONS=$(echo "$FILE_CONTENT" | grep -nE "<(button|Button)[^>]*>" | grep -v "aria-label" | grep -v "title=" || true)
  if [[ -n "$ICON_BUTTONS" ]]; then
    # İçinde metin olmayan butonları filtrele (sadece ikon varsa)
    ICON_ONLY=$(echo "$ICON_BUTTONS" | grep -E "Icon|<[A-Z][a-z]+\s*/>" | head -3 || true)
    if [[ -n "$ICON_ONLY" ]]; then
      echo "⚠️  [K28] Erişilebilirlik: İkon-only buton'da aria-label eksik olabilir — $REL_PATH"
      ((WARNS++))
    fi
  fi
fi

# ============================================================================
# [K29] ŞİFRE VALİDASYONU TUTARLILIĞI
# Şifre kontrolü yapılıyorsa minimum 8 karakter olmalı (6 değil)
# Bulgu: O1 (UI:8 vs API:6 tutarsızlığı)
# ============================================================================
if echo "$FILE_CONTENT" | grep -qE "password.*min.*6|\.min\(6.*ifre|\.length\s*<\s*6"; then
  echo "⚠️  [K29] Şifre validasyonu: min 6 karakter tespit — standart min 8 olmalı — $REL_PATH"
  ((WARNS++))
fi

# ============================================================================
# [K30] API ROUTE'LARDA TÜRKÇE HATA MESAJI ZORUNLULUĞU
# Kullanıcıya gösterilen hatalar Türkçe olmalı
# Bulgu: O5 (generic İngilizce hatalar)
# ============================================================================
if [[ "$IS_API" == "true" ]]; then
  ENG_ERRORS=$(echo "$FILE_CONTENT" | grep -nE "error:\s*['\"]" | grep -iE "(unauthorized|forbidden|not found|bad request|internal server error|something went wrong)" | grep -v "^\s*//" || true)
  if [[ -n "$ENG_ERRORS" ]]; then
    echo "⚠️  [K30] API'de İngilizce hata mesajı — Türkçe olmalı — $REL_PATH"
    echo "$ENG_ERRORS" | head -2 | while read -r line; do
      echo "   → $line"
    done
    ((WARNS++))
  fi
fi

# ============================================================================
# SONUÇ
# ============================================================================
if [[ $ERRORS -gt 0 ]]; then
  echo "━━━ ❌ $ERRORS HATA, $WARNS uyarı ━━━"
  exit 2
elif [[ $WARNS -gt 0 ]]; then
  echo "━━━ ⚠️  $WARNS uyarı ━━━"
  exit 0
else
  echo "━━━ ✅ Temiz ━━━"
  exit 0
fi
