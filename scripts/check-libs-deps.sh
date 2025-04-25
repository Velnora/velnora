#!/bin/bash

LIBS_JSON="{}"
depCheckScript=$(yarn bin depcheck)

EXCEPTION_LIST=$(cat <<EOF
@fluxora/example-base deps:reflect-metadata,@fluxora/framework-react
@base-example/profile missingDeps:order
@fluxora/adapter-express deps:rxjs
EOF
)

get_exceptions() {
  local workspace=$1
  local type=$2

  local line=$(echo "$EXCEPTION_LIST" | grep "^$workspace ")
  if [ -z "$line" ]; then
    echo ""
    return
  fi

  # Extract value after workspace name
  local value=${line#"$workspace "}
  IFS=';' read -ra parts <<< "$value"

  for part in "${parts[@]}"; do
    key="${part%%:*}"
    val="${part#*:}"
    if [[ "$key" == "$type" ]]; then
      echo "$val"
      return
    fi
  done

  echo ""
}

# Remove specified packages from a jq array or object
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
    local exceptions=$(get_exceptions "$depName" "$type")
    if [ -n "$exceptions" ]; then
      echo "⚠️  Filtering $type in $depName: $exceptions"
      if [[ "$type" == "deps" ]]; then
        deps=$(filterDependencies "$type" "$deps" "$exceptions")
      elif [[ "$type" == "devDeps" ]]; then
        devDeps=$(filterDependencies "$type" "$devDeps" "$exceptions")
      elif [[ "$type" == "missingDeps" ]]; then
        missingDeps=$(filterDependencies "$type" "$missingDeps" "$exceptions")
      fi
    fi
  done

  if [[ "$deps" != "[]" || "$devDeps" != "[]" || "$missingDeps" != "{}" ]]; then
    echo "📦 Issues found in $depName:"
    echo "$(
      jq -n \
        --argjson deps "$deps" \
        --argjson devDeps "$devDeps" \
        --argjson missingDeps "$missingDeps" \
        '{deps: $deps, devDeps: $devDeps, missingDeps: $missingDeps}'
    )"
    LIBS_JSON=$(echo "$LIBS_JSON" | jq ". + { \"$depName\": { \"deps\": $deps, \"devDeps\": $devDeps, \"missingDeps\": $missingDeps } }")
  else
    echo "✅ No remaining issues in $depName"
  fi

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

echo "$LIBS_JSON" | jq --indent 2 '.' > libs-deps.json
