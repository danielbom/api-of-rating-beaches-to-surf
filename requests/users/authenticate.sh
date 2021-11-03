__DIR=$(dirname "$0")
source "$__DIR/../env.sh"

data='''{
  "email": "dan@domain.com",
  "password": "123mudar"
}'''

curl -v \
  -H "Content-Type: application/json" \
  -d "$data" \
  -X POST "$baseUrl/users/authenticate"
