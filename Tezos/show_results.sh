#!/bin/bash

# Pretty print SmartPy test results from LickAuction/log.txt

LOG_FILE="LickAuction/log.txt"

if [ ! -f "$LOG_FILE" ]; then
    echo "Error: $LOG_FILE not found"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

passed=0
failed=0
expected_errors=0

echo ""
echo -e "${BOLD}═══════════════════════════════════════════════════════════${NC}"

pending_verify=""
pending_exec=""

while IFS= read -r line; do
    # Check for OK/error after pending verify
    if [ -n "$pending_verify" ]; then
        if [[ $line =~ ^" OK"$ ]]; then
            echo -e "  ${GREEN}✓${NC} $pending_verify"
            ((passed++))
        else
            echo -e "  ${RED}✗${NC} $pending_verify"
            ((failed++))
        fi
        pending_verify=""
        continue
    fi

    # Check for result after pending exec
    if [ -n "$pending_exec" ]; then
        if [[ $line =~ "Expected error:" ]]; then
            error_msg="${line#*: }"
            echo -e "  ${YELLOW}⚡${NC} $pending_exec"
            echo -e "    ${YELLOW}Expected: ${error_msg}${NC}"
            ((expected_errors++))
        elif [[ $line =~ ^" -> " ]]; then
            echo -e "  ${GREEN}✓${NC} $pending_exec"
            ((passed++))
        fi
        pending_exec=""
        continue
    fi

    # Main heading (h1)
    if [[ $line =~ " h1: "(.*) ]]; then
        echo -e "${BOLD}${BLUE}  ${BASH_REMATCH[1]}${NC}"
        echo -e "${BOLD}═══════════════════════════════════════════════════════════${NC}"
        echo ""
    # Sub heading (h2)
    elif [[ $line =~ " h2: "(.*) ]]; then
        echo -e "${CYAN}▶ ${BASH_REMATCH[1]}${NC}"
    # Verification - save for next line
    elif [[ $line =~ ^"Verifying "(.*)"..."$ ]]; then
        pending_verify="${BASH_REMATCH[1]}"
    # Executing entrypoint - save for next line
    elif [[ $line =~ ^"Executing "(.*)"..."$ ]]; then
        pending_exec="${BASH_REMATCH[1]}"
    fi
done < "$LOG_FILE"

echo ""
echo -e "${BOLD}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Summary:${NC}"
echo -e "  ${GREEN}✓ Passed:${NC} $passed"
echo -e "  ${YELLOW}⚡ Expected errors:${NC} $expected_errors"
if [ $failed -gt 0 ]; then
    echo -e "  ${RED}✗ Failed:${NC} $failed"
fi
echo -e "${BOLD}═══════════════════════════════════════════════════════════${NC}"
echo ""
