import json
import os
import datetime

from flask import Flask, request
from flask import render_template

app = Flask(__name__)
app.static_folder = 'static'
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/models/<path:filename>')
def custom_static(filename):
    return send_from_directory(app.config['CUSTOM_STATIC_PATH'], filename)


@app.route('/export_labels', methods = ['POST'])
def export_labels():
    json_data = request.get_json()
    json_data_out = {}
    for key in json_data.keys():
        json_data[key] = json_data[key].split(',')
        json_data_out[key.strip('spanclass-')] = json_data[key]
        
    label_arr = []
    for key in json_data_out.keys():
        for thing in json_data_out[key]:
            label_arr.append([thing, key])
        
    now = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    filename = now + '-labels.json'
    with open(os.path.join(app.root_path, 'labels/', filename), 'w') as fp:
        json.dump(json_data_out, fp)
    
    filename = now + '-labels-array.json'
    with open(os.path.join(app.root_path, 'labels/', filename), 'w') as fp:
        fp.write(str(label_arr))
        
    return 'Success'

@app.route('/export_labels_metadata', methods = ['POST'])
def export_labels_metadata():
    json_data = request.get_json()
        
    now = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    filename = now + '-labels-metadata.json'
    with open(os.path.join(app.root_path, 'labels/', filename), 'w') as fp:
        json.dump(json_data, fp)
        
    return 'Success'


@app.route('/')
def hello_world():
    return render_template('index.html')
