# import sys
# import cv2
# import imagezmq

# image_hub = imagezmq.ImageHub(open_port="tcp://203.252.230.242:6666")

# # 배경 차분 알고리즘 객체 생성
# bs = cv2.createBackgroundSubtractorMOG2()
# #bs = cv2.createBackgroundSubtractorKNN() 
# bs.setDetectShadows(False)
# count = 0

# while True:  # show streamed images until Ctrl-C
#     rpi_name, frame = image_hub.recv_image()

#     if not rpi_name:
#         break
    
#     frame = cv2.flip(frame, 0) # like mirror
#     #frame = cv2.resize(frame, (800, 450), interpolation=cv2.INTER_AREA)
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     #gray = cv2.resize(gray, (800, 450), interpolation=cv2.INTER_AREA)

#     fgmask = bs.apply(gray)
#     back = bs.getBackgroundImage()

#     # 레이블링을 이용하여 바운딩 박스 표시
#     cnt, _, stats, centroid = cv2.connectedComponentsWithStats(fgmask)
#     for i in range(1, cnt):
#         x, y, w, h, area = stats[i]

#         if area < 10000:
#             continue

#         cv2.rectangle(frame, (x, y, w, h), (0, 0, 255), 2)

#     cv2.imshow('frame', frame)
#     if cv2.waitKey(20) == 27:
#         print(count)
#         break

#     # cv2.waitKey(1)
#     # cv2.destroyAllWindows()
#     image_hub.send_reply(b'OK')

import cv2
import imagezmq

class VideoStreaming:
    image = None
    ip = None
    port = None
    image_hub = None

    def __init__(self, ip, port):
        self.ip = ip
        self.port = port

        self.image_hub = imagezmq.ImageHub(open_port=f"tcp://{ip}:{port}")

    def startStreaming(self):
        while True:  # show streamed images until Ctrl-C
            rpi_name, image = self.image_hub.recv_image()

            self.image = image

            # cv2.imshow(rpi_name, image)  # 1 window for each RPi
            # k = cv2.waitKey(1)
            # if k == 27:
            #     break
            # image_hub.send_reply(b'OK')

    def getImage(self):
        return self.image