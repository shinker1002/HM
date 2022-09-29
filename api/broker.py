import cv2
import os
import numpy as np
import sys
import datetime
import sqlite3
import time
import threading

from pathlib import Path
from django.apps import AppConfig
from django.conf import settings
from opencv.utils.centroidtracker import CentroidTracker
from opencv.utils.trackableobject import TrackableObject

BASE_DIR = Path(__file__).resolve().parent.parent

confThreshold = 0.6
nmsThreshold = 0.5
#inpWidth = 416 
#inpHeight = 416
inpWidth = 512
inpHeight = 512
trackableObjects = {}
totalDown = 0
totalUp = 0
ct = CentroidTracker(maxDisappeared=40, maxDistance=50)

class peopleCounter(AppConfig):
    name = 'api'
        
    def getOutputsNames(self, net):
        layersNames = net.getLayerNames()
        return [layersNames[i - 1] for i in net.getUnconnectedOutLayers()]
    
    def postprocess(self, frame, outs, con, cur, id):
        global confThreshold
        global nmsThreshold
        
        frameHeight = frame.shape[0]
        frameWidth = frame.shape[1]

        rects = []
        classIds = []
        confidences = []
        boxes = []
        for out in outs:
            for detection in out:
                scores = detection[5:]
                classId = np.argmax(scores)
                confidence = scores[classId]
                if confidence > confThreshold:
                    center_x = int(detection[0] * frameWidth)
                    center_y = int(detection[1] * frameHeight)
                    width = int(detection[2] * frameWidth)
                    height = int(detection[3] * frameHeight)
                    left = int(center_x - width / 2)
                    top = int(center_y - height / 2)
                    classIds.append(int(classId))
                    confidences.append(float(confidence))
                    boxes.append([left, top, width, height])

        indices = cv2.dnn.NMSBoxes(boxes, confidences, confThreshold, nmsThreshold)
        for i in indices:
            box = boxes[i]
            left = box[0]
            top = box[1]
            width = box[2]
            height = box[3]
            if classIds[i] == 0:
                rects.append((left, top, left + width, top + height))
                objects = ct.update(rects)
                self.counting(objects, frame, con, cur, id)
                
    def counting(self, objects, frame, con, cur, id):
        global trackableObjects
        global totalUp
        global totalDown
        
        frameHeight = frame.shape[0]
        frameWidth = frame.shape[1]

        for (objectID, centroid) in objects.items():
            to = trackableObjects.get(objectID, None)
    
            if to is None:
                to = TrackableObject(objectID, centroid)

            else:
                y = [c[1] for c in to.centroids]
                direction = centroid[1] - np.mean(y)
                to.centroids.append(centroid)
                
                # x = [c[0] for c in to.centroids]
                # direction = centroid[0] - np.mean(x)
                # to.centroids.append(centroid)
    
                if not to.counted:
                    if direction < 0 and centroid[1] in range(frameHeight//2 - 50, frameHeight//2 + 50):
                        totalUp += 1
                        to.counted = True
                        #입장시 DB쿼리
                        cur.execute("insert into api_stay values (?, ?, ?, ?)", (id, 1, "종합강의동",datetime.datetime.now()))
                        print(f"up: {id}")
                        id += 1
                        con.commit()

                    elif direction > 0 and centroid[1] in range(frameHeight//2 - 50, frameHeight//2 + 50):
                        totalDown += 1
                        to.counted = True
                        #퇴장시 DB쿼리
                        cur.execute("insert into api_stay values (?, ?, ?, ?)", (id, 0, "종합강의동",datetime.datetime.now()))
                        id += 1
                        con.commit()
                        print(f"down: {id}")
                        
                #if not to.counted:
                #    if direction < 0 and centroid[0] in range(frameWidth//2 - 50, frameWidth//2 + 50):
                #        totalUp += 1
                #        to.counted = True
                #    elif direction > 0 and centroid[0] in range(frameWidth//2 - 50, frameWidth//2 + 50):
                #        totalDown += 1
                #        to.counted = True
            trackableObjects[objectID] = to
            cv2.circle(frame, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)
        info = [
            ("Up", totalUp),
            ("Down", totalDown),
        ]

        for (i, (k, v)) in enumerate(info):
            text = "{}: {}".format(k, v)
            cv2.putText(frame, text, (10, frameHeight - ((i * 40) + 20)),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
    
    def people_counter(self, modelConfiguration, modelWeights):
        global inpWidth
        global inpHeight
        
        classesFile = os.path.join(BASE_DIR,'opencv','coco.names')
        classes = None
        with open(classesFile, 'rt') as f:
            classes = f.read().rstrip('\n').split('\n')
        
        print("[INFO] loading model...")
        net = cv2.dnn.readNet(modelConfiguration, modelWeights)
        net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
        net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)
        
        writer = None
        W = None
        H = None
        
        winName = 'Deep learning object detection in OpenCV'
        cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
        
        outputFile = "yolo_out_py.avi"
        # cap = cv2.VideoCapture("t2.mp4")
        cap = cv2.VideoCapture("http://admin:admin123!@203.252.230.244:8090/?action=stream")

        vid_writer = cv2.VideoWriter(outputFile, cv2.VideoWriter_fourcc('M','J','P','G'), 30, (round(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),round(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))))

        con, cur, id = self.connect_sqlite()

        while True:
            start_time = time.process_time()
            hasFrame, frame = cap.read()

            original_frame = frame
            setattr(settings, "ORIGIN_IMAGE", original_frame)

            frame = frame[300:1100, : 600]
            # frame = frame[150:, 200:1000]
            # print(frame.shape)
            frameHeight = frame.shape[0]
            frameWidth = frame.shape[1]
            
            cv2.line(frame, (0, frameHeight//2), (frameWidth, frameHeight//2), (0, 255, 255), 2)
            # cv2.line(frame, (frameWidth//2, 0), (frameWidth//2, frameHeight), (0, 255, 255), 2)
            
            if not hasFrame:
                print("Done processing !!!")
                print("Output file is stored as ", outputFile)
                cv2.waitKey(3000)
                cap.release()
                break
            
            blob = cv2.dnn.blobFromImage(frame, 1/255, (inpWidth, inpHeight), [0,0,0], 1, crop=False)
            net.setInput(blob)
            
            outs = net.forward(self.getOutputsNames(net))
            self.postprocess(frame, outs, con, cur, id)
            
            t, _ = net.getPerfProfile()
            # label = 'Inference time: %.2f ms' % (t * 1000.0 / cv.getTickFrequency())
            # cv.putText(frame, label, (0, 15), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255))
            
            vid_writer.write(frame.astype(np.uint8))
            end_time = time.process_time()
            print(f"time elapsed : {int(round((end_time - start_time) * 1000))}ms")
            
            setattr(settings, "RESULT_IMAGE", frame)

            # cv2.imshow(winName, frame)
            # key = cv2.waitKey(1)
            # if key == ord("q"):
            #     break
    
    def connect_sqlite(self):
        #db연결
        con = sqlite3.connect('db.sqlite3')
        cur = con.cursor()

        id = con.execute("select id from api_stay order by rowid desc limit 1").fetchall()
        id = id[0][0] + 1

        return con, cur, id

    def ready(self):
        print("hi")
        print("start")
        modelConfiguration = os.path.join(BASE_DIR,'opencv','yolov4.cfg')
        modelWeights = os.path.join(BASE_DIR,'opencv','yolov4.weights')

        t = threading.Thread(target=self.people_counter, args=(modelConfiguration,modelWeights))
        # self.people_counter(modelConfiguration, modelWeights)
        t.start()
        print("end")
    
    