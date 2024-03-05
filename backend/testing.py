import tensorflow as tf
import numpy as np
import cv2
model = tf.keras.models.load_model("./model/forge.h5", compile=False)
tf.get_logger().setLevel('ERROR')

img = cv2.imread('./test/forged.png', cv2.IMREAD_GRAYSCALE)
img = cv2.resize(img, (128, 128))
img = np.array(img).reshape(1, 128, 128, 1) / 255.0

prediction = model.predict(img)

if prediction < 0.5:
    print("The signature is real.")
else:
    print("The signature is forged.")