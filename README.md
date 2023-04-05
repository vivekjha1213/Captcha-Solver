# Captcha-Solver

The URL for the endpoint :
POST:
http://localhost:8000/solve-captcha
Reqeuest Body:
Json->>
{
  "url": "pass the url"
}

curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com/"}' http://localhost:8000/solve-captcha

npm install express request-promise-native sharp


