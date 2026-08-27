#!/usr/bin/env bash
# Which NVIDIA NIM models can THIS account actually use?
#
# Run locally. Your key stays on your machine — it is only sent to NVIDIA, and
# this script never prints it.
#
#   NVIDIA_API_KEY=nvapi-xxxx ./check-models.sh
#
# Reading the output:
#   OK      -> usable; safe to put first in MODEL_CANDIDATES in api/chat.js
#   404/410 -> not granted to your account, or retired. Unusable.
#   403     -> the KEY is wrong (not the model).
#   TIMEOUT -> accepted the request but never responded. Unusable in practice.
#
# Share the output freely: it contains model names and status codes, no secrets.

set -u

if [ -z "${NVIDIA_API_KEY:-}" ]; then
  echo "Set NVIDIA_API_KEY first, e.g.:"
  echo "  NVIDIA_API_KEY=nvapi-xxxx ./check-models.sh"
  exit 1
fi

MODELS=(
  "nvidia/nemotron-3.5-lightning-30b-a3b"
  "nvidia/nemotron-3-nano-30b-a3b"
  "nvidia/nemotron-3-ultra-550b-a55b"
  "google/gemma-4-31b-it"
  "deepseek-ai/deepseek-v4-flash-0731"
)

printf "%-42s %-8s %s\n" "MODEL" "STATUS" "TIME"
printf "%-42s %-8s %s\n" "-----" "------" "----"

for M in "${MODELS[@]}"; do
  START=$(date +%s)
  # Deliberately tiny: we're testing access, not quality.
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 25 \
    https://integrate.api.nvidia.com/v1/chat/completions \
    -H "Authorization: Bearer ${NVIDIA_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"${M}\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"max_tokens\":1}" \
    2>/dev/null)
  END=$(date +%s)
  ELAPSED=$((END - START))

  case "$CODE" in
    200) LABEL="OK" ;;
    000) LABEL="TIMEOUT" ;;
    404|410) LABEL="$CODE NO" ;;
    403) LABEL="403 KEY" ;;
    *) LABEL="$CODE" ;;
  esac
  printf "%-42s %-8s %ss\n" "$M" "$LABEL" "$ELAPSED"
done


echo
printf "%-42s %-8s %s\n" "EMBEDDING MODEL" "STATUS" "TIME"
printf "%-42s %-8s %s\n" "---------------" "------" "----"

EMBED=(
  "nvidia/nv-embedqa-mistral-7b-v2"
  "nvidia/embed-qa-4"
  "snowflake/arctic-embed-l"
  "nvidia/nemotron-3-embed-1b"
  "nvidia/llama-3.2-nv-embedqa-1b-v1"
)

for M in "${EMBED[@]}"; do
  START=$(date +%s)
  # input_type is required by NVIDIA's retrieval embedders.
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 25 \
    https://integrate.api.nvidia.com/v1/embeddings \
    -H "Authorization: Bearer ${NVIDIA_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"${M}\",\"input\":[\"hello\"],\"input_type\":\"query\"}" \
    2>/dev/null)
  END=$(date +%s)
  case "$CODE" in
    200) LABEL="OK" ;;
    000) LABEL="TIMEOUT" ;;
    404|410) LABEL="$CODE NO" ;;
    403) LABEL="403 KEY" ;;
    *) LABEL="$CODE" ;;
  esac
  printf "%-42s %-8s %ss\n" "$M" "$LABEL" "$((END - START))"
done

echo
echo "Chat: put the fastest OK model first in MODEL_CANDIDATES (api/chat.js)."
echo "Embeddings: put the first OK model first in EMBED_CANDIDATES (api/_rag.js)."
