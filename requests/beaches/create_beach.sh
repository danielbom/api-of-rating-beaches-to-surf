__DIR=$(dirname "$0")
source "$__DIR/../env.sh"

data='''{
  "lat": -33.32,
  "lng": 150.20,
  "name": "Marley",
  "position": "E"
}'''

curl -s \
  -H "Content-Type: application/json" \
  -H "Authorization: $token" \
  -d "$data" \
  -X POST "$baseUrl/beaches"
