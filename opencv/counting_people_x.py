import cv2
import numpy as np
import time
from utils.centroidtracker import CentroidTracker
from utils.trackableobject import TrackableObject

class peopleCounter:
    
    def __init__(self):
        self.confThreshold = 0.6
        self.nmsThreshold = 0.5
        #self.inpWidth = 512 
        #self.inpHeight = 512
        self.inpWidth = 416
        self.inpHeight = 416
        self.trackers = []
        self.trackableObjects = {}
        self.totalDown = 0
        self.totalUp = 0
        self.ct = CentroidTracker(maxDisappeared=40, maxDistance=50)
        
    def getOutputsNames(self, net):
        layersNames = net.getLayerNames()
        return [layersNames[i - 1] for i in net.getUnconnectedOutLayers()]
    
    def postprocess(self, frame, outs):
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
                if confidence > self.confThreshold:
                    center_x = int(detection[0] * frameWidth)
                    center_y = int(detection[1] * frameHeight)
                    width = int(detection[2] * frameWidth)
                    height = int(detection[3] * frameHeight)
                    left = int(center_x - width / 2)
                    top = int(center_y - height / 2)
                    classIds.append(int(classId))
                    confidences.append(float(confidence))
                    boxes.append([left, top, width, height])

        indices = cv2.dnn.NMSBoxes(boxes, confidences, self.confThreshold, self.nmsThreshold)
        for i in indices:
            box = boxes[i]
            left = box[0]
            top = box[1]
            width = box[2]
            height = box[3]
            if classIds[i] == 0:
                rects.append((left, top, left + width, top + height))
                objects = self.ct.update(rects)
                self.counting(objects, frame)
                
    def counting(self, objects, frame):
        frameHeight = frame.shape[0]
        frameWidth = frame.shape[1]

        for (objectID, centroid) in objects.items():
            to = self.trackableObjects.get(objectID, None)
    
            if to is None:
                to = TrackableObject(objectID, centroid)

            else:
                x = [c[0] for c in to.centroids]
                direction = centroid[0] - np.mean(x)
                to.centroids.append(centroid)
                
                # x = [c[0] for c in to.centroids]
                # direction = centroid[0] - np.mean(x)
                # to.centroids.append(centroid)
    
                #if not to.counted:
                #    if direction < 0 and centroid[0] in range(frameHeight//2 - 50, frameHeight//2 + 50):
                #        self.totalUp += 1
                #        to.counted = True
                #    elif direction > 0 and centroid[0] in range(frameHeight//2 - 50, frameHeight//2 + 50):
                #        self.totalDown += 1
                #        to.counted = True
                        
                if not to.counted:
                    if direction < 0 and centroid[0] in range(frameWidth//2 - 50, frameWidth//2 + 50):
                        self.totalUp += 1
                        to.counted = True
                    elif direction > 0 and centroid[0] in range(frameWidth//2 - 50, frameWidth//2 + 50):
                        self.totalDown += 1
                        to.counted = True
            self.trackableObjects[objectID] = to
            cv2.circle(frame, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)
        info = [
            ("Up", self.totalUp),
            ("Down", self.totalDown),
        ]

        for (i, (k, v)) in enumerate(info):
            text = "{}: {}".format(k, v)
            cv2.putText(frame, text, (10, frameHeight - ((i * 40) + 20)),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
    
    def people_counter(self, modelConfiguration, modelWeights):
        classesFile = "coco.names";
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
        cap = cv2.VideoCapture("t4.mp4")
        vid_writer = cv2.VideoWriter(outputFile, cv2.VideoWriter_fourcc('M','J','P','G'), 30, (round(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),round(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))))
    
        while True:
            start_time = time.process_time()
            hasFrame, frame = cap.read()
            frame = frame[150:, 200:1000]
            # frame = frame[150:, 200:1000]
            # print(frame.shape)
            frameHeight = frame.shape[0]
            frameWidth = frame.shape[1]
            
            # cv2.line(frame, (0, frameHeight // 2), (frameWidth, frameHeight // 2), (0, 255, 255), 2)
            cv2.line(frame, (frameWidth//2, 0), (frameWidth//2, frameHeight), (0, 255, 255), 2)
            
            if not hasFrame:
                print("Done processing !!!")
                print("Output file is stored as ", outputFile)
                cv2.waitKey(3000)
                cap.release()
                break
            
            blob = cv2.dnn.blobFromImage(frame, 1/255, (self.inpWidth, self.inpHeight), [0,0,0], 1, crop=False)
            net.setInput(blob)
            
            outs = net.forward(self.getOutputsNames(net))
            self.postprocess(frame, outs)
            
            t, _ = net.getPerfProfile()
            # label = 'Inference time: %.2f ms' % (t * 1000.0 / cv.getTickFrequency())
            # cv.putText(frame, label, (0, 15), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255))
            
            vid_writer.write(frame.astype(np.uint8))
            end_time = time.process_time()
            print(f"time elapsed : {int(round((end_time - start_time) * 1000))}ms")
            cv2.imshow(winName, frame)
            key = cv2.waitKey(1)
            if key == ord("q"):
                break