#User API Spesifications

##Register user API

- Endpoint : POST /api/users
- Request Body :

```json
{
  "name": "Ahmad",
  "email": "ahmad@gmail.com",
  "password": "ahmad"
}
```

- Response Success :

```json
{
  "errors": null,
  "message": "Aktivasi akun dikirim ke email anda",
  "data": [
    {
      "name": "Ahmad",
      "email": "ahmad@gmail.com",
      "password": "ahmad"
    }
  ]
}
```
