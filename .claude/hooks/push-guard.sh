#!/usr/bin/env bash
# ============================================================================
# KÂRNET PUSH GUARD — PreToolUse Hook
# ============================================================================
# git push komutlarını yakalar ve uyarı verir.
# Hilmi açıkça "deploy et" demedikçe push YASAK.
# ============================================================================

set -uo pipefail

INPUT=$(cat)

# Bash tool kullanımından komutu çıkar
COMMAND=$(echo "$INPUT" | sed -n 's/.*"command"\s*:\s*"\([^"]*\)".*/\1/p' | head -1)

# git push tespit et
if echo "$COMMAND" | grep -qE "git\s+push"; then
  echo "🛑 PUSH GUARD: git push tespit edildi!" >&2
  echo "Hilmi açıkça 'deploy et' demedikçe push YASAKTIR." >&2
  echo "Komut: $COMMAND" >&2
  exit 2
fi

exit 0
