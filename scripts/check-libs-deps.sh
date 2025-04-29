#!/bin/bash

LIBS_JSON="{}"
depCheckScript=$(yarn bin depcheck)

# IGNORE_LIST format:
# Each line defines ignored dependencies for workspaces.
# Supports glob-style patterns like '*' (wildcard matching).
#
# Syntax:
#   <workspace-pattern> <type1>:<packages1>;<type2>:<packages2>;...
#
# where:
# - <workspace-pattern> can use * to match multiple workspaces
# - <type> is one of: deps, devDeps, missingDeps
# - <packages> is a comma-separated list of package names
#
# Example:
#   @fluxora/example-* deps:fluxora;devDeps:fluxora
#     → Matches all workspaces starting with "@fluxora/example-"
#     → Ignores "fluxora" in dependencies and devDependencies
#   @fluxora/adapter-express deps:rxjs
#     → Matches only "@fluxora/adapter-express"
#     → Ignores "rxjs" in dependencies
#   @fluxora-examples/base-profile missingDeps:order
#     → Matches "@fluxora-examples/base-profile"
#     → Ignores "order" in missing dependencies
#
IGNORE_LIST=$(cat <<EOF
@fluxora/example-base deps:reflect-metadata,@fluxora/framework-react
@fluxora-examples/base-* missingDeps:fluxora
@fluxora-examples/base-profile missingDeps:order
@fluxora/adapter-express deps:rxjs
EOF
)

get_ignore_packages() {
  local workspace=$1
  local type=$2

  while IFS= read -r line; do
    local pattern="${line%% *}"
    local value="${line#* }"

    if [[ "$workspace" == $pattern ]]; then
      IFS=';' read -ra parts <<< "$value"
      for part in "${parts[@]}"; do
        key="${part%%:*}"
        val="${part#*:}"
        if [[ "$key" == "$type" ]]; then
          echo "$val"
          return
        fi
      done
    fi
  done <<< "$IGNORE_LIST"

  echo ""
}

filterDependencies() {
  local type=$1
  local json=$2
  local packagesCsv=$3

  IFS=',' read -ra packages <<< "$packagesCsv"
  for pkg in "${packages[@]}"; do
    if [[ "$type" == "missingDeps" ]]; then
      json=$(echo "$json" | jq --arg p "$pkg" 'with_entries(select(.key != $p))')
    else
      json=$(echo "$json" | jq --arg p "$pkg" 'map(select(. != $p))')
    fi
  done
  echo "$json"
}

checkDependency() {
  local depPath=$1
  local depName=$2

  if [ -z "$depPath" ] || [ -z "$depName" ]; then
    echo "❌ Error: dependency path or name is empty"
    exit 1
  fi

  if [ "$depPath" == "." ]; then
    return
  fi

  echo "🔍 Checking $depName"

  pushd "$depPath" > /dev/null || { echo "❌ Error: Failed to enter $depPath"; exit 1; }
  local json
  json="$(node "$depCheckScript" --json)"
  popd > /dev/null || exit 1

  local deps=$(echo "$json" | jq -r '.dependencies // []')
  local devDeps=$(echo "$json" | jq -r '.devDependencies // []')
  local missingDeps=$(echo "$json" | jq -r '.missing // {}')

  for type in deps devDeps missingDeps; do
    local ignored=$(get_ignore_packages "$depName" "$type")
    if [ -n "$ignored" ]; then
      echo "⚠️  Filtering $type in $depName: $ignored"
      if [[ "$type" == "deps" ]]; then
        deps=$(filterDependencies "$type" "$deps" "$ignored")
      elif [[ "$type" == "devDeps" ]]; then
        devDeps=$(filterDependencies "$type" "$devDeps" "$ignored")
      elif [[ "$type" == "missingDeps" ]]; then
        missingDeps=$(filterDependencies "$type" "$missingDeps" "$ignored")
      fi
    fi
  done

  if [[ "$deps" == "[]" && "$devDeps" == "[]" && "$missingDeps" == "{}" ]]; then
    echo "✅ No remaining issues in $depName"
    return
  fi

  echo "📦 Issues found in $depName:"
  echo "$(
    jq -n \
      --argjson deps "$deps" \
      --argjson devDeps "$devDeps" \
      --argjson missingDeps "$missingDeps" \
      '{deps: $deps, devDeps: $devDeps, missingDeps: $missingDeps}'
  )"
  LIBS_JSON=$(echo "$LIBS_JSON" | jq ". + { \"$depName\": { \"deps\": $deps, \"devDeps\": $devDeps, \"missingDeps\": $missingDeps } }")

  echo
}

processWorkspaces() {
  WORKSPACES=$(yarn workspaces list --json | jq -c -r '{name, location}')

  for row in $WORKSPACES; do
    local name=$(echo "$row" | jq -r '.name')
    local location=$(echo "$row" | jq -r '.location')
    checkDependency "$location" "$name"
  done
}

processWorkspaces

if [[ "$LIBS_JSON" == "{}" ]]; then
  echo "🧹 No issues found, cleaning up."
  rm -f libs-deps.json
else
  echo "$LIBS_JSON" | jq --indent 2 '.' > libs-deps.json
fi
