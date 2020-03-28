# Example Express integration

## Manual testing

### Get login hash

```bash
http POST localhost:3000/login username=admin password=admin
# "YWRtaW46YWRtaW4="
```

### Show contact details

```bash
http -a admin:admin localhost:3000/contact-details
# {
#     "name": "Root user",
#     "phoneNumber": "+55000000"
# }
```

### List and create an order

```bash
http -a admin:admin localhost:3000/order
# []
http -a admin:admin POST localhost:3000/order product="Switch" value="3000"
# {
#     "id": "1",
#     "product": "Switch",
#     "value": "3000"
# }
http -a admin:admin localhost:3000/order
# [
#     {
#         "id": "1",
#         "product": "Switch",
#         "value": "3000"
#     }
# ]
```

<!-- TODO: once we have support to query, add use cases here -->
