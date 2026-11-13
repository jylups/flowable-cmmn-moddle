#!/usr/bin/env bash

###
# Fetches the CMMN models from the Flowable engine repository
# (https://github.com/flowable/flowable-engine, Apache-2.0) at a pinned
# commit into .flowable-models/, for the load-and-save report
# (npm run roundtrip).
#
# Only the CMMN files are downloaded: a partial clone without file
# contents, then a sparse checkout of *.cmmn, *.cmmn.xml and *.cmmn11.xml.
#
# Set FLOWABLE_ENGINE_REF to use another commit, branch or tag.
###

set -euo pipefail

cd "$(dirname "$0")/.."

REPO=https://github.com/flowable/flowable-engine.git
REF=${FLOWABLE_ENGINE_REF:-055f90ad53a581c76ec2a6f4973acd2498c443fd}
DEST=.flowable-models

if [ ! -d "$DEST/.git" ]; then
  git clone --quiet --filter=blob:none --no-checkout "$REPO" "$DEST"
fi

cd "$DEST"

git sparse-checkout set --no-cone '*.cmmn' '*.cmmn.xml' '*.cmmn11.xml'
git fetch --quiet --filter=blob:none origin "$REF"
git -c advice.detachedHead=false checkout --quiet FETCH_HEAD

COUNT=$(find . -path ./.git -prune -o -type f -print | wc -l | tr -d ' ')

echo "flowable-engine $(git rev-parse --short HEAD): $COUNT CMMN models in $DEST"
