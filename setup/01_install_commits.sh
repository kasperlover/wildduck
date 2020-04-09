#! /bin/bash

OURNAME=01_install_commits.sh

NODEREPO="node_12.x"
MONGODB="4.0"
CODENAME=`lsb_release -c -s`

WILDDUCK_COMMIT="7f491802578a019a66e49c55a876ea59d8b5e3d9"
ZONEMTA_COMMIT="5b697fb6aa6bfb604212f31d59bb926bd7845255" # zone-mta-template
WEBMAIL_COMMIT="9227ec04ffb8c7e92b39239137d7c448d9e4bfc2"
WILDDUCK_ZONEMTA_COMMIT="d6d5d586b9ffd9ab973fb0c69bdd7fd0ab7c032a"
WILDDUCK_HARAKA_COMMIT="764f44db1205c1b827cdfd494d78f0782bb03329"
HARAKA_VERSION="2.8.25"

echo -e "\n-- Executing ${ORANGE}${OURNAME}${NC} subscript --"
