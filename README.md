[English]
# IoVA

## Safe Driving Assistant for Newby Drivers
'IoVA' will present during drive that general car information and measured laser information.
This is IoVA's server application.

## How it Works
### Send my dangerous behaviors
If driver doing some dangerous behaviors, Android will send that information to server.
Server connected with client by MQTT(also rabbitMQ) protocol.

### Get locations where gathered user's danger information.
To receive locations put your Geo-location of android's GPS.
If you in dangerous boundary will received the locations.
Server will send you the dangerous locations.

## Contact
more information please contact us GDmail91@gmail.com


* * *
[Korean]
# IoVA

## 초보운전자를 위한 안전운전 도우미
'IoVA'는 운전하는 동안의 일반적인 차량정보와 레이저센서로 측정된 정보를 보여줍니다.
이 소스는 IoVA의 서버용 어플리케이션 입니다.

## 소개
### 위험 행동 전달
만약 운전자가 위험한 행동을 하게된다면, 안드로이드에서 운전정보를 서버에 보내줍니다.
서버와 클라이언트는 MQTT(+ rabbitMQ)로 연결되어있습니다.

### 위험지역 받기
위험지역을 받기 위해선 안드로이드의 GPS를 이용하여 Geo-location 을 보내야 합니다.
만약 당신이 위험지역안에 있다면 그 지역정보를 받습니다.
서버에선 당신에게 위험한지역을 알려주게 됩니다.

## 연락처
더 자세한 정보는 GDmail91@gmail.com 으로 연락해 주세요
