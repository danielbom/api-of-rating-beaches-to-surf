__DIR=$(dirname "$0")
source "$__DIR/../env.sh"

curl -s \
  -H "Content-Type: application/json" \
  -H "Authorization: $token" \
  -X GET "$baseUrl/forecast"
