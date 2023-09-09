import json
import requests

# Địa chỉ URL của API
url = "https://www.traveloka.com/api/v2/hotel/searchList"


with open("cookie.txt", "r") as cookie_file:
    cookies = cookie_file.read()

with open("payload.json", "r") as json_file:
    payload = json.load(json_file)

headers = {
    "Cookie": cookies,
    "Origin": "https://www.traveloka.com",
    "X-Domain": "accomSearch",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
}

response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    data = response.json()

    with open("result.json", "w") as json_file:
        json.dump(data, json_file, indent=4)

    print("Kết quả đã được lưu vào tệp result.json")
else:
    print("Lỗi trong quá trình gọi API. Mã trạng thái:", response.status_code)
    print("Nội dung phản hồi từ API:\n", response.text)
    print("Response Headers:", response.headers)

