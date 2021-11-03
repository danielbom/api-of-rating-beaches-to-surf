__DIR=$(dirname "$0")
source "$__DIR/../env.sh"

curl -s \
  -H "Content-Type: application/json" \
  -X GET "$baseUrl/forecast"
