#!/bin/bash

LIBS_JSON="{}";
depCheckScript=$(yarn bin depcheck)

function checkDependency() {
  local depPath=$1
  local depName=$2

  if [ -z "$depPath" ] || [ -z "$depName" ]; then
    echo "Error: dependency path or name is empty"
    exit 1
  fi

  if [ "$depPath" == "." ]; then
    return
  fi

  pushd "$depPath" || { echo "Error: Failed to enter $depPath"; exit 1; }
  local json="$(node "$depCheckScript" --json)";
  popd || exit 1

  local deps=$(echo "$json" | jq -r '.dependencies // []' || echo "[]");
  local devDeps=$(echo "$json" | jq -r '.devDependencies // []' || echo "[]");
  local missingDeps=$(echo "$json" | jq -r '.missing // {}' || echo "{}");

  if [[ "$deps" != "[]" || "$devDeps" != "[]" || "$missingDeps" != "{}" ]]; then
    LIBS_JSON=$(echo "$LIBS_JSON" | jq ". + { \"$depName\": { \"deps\": $deps, \"devDeps\": $devDeps, \"missingDeps\": $missingDeps } }");
  fi
}

function processWorkspaces() {
  WORKSPACES=$(yarn workspaces list --json | jq -c -r '{name, location}')

  for row in $WORKSPACES; do
    local name=$(echo $row | jq -r '.name')
    local location=$(echo $row | jq -r '.location')
    checkDependency "$location" "$name"
  done
}

processWorkspaces

echo "$LIBS_JSON" | jq --indent 2 '.' > libs-deps.json
