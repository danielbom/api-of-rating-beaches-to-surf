__DIR=$(dirname "$0")
source "$__DIR/../env.sh"

data='''{
  "name": "DanDan",
  "email": "dan@domain.com",
  "password": "123mudar"
}'''

curl -v \
  -H "Content-Type: application/json" \
  -d "$data" \
  -X POST "$baseUrl/users"
