import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
import random
import tensorflow as tf

# Load the saved model
model = tf.keras.models.load_model('model.h5')
df = pd.read_csv('your_updated_file.csv')

event_types = df['EVENT_TYPE']

# Define the new data as a NumPy array
new_data = np.array([[30.6, 20.8, 50.5, 10.2, 63.5, 10.9, 10.2, 12.4, 11.8, 10, 10, 190]])


# Encode the event types using the same label encoder as before
label_encoder = LabelEncoder()
label_encoder.fit_transform(event_types)


# Convert features to TensorFlow tensors
feature_tensors = tf.convert_to_tensor(new_data, dtype=tf.float32)

# Make predictions
predictions = model.predict(feature_tensors)
predicted_labels = tf.argmax(predictions, axis=1)

# Decode the predicted labels using the inverse transform of the label encoder
decoded_labels = label_encoder.inverse_transform(predicted_labels)

# Print the predicted event types and probabilities
for event, prob in zip(decoded_labels, tf.reduce_max(predictions, axis=1)):
    print(f'Event Type: {event}, Probability: {prob.numpy()}')