from counting_people_y import peopleCounter

modelConfiguration = "yolov4.cfg";
modelWeights = "yolov4.weights";

pc = peopleCounter()
pc.people_counter(modelConfiguration, modelWeights)