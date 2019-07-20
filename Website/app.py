# import requests, json
# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func

# from flask import Flask, render_template, url_for, json, jsonify
# from flask_sqlalchemy import SQLAlchemy

# import pymysql

# import MySQLdb

# import pandas as pd
# import numpy as np
# import pymysql
# from sqlalchemy import create_engine
import requests
from flask import Flask, request, jsonify, render_template

from keys import gkey, ykey, zkey
# pymysql.install_as_MySQLdb()

app = Flask(__name__)

#connection to My_SQL
# engine = create_engine('mysql://root:#Caracas10@localhost/dineoutconsolidator')

# reflect an existing database into a new model
# Base = automap_base()
# reflect the tables
# Base.prepare(engine, reflect=True)

# Print all of the classes mapped to the Base
# Base.classes.keys()

# Save references to each table
# restaurants= Base.classes.restaurants6
# ratings= Base.classes.ratings


# Create our session (link) from Python to the DB
# session = Session(engine)

# print(engine.execute('select * from ratings limit 10').fetchall())


#     print(row.__dict__)

# ##################################################################
# ###################### Routes ###################################
# #################################################################

# function to create dictionary with all details on species
# @app.route("/")
# def index():
#     """Return the Home page."""
#     return render_template("Dineoutconsolidator/website/index.html")

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

# @app.route("/")
# def main():
#     return "Welcome!"

# @app.route("/map")
# def getdata():

#     # for row in session.query(restaurants).all():

#     sel=[restaurants.name,
#     restaurants.phone,
#     restaurants.address,
#     restaurants.average_price,
#     restaurants.latitude,
#     restaurants.longitude,
#     restaurants.total_users_reviews,
#     restaurants.overall_score,
#     restaurants.website
#     ]

#     results = session.query(*sel).all()

#     restdata = []
    
#     for row in results:
#         rest_dict = {}
#         rest_dict['name'] = row.name
#         rest_dict['overall_score'] = row.overall_score
#         rest_dict['price_range']= row.average_price
#         rest_dict['total_reviews']= row.total_users_reviews
#         rest_dict['location']= (row.latitude,row.longitude) 
#         rest_dict['website']= row.website
#         restdata.append(rest_dict)

#     return jsonify(restdata)

@app.route("/api/google")
def googleapi():
    phone = "%2B1" + request.args.get('phone')
    gurl=f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={phone}&inputtype=phonenumber&fields=geometry,name,user_ratings_total,price_level,rating&key={gkey}"
    response = requests.get(gurl)
    return jsonify(response.json())

@app.route("/api/yelp")
def yelpapi():
    phone = "+1" + request.args.get('phone')
    base_url=f"https://api.yelp.com/v3/businesses/search/phone"
    params = { 'phone': phone }
    headers = {'Authorization': 'Bearer %s' % ykey}
    response = requests.get(base_url, params=params, headers=headers)
    return jsonify(response.json())

@app.route("/api/zomato")
def zomatoapi():
    name = request.args.get('name')
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    url = f"https://developers.zomato.com/api/v2.1/search"
    headers = { 'user-key': zkey }
    params = { 'q': name, 'lat': lat, 'lng': lng }
    response = requests.get(url, params=params, headers=headers)
    return jsonify(response.json())

# @app.route("/location")
# def getcoordinates():

#     sel=[
#     restaurants.latitude,
#     restaurants.longitude
#     ]

#     results2 = session.query(*sel).all()

#     coordinate = []
#     for y in results2:
#         for x in results2:
#             coordinate.append((x,y))

#     return jsonify(coordinate)


if __name__ == '__main__':
    app.run(debug=True,port=8011)