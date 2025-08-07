#!/bin/bash

# Rebranding script for Universal Form Builder
# Usage: ./scripts/dev/rebrand.sh [preset_name] [custom_name]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Available presets
PRESETS=("formular" "hr" "medical" "legal" "government" "generic")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo -e "${BLUE}Usage:${NC}"
    echo "  $0 [preset_name]                    # Apply a preset"
    echo "  $0 custom [brand_name] [use_case]   # Apply custom branding"
    echo ""
    echo -e "${BLUE}Available presets:${NC}"
    for preset in "${PRESETS[@]}"; do
        echo "  - $preset"
    done
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  $0 formular              # Apply Formular branding"
    echo "  $0 hr                    # Apply HR branding"
    echo "  $0 medical               # Apply medical branding"
    echo "  $0 custom \"MyApp\" \"HR\"  # Custom branding"
}

apply_preset() {
    local preset=$1
    local env_file="$FRONTEND_DIR/.env.local"
    
    echo -e "${GREEN}Applying $preset preset...${NC}"
    
    # Create .env.local if it doesn't exist
    touch "$env_file"
    
    # Remove existing branding variables
    sed -i '/^NEXT_PUBLIC_BRAND_/d' "$env_file"
    
    # Add preset selection
    echo "NEXT_PUBLIC_BRAND_PRESET=$preset" >> "$env_file"
    
    echo -e "${GREEN}✓ $preset preset applied!${NC}"
    echo -e "${YELLOW}Restart your dev server to see changes.${NC}"
}

apply_custom() {
    local brand_name=$1
    local use_case=${2:-"Universal Intake"}
    local env_file="$FRONTEND_DIR/.env.local"
    
    echo -e "${GREEN}Applying custom branding: $brand_name ($use_case)${NC}"
    
    # Create .env.local if it doesn't exist
    touch "$env_file"
    
    # Remove existing branding variables
    sed -i '/^NEXT_PUBLIC_BRAND_/d' "$env_file"
    
    # Add custom branding
    cat >> "$env_file" << EOF
NEXT_PUBLIC_BRAND_NAME="$brand_name"
NEXT_PUBLIC_BRAND_SHORT_NAME="$brand_name"
NEXT_PUBLIC_BRAND_DESCRIPTION="AI-Ready Intake System - $use_case"
NEXT_PUBLIC_BRAND_USE_CASE="$use_case"
NEXT_PUBLIC_BRAND_DOMAIN="${brand_name,,}.com"
EOF
    
    echo -e "${GREEN}✓ Custom branding applied!${NC}"
    echo -e "${YELLOW}Restart your dev server to see changes.${NC}"
}

# Main script logic
if [ $# -eq 0 ]; then
    print_usage
    exit 1
fi

case $1 in
    "custom")
        if [ $# -lt 2 ]; then
            echo -e "${RED}Error: Custom branding requires a brand name.${NC}"
            print_usage
            exit 1
        fi
        apply_custom "$2" "$3"
        ;;
    *)
        # Check if it's a valid preset
        if [[ " ${PRESETS[@]} " =~ " $1 " ]]; then
            apply_preset "$1"
        else
            echo -e "${RED}Error: Invalid preset '$1'${NC}"
            print_usage
            exit 1
        fi
        ;;
esac 