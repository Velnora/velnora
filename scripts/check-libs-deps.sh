#!/bin/bash

LIBS_JSON="{}";

function checkDependency() {
  local dep=$1
  
  # check if dep variable not empty
  if [ -z "$dep" ]; then
    echo "Error: dependency variable is empty"
    exit 1
  fi
  
  local depCheckScript=$(yarn bin depcheck)

  pushd "libs/$dep" || exit 1
  local json="$(node "$depCheckScript" --json)";
  popd || exit 1
  
  local deps=$(echo "$json" | jq -r '.dependencies');
  local devDeps=$(echo "$json" | jq -r '.devDependencies');
  local missingDeps=$(echo "$json" | jq -r '.missing');
  
  if [[ "$deps" == "[]" && "$devDeps" == "[]" && "$missingDeps" == "{}" ]]; then
    return
  fi
  
  # add all vars to LIBS_JSON. like { "dep": { "deps": [], "devDeps": [], "missingDeps": [] } }
  LIBS_JSON=$(echo "$LIBS_JSON" | jq ". + { \"$dep\": { \"deps\": $deps, \"devDeps\": $devDeps, \"missingDeps\": $missingDeps } }");   
}

for dir in libs/*/ ; do
  checkDependency "$(basename "$dir")"
done

echo "$LIBS_JSON" | jq --indent 2 '.' > libs-deps.json
