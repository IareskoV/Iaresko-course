import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder

# Read the CSV file
df = pd.read_csv('your_updated_file.csv')

# Exclude unnecessary columns
columns_to_exclude = ['BEGIN_DATE','BEGIN_TIME','MAGNITUDE','TOR_F_SCALE','MAGNITUDE_TYPE','END_DATE','END_TIME','BEGIN_LAT','BEGIN_LON']
df = df.drop(columns=columns_to_exclude)

# Encode the event types
event_types = df['EVENT_TYPE']
label_encoder = LabelEncoder()
df['EVENT_TYPE'] = label_encoder.fit_transform(event_types)

# Split the data into features and labels
features = df.drop(columns=['EVENT_TYPE'])
labels = df['EVENT_TYPE']

# Convert features and labels to TensorFlow tensors
feature_tensors = tf.convert_to_tensor(features.values, dtype=tf.float32)
label_tensors = tf.convert_to_tensor(labels.values, dtype=tf.int32)

# Define the TensorFlow model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(len(features.columns),)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(len(label_encoder.classes_), activation='softmax')
])

# Compile and train the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(feature_tensors, label_tensors, epochs=100)
model.save('model.h5')  # Save the model as a single file
# Make predictions
predictions = model.predict(feature_tensors)
predicted_labels = tf.argmax(predictions, axis=1)

# Decode the predicted labels
decoded_labels = label_encoder.inverse_transform(predicted_labels)

# Print the predicted event types and probabilities
for event, prob in zip(decoded_labels, tf.reduce_max(predictions, axis=1)):
    print(f'Event Type: {event}, Probability: {prob.numpy()}')

