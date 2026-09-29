---
title: Detect objects in an image
provider: Ultralytics
product: YOLO
description: A pretrained detector run over an image, from Python and from the CLI.
model_types: [vision]
source: https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/detect.md
verified: 2026-09-21
packages:
  python: ultralytics==8.4.157
resources:
  - label: Documentation
    url: https://docs.ultralytics.com
  - label: Predict mode
    url: https://docs.ultralytics.com/modes/predict
  - label: Repository
    url: https://github.com/ultralytics/ultralytics
tags: [object-detection]
prerequisites: ["Install ultralytics and its runtime dependencies.", "Provide access to the sample image and pretrained weights used in the official example."]
expected_output: "Object-detection results from a pretrained YOLO model."
---

```python
from ultralytics import YOLO

# Load a model
model = YOLO("yolo26n.pt")  # load an official model
model = YOLO("path/to/best.pt")  # load a custom model

# Predict with the model
results = model("https://ultralytics.com/images/bus.jpg")  # predict on an image

# Access the results
for result in results:
    xywh = result.boxes.xywh  # center-x, center-y, width, height
    xywhn = result.boxes.xywhn  # normalized
    xyxy = result.boxes.xyxy  # top-left-x, top-left-y, bottom-right-x, bottom-right-y
    xyxyn = result.boxes.xyxyn  # normalized
    names = [result.names[cls.item()] for cls in result.boxes.cls.int()]  # class name of each box
    confs = result.boxes.conf  # confidence score of each box
```

```bash
yolo detect predict model=yolo26n.pt source='https://ultralytics.com/images/bus.jpg'      # predict with official model
yolo detect predict model=path/to/best.pt source='https://ultralytics.com/images/bus.jpg' # predict with custom model
```
